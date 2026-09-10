import crypto from 'crypto'
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";

import User from './auth.model.js'
import transporter from '../../integrations/email/mail.js'
import ApiError from '../../utils/Apierror.js'
import sendSuccessResponse from '../../utils/ApiResponse.js'
import {
    validateRegistration,
    validateVerifyOtp,
    validateLogin,
    validateResendOtp,
    validateForgotPassword,
    validateVerifyResetOtp,
    validateResetPassword,
} from './auth.validation.js'


export const register = async (req, res, next) => {

    try {

        const { error, data } = validateRegistration(req.body)

        if (error) {
            return next(new ApiError(400, error))
        }

        const { email, password, phone } = data;
        const existinguser = await User.findOne({ email })

        if (existinguser) {
            return next(new ApiError(409, "Email is already registerd "))
        }

        const otp = crypto.randomInt(100000, 1000000).toString()

        const hashedOtp = await bcrypt.hash(otp, 10);

        const otpExpire = new Date(Date.now() + 10 * 60 * 1000);

        const user = new User({
            email,
            password,
            phone,
            otp: hashedOtp,
            otpExpire,
            isVerified: false
        })

        await user.save()

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Verify your tinynest account",
            text: `Your verification OTP is ${otp}. It expires in 10 minutes.`
        })
        sendSuccessResponse(res, 201, null, "Registration successful. Please verify the OTP sent to your email.")


    } catch (error) {
        next(error);
    }

}

// Verify the OTP sent to the user's email
export const verifyOtp = async (req, res, next) => {
    try {
        // Validate the email and OTP
        const error = validateVerifyOtp(req.body);

        // Stop if validation fails
        if (error) {
            return next(new ApiError(400, error));
        }

        // Get email and OTP from the request
        const { email, otp } = req.body;

        // Find the user using their email
        const user = await User.findOne({ email });

        // Check whether the user exists
        if (!user) {
            return next(new ApiError(404, "User not found"));
        }

        // Check whether the user is already verified
        if (user.isVerified) {
            return next(new ApiError(400, "User is already verified"));
        }

        // Check whether an OTP exists
        if (!user.otp || !user.otpExpire) {
            return next(new ApiError(400, "Please request a new OTP"));
        }

        // Check whether the OTP has expired
        if (new Date() > user.otpExpire) {

            // Remove the expired OTP
            user.otp = null;
            user.otpExpire = null;

            // Save the changes
            await user.save();

            return next(
                new ApiError(400, "OTP expired. Please request a new OTP")
            );
        }

        // Compare the entered OTP with the hashed OTP in MongoDB
        const isOtpCorrect = await bcrypt.compare(otp, user.otp);

        // Stop if the OTP is incorrect
        if (!isOtpCorrect) {
            return next(new ApiError(400, "Invalid OTP"));
        }

        // Mark the user's email as verified
        user.isVerified = true;

        // Remove the OTP after successful verification
        user.otp = null;
        user.otpExpire = null;

        // Save the updated user
        await user.save();

        // Send a successful response
        sendSuccessResponse(
            res,
            200,
            null,
            "Email verified successfully"
        );

    } catch (error) {
        // Pass unexpected errors to the error handler
        next(error);
    }
};

// Login an existing user
export const login = async (req, res, next) => {
    try {
        // Validate the login data
        const error = validateLogin(req.body);

        // Stop if validation fails
        if (error) {
            return next(new ApiError(400, error));
        }

        // Get email and password from the request
        const { email, password } = req.body;

        // Convert email to lowercase and remove extra spaces
        const normalizedEmail = email.trim().toLowerCase();

        // Find the user by email
        const user = await User.findOne({ email: normalizedEmail });

        // Check whether the email exists
        if (!user) {
            return next(new ApiError(401, "Invalid email or password"));
        }

        // User must verify their email before logging in
        if (!user.isVerified) {
            return next(new ApiError(403, "Please verify your email first"));
        }

        // Compare the entered password with the stored password hash
        const passwordMatch = await user.isPasswordCorrect(password);

        // Stop if the password is incorrect
        if (!passwordMatch) {
            return next(new ApiError(401, "Invalid email or password"));
        }

        // Create a JWT containing the user's ID
        const token = jwt.sign(
            {
                userId: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        // Send successful login response with the JWT
        sendSuccessResponse(
            res,
            200,
            {
                token
            },
            "Login successful"
        );

    } catch (error) {
        // Pass unexpected errors to the central error handler
        next(error);
    }
};

// Get the currently logged-in user's profile
export const getProfile = async (req, res, next) => {
    try {
        // req.user was added by the protect middleware
        const user = req.user;

        // Send the user's basic profile information
        sendSuccessResponse(
            res,
            200,
            {
                email: user.email,
                phone: user.phone,
                role: user.role,
                isVerified: user.isVerified
            },
            "Profile fetched successfully"
        );

    } catch (error) {
        // Pass unexpected errors to the error handler
        next(error);
    }
};

// Resend a new OTP to the user's email
export const resendOtp = async (req, res, next) => {
    try {
        // Validate the email
        const error = validateResendOtp(req.body);

        // Stop if validation fails
        if (error) {
            return next(new ApiError(400, error));
        }

        // Get and normalize the email
        const email = req.body.email.trim().toLowerCase();

        // Find the user by email
        const user = await User.findOne({ email });

        // Check whether the user exists
        if (!user) {
            return next(new ApiError(404, "User not found"));
        }

        // Don't send OTP to an already verified user
        if (user.isVerified) {
            return next(new ApiError(400, "Email is already verified"));
        }

        // Generate a new 6-digit OTP
        const otp = crypto.randomInt(100000, 1000000).toString();

        // Hash the new OTP before storing it
        const hashedOtp = await bcrypt.hash(otp, 10);

        // Set the new OTP expiry to 10 minutes
        const otpExpire = new Date(Date.now() + 10 * 60 * 1000);

        // Update the user's OTP information
        user.otp = hashedOtp;
        user.otpExpire = otpExpire;

        // Save the updated user
        await user.save();

        // Send the new OTP to the user's email
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Your new tinynest verification OTP",
            text: `Your new verification OTP is ${otp}. It expires in 10 minutes.`
        });

        // Send a successful response
        sendSuccessResponse(
            res,
            200,
            null,
            "A new OTP has been sent to your email"
        );

    } catch (error) {
        // Pass unexpected errors to the error handler
        next(error);
    }
};

// Send a password-reset OTP to the user's email
export const forgotPassword = async (req, res, next) => {
    try {
        // Validate the email from the request
        const error = validateForgotPassword(req.body);

        if (error) {
            return next(new ApiError(400, error));
        }

        // Normalize the email before searching
        const normalizedEmail = req.body.email.trim().toLowerCase();

        // Find the user with this email
        const user = await User.findOne({
            email: normalizedEmail
        });

        // Don't reveal whether an email exists
        // This helps prevent account enumeration
        if (!user) {
            return sendSuccessResponse(
                res,
                200,
                null,
                "If an account exists with this email, a reset OTP has been sent"
            );
        }

        // Generate a random 6-digit OTP
        const resetOtp = crypto
            .randomInt(100000, 1000000)
            .toString();

        // Hash the OTP before storing it in MongoDB
        const hashedResetOtp = await bcrypt.hash(resetOtp, 10);

        // OTP will expire after 10 minutes
        const resetOtpExpire = new Date(
            Date.now() + 10 * 60 * 1000
        );

        // Save the hashed OTP and expiry time
        user.resetOtp = hashedResetOtp;
        user.resetOtpExpire = resetOtpExpire;

        await user.save();

        // Send the reset OTP to the user's email
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: normalizedEmail,
            subject: "Reset your tinynest password",
            text: `Your password reset OTP is ${resetOtp}. It expires in 10 minutes.`
        });

        // Send success response
        sendSuccessResponse(
            res,
            200,
            null,
            "If an account exists with this email, a reset OTP has been sent"
        );

    } catch (error) {
        next(error);
    }
};

// Verify the OTP used for password reset
// Verify the OTP used for password reset
export const verifyResetOtp = async (req, res, next) => {
    try {
        // Validate the request
        const error = validateVerifyResetOtp(req.body);

        if (error) {
            return next(new ApiError(400, error));
        }

        // Normalize the email
        const normalizedEmail = req.body.email
            .trim()
            .toLowerCase();

        const { otp } = req.body;

        // Find the user
        const user = await User.findOne({
            email: normalizedEmail
        });

        // Don't reveal whether the account exists
        if (!user) {
            return next(
                new ApiError(400, "Invalid or expired OTP")
            );
        }

        // Make sure a reset OTP exists
        if (!user.resetOtp || !user.resetOtpExpire) {
            return next(
                new ApiError(400, "Invalid or expired OTP")
            );
        }

        // Check whether the OTP has expired
        if (new Date() > user.resetOtpExpire) {
            user.resetOtp = null;
            user.resetOtpExpire = null;

            await user.save();

            return next(
                new ApiError(
                    400,
                    "OTP expired. Please request a new OTP"
                )
            );
        }

        // Compare the entered OTP with the hashed OTP
        const isOtpCorrect = await bcrypt.compare(
            otp,
            user.resetOtp
        );

        if (!isOtpCorrect) {
            return next(
                new ApiError(400, "Invalid OTP")
            );
        }

        // Generate a temporary token after successful OTP verification
        const resetToken = jwt.sign(
            {
                userId: user._id,
                purpose: "password-reset"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "10m"
            }
        );

        // Clear the OTP because it has already been used
        user.resetOtp = null;
        user.resetOtpExpire = null;

        await user.save();

        // Return the temporary reset token
        sendSuccessResponse(
            res,
            200,
            {
                resetToken
            },
            "Reset OTP verified successfully"
        );

    } catch (error) {
        next(error);
    }
};
// Reset the user's password using the temporary reset token
export const resetPassword = async (req, res, next) => {
    try {
        // Validate the request
        const error = validateResetPassword(req.body);

        if (error) {
            return next(new ApiError(400, error));
        }

        const { resetToken, newPassword } = req.body;

        // Verify the temporary reset token
        const decoded = jwt.verify(
            resetToken,
            process.env.JWT_SECRET
        );

        // Make sure this token was specifically created
        // for password reset
        if (decoded.purpose !== "password-reset") {
            return next(
                new ApiError(401, "Invalid reset token")
            );
        }

        // Find the user from the ID stored in the token
        const user = await User.findById(decoded.userId);

        if (!user) {
            return next(
                new ApiError(404, "User not found")
            );
        }

        // Set the new password
        // The Mongoose pre-save hook will hash it automatically
        user.password = newPassword;

        // Save the updated password
        await user.save();

        // Send success response
        sendSuccessResponse(
            res,
            200,
            null,
            "Password reset successfully"
        );

    } catch (error) {

        // JWT errors mean the token is invalid or expired
        if (error.name === "TokenExpiredError") {
            return next(
                new ApiError(
                    401,
                    "Reset token has expired. Please start again"
                )
            );
        }

        if (error.name === "JsonWebTokenError") {
            return next(
                new ApiError(
                    401,
                    "Invalid reset token"
                )
            );
        }

        next(error);
    }
};
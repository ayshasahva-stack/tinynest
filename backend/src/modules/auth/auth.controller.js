import crypto from 'crypto'
import bcrypt from 'bcrypt'

import User from './auth.model.js'
import transporter from '../../integrations/email/mail.js'
import ApiError from '../../utils/Apierror.js'
import sendSuccessResponse from '../../utils/ApiResponse.js'
import { validateRegistration,validateVerifyOtp } from './auth.validation.js'


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
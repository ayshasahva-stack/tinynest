import User from "../auth/auth.model.js";
import sendSuccessResponse from "../../utils/ApiResponse.js";
import ApiError from "../../utils/Apierror.js";

// Admin: get all customers
export const getAllUsers = async (req, res, next) => {
    try {
        // Get only customer accounts, not admin accounts
        const users = await User.find({
            role: "user"
        })
            // Do not send sensitive authentication information
            .select("-password -otp -otpExpire -resetOtp -resetOtpExpire")
            // Show newest customers first
            .sort({ createdAt: -1 });

        // Send the customers to the admin
        return sendSuccessResponse(
            res,
            200,
            users,
            "Users fetched successfully"
        );
    } catch (error) {
        // Pass unexpected errors to the global error handler
        next(error);
    }
};

// Admin: block a customer
export const blockUser = async (req, res, next) => {
    try {
        // Get the customer ID from the URL
        const { userId } = req.params;

        // Find only a customer account
        // This prevents an admin account from being blocked
        const user = await User.findOne({
            _id: userId,
            role: "user"
        });

        // Check whether the customer exists
        if (!user) {
            return next(new ApiError(404, "Customer not found"));
        }

        // Check whether the customer is already blocked
        if (user.isBlocked) {
            return next(new ApiError(400, "Customer is already blocked"));
        }

        // Block the customer
        user.isBlocked = true;

        // Save the updated customer
        await user.save();

        // Send the updated customer
        return sendSuccessResponse(
            res,
            200,
            user,
            "Customer blocked successfully"
        );
    } catch (error) {
        // Pass unexpected errors to the global error handler
        next(error);
    }
};
// Admin: unblock a customer
export const unblockUser = async (req, res, next) => {
    try {
        // Get the customer ID from the URL
        const { userId } = req.params;

        // Find only a customer account
        const user = await User.findOne({
            _id: userId,
            role: "user"
        });

        // Check whether the customer exists
        if (!user) {
            return next(new ApiError(404, "Customer not found"));
        }

        // Check whether the customer is already active
        if (!user.isBlocked) {
            return next(new ApiError(400, "Customer is not blocked"));
        }

        // Unblock the customer
        user.isBlocked = false;

        // Save the updated customer
        await user.save();

        // Send the updated customer
        return sendSuccessResponse(
            res,
            200,
            user,
            "Customer unblocked successfully"
        );
    } catch (error) {
        // Pass unexpected errors to the global error handler
        next(error);
    }
};
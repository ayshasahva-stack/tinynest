import User from "../auth/auth.model.js";
import sendSuccessResponse from "../../utils/ApiResponse.js";

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
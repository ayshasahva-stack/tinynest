
import User from "../auth/auth.model.js";
import sendSuccessResponse from "../../utils/ApiResponse.js";
import ApiError from "../../utils/Apierror.js";

// Fields that must never be sent to the frontend
const SENSITIVE_FIELDS = [
    "password",
    "otp",
    "otpExpire",
    "resetOtp",
    "resetOtpExpire",
];

// Remove sensitive fields before returning user data
const getSafeUser = (user) => {
    const safeUser = user.toObject();

    SENSITIVE_FIELDS.forEach((field) => {
        delete safeUser[field];
    });

    return safeUser;
};

// GET /users
// Fetch all customers, excluding admin accounts and sensitive data
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({ role: "user" })
            .select("-password -otp -otpExpire -resetOtp -resetOtpExpire")
            .sort({ createdAt: -1 })
            .lean();

        return sendSuccessResponse(
            res,
            200,
            users,
            "Customers fetched successfully"
        );
    } catch (error) {
        next(error);
    }
};

// PATCH /users/:userId/block
// Block a customer from using the application
export const blockUser = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const user = await User.findOne({
            _id: userId,
            role: "user",
        });

        if (!user) {
            throw new ApiError(404, "Customer not found");
        }

        if (user.isBlocked) {
            throw new ApiError(400, "Customer is already blocked");
        }

        user.isBlocked = true;
        await user.save();

        return sendSuccessResponse(
            res,
            200,
            getSafeUser(user),
            "Customer blocked successfully"
        );
    } catch (error) {
        next(error);
    }
};

// PATCH /users/:userId/unblock
// Restore a blocked customer's access
export const unblockUser = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const user = await User.findOne({
            _id: userId,
            role: "user",
        });

        if (!user) {
            throw new ApiError(404, "Customer not found");
        }

        if (!user.isBlocked) {
            throw new ApiError(400, "Customer is not blocked");
        }

        user.isBlocked = false;
        await user.save();

        return sendSuccessResponse(
            res,
            200,
            getSafeUser(user),
            "Customer unblocked successfully"
        );
    } catch (error) {
        next(error);
    }
};

// DELETE /users/:userId
// Permanently delete a customer account
export const deleteUser = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const user = await User.findOne({
            _id: userId,
            role: "user",
        });

        if (!user) {
            throw new ApiError(404, "Customer not found");
        }

        await User.deleteOne({ _id: user._id });

        return sendSuccessResponse(
            res,
            200,
            null,
            "Customer deleted successfully"
        );
    } catch (error) {
        next(error);
    }
};

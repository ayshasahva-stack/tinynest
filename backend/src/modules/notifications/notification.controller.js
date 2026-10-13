
import Notification from "./notification.model.js";
import ApiError from "../../utils/Apierror.js";
import sendSuccessResponse from "../../utils/ApiResponse.js";
import {
    validateNotificationId,
} from "./notification.validation.js";

// Get all notifications belonging to the logged-in user.
export const getMyNotifications = async (req, res, next) => {
    try {
        // Find only notifications owned by the authenticated user.
        const notifications = await Notification.find({
            recipient: req.user._id,
        })
            .sort({ createdAt: -1 }) // Newest notifications first.
            .limit(50); // Return at most 50 notifications.

        // Send the notifications using the project's response helper.
        return sendSuccessResponse(
            res,
            200,
            notifications,
            "Notifications fetched successfully"
        );
    } catch (error) {
        next(error);
    }
};

// Mark one of the logged-in user's notifications as read.
export const markNotificationAsRead = async (req, res, next) => {
    try {
        const { notificationId } = req.params;

        // Validate the notification ID using the validation module.
        const validationError = validateNotificationId(notificationId);

        if (validationError) {
            return next(new ApiError(400, validationError));
        }

        // Update only a notification owned by the logged-in user.
        const notification = await Notification.findOneAndUpdate(
            {
                _id: notificationId,
                recipient: req.user._id,
            },
            {
                $set: { isRead: true },
            },
            {
                new: true, // Return the updated notification.
                runValidators: true,
            }
        );

        // The notification may not exist or may belong to another user.
        if (!notification) {
            return next(
                new ApiError(404, "Notification not found")
            );
        }

        return sendSuccessResponse(
            res,
            200,
            notification,
            "Notification marked as read"
        );
    } catch (error) {
        next(error);
    }
};

// Delete all notifications belonging to the logged-in user.
export const clearMyNotifications = async (req, res, next) => {
    try {
        // Delete only the authenticated user's notifications.
        const result = await Notification.deleteMany({
            recipient: req.user._id,
        });

        return sendSuccessResponse(
            res,
            200,
            {
                deletedCount: result.deletedCount,
            },
            "Notifications cleared successfully"
        );
    } catch (error) {
        next(error);
    }
};

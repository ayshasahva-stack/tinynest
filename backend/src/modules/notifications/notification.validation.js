
import mongoose from "mongoose";

// Validate the notification ID before updating a notification.
export const validateNotificationId = (notificationId) => {
    // Make sure the ID was provided.
    if (!notificationId) {
        return "Notification ID is required";
    }

    // Make sure the ID is a valid MongoDB ObjectId.
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
        return "Notification ID must be a valid notification ID";
    }

    return null;
};

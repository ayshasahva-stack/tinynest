
import User from "../auth/auth.model.js";
import Notification from "./notification.model.js";
import { getIo } from "../../realtime/io.js";

// Create notifications for all admins and send them in real time.
export const notifyAdmins = async ({
    type,
    title,
    message,
    order = null,
}) => {
    // Find every admin account.
    const admins = await User.find({ role: "admin" }).select("_id");

    // There is nobody to notify if no admin accounts exist.
    if (admins.length === 0) {
        return [];
    }

    // Create one notification for each admin.
    const notifications = await Notification.insertMany(
        admins.map((admin) => ({
            recipient: admin._id,
            type,
            title,
            message,
            order,
        }))
    );

    // Send the saved notifications to connected admin clients.
    // Database saving should still succeed if Socket.IO is unavailable.
    try {
        const io = getIo();

        notifications.forEach((notification) => {
            io.to("admin").emit(
                "notification:new",
                notification.toObject()
            );
        });
    } catch (error) {
        // Keep the saved notifications even if real-time delivery fails.
        console.error(
            "Admin notification saved, but real-time delivery failed:",
            error.message
        );
    }

    // Return the saved notifications for optional use by the caller.
    return notifications;
};

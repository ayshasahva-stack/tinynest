
import mongoose from "mongoose";

// Store each notification separately so it survives page refreshes.
const notificationSchema = new mongoose.Schema(
    {
        // The user who should receive this notification.
        // For a new order, this can be an admin.
        // For an order status update, this is the customer.
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        // Identify which event created the notification.
        type: {
            type: String,
            enum: ["new-order", "status-updated"],
            required: true,
        },

        // Short heading displayed in the notification dropdown.
        title: {
            type: String,
            required: true,
            trim: true,
        },

        // Notification message displayed to the recipient.
        message: {
            type: String,
            required: true,
            trim: true,
        },

        // Link the notification to its related order.
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },

        // Track whether the recipient has read the notification.
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        // Automatically record when each notification was created
        // and last updated.
        timestamps: true,
    }
);

// Helps retrieve a user's latest notifications efficiently.
notificationSchema.index({ recipient: 1, createdAt: -1 });

const Notification = mongoose.model(
    "Notification",
    notificationSchema
);

export default Notification;

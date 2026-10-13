
import mongoose from "mongoose";

// Define the structure of notifications stored in MongoDB.
const notificationSchema = new mongoose.Schema(
    {
        // The user who receives this notification (admin or customer).
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        // The event that triggered the notification.
        type: {
            type: String,
            enum: [
                "new-order",
                "status-updated",
                "order-cancelled",
                "new-user",
            ],
            required: true,
        },

        // Short heading displayed in the notification dropdown.
        title: {
            type: String,
            required: true,
            trim: true,
        },

        // Description of the event.
        message: {
            type: String,
            required: true,
            trim: true,
        },

        // Optional: only order-related notifications need an order reference.
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: false,
            default: null,
        },

        // Whether the recipient has read the notification.
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        // Automatically save createdAt and updatedAt timestamps.
        timestamps: true,
    }
);

// Optimize notification retrieval for each recipient.
notificationSchema.index({ recipient: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;

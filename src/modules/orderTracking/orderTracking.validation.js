import mongoose from "mongoose";

// Validate the order ID
export const validateTrackingOrder = (orderId) => {
    // Check whether order ID was provided
    if (!orderId) {
        return "Order ID is required";
    }

    // Check whether order ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return "Order ID must be a valid order ID";
    }

    return null;
};

// Validate tracking data
export const validateTracking = (body) => {
    const { status, message } = body;

    // Status is required
    if (!status) {
        return "Tracking status is required";
    }

    // Status must be one of our allowed order statuses
    const allowedStatuses = [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled"
    ];

    if (!allowedStatuses.includes(status)) {
        return "Invalid tracking status";
    }

    // Message is optional, but if provided it must be a string
    if (
        message !== undefined &&
        message !== null &&
        typeof message !== "string"
    ) {
        return "Tracking message must be a string";
    }

    return null;
};
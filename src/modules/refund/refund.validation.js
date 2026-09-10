import mongoose from "mongoose";

// Validate the order ID for a refund request
export const validateRefundOrder = (orderId) => {
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

// Validate the customer's refund reason
export const validateRefundRequest = (body) => {
    const { reason } = body;

    // Check whether reason was provided
    if (!reason) {
        return "Refund reason is required";
    }

    // Check whether reason is a string
    if (typeof reason !== "string") {
        return "Refund reason must be a string";
    }

    // Check whether reason contains actual text
    if (reason.trim() === "") {
        return "Refund reason cannot be empty";
    }

    return null;
};

// Validate the admin's refund decision
export const validateRefundDecision = (body) => {
    const { status, adminNote } = body;

    // Check whether status was provided
    if (!status) {
        return "Refund status is required";
    }

    // Only approved or rejected are allowed at this stage
    if (!["approved", "rejected"].includes(status)) {
        return "Refund status must be approved or rejected";
    }

    // Admin note is optional, but if provided it must be a string
    if (
        adminNote !== undefined &&
        adminNote !== null &&
        typeof adminNote !== "string"
    ) {
        return "Admin note must be a string";
    }

    return null;
};
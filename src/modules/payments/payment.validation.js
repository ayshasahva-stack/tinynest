import mongoose from "mongoose";

// Validate the order ID
export const validatePaymentOrder = (orderId) => {
    if (!orderId) {
        return "Order ID is required";
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return "Order ID must be a valid order ID";
    }

    return null;
};

// Validate payment creation data
export const validatePayment = (body) => {
    const { paymentMethod } = body;

    // Payment method is required
    if (!paymentMethod) {
        return "Payment method is required";
    }

    // Only supported payment methods are allowed
    if (!["cod", "online"].includes(paymentMethod)) {
        return "Payment method must be cod or online";
    }

    // Transaction ID is optional because COD does not require one
    if (
        body.transactionId !== undefined &&
        body.transactionId !== null &&
        typeof body.transactionId !== "string"
    ) {
        return "Transaction ID must be a string";
    }

    return null;
};

// Validate payment status updates
export const validatePaymentStatus = (body) => {
    const { status } = body;

    if (!status) {
        return "Payment status is required";
    }

    if (!["pending", "paid", "failed", "refunded"].includes(status)) {
        return "Invalid payment status";
    }

    return null;
};
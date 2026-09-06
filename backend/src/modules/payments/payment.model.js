import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        // Order associated with this payment
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
            unique: true
        },

        // User who owns the order/payment
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // Payment method selected by the customer
        paymentMethod: {
            type: String,
            required: true,
            enum: ["cod", "online"]
        },

        // Transaction ID from the payment provider
        transactionId: {
            type: String,
            trim: true,
            default: null
        },

        // Amount associated with the payment
        amount: {
            type: Number,
            required: true,
            min: 0
        },

        // Current payment status
        status: {
            type: String,
            required: true,
            enum: ["pending", "paid", "failed", "refunded"],
            default: "pending"
        },

        // Time when payment was successfully completed
        paidAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
import mongoose from "mongoose";

const refundSchema = new mongoose.Schema(
    {
        // Order for which the refund is requested
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
            unique: true
        },

        // Customer who requested the refund
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        refundType: {
            type: String,
            enum: ["customer_request", "order_cancelled"],
            required: true
        },

        // Payment associated with the order
        payment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Payment",
            required: true
        },

        // Reason given by the customer
        reason: {
            type: String,
            required: true,
            trim: true
        },


        // Amount that should be refunded
        amount: {
            type: Number,
            required: true,
            min: 0
        },

        // Current status of the refund
        status: {
            type: String,
            enum: [
                "requested",
                "approved",
                "rejected",
                "processing",
                "completed"
            ],
            default: "requested"
        },

        // Note added by the admin
        adminNote: {
            type: String,
            trim: true,
            default: ""
        },

        // When the customer requested the refund
        requestedAt: {
            type: Date,
            default: Date.now
        },

        // When the refund was processed
        processedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Refund = mongoose.model("Refund", refundSchema);

export default Refund;
import mongoose from "mongoose";

// Schema for storing each tracking update of an order
const orderTrackingSchema = new mongoose.Schema(
    {
        // The order this tracking update belongs to
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true
        },

        // Current status of the order at this tracking point
        status: {
            type: String,
            required: true,
            enum: [
                "pending",
                "confirmed",
                "processing",
                "shipped",
                "delivered",
                "cancelled"
            ]
        },

        // Optional message describing the tracking update
        message: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        // Automatically creates createdAt and updatedAt
        timestamps: true
    }
);

const OrderTracking = mongoose.model( "OrderTracking", orderTrackingSchema);

export default OrderTracking;
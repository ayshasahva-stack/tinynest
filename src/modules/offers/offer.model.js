import mongoose from "mongoose";

// Schema for product/category offers
const offerSchema = new mongoose.Schema(
    {
        // Name/title shown to customers
        title: {
            type: String,
            required: true,
            trim: true
        },

        // Type of discount
        discountType: {
            type: String,
            required: true,
            enum: ["percentage", "fixed"]
        },

        // Discount amount
        // Example:
        // percentage → 20 means 20%
        // fixed → 100 means ₹100
        discountValue: {
            type: Number,
            required: true,
            min: 0
        },

        // Specific product targeted by the offer
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            default: null
        },

        // Entire category targeted by the offer
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            default: null
        },

        // Date when the offer starts
        startDate: {
            type: Date,
            required: true
        },

        // Date when the offer expires
        expiryDate: {
            type: Date,
            required: true
        },

        // Whether the admin has enabled the offer
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const Offer = mongoose.model("Offer", offerSchema);

export default Offer;
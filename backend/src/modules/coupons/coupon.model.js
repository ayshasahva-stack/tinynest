import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
    {
        // Unique coupon code customers will enter
        code: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true
        },

        // How the discount should be calculated
        discountType: {
            type: String,
            required: true,
            enum: ["percentage", "fixed"]
        },

        // Discount amount or percentage
        discountValue: {
            type: Number,
            required: true,
            min: 0
        },

        // Minimum order value required to use the coupon
        minOrderAmount: {
            type: Number,
            default: 0,
            min: 0
        },

        // Maximum discount allowed for percentage coupons
        maxDiscount: {
            type: Number,
            default: null,
            min: 0
        },

        // Coupon becomes usable from this date
        startDate: {
            type: Date,
            required: true
        },

        // Coupon expires after this date
        expiryDate: {
            type: Date,
            required: true
        },

        // Maximum number of times the coupon can be used
        usageLimit: {
            type: Number,
            default: null,
            min: 1
        },

        // Number of times the coupon has already been used
        usedCount: {
            type: Number,
            default: 0,
            min: 0
        },

        // Allows admin to activate/deactivate the coupon
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
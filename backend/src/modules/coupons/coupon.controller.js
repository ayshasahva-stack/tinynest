import mongoose from "mongoose";
import Coupon from "./coupon.model.js";
import ApiError from "../../utils/Apierror.js";
import sendSuccessResponse from "../../utils/ApiResponse.js";
import {
    validateCoupon,
    validateCouponUpdate,
} from "./coupon.validation.js";

// Admin: create a new coupon
export const createCoupon = async (req, res, next) => {
    try {
        // Validate coupon data
        const validationError = validateCoupon(req.body);

        if (validationError) {
            return next(new ApiError(400, validationError));
        }

        const {
            code,
            discountType,
            discountValue,
            minOrderAmount = 0,
            maxDiscount = null,
            startDate,
            expiryDate,
            usageLimit = null,
            isActive = true
        } = req.body;

        // Normalize the coupon code
        const normalizedCode = code.trim().toUpperCase();

        // Check whether the coupon already exists
        const existingCoupon = await Coupon.findOne({
            code: normalizedCode
        });

        if (existingCoupon) {
            return next(new ApiError(400, "Coupon code already exists"));
        }

        // Create the coupon
        const coupon = await Coupon.create({
            code: normalizedCode,
            discountType,
            discountValue,
            minOrderAmount,
            maxDiscount,
            startDate,
            expiryDate,
            usageLimit,
            isActive
        });

        return sendSuccessResponse(
            res,
            201,
            coupon,
            "Coupon created successfully"
        );
    } catch (error) {
        next(error);
    }
};
// Get currently active and usable coupons
export const getActiveCoupons = async (req, res, next) => {
    try {
        const now = new Date();

        // Find coupons that are active, currently valid,
        // and have not reached their usage limit
        const coupons = await Coupon.find({
            isActive: true,
            startDate: { $lte: now },
            expiryDate: { $gte: now },
            $or: [
                { usageLimit: null },
                { $expr: { $lt: ["$usedCount", "$usageLimit"] } }
            ]
        }).sort({ expiryDate: 1 });

        return sendSuccessResponse(
            res,
            200,
            coupons,
            "Active coupons fetched successfully"
        );
    } catch (error) {
        next(error);
    }
};

// Admin: get all coupons
export const getAllCoupons = async (req, res, next) => {
    try {
        // Get every coupon for admin management
        const coupons = await Coupon.find()
            .sort({ createdAt: -1 });

        return sendSuccessResponse(
            res,
            200,
            coupons,
            "All coupons fetched successfully"
        );
    } catch (error) {
        next(error);
    }
};
// Admin: update an existing coupon
export const updateCoupon = async (req, res, next) => {
    try {
        const { couponId } = req.params;

        // Validate MongoDB coupon ID
        if (!mongoose.Types.ObjectId.isValid(couponId)) {
            return next(
                new ApiError(400, "Coupon ID must be a valid coupon ID")
            );
        }

        // Validate update data
        const validationError = validateCouponUpdate(req.body);

        if (validationError) {
            return next(new ApiError(400, validationError));
        }

        // Find the coupon
        const coupon = await Coupon.findById(couponId);

        if (!coupon) {
            return next(new ApiError(404, "Coupon not found"));
        }

        // Normalize the code if it is being updated
        if (req.body.code !== undefined) {
            const normalizedCode = req.body.code.trim().toUpperCase();

            // Check whether another coupon already uses this code
            const existingCoupon = await Coupon.findOne({
                code: normalizedCode,
                _id: { $ne: couponId }
            });

            if (existingCoupon) {
                return next(
                    new ApiError(400, "Coupon code already exists")
                );
            }

            coupon.code = normalizedCode;
        }

        // Update only fields provided by the admin
        const fields = [
            "discountType",
            "discountValue",
            "minOrderAmount",
            "maxDiscount",
            "startDate",
            "expiryDate",
            "usageLimit",
            "isActive"
        ];

        for (const field of fields) {
            if (req.body[field] !== undefined) {
                coupon[field] = req.body[field];
            }
        }

        await coupon.save();

        return sendSuccessResponse(
            res,
            200,
            coupon,
            "Coupon updated successfully"
        );
    } catch (error) {
        next(error);
    }
};
// Admin: deactivate a coupon
export const deactivateCoupon = async (req, res, next) => {
    try {
        const { couponId } = req.params;

        // Validate MongoDB coupon ID
        if (!mongoose.Types.ObjectId.isValid(couponId)) {
            return next(
                new ApiError(400, "Coupon ID must be a valid coupon ID")
            );
        }

        // Find the coupon
        const coupon = await Coupon.findById(couponId);

        if (!coupon) {
            return next(new ApiError(404, "Coupon not found"));
        }

        // Deactivate the coupon
        coupon.isActive = false;

        await coupon.save();

        return sendSuccessResponse(
            res,
            200,
            coupon,
            "Coupon deactivated successfully"
        );
    } catch (error) {
        next(error);
    }
};
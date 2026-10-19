import mongoose from "mongoose";
import Coupon from "./coupon.model.js";
import Cart from "../cart/cart.model.js";
import ApiError from "../../utils/Apierror.js";
import sendSuccessResponse from "../../utils/ApiResponse.js";
import { getProductOfferPrice } from "../offers/offer.service.js";
import {
    validateCoupon,
    validateCouponUpdate,
    validateApplyCoupon,
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
// Apply and calculate a coupon discount

export const applyCoupon = async (req, res, next) => {
    try {
        // Validate the coupon code sent by the customer.
        const validationError = validateApplyCoupon(req.body);

        if (validationError) {
            return next(new ApiError(400, validationError));
        }

        // Normalize the code so uppercase/lowercase input works.
        const normalizedCode = req.body.code.trim().toUpperCase();

        // Load the customer's cart and its referenced items.
        const cart = await Cart.findOne({
            user: req.user._id
        }).populate("items.product items.kit");

        if (!cart || cart.items.length === 0) {
            return next(new ApiError(400, "Cart is empty"));
        }

        // Calculate subtotal using the same pricing rules as orders.
        let subtotal = 0;

        for (const item of cart.items) {
            const itemType = item.itemType || "product";

            if (itemType === "product") {
                if (!item.product) {
                    return next(
                        new ApiError(400, "A product in your cart is unavailable")
                    );
                }

                // Include the active offer price, if applicable.
                const pricing = await getProductOfferPrice(item.product);

                subtotal += pricing.offerPrice * item.quantity;
            } else if (itemType === "kit") {
                if (!item.kit || !item.kit.isActive) {
                    return next(
                        new ApiError(400, "A kit in your cart is unavailable")
                    );
                }

                // Match the current order controller's kit pricing.
                subtotal += item.kit.price * item.quantity;
            }
        }

        // Find the requested coupon.
        const coupon = await Coupon.findOne({
            code: normalizedCode
        });

        if (!coupon) {
            return next(new ApiError(404, "Coupon not found"));
        }

        const now = new Date();

        // Check whether the coupon is enabled.
        if (!coupon.isActive) {
            return next(new ApiError(400, "Coupon is inactive"));
        }

        // Check the coupon's validity period.
        if (now < coupon.startDate) {
            return next(new ApiError(400, "Coupon is not active yet"));
        }

        if (now > coupon.expiryDate) {
            return next(new ApiError(400, "Coupon has expired"));
        }

        // Check the usage limit.
        if (
            coupon.usageLimit !== null &&
            coupon.usedCount >= coupon.usageLimit
        ) {
            return next(
                new ApiError(400, "Coupon usage limit reached")
            );
        }
// Debug the amount used for coupon validation.
console.log("Coupon code:", normalizedCode);
console.log("Calculated cart subtotal:", subtotal);
console.log("Coupon minimum order amount:", coupon.minOrderAmount);
        // Check the minimum eligible subtotal.
        if (subtotal < coupon.minOrderAmount) {
            return next(
                new ApiError(
                    400,
                    `Minimum order amount is ₹${coupon.minOrderAmount}`
                )
            );
        }

        // Calculate the coupon discount.
        let discount = 0;

        if (coupon.discountType === "percentage") {
            discount = (subtotal * coupon.discountValue) / 100;

            // Respect the configured maximum discount.
            if (
                coupon.maxDiscount !== null &&
                discount > coupon.maxDiscount
            ) {
                discount = coupon.maxDiscount;
            }
        } else {
            // A fixed discount cannot exceed the subtotal.
            discount = Math.min(coupon.discountValue, subtotal);
        }

        // Round currency calculations to two decimal places.
        subtotal = Math.round(subtotal * 100) / 100;
        discount = Math.round(discount * 100) / 100;

        const finalSubtotal = Math.round(
            (subtotal - discount) * 100
        ) / 100;

        // Keep shipping consistent with the current order rules.
        const shippingFee = subtotal >= 1000 ? 0 : 50;

        const totalAmount = Math.round(
            (finalSubtotal + shippingFee) * 100
        ) / 100;

        // Return the preview without creating an order or
        // incrementing the coupon usage count.
        return sendSuccessResponse(
            res,
            200,
            {
                couponId: coupon._id,
                code: coupon.code,
                discountType: coupon.discountType,
                subtotal,
                discount,
                finalSubtotal,
                shippingFee,
                totalAmount
            },
            "Coupon applied successfully"
        );
    } catch (error) {
        next(error);
    }
};

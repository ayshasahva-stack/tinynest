    import Coupon from "./coupon.model.js";
import ApiError from "../../utils/Apierror.js";
import sendSuccessResponse from "../../utils/ApiResponse.js";
import { validateCoupon } from "./coupon.validation.js";

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
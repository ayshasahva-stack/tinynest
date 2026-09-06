import mongoose from "mongoose";

export const validateCoupon = (body) => {
    const {
        code,
        discountType,
        discountValue,
        minOrderAmount,
        maxDiscount,
        startDate,
        expiryDate,
        usageLimit,
        isActive
    } = body;

    // Coupon code is required
    if (!code || typeof code !== "string" || code.trim() === "") {
        return "Coupon code is required";
    }

    // Discount type is required
    if (!discountType) {
        return "Discount type is required";
    }

    if (!["percentage", "fixed"].includes(discountType)) {
        return "Discount type must be percentage or fixed";
    }

    // Discount value is required
    if (
        discountValue === undefined ||
        discountValue === null ||
        typeof discountValue !== "number"
    ) {
        return "Discount value must be a number";
    }

    if (discountValue <= 0) {
        return "Discount value must be greater than 0";
    }

    // Percentage cannot exceed 100
    if (discountType === "percentage" && discountValue > 100) {
        return "Percentage discount cannot exceed 100";
    }

    // Validate minimum order amount
    if (
        minOrderAmount !== undefined &&
        (typeof minOrderAmount !== "number" || minOrderAmount < 0)
    ) {
        return "Minimum order amount must be a valid positive number";
    }

    // Validate maximum discount
    if (
        maxDiscount !== undefined &&
        maxDiscount !== null &&
        (typeof maxDiscount !== "number" || maxDiscount <= 0)
    ) {
        return "Maximum discount must be greater than 0";
    }

    // Validate dates
    if (!startDate) {
        return "Start date is required";
    }

    if (!expiryDate) {
        return "Expiry date is required";
    }

    const start = new Date(startDate);
    const expiry = new Date(expiryDate);

    if (Number.isNaN(start.getTime())) {
        return "Start date must be a valid date";
    }

    if (Number.isNaN(expiry.getTime())) {
        return "Expiry date must be a valid date";
    }

    if (expiry <= start) {
        return "Expiry date must be after start date";
    }

    // Validate usage limit
    if (
        usageLimit !== undefined &&
        usageLimit !== null &&
        (typeof usageLimit !== "number" || usageLimit < 1)
    ) {
        return "Usage limit must be at least 1";
    }

    // Validate active status
    if (isActive !== undefined && typeof isActive !== "boolean") {
        return "isActive must be a boolean";
    }

    return null;
};
// Validate coupon data when updating an existing coupon
export const validateCouponUpdate = (body) => {
    if (!body || Object.keys(body).length === 0) {
        return "At least one field is required to update the coupon";
    }

    // These are the only fields an admin can update
    const allowedFields = [
        "code",
        "discountType",
        "discountValue",
        "minOrderAmount",
        "maxDiscount",
        "startDate",
        "expiryDate",
        "usageLimit",
        "isActive"
    ];

    // Prevent unknown fields from being updated
    for (const field of Object.keys(body)) {
        if (!allowedFields.includes(field)) {
            return `${field} is not allowed`;
        }
    }

    // Validate coupon code if provided
    if (
        body.code !== undefined &&
        (typeof body.code !== "string" || body.code.trim() === "")
    ) {
        return "Coupon code cannot be empty";
    }

    // Validate discount type if provided
    if (
        body.discountType !== undefined &&
        !["percentage", "fixed"].includes(body.discountType)
    ) {
        return "Discount type must be percentage or fixed";
    }

    // Validate discount value if provided
    if (body.discountValue !== undefined) {
        if (
            typeof body.discountValue !== "number" ||
            body.discountValue <= 0
        ) {
            return "Discount value must be greater than 0";
        }
    }

    // Validate minimum order amount
    if (body.minOrderAmount !== undefined) {
        if (
            typeof body.minOrderAmount !== "number" ||
            body.minOrderAmount < 0
        ) {
            return "Minimum order amount must be a valid positive number";
        }
    }

    // Validate maximum discount
    if (body.maxDiscount !== undefined && body.maxDiscount !== null) {
        if (
            typeof body.maxDiscount !== "number" ||
            body.maxDiscount <= 0
        ) {
            return "Maximum discount must be greater than 0";
        }
    }

    // Validate dates if provided
    if (body.startDate !== undefined) {
        const startDate = new Date(body.startDate);

        if (Number.isNaN(startDate.getTime())) {
            return "Start date must be a valid date";
        }
    }

    if (body.expiryDate !== undefined) {
        const expiryDate = new Date(body.expiryDate);

        if (Number.isNaN(expiryDate.getTime())) {
            return "Expiry date must be a valid date";
        }
    }

    // Validate usage limit
    if (body.usageLimit !== undefined && body.usageLimit !== null) {
        if (
            typeof body.usageLimit !== "number" ||
            body.usageLimit < 1
        ) {
            return "Usage limit must be at least 1";
        }
    }

    // Validate active status
    if (
        body.isActive !== undefined &&
        typeof body.isActive !== "boolean"
    ) {
        return "isActive must be a boolean";
    }

    return null;
};
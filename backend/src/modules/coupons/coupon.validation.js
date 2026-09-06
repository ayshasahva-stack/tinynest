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
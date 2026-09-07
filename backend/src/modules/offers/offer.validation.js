import mongoose from "mongoose";

// Validate offer data when creating an offer
export const validateOffer = (body) => {
    const {
        title,
        discountType,
        discountValue,
        product,
        category,
        startDate,
        expiryDate,
        isActive
    } = body;

    // Title is required
    if (!title || typeof title !== "string" || title.trim() === "") {
        return "Offer title is required";
    }

    // Discount type is required
    if (!discountType) {
        return "Discount type is required";
    }

    // Only percentage and fixed discounts are allowed
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

    // Discount must be greater than zero
    if (discountValue <= 0) {
        return "Discount value must be greater than 0";
    }

    // Percentage cannot exceed 100
    if (discountType === "percentage" && discountValue > 100) {
        return "Percentage discount cannot exceed 100";
    }

    // Offer must target either a product or a category
    if (!product && !category) {
        return "Offer must target a product or category";
    }

    // Offer cannot target both
    if (product && category) {
        return "Offer cannot target both product and category";
    }

    // Validate product ID if provided
    if (product && !mongoose.Types.ObjectId.isValid(product)) {
        return "Product ID must be a valid product ID";
    }

    // Validate category ID if provided
    if (category && !mongoose.Types.ObjectId.isValid(category)) {
        return "Category ID must be a valid category ID";
    }

    // Start date is required
    if (!startDate) {
        return "Start date is required";
    }

    // Expiry date is required
    if (!expiryDate) {
        return "Expiry date is required";
    }

    const start = new Date(startDate);
    const expiry = new Date(expiryDate);

    // Validate dates
    if (Number.isNaN(start.getTime())) {
        return "Start date must be a valid date";
    }

    if (Number.isNaN(expiry.getTime())) {
        return "Expiry date must be a valid date";
    }

    // Expiry must be after start
    if (expiry <= start) {
        return "Expiry date must be after start date";
    }

    // isActive must be boolean if provided
    if (isActive !== undefined && typeof isActive !== "boolean") {
        return "isActive must be a boolean";
    }

    return null;
};
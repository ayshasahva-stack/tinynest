import mongoose from "mongoose";

// Validate the product ID sent when adding or removing a wishlist item
export const validateWishlistProduct = (productId) => {
    // Check whether a product ID was provided
    if (!productId) {
        return "Product ID is required";
    }

    // Check whether the ID has a valid MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return "Product ID must be a valid product ID";
    }

    // No validation error
    return null;
};
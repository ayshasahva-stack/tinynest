import mongoose from "mongoose";

// Validate data when adding a product to the cart
export const validateCartItem = (body) => {
    const { product, quantity } = body;

    // Product ID is required
    if (!product) {
        return "Product ID is required";
    }

    // Product ID must be a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(product)) {
        return "Product ID must be a valid product ID";
    }

    // Quantity is required
    if (quantity === undefined) {
        return "Quantity is required";
    }

    // Quantity must be a number
    if (typeof quantity !== "number") {
        return "Quantity must be a number";
    }

    // Quantity must be at least 1
    if (quantity < 1) {
        return "Quantity must be at least 1";
    }

    return null;
};
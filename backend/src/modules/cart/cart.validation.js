import mongoose from "mongoose";

// Validate data when adding a product to the cart
// Validate data when adding a product or kit to the cart
export const validateCartItem = (body) => {
    // Get the item type
    // Product is the default for backward compatibility
    const itemType = body.itemType || "product";

    const { product, kit, quantity } = body;

    // Item type must be either product or kit
    if (!["product", "kit"].includes(itemType)) {
        return "Item type must be either product or kit";
    }

    // Validate the ID based on the item type
    if (itemType === "product") {
        // Product ID is required
        if (!product) {
            return "Product ID is required";
        }

        // Product ID must be a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(product)) {
            return "Product ID must be a valid product ID";
        }
    }

    if (itemType === "kit") {
        // Kit ID is required
        if (!kit) {
            return "Kit ID is required";
        }

        // Kit ID must be a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(kit)) {
            return "Kit ID must be a valid kit ID";
        }
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

// Validate data when updating cart item quantity
export const validateCartQuantity = (body) => {
    const { quantity } = body;

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
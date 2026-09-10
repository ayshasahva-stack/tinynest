import mongoose from "mongoose";

// Validate the product ID when we work with an order item
export const validateOrderProduct = (productId) => {
    if (!productId) {
        return "Product ID is required";
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return "Product ID must be a valid product ID";
    }

    return null;
};

// Validate the shipping address received during checkout
export const validateShippingAddress = (address) => {
    // Make sure an address was provided
    if (!address || typeof address !== "object") {
        return "Shipping address is required";
    }

    // Required address fields
    const requiredFields = [
        "fullName",
        "phone",
        "addressLine",
        "city",
        "state",
        "postalCode",
        "country"
    ];

    // Check each required field
    for (const field of requiredFields) {
        if (
            address[field] === undefined ||
            address[field] === null ||
            String(address[field]).trim() === ""
        ) {
            return `${field} is required`;
        }
    }

    return null;
};
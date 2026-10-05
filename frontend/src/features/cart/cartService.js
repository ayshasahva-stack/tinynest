// Import the reusable Axios API instance
import api from "../../services/api";

// Add a product or kit to the user's cart
export const addToCart = async (cartData) => {
    const response = await api.post("/cart", cartData);

    return response.data;
};

// Get the logged-in user's cart
export const getMyCart = async () => {
    const response = await api.get("/cart");

    return response.data;
};

// Update the quantity of a product or kit
export const updateCartQuantity = async (
    itemType,
    itemId,
    quantity
) => {
    const response = await api.patch(
        `/cart/${itemType}/${itemId}`,
        { quantity }
    );

    return response.data;
};

// Remove a product or kit from the cart
export const removeFromCart = async (itemType, itemId) => {
    const response = await api.delete(
        `/cart/${itemType}/${itemId}`
    );

    return response.data;
};

// Remove all items from the cart
export const clearCart = async () => {
    const response = await api.delete("/cart");

    return response.data;
};
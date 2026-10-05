import api from "../../services/api";

// Add a product to the logged-in user's wishlist
export const addToWishlist = async (productId) => {
    const response = await api.post(`/wishlist/${productId}`);

    return response.data;
};

// Get the logged-in user's wishlist
export const getMyWishlist = async () => {
    const response = await api.get("/wishlist");

    return response.data;
};

// Remove a product from the wishlist
export const removeFromWishlist = async (productId) => {
    const response = await api.delete(`/wishlist/${productId}`);

    return response.data;
};

// Remove all products from the wishlist
export const clearWishlist = async () => {
    const response = await api.delete("/wishlist");

    return response.data;
};
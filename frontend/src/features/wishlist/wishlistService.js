
import api from "../../services/api";

// Existing product wishlist API.
export const addToWishlist = async (productId) => {
    const response = await api.post(`/wishlist/${productId}`);
    return response.data;
};

// New: add a baby kit to the wishlist.
export const addKitToWishlist = async (kitId) => {
    const response = await api.post(`/wishlist/kit/${kitId}`);
    return response.data;
};

// Fetch both products and kits.
export const getMyWishlist = async () => {
    const response = await api.get("/wishlist");
    return response.data;
};

// Existing product removal API.
export const removeFromWishlist = async (productId) => {
    const response = await api.delete(`/wishlist/${productId}`);
    return response.data;
};

// New: remove a baby kit.
export const removeKitFromWishlist = async (kitId) => {
    const response = await api.delete(`/wishlist/kit/${kitId}`);
    return response.data;
};

// Clear both products and kits.
export const clearWishlist = async () => {
    const response = await api.delete("/wishlist");
    return response.data;
};


import api from "../../services/api";

// Fetch all coupons, including inactive and expired coupons,
// for the admin management page.
export const getAllCoupons = async () => {
    const response = await api.get("/coupons/admin");
    return response.data;
};

// Create a new coupon.
export const createCoupon = async (couponData) => {
    const response = await api.post("/coupons", couponData);
    return response.data;
};

// Update an existing coupon.
export const updateCoupon = async (couponId, couponData) => {
    const response = await api.patch(
        `/coupons/${couponId}`,
        couponData
    );
    return response.data;
};

// Deactivate a coupon.
export const deactivateCoupon = async (couponId) => {
    const response = await api.patch(
        `/coupons/${couponId}/deactivate`
    );
    return response.data;
};
// Fetch currently active coupons for the customer page.
// The backend uses GET /coupons to filter valid coupons.
export const getActiveCoupons = async () => {
    const response = await api.get("/coupons");
    return response.data;
};

/**
 * Validate a coupon against the logged-in user's cart.
 * The backend calculates the discount and updated total.
 */
export const applyCoupon = async (couponCode) => {
    const response = await api.post("/coupons/apply", {
        code: couponCode,
    });

    // Return the backend response to the thunk.
    return response.data;
};

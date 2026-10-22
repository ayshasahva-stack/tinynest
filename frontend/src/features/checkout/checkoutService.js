import api from "../../services/api";

// Create an order from the logged-in user's cart
export const createOrder = async (orderData) => {
    const response = await api.post("/orders", orderData);

    return response.data;
};
// Safely abandon an unpaid online checkout. The backend verifies Razorpay
// status before cancelling or restoring the customer's cart.
export const abandonPendingOrder = async (orderId) => {
    const response = await api.patch(`/orders/${orderId}/abandon-payment`);
    return response.data;
};

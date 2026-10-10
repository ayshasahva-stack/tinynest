
import api from "../../services/api";

// Fetch all orders belonging to the logged-in customer.
export const getMyOrders = async () => {
    const response = await api.get("/orders");
    return response.data;
};

// Fetch one order belonging to the logged-in customer.
export const getMyOrderById = async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
};

// Admin: fetch all customer orders.
export const getAllOrdersForAdmin = async () => {
    const response = await api.get("/orders/admin");
    return response.data;
};

// Admin: update an order's status.
export const updateOrderStatus = async (orderId, status) => {
    const response = await api.patch(
        `/orders/${orderId}/status`,
        { status }
    );

    return response.data;
};

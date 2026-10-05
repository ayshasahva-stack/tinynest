import api from "../../services/api";

// Get all orders belonging to the logged-in user
export const getMyOrders = async () => {
    const response = await api.get("/orders");

    return response.data;
};

// Get one order by ID
export const getMyOrderById = async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);

    return response.data;
};
import api from "../../services/api";

// Create an order from the logged-in user's cart
export const createOrder = async (orderData) => {
    const response = await api.post("/orders", orderData);

    return response.data;
};
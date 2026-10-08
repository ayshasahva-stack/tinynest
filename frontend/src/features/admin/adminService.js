// Import the configured Axios instance.
import api from "../../services/api";

// Get admin dashboard overview statistics.
export const getDashboardOverview = async () => {
    const response = await api.get("/admin/dashboard/overview");

    return response.data;
};

// Get the five most recent orders.
export const getRecentOrders = async () => {
    const response = await api.get("/admin/dashboard/recent-orders");

    return response.data;
};

// Get the five most recently registered customers.
export const getRecentCustomers = async () => {
    const response = await api.get("/admin/dashboard/recent-customers");

    return response.data;
};

// Get products whose stock is five or less.
export const getLowStockProducts = async () => {
    const response = await api.get("/admin/dashboard/low-stock");

    return response.data;
};
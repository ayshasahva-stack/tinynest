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
// Get daily sales for the current month.
export const getSalesStatistics = async () => {
    const response = await api.get("/admin/dashboard/sales");

    return response.data;
};

// Get monthly sales for the current year.
export const getMonthlySales = async () => {
    const response = await api.get("/admin/dashboard/monthly-sales");

    return response.data;
};

// Get order counts grouped by order status.
export const getOrderStatistics = async () => {
    const response = await api.get("/admin/dashboard/order-statistics");

    return response.data;
};

// Get successful payment statistics grouped by payment method.
export const getPaymentStatistics = async () => {
    const response = await api.get("/admin/dashboard/payment-statistics");

    return response.data;
};

// Get the top-selling products.
export const getTopSellingProducts = async () => {
    const response = await api.get("/admin/dashboard/top-products");

    return response.data;
};
import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    getDashboardOverview,
    getRecentOrders,
    getRecentCustomers,
    getLowStockProducts,
    getSalesStatistics,
    getMonthlySales,
    getOrderStatistics,
    getPaymentStatistics,
    getTopSellingProducts,
} from "./adminService";

// Fetch the main dashboard statistics.
export const getDashboardOverviewThunk = createAsyncThunk(
    "admin/getDashboardOverview",

    async (_, { rejectWithValue }) => {
        try {
            const response = await getDashboardOverview();

            return response;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch dashboard data";

            return rejectWithValue(message);
        }
    }
);

// Fetch the latest five orders.
export const getRecentOrdersThunk = createAsyncThunk(
    "admin/getRecentOrders",

    async (_, { rejectWithValue }) => {
        try {
            const response = await getRecentOrders();

            return response;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch recent orders";

            return rejectWithValue(message);
        }
    }
);

// Fetch the latest five registered customers.
export const getRecentCustomersThunk = createAsyncThunk(
    "admin/getRecentCustomers",

    async (_, { rejectWithValue }) => {
        try {
            const response = await getRecentCustomers();

            return response;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch recent customers";

            return rejectWithValue(message);
        }
    }
);

// Fetch products with low stock.
export const getLowStockProductsThunk = createAsyncThunk(
    "admin/getLowStockProducts",

    async (_, { rejectWithValue }) => {
        try {
            const response = await getLowStockProducts();

            return response;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch low stock products";

            return rejectWithValue(message);
        }
    }
);
// Fetch daily sales for the current month.
export const getSalesStatisticsThunk = createAsyncThunk(
    "admin/getSalesStatistics",

    async (_, { rejectWithValue }) => {
        try {
            const response = await getSalesStatistics();

            return response;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch sales statistics";

            return rejectWithValue(message);
        }
    }
);

// Fetch monthly sales for the current year.
export const getMonthlySalesThunk = createAsyncThunk(
    "admin/getMonthlySales",

    async (_, { rejectWithValue }) => {
        try {
            const response = await getMonthlySales();

            return response;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch monthly sales";

            return rejectWithValue(message);
        }
    }
);

// Fetch order statistics grouped by status.
export const getOrderStatisticsThunk = createAsyncThunk(
    "admin/getOrderStatistics",

    async (_, { rejectWithValue }) => {
        try {
            const response = await getOrderStatistics();

            return response;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch order statistics";

            return rejectWithValue(message);
        }
    }
);

// Fetch successful payment statistics.
export const getPaymentStatisticsThunk = createAsyncThunk(
    "admin/getPaymentStatistics",

    async (_, { rejectWithValue }) => {
        try {
            const response = await getPaymentStatistics();

            return response;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch payment statistics";

            return rejectWithValue(message);
        }
    }
);

// Fetch the top-selling products.
export const getTopSellingProductsThunk = createAsyncThunk(
    "admin/getTopSellingProducts",

    async (_, { rejectWithValue }) => {
        try {
            const response = await getTopSellingProducts();

            return response;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch top-selling products";

            return rejectWithValue(message);
        }
    }
);
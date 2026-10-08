import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    getDashboardOverview,
    getRecentOrders,
    getRecentCustomers,
    getLowStockProducts,
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
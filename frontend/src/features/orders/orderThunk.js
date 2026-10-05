import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    getMyOrders,
    getMyOrderById,
} from "./orderService";

// Fetch all orders belonging to the logged-in user
export const getMyOrdersThunk = createAsyncThunk(
    "orders/getMyOrders",

    async (_, thunkAPI) => {
        try {
            return await getMyOrders();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch orders"
            );
        }
    }
);

// Fetch one order by its ID
export const getMyOrderByIdThunk = createAsyncThunk(
    "orders/getMyOrderById",

    async (orderId, thunkAPI) => {
        try {
            return await getMyOrderById(orderId);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch order"
            );
        }
    }
);
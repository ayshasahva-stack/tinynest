import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    getMyOrders,
    getMyOrderById,
     getAllOrdersForAdmin,
    updateOrderStatus,
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
// Admin: fetch every order.
export const getAllOrdersForAdminThunk = createAsyncThunk(
    "orders/getAllOrdersForAdmin",
    async (_, thunkAPI) => {
        try {
            return await getAllOrdersForAdmin();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch all orders"
            );
        }
    }
);

// Admin: update the status of one order.
// The argument must contain { orderId, status }.
export const updateOrderStatusThunk = createAsyncThunk(
    "orders/updateOrderStatus",
    async ({ orderId, status }, thunkAPI) => {
        try {
            const response = await updateOrderStatus(orderId, status);

            // Return the ID and requested status as a fallback
            // if the backend response does not include the updated order.
            return {
                orderId,
                status,
                response,
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to update order status"
            );
        }
    }
);




import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    getMyOrders,
    getMyOrderById,
     getAllOrdersForAdmin,
    updateOrderStatus,
    cancelMyOrder,
    confirmCodPayment,

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


 // Customer: cancel an order and return the updated order response.
export const cancelMyOrderThunk = createAsyncThunk(
    "orders/cancelMyOrder",
    async (orderId, thunkAPI) => {
        try {
            return await cancelMyOrder(orderId);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to cancel order"
            );
        }
    }
);



 // Admin: confirm COD payment for a delivered order.
export const confirmCodPaymentThunk = createAsyncThunk(
    "orders/confirmCodPayment",
    async (orderId, thunkAPI) => {
        try {
            return {
                orderId,
                response: await confirmCodPayment(orderId),
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to confirm COD payment"
            );
        }
    }
);

import { createAsyncThunk } from "@reduxjs/toolkit";

import { createOrder, abandonPendingOrder } from "./checkoutService";

// Create an order using the current user's cart
export const createOrderThunk = createAsyncThunk(
    "checkout/createOrder",

    async (orderData, thunkAPI) => {
        try {
            // Send shipping address and optional coupon
            // to the backend order API.
            return await createOrder(orderData);
        } catch (error) {
            // Return the backend error message to Redux
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to create order"
            );
        }
    }
);
// Ask the backend to safely cancel an abandoned Razorpay checkout.
export const abandonPendingOrderThunk = createAsyncThunk(
    "checkout/abandonPendingOrder",
    async (orderId, thunkAPI) => {
        try {
            return await abandonPendingOrder(orderId);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Unable to confirm payment status. Your order was not changed."
            );
        }
    }
);

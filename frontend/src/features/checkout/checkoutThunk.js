import { createAsyncThunk } from "@reduxjs/toolkit";

import { createOrder } from "./checkoutService";

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
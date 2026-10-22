
import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    createRazorpayOrder,
    verifyRazorpayPayment,
    createPayment,
    createRazorpayCheckoutSession,
    verifyRazorpayCheckoutSession,
} from "./paymentService";

// Create a Razorpay order on the backend.
export const createRazorpayOrderThunk = createAsyncThunk(
    "payments/createRazorpayOrder",
    async (orderId, thunkAPI) => {
        try {
            return await createRazorpayOrder(orderId);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to create Razorpay order"
            );
        }
    }
);

// Verify a payment after the Razorpay Checkout callback.
export const verifyRazorpayPaymentThunk = createAsyncThunk(
    "payments/verifyRazorpayPayment",
    async (paymentData, thunkAPI) => {
        try {
            return await verifyRazorpayPayment(paymentData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Payment verification failed"
            );
        }
    }
);

// Create a payment record, for example for Cash on Delivery.
export const createPaymentThunk = createAsyncThunk(
    "payments/createPayment",
    async ({ orderId, paymentMethod }, thunkAPI) => {
        try {
            return await createPayment(orderId, { paymentMethod });
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to create payment record"
            );
        }
    }
);

// Create a Razorpay payment attempt without creating an order document.
export const createRazorpayCheckoutSessionThunk = createAsyncThunk(
    "payments/createRazorpayCheckoutSession",
    async (checkoutData, thunkAPI) => {
        try {
            return await createRazorpayCheckoutSession(checkoutData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to start Razorpay checkout"
            );
        }
    }
);

// Verify payment and create the actual order only after gateway confirmation.
export const verifyRazorpayCheckoutSessionThunk = createAsyncThunk(
    "payments/verifyRazorpayCheckoutSession",
    async (paymentData, thunkAPI) => {
        try {
            return await verifyRazorpayCheckoutSession(paymentData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Payment verification failed"
            );
        }
    }
);


import { createSlice } from "@reduxjs/toolkit";

import {
    createRazorpayOrderThunk,
    verifyRazorpayPaymentThunk,
    createPaymentThunk,
    createRazorpayCheckoutSessionThunk,
    verifyRazorpayCheckoutSessionThunk,
} from "./paymentThunk";

const initialState = {
    razorpayOrder: null,
    payment: null,
    loading: false,
    error: null,
    verified: false,
};

const paymentSlice = createSlice({
    name: "payments",
    initialState,

    reducers: {
        // Clear old payment messages and data before a new attempt.
        resetPayment: (state) => {
            state.razorpayOrder = null;
            state.payment = null;
            state.loading = false;
            state.error = null;
            state.verified = false;
        },

        // Clear a displayed payment error.
        clearPaymentError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            // Create Razorpay order
            .addCase(createRazorpayOrderThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createRazorpayOrderThunk.fulfilled, (state, action) => {
                state.loading = false;

                // The API response uses the standard success envelope.
                state.razorpayOrder = action.payload.data;
            })
            .addCase(createRazorpayOrderThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Could not create payment order";
            })

            // Verify Razorpay payment
            .addCase(verifyRazorpayPaymentThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.verified = false;
            })
            .addCase(verifyRazorpayPaymentThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.payment = action.payload.data;
                state.verified = true;
            })
            .addCase(verifyRazorpayPaymentThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Payment verification failed";
                state.verified = false;
            })

            // Start Razorpay without creating an order.
            .addCase(createRazorpayCheckoutSessionThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.verified = false;
            })
            .addCase(createRazorpayCheckoutSessionThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.razorpayOrder = action.payload.data;
            })
            .addCase(createRazorpayCheckoutSessionThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Could not start Razorpay checkout";
            })

            // Verify captured checkout payment and finalize the order.
            .addCase(verifyRazorpayCheckoutSessionThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.verified = false;
            })
            .addCase(verifyRazorpayCheckoutSessionThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.payment = action.payload.data;
                state.verified = true;
            })
            .addCase(verifyRazorpayCheckoutSessionThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Payment verification failed";
                state.verified = false;
            })

            // Create payment record, such as COD
            .addCase(createPaymentThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPaymentThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.payment = action.payload.data;
            })
            .addCase(createPaymentThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to create payment";
            });
    },
});

export const { resetPayment, clearPaymentError } = paymentSlice.actions;

export default paymentSlice.reducer;

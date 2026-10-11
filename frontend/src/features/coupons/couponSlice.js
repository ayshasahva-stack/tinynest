
import { createSlice } from "@reduxjs/toolkit";

import {
    fetchAdminCouponsThunk,
    createCouponThunk,
    updateCouponThunk,
    deactivateCouponThunk,
} from "./couponThunk";

const initialState = {
    coupons: [],
    loading: false,
    error: null,

    // State for create, edit, and deactivate operations.
    saving: false,
    saveError: null,
    saveSuccess: null,
};

const couponSlice = createSlice({
    name: "coupons",
    initialState,
    reducers: {
        // Clear old feedback when opening or closing the form.
        clearCouponFeedback: (state) => {
            state.saveError = null;
            state.saveSuccess = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // ==========================================
            // FETCH ALL COUPONS
            // ==========================================
            .addCase(fetchAdminCouponsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminCouponsThunk.fulfilled, (state, action) => {
                state.loading = false;

                // Support both a direct array and a response
                // wrapped as { coupons: [...] }.
                const payload = action.payload;
                state.coupons = Array.isArray(payload)
                    ? payload
                    : payload?.coupons ?? [];
            })
            .addCase(fetchAdminCouponsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })

            // ==========================================
            // CREATE COUPON
            // ==========================================
            .addCase(createCouponThunk.pending, (state) => {
                state.saving = true;
                state.saveError = null;
                state.saveSuccess = null;
            })
            .addCase(createCouponThunk.fulfilled, (state, action) => {
                state.saving = false;

                // Add the newly created coupon to the list.
                const payload = action.payload;
                const coupon = payload?.coupon ?? payload;

                if (coupon?._id) {
                    state.coupons.unshift(coupon);
                }

                state.saveSuccess = "Coupon created successfully";
            })
            .addCase(createCouponThunk.rejected, (state, action) => {
                state.saving = false;
                state.saveError = action.payload || action.error.message;
            })

            // ==========================================
            // UPDATE COUPON
            // ==========================================
            .addCase(updateCouponThunk.pending, (state) => {
                state.saving = true;
                state.saveError = null;
                state.saveSuccess = null;
            })
            .addCase(updateCouponThunk.fulfilled, (state, action) => {
                state.saving = false;

                const payload = action.payload;
                const updatedCoupon = payload?.coupon ?? payload;

                if (updatedCoupon?._id) {
                    state.coupons = state.coupons.map((coupon) =>
                        coupon._id === updatedCoupon._id
                            ? updatedCoupon
                            : coupon
                    );
                }

                state.saveSuccess = "Coupon updated successfully";
            })
            .addCase(updateCouponThunk.rejected, (state, action) => {
                state.saving = false;
                state.saveError = action.payload || action.error.message;
            })

            // ==========================================
            // DEACTIVATE COUPON
            // ==========================================
            .addCase(deactivateCouponThunk.pending, (state) => {
                state.saving = true;
                state.saveError = null;
                state.saveSuccess = null;
            })
            .addCase(deactivateCouponThunk.fulfilled, (state, action) => {
                state.saving = false;

                const payload = action.payload;
                const deactivatedCoupon = payload?.coupon ?? payload;

                if (deactivatedCoupon?._id) {
                    state.coupons = state.coupons.map((coupon) =>
                        coupon._id === deactivatedCoupon._id
                            ? deactivatedCoupon
                            : coupon
                    );
                }

                state.saveSuccess = "Coupon deactivated successfully";
            })
            .addCase(deactivateCouponThunk.rejected, (state, action) => {
                state.saving = false;
                state.saveError = action.payload || action.error.message;
            });
    },
});

export const { clearCouponFeedback } = couponSlice.actions;

export default couponSlice.reducer;

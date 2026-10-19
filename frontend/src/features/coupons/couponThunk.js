
import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    getAllCoupons,
    createCoupon,
    updateCoupon,
    deactivateCoupon,
    getActiveCoupons,
    applyCoupon,
    
} from "./couponService";

// Extract the payload from the API response.
// Your backend's sendSuccessResponse helper may wrap
// the actual result inside a "data" property.
const getPayload = (response) => response?.data ?? response;

// Fetch every coupon for the admin.
export const fetchAdminCouponsThunk = createAsyncThunk(
    "coupons/fetchAdminCoupons",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAllCoupons();
            return getPayload(response);
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch coupons"
            );
        }
    }
);

// Create a coupon.
export const createCouponThunk = createAsyncThunk(
    "coupons/createCoupon",
    async (couponData, { rejectWithValue }) => {
        try {
            const response = await createCoupon(couponData);
            return getPayload(response);
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to create coupon"
            );
        }
    }
);

// Update a coupon.
export const updateCouponThunk = createAsyncThunk(
    "coupons/updateCoupon",
    async ({ couponId, couponData }, { rejectWithValue }) => {
        try {
            const response = await updateCoupon(couponId, couponData);
            return getPayload(response);
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to update coupon"
            );
        }
    }
);

// Deactivate a coupon.
export const deactivateCouponThunk = createAsyncThunk(
    "coupons/deactivateCoupon",
    async (couponId, { rejectWithValue }) => {
        try {
            const response = await deactivateCoupon(couponId);
            return getPayload(response);
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to deactivate coupon"
            );
        }
    }
);
// Fetch valid coupons for the customer-facing page.
export const fetchActiveCouponsThunk = createAsyncThunk(
    "coupons/fetchActiveCoupons",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getActiveCoupons();

            // Handle both direct data and { data: ... } responses.
            return response?.data ?? response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch available coupons"
            );
        }
    }
);

/**
 * Apply a coupon and retrieve the server-calculated totals.
 */
export const applyCouponThunk = createAsyncThunk(
    "coupons/applyCoupon",
    async (couponCode, { rejectWithValue }) => {
        try {
            const response = await applyCoupon(couponCode);

            // API responses may wrap the result in "data".
            return response?.data ?? response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to apply coupon"
            );
        }
    }
);

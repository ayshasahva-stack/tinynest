
import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    requestRefund,
    getAllRefunds,
    updateRefundStatus,
    processRefund,
    completeRefund,
    getMyRefunds
} from "./refundService";

// Customer: submit a refund request.
// Expected argument: { orderId, reason }
export const requestRefundThunk = createAsyncThunk(
    "refunds/requestRefund",
    async ({ orderId, reason }, thunkAPI) => {
        try {
            return await requestRefund(orderId, reason);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to request refund"
            );
        }
    }
);

// Admin: load all refund requests.
export const getAllRefundsThunk = createAsyncThunk(
    "refunds/getAllRefunds",
    async (_, thunkAPI) => {
        try {
            return await getAllRefunds();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch refunds"
            );
        }
    }
);

// Admin: approve or reject a refund.
// Expected argument: { refundId, status, adminNote }
export const updateRefundStatusThunk = createAsyncThunk(
    "refunds/updateRefundStatus",
    async (refundData, thunkAPI) => {
        try {
            return await updateRefundStatus(refundData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to update refund status"
            );
        }
    }
);

// Admin: start processing an approved refund.
export const processRefundThunk = createAsyncThunk(
    "refunds/processRefund",
    async (refundId, thunkAPI) => {
        try {
            return await processRefund(refundId);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to process refund"
            );
        }
    }
);

// Admin: complete a refund that is being processed.
export const completeRefundThunk = createAsyncThunk(
    "refunds/completeRefund",
    async (refundId, thunkAPI) => {
        try {
            return await completeRefund(refundId);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to complete refund"
            );
        }
    }
);
// Customer: fetch the logged-in user's refund history.
export const getMyRefundsThunk = createAsyncThunk(
    "refunds/getMyRefunds",
    async (_, thunkAPI) => {
        try {
            return await getMyRefunds();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch your refunds"
            );
        }
    }
);

import { createSlice } from "@reduxjs/toolkit";

import {
    getAllUsersThunk,
    blockUserThunk,
    unblockUserThunk,
    deleteUserThunk,
} from "./userThunk";

// Extract a customer object from the API response when available.
const getUpdatedUser = (payload) => {
    return payload?.response?.data?.data ??
        payload?.response?.data?.user ??
        payload?.response?.data ??
        null;
};

const initialState = {
    users: [],
    loading: false,
    error: null,
    actionLoading: false,
    actionError: null,
    actionSuccess: null,
};

const userSlice = createSlice({
    name: "users",
    initialState,

    reducers: {
        // Clear old feedback when needed.
        clearUserFeedback: (state) => {
            state.actionError = null;
            state.actionSuccess = null;
        },
    },

    extraReducers: (builder) => {
        builder
            // =========================
            // FETCH CUSTOMERS
            // =========================
            .addCase(getAllUsersThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllUsersThunk.fulfilled, (state, action) => {
                state.loading = false;

                // sendSuccessResponse returns the array in data.
                state.users = action.payload?.data ?? [];
            })
            .addCase(getAllUsersThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch customers";
            })

            // =========================
            // BLOCK CUSTOMER
            // =========================
            .addCase(blockUserThunk.pending, (state) => {
                state.actionLoading = true;
                state.actionError = null;
                state.actionSuccess = null;
            })
            .addCase(blockUserThunk.fulfilled, (state, action) => {
                state.actionLoading = false;

                const userId = action.payload.userId;
                const updatedUser = getUpdatedUser(action.payload);

                // Use the returned customer when available;
                // otherwise update the known status locally.
                state.users = state.users.map((user) =>
                    user._id === userId
                        ? { ...user, ...(updatedUser || {}), isBlocked: true }
                        : user
                );

                state.actionSuccess = "Customer blocked successfully";
            })
            .addCase(blockUserThunk.rejected, (state, action) => {
                state.actionLoading = false;
                state.actionError = action.payload || "Failed to block customer";
            })

            // =========================
            // UNBLOCK CUSTOMER
            // =========================
            .addCase(unblockUserThunk.pending, (state) => {
                state.actionLoading = true;
                state.actionError = null;
                state.actionSuccess = null;
            })
            .addCase(unblockUserThunk.fulfilled, (state, action) => {
                state.actionLoading = false;

                const userId = action.payload.userId;
                const updatedUser = getUpdatedUser(action.payload);

                state.users = state.users.map((user) =>
                    user._id === userId
                        ? { ...user, ...(updatedUser || {}), isBlocked: false }
                        : user
                );

                state.actionSuccess = "Customer unblocked successfully";
            })
            .addCase(unblockUserThunk.rejected, (state, action) => {
                state.actionLoading = false;
                state.actionError = action.payload || "Failed to unblock customer";
            })

            // =========================
            // DELETE CUSTOMER
            // =========================
            .addCase(deleteUserThunk.pending, (state) => {
                state.actionLoading = true;
                state.actionError = null;
                state.actionSuccess = null;
            })
            .addCase(deleteUserThunk.fulfilled, (state, action) => {
                state.actionLoading = false;

                // Remove the deleted customer from the Redux list.
                state.users = state.users.filter(
                    (user) => user._id !== action.payload
                );

                state.actionSuccess = "Customer deleted successfully";
            })
            .addCase(deleteUserThunk.rejected, (state, action) => {
                state.actionLoading = false;
                state.actionError = action.payload || "Failed to delete customer";
            });
    },
});

export const { clearUserFeedback } = userSlice.actions;

export default userSlice.reducer;

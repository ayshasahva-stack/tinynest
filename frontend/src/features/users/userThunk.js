
import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    getAllUsers,
    blockUser,
    unblockUser,
    deleteUser,
} from "./userService";

// Admin: fetch all customer accounts.
export const getAllUsersThunk = createAsyncThunk(
    "users/getAllUsers",
    async (_, thunkAPI) => {
        try {
            return await getAllUsers();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch customers"
            );
        }
    }
);

// Admin: block a customer account.
export const blockUserThunk = createAsyncThunk(
    "users/blockUser",
    async (userId, thunkAPI) => {
        try {
            const response = await blockUser(userId);

            // Keep the ID available if the response omits user data.
            return { userId, response };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to block customer"
            );
        }
    }
);

// Admin: unblock a customer account.
export const unblockUserThunk = createAsyncThunk(
    "users/unblockUser",
    async (userId, thunkAPI) => {
        try {
            const response = await unblockUser(userId);

            // Keep the ID available if the response omits user data.
            return { userId, response };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to unblock customer"
            );
        }
    }
);

// Admin: permanently delete a customer account.
export const deleteUserThunk = createAsyncThunk(
    "users/deleteUser",
    async (userId, thunkAPI) => {
        try {
            await deleteUser(userId);

            // Return the ID so Redux can remove the correct customer.
            return userId;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to delete customer"
            );
        }
    }
);

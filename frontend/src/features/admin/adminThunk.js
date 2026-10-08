import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    getDashboardOverview,
} from "./adminService";

// Fetch admin dashboard overview statistics.
export const getDashboardOverviewThunk = createAsyncThunk(
    "admin/getDashboardOverview",

    async (_, { rejectWithValue }) => {
        try {
            // Call the service function.
            const response = await getDashboardOverview();

            // Send successful data to the Redux slice.
            return response;
        } catch (error) {
            // Get the backend error message when available.
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch dashboard data";

            // Send the error to Redux.
            return rejectWithValue(message);
        }
    }
);
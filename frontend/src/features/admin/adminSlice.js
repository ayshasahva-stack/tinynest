import { createSlice } from "@reduxjs/toolkit";

import {
    getDashboardOverviewThunk,
} from "./adminThunk";

// Initial Redux state for the admin feature.
const initialState = {
    overview: null,
    loading: false,
    error: null,
};

// Create the admin Redux slice.
const adminSlice = createSlice({
    name: "admin",

    initialState,

    reducers: {
        // Clear any previous admin error.
        clearAdminError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // Request started.
            .addCase(
                getDashboardOverviewThunk.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            // Request succeeded.
            .addCase(
                getDashboardOverviewThunk.fulfilled,
                (state, action) => {
                    state.loading = false;

                    // Backend response structure:
                    // response.data contains the overview object.
                    state.overview = action.payload.data;
                }
            )

            // Request failed.
            .addCase(
                getDashboardOverviewThunk.rejected,
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            );
    },
});

// Export the action.
export const {
    clearAdminError,
} = adminSlice.actions;

// Export the reducer.
export default adminSlice.reducer;
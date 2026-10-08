import { createSlice } from "@reduxjs/toolkit";

import {
    getDashboardOverviewThunk,
    getRecentOrdersThunk,
    getRecentCustomersThunk,
    getLowStockProductsThunk,
} from "./adminThunk";

// Initial state for the admin feature.
const initialState = {
    // Main dashboard statistics.
    overview: null,

    // Recent dashboard data.
    recentOrders: [],
    recentCustomers: [],
    lowStockProducts: [],

    // Loading states.
    loading: false,
    recentOrdersLoading: false,
    recentCustomersLoading: false,
    lowStockLoading: false,

    // Error states.
    error: null,
    recentOrdersError: null,
    recentCustomersError: null,
    lowStockError: null,
};

const adminSlice = createSlice({
    name: "admin",

    initialState,

    reducers: {
        // Clear the main dashboard error.
        clearAdminError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // -------------------------------
            // Dashboard overview
            // -------------------------------

            .addCase(
                getDashboardOverviewThunk.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                getDashboardOverviewThunk.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.overview = action.payload.data;
                }
            )

            .addCase(
                getDashboardOverviewThunk.rejected,
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            )

            // -------------------------------
            // Recent orders
            // -------------------------------

            .addCase(
                getRecentOrdersThunk.pending,
                (state) => {
                    state.recentOrdersLoading = true;
                    state.recentOrdersError = null;
                }
            )

            .addCase(
                getRecentOrdersThunk.fulfilled,
                (state, action) => {
                    state.recentOrdersLoading = false;

                    state.recentOrders =
                        action.payload.data || [];
                }
            )

            .addCase(
                getRecentOrdersThunk.rejected,
                (state, action) => {
                    state.recentOrdersLoading = false;
                    state.recentOrdersError = action.payload;
                }
            )

            // -------------------------------
            // Recent customers
            // -------------------------------

            .addCase(
                getRecentCustomersThunk.pending,
                (state) => {
                    state.recentCustomersLoading = true;
                    state.recentCustomersError = null;
                }
            )

            .addCase(
                getRecentCustomersThunk.fulfilled,
                (state, action) => {
                    state.recentCustomersLoading = false;

                    state.recentCustomers =
                        action.payload.data || [];
                }
            )

            .addCase(
                getRecentCustomersThunk.rejected,
                (state, action) => {
                    state.recentCustomersLoading = false;
                    state.recentCustomersError = action.payload;
                }
            )

            // -------------------------------
            // Low stock products
            // -------------------------------

            .addCase(
                getLowStockProductsThunk.pending,
                (state) => {
                    state.lowStockLoading = true;
                    state.lowStockError = null;
                }
            )

            .addCase(
                getLowStockProductsThunk.fulfilled,
                (state, action) => {
                    state.lowStockLoading = false;

                    state.lowStockProducts =
                        action.payload.data || [];
                }
            )

            .addCase(
                getLowStockProductsThunk.rejected,
                (state, action) => {
                    state.lowStockLoading = false;
                    state.lowStockError = action.payload;
                }
            );
    },
});

export const {
    clearAdminError,
} = adminSlice.actions;

export default adminSlice.reducer;
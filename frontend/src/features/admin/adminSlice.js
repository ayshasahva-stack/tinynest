import { createSlice } from "@reduxjs/toolkit";

import {
    getDashboardOverviewThunk,
    getRecentOrdersThunk,
    getRecentCustomersThunk,
    getLowStockProductsThunk,
    getSalesStatisticsThunk,
    getMonthlySalesThunk,
    getOrderStatisticsThunk,
    getPaymentStatisticsThunk,
    getTopSellingProductsThunk,
} from "./adminThunk";

// Initial Redux state for the admin feature.
const initialState = {
    // --------------------------------
    // Dashboard overview
    // --------------------------------

    // Main dashboard statistics.
    overview: null,

    // --------------------------------
    // Recent activity
    // --------------------------------

    // Recently placed orders.
    recentOrders: [],

    // Recently registered customers.
    recentCustomers: [],

    // Products that have low stock.
    lowStockProducts: [],

    // --------------------------------
    // Loading states
    // --------------------------------

    // Main dashboard loading.
    loading: false,

    // Recent activity loading states.
    recentOrdersLoading: false,
    recentCustomersLoading: false,
    lowStockLoading: false,

    // Sales analytics loading states.
    salesLoading: false,
    monthlySalesLoading: false,
    orderStatisticsLoading: false,
    paymentStatisticsLoading: false,
    topProductsLoading: false,

    // --------------------------------
    // Sales analytics data
    // --------------------------------

    // Daily sales for the current month.
    sales: [],

    // Monthly sales for the current year.
    monthlySales: [],

    // Orders grouped by status.
    orderStatistics: [],

    // Payments grouped by payment method.
    paymentStatistics: [],

    // Top-selling products.
    topSellingProducts: [],

    // --------------------------------
    // Error states
    // --------------------------------

    // Main dashboard error.
    error: null,

    // Recent activity errors.
    recentOrdersError: null,
    recentCustomersError: null,
    lowStockError: null,

    // Sales analytics errors.
    salesError: null,
    monthlySalesError: null,
    orderStatisticsError: null,
    paymentStatisticsError: null,
    topProductsError: null,
};

// Create the admin Redux slice.
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

            // ==========================================
            // DASHBOARD OVERVIEW
            // ==========================================

            // Dashboard request started.
            .addCase(
                getDashboardOverviewThunk.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            // Dashboard request succeeded.
            .addCase(
                getDashboardOverviewThunk.fulfilled,
                (state, action) => {
                    state.loading = false;

                    // Backend response:
                    // action.payload.data = overview object
                    state.overview = action.payload.data;
                }
            )

            // Dashboard request failed.
            .addCase(
                getDashboardOverviewThunk.rejected,
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            )

            // ==========================================
            // RECENT ORDERS
            // ==========================================

            // Recent orders request started.
            .addCase(
                getRecentOrdersThunk.pending,
                (state) => {
                    state.recentOrdersLoading = true;
                    state.recentOrdersError = null;
                }
            )

            // Recent orders request succeeded.
            .addCase(
                getRecentOrdersThunk.fulfilled,
                (state, action) => {
                    state.recentOrdersLoading = false;

                    state.recentOrders =
                        action.payload.data || [];
                }
            )

            // Recent orders request failed.
            .addCase(
                getRecentOrdersThunk.rejected,
                (state, action) => {
                    state.recentOrdersLoading = false;
                    state.recentOrdersError = action.payload;
                }
            )

            // ==========================================
            // RECENT CUSTOMERS
            // ==========================================

            // Recent customers request started.
            .addCase(
                getRecentCustomersThunk.pending,
                (state) => {
                    state.recentCustomersLoading = true;
                    state.recentCustomersError = null;
                }
            )

            // Recent customers request succeeded.
            .addCase(
                getRecentCustomersThunk.fulfilled,
                (state, action) => {
                    state.recentCustomersLoading = false;

                    state.recentCustomers =
                        action.payload.data || [];
                }
            )

            // Recent customers request failed.
            .addCase(
                getRecentCustomersThunk.rejected,
                (state, action) => {
                    state.recentCustomersLoading = false;
                    state.recentCustomersError = action.payload;
                }
            )

            // ==========================================
            // LOW STOCK PRODUCTS
            // ==========================================

            // Low-stock request started.
            .addCase(
                getLowStockProductsThunk.pending,
                (state) => {
                    state.lowStockLoading = true;
                    state.lowStockError = null;
                }
            )

            // Low-stock request succeeded.
            .addCase(
                getLowStockProductsThunk.fulfilled,
                (state, action) => {
                    state.lowStockLoading = false;

                    state.lowStockProducts =
                        action.payload.data || [];
                }
            )

            // Low-stock request failed.
            .addCase(
                getLowStockProductsThunk.rejected,
                (state, action) => {
                    state.lowStockLoading = false;
                    state.lowStockError = action.payload;
                }
            )

            // ==========================================
            // DAILY SALES
            // ==========================================

            // Daily sales request started.
            .addCase(
                getSalesStatisticsThunk.pending,
                (state) => {
                    state.salesLoading = true;
                    state.salesError = null;
                }
            )

            // Daily sales request succeeded.
            .addCase(
                getSalesStatisticsThunk.fulfilled,
                (state, action) => {
                    state.salesLoading = false;

                    state.sales =
                        action.payload.data || [];
                }
            )

            // Daily sales request failed.
            .addCase(
                getSalesStatisticsThunk.rejected,
                (state, action) => {
                    state.salesLoading = false;
                    state.salesError = action.payload;
                }
            )

            // ==========================================
            // MONTHLY SALES
            // ==========================================

            // Monthly sales request started.
            .addCase(
                getMonthlySalesThunk.pending,
                (state) => {
                    state.monthlySalesLoading = true;
                    state.monthlySalesError = null;
                }
            )

            // Monthly sales request succeeded.
            .addCase(
                getMonthlySalesThunk.fulfilled,
                (state, action) => {
                    state.monthlySalesLoading = false;

                    state.monthlySales =
                        action.payload.data || [];
                }
            )

            // Monthly sales request failed.
            .addCase(
                getMonthlySalesThunk.rejected,
                (state, action) => {
                    state.monthlySalesLoading = false;
                    state.monthlySalesError = action.payload;
                }
            )

            // ==========================================
            // ORDER STATISTICS
            // ==========================================

            // Order statistics request started.
            .addCase(
                getOrderStatisticsThunk.pending,
                (state) => {
                    state.orderStatisticsLoading = true;
                    state.orderStatisticsError = null;
                }
            )

            // Order statistics request succeeded.
            .addCase(
                getOrderStatisticsThunk.fulfilled,
                (state, action) => {
                    state.orderStatisticsLoading = false;

                    state.orderStatistics =
                        action.payload.data || [];
                }
            )

            // Order statistics request failed.
            .addCase(
                getOrderStatisticsThunk.rejected,
                (state, action) => {
                    state.orderStatisticsLoading = false;
                    state.orderStatisticsError = action.payload;
                }
            )

            // ==========================================
            // PAYMENT STATISTICS
            // ==========================================

            // Payment statistics request started.
            .addCase(
                getPaymentStatisticsThunk.pending,
                (state) => {
                    state.paymentStatisticsLoading = true;
                    state.paymentStatisticsError = null;
                }
            )

            // Payment statistics request succeeded.
            .addCase(
                getPaymentStatisticsThunk.fulfilled,
                (state, action) => {
                    state.paymentStatisticsLoading = false;

                    state.paymentStatistics =
                        action.payload.data || [];
                }
            )

            // Payment statistics request failed.
            .addCase(
                getPaymentStatisticsThunk.rejected,
                (state, action) => {
                    state.paymentStatisticsLoading = false;
                    state.paymentStatisticsError = action.payload;
                }
            )

            // ==========================================
            // TOP-SELLING PRODUCTS
            // ==========================================

            // Top-products request started.
            .addCase(
                getTopSellingProductsThunk.pending,
                (state) => {
                    state.topProductsLoading = true;
                    state.topProductsError = null;
                }
            )

            // Top-products request succeeded.
            .addCase(
                getTopSellingProductsThunk.fulfilled,
                (state, action) => {
                    state.topProductsLoading = false;

                    state.topSellingProducts =
                        action.payload.data || [];
                }
            )

            // Top-products request failed.
            .addCase(
                getTopSellingProductsThunk.rejected,
                (state, action) => {
                    state.topProductsLoading = false;
                    state.topProductsError = action.payload;
                }
            );
    },
});

// Export Redux actions.
export const {
    clearAdminError,
} = adminSlice.actions;

// Export the admin reducer.
// This reducer is registered in the Redux store as:
// admin: adminReducer
export default adminSlice.reducer;
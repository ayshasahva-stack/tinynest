
import { createSlice } from "@reduxjs/toolkit";

import {
    getMyOrdersThunk,
    getMyOrderByIdThunk,
    getAllOrdersForAdminThunk,
    updateOrderStatusThunk,
} from "./orderThunk";

const initialState = {
    // Existing customer order state.
    orders: [],
    selectedOrder: null,
    loading: false,
    error: null,

    // Admin order state.
    adminOrders: [],
    adminLoading: false,
    adminError: null,
    updatingOrderId: null,
    updateError: null,
    updateSuccess: false,
};

const orderSlice = createSlice({
    name: "orders",
    initialState,

    reducers: {
        clearSelectedOrder: (state) => {
            state.selectedOrder = null;
        },

        clearOrderError: (state) => {
            state.error = null;
        },

        // Clear errors and feedback when the admin starts a new action.
        clearAdminOrderFeedback: (state) => {
            state.adminError = null;
            state.updateError = null;
            state.updateSuccess = false;
        },
    },

    extraReducers: (builder) => {
        builder
            // =====================================
            // CUSTOMER: FETCH MY ORDERS
            // =====================================
            .addCase(getMyOrdersThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMyOrdersThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.data || [];
                state.error = null;
            })
            .addCase(getMyOrdersThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // =====================================
            // CUSTOMER: FETCH ONE ORDER
            // =====================================
            .addCase(getMyOrderByIdThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMyOrderByIdThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedOrder = action.payload.data;
                state.error = null;
            })
            .addCase(getMyOrderByIdThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // =====================================
            // ADMIN: FETCH ALL ORDERS
            // =====================================
            .addCase(getAllOrdersForAdminThunk.pending, (state) => {
                state.adminLoading = true;
                state.adminError = null;
            })
            .addCase(getAllOrdersForAdminThunk.fulfilled, (state, action) => {
                state.adminLoading = false;

                // The existing API convention returns data in response.data.
                state.adminOrders = action.payload.data || [];
                state.adminError = null;
            })
            .addCase(getAllOrdersForAdminThunk.rejected, (state, action) => {
                state.adminLoading = false;
                state.adminError = action.payload;
            })

            // =====================================
            // ADMIN: UPDATE ORDER STATUS
            // =====================================
            .addCase(updateOrderStatusThunk.pending, (state, action) => {
                state.updatingOrderId = action.meta.arg.orderId;
                state.updateError = null;
                state.updateSuccess = false;
            })
            .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
                state.updatingOrderId = null;
                state.updateSuccess = true;

                const { orderId, status } = action.payload;

                // Update the matching order in Redux without
                // needing to reload the entire list.
                state.adminOrders = state.adminOrders.map((order) =>
                    order._id === orderId
                        ? { ...order, status }
                        : order
                );
            })
            .addCase(updateOrderStatusThunk.rejected, (state, action) => {
                state.updatingOrderId = null;
                state.updateError = action.payload;
                state.updateSuccess = false;
            });
    },
});

export const {
    clearSelectedOrder,
    clearOrderError,
    clearAdminOrderFeedback,
} = orderSlice.actions;

export default orderSlice.reducer;

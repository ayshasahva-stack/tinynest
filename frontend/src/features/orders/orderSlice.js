
import { createSlice } from "@reduxjs/toolkit";

import {
    getMyOrdersThunk,
    getMyOrderByIdThunk,
    getAllOrdersForAdminThunk,
    updateOrderStatusThunk,
    cancelMyOrderThunk,
} from "./orderThunk";

// Initial state for customer orders, admin orders, and cancellation.
const initialState = {
    // Customer order state
    orders: [],
    selectedOrder: null,
    loading: false,
    error: null,

    // Admin order state
    adminOrders: [],
    adminLoading: false,
    adminError: null,
    updatingOrderId: null,
    updateError: null,
    updateSuccess: false,

    // Customer cancellation state
    cancellingOrder: false,
    cancelError: null,
    cancelSuccess: false,
};

const orderSlice = createSlice({
    name: "orders",
    initialState,

    reducers: {
        // Clear the currently selected order.
        clearSelectedOrder: (state) => {
            state.selectedOrder = null;
        },

        // Clear customer order errors.
        clearOrderError: (state) => {
            state.error = null;
        },

        // Clear cancellation feedback when needed.
        clearCancelOrderFeedback: (state) => {
            state.cancelError = null;
            state.cancelSuccess = false;
        },

        // Clear admin order feedback before a new action.
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

                // Update only the matching order in the admin list.
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
            })

            // =====================================
            // CUSTOMER: CANCEL ORDER
            // =====================================
            .addCase(cancelMyOrderThunk.pending, (state) => {
                state.cancellingOrder = true;
                state.cancelError = null;
                state.cancelSuccess = false;
            })
            .addCase(cancelMyOrderThunk.fulfilled, (state, action) => {
                state.cancellingOrder = false;
                state.cancelSuccess = true;
                state.cancelError = null;

                // The backend response contains the updated order in data.
                const updatedOrder = action.payload?.data;

                if (updatedOrder?._id) {
                    // Update the selected order with the backend response.
                    if (state.selectedOrder?._id === updatedOrder._id) {
                        state.selectedOrder = updatedOrder;
                    }

                    // Update the matching order in the customer's order list.
                    state.orders = state.orders.map((order) =>
                        order._id === updatedOrder._id
                            ? updatedOrder
                            : order
                    );
                }
            })
            .addCase(cancelMyOrderThunk.rejected, (state, action) => {
                state.cancellingOrder = false;
                state.cancelError =
                    action.payload || "Failed to cancel order";
                state.cancelSuccess = false;
            });
    },
});

// Export actions for use in components.
export const {
    clearSelectedOrder,
    clearOrderError,
    clearCancelOrderFeedback,
    clearAdminOrderFeedback,
} = orderSlice.actions;

export default orderSlice.reducer;

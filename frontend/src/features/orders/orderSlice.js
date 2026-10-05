import { createSlice } from "@reduxjs/toolkit";

import {
    getMyOrdersThunk,
    getMyOrderByIdThunk,
} from "./orderThunk";

const initialState = {
    // Store all orders for the logged-in user
    orders: [],

    // Store one selected order
    selectedOrder: null,

    // Loading state
    loading: false,

    // Error message
    error: null,
};

const orderSlice = createSlice({
    name: "orders",

    initialState,

    reducers: {
        // Clear the currently selected order
        clearSelectedOrder: (state) => {
            state.selectedOrder = null;
        },

        // Clear any previous error
        clearOrderError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // =====================================
            // GET MY ORDERS
            // =====================================

            .addCase(getMyOrdersThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getMyOrdersThunk.fulfilled, (state, action) => {
                state.loading = false;

                // Backend returns the orders array
                state.orders = action.payload.data || [];

                state.error = null;
            })

            .addCase(getMyOrdersThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // =====================================
            // GET ONE ORDER
            // =====================================

            .addCase(getMyOrderByIdThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getMyOrderByIdThunk.fulfilled, (state, action) => {
                state.loading = false;

                // Store the selected order
                state.selectedOrder = action.payload.data;

                state.error = null;
            })

            .addCase(getMyOrderByIdThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearSelectedOrder,
    clearOrderError,
} = orderSlice.actions;

export default orderSlice.reducer;
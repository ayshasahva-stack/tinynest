import { createSlice } from "@reduxjs/toolkit";

import { createOrderThunk } from "./checkoutThunk";

const initialState = {
    order: null,
    loading: false,
    error: null,
    success: false
};

const checkoutSlice = createSlice({
    name: "checkout",

    initialState,

    reducers: {
        // Clear the previous checkout state
        resetCheckout: (state) => {
            state.order = null;
            state.loading = false;
            state.error = null;
            state.success = false;
        }
    },

    extraReducers: (builder) => {
        builder

            // -------------------------
            // Create order - pending
            // -------------------------
            .addCase(createOrderThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })

            // -------------------------
            // Create order - success
            // -------------------------
            .addCase(createOrderThunk.fulfilled, (state, action) => {
                state.loading = false;

                // Store the newly created order
                state.order = action.payload.data;

                state.success = true;
                state.error = null;
            })

            // -------------------------
            // Create order - failed
            // -------------------------
            .addCase(createOrderThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            });
    }
});

export const { resetCheckout } = checkoutSlice.actions;

export default checkoutSlice.reducer;
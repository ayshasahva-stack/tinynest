// Import Redux Toolkit's createSlice
import { createSlice } from "@reduxjs/toolkit";

// Import cart thunks
import {
    addToCartThunk,
    getMyCartThunk,
    updateCartQuantityThunk,
    removeFromCartThunk,
    clearCartThunk,
} from "./cartThunk";

// Initial cart state
const initialState = {
    items: [],
    loading: false,
    error: null,
};

// Create the cart slice
const cartSlice = createSlice({
    name: "cart",

    initialState,

    reducers: {},

    extraReducers: (builder) => {
        // -----------------------------
        // GET CART
        // -----------------------------

        builder.addCase(getMyCartThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        builder.addCase(getMyCartThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.items = action.payload.data?.items || [];
        });

        builder.addCase(getMyCartThunk.rejected, (state, action) => {
            state.loading = false;
            state.error =
                action.payload || "Failed to fetch cart";
        });

        // -----------------------------
        // ADD TO CART
        // -----------------------------

        builder.addCase(addToCartThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        builder.addCase(addToCartThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.items = action.payload.data?.items || [];
        });

        builder.addCase(addToCartThunk.rejected, (state, action) => {
            state.loading = false;
            state.error =
                action.payload || "Failed to add item to cart";
        });

        // -----------------------------
        // UPDATE QUANTITY
        // -----------------------------

        builder.addCase(
            updateCartQuantityThunk.pending,
            (state) => {
                state.loading = true;
                state.error = null;
            }
        );

        builder.addCase(
            updateCartQuantityThunk.fulfilled,
            (state, action) => {
                state.loading = false;
                state.error = null;
                state.items =
                    action.payload.data?.items || [];
            }
        );

        builder.addCase(
            updateCartQuantityThunk.rejected,
            (state, action) => {
                state.loading = false;
                state.error =
                    action.payload ||
                    "Failed to update cart quantity";
            }
        );

        // -----------------------------
        // REMOVE ITEM
        // -----------------------------

        builder.addCase(
            removeFromCartThunk.pending,
            (state) => {
                state.loading = true;
                state.error = null;
            }
        );

        builder.addCase(
            removeFromCartThunk.fulfilled,
            (state, action) => {
                state.loading = false;
                state.error = null;
                state.items =
                    action.payload.data?.items || [];
            }
        );

        builder.addCase(
            removeFromCartThunk.rejected,
            (state, action) => {
                state.loading = false;
                state.error =
                    action.payload ||
                    "Failed to remove item from cart";
            }
        );

        // -----------------------------
        // CLEAR CART
        // -----------------------------

        builder.addCase(
            clearCartThunk.pending,
            (state) => {
                state.loading = true;
                state.error = null;
            }
        );

        builder.addCase(
            clearCartThunk.fulfilled,
            (state, action) => {
                state.loading = false;
                state.error = null;
                state.items =
                    action.payload.data?.items || [];
            }
        );

        builder.addCase(
            clearCartThunk.rejected,
            (state, action) => {
                state.loading = false;
                state.error =
                    action.payload ||
                    "Failed to clear cart";
            }
        );
    },
});

// Export the cart reducer
export default cartSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

import {
    addToWishlistThunk,
    getMyWishlistThunk,
    removeFromWishlistThunk,
    clearWishlistThunk
} from "./wishlistThunk";

const initialState = {
    products: [],
    loading: false,
    error: null
};

const wishlistSlice = createSlice({
    name: "wishlist",

    initialState,

    reducers: {
        // Clear any previous wishlist error
        clearWishlistError: (state) => {
            state.error = null;
        }
    },

    extraReducers: (builder) => {
        builder

            // -------------------------
            // Add to wishlist
            // -------------------------

            .addCase(addToWishlistThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(addToWishlistThunk.fulfilled, (state, action) => {
                state.loading = false;

                // Backend returns the updated wishlist
                state.products = action.payload.data?.products || [];
            })

            .addCase(addToWishlistThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // -------------------------
            // Get wishlist
            // -------------------------

            .addCase(getMyWishlistThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getMyWishlistThunk.fulfilled, (state, action) => {
                state.loading = false;

                state.products = action.payload.data?.products || [];
            })

            .addCase(getMyWishlistThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // -------------------------
            // Remove from wishlist
            // -------------------------

            .addCase(removeFromWishlistThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(removeFromWishlistThunk.fulfilled, (state, action) => {
                state.loading = false;

                state.products = action.payload.data?.products || [];
            })

            .addCase(removeFromWishlistThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // -------------------------
            // Clear wishlist
            // -------------------------

            .addCase(clearWishlistThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(clearWishlistThunk.fulfilled, (state, action) => {
                state.loading = false;

                state.products = action.payload.data?.products || [];
            })

            .addCase(clearWishlistThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearWishlistError } = wishlistSlice.actions;

export default wishlistSlice.reducer;
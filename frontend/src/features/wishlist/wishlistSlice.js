
import { createSlice } from "@reduxjs/toolkit";

import {
    addToWishlistThunk,
    addKitToWishlistThunk,
    getMyWishlistThunk,
    removeFromWishlistThunk,
    removeKitFromWishlistThunk,
    clearWishlistThunk,
} from "./wishlistThunk";

const initialState = {
    products: [],
    kits: [],
    loading: false,
    error: null,
};

// Read both arrays from the backend response.
const updateWishlist = (state, action) => {
    const data = action.payload?.data;

    state.products = data?.products || [];
    state.kits = data?.kits || [];
};

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,

    reducers: {
        clearWishlistError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        const requests = [
            addToWishlistThunk,
            addKitToWishlistThunk,
            getMyWishlistThunk,
            removeFromWishlistThunk,
            removeKitFromWishlistThunk,
            clearWishlistThunk,
        ];

        // Keep loading and error state consistent for every request.
        requests.forEach((thunk) => {
            builder
                .addCase(thunk.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(thunk.fulfilled, (state, action) => {
                    state.loading = false;
                    updateWishlist(state, action);
                })
                .addCase(thunk.rejected, (state, action) => {
                    state.loading = false;
                    state.error =
                        action.payload || "Wishlist request failed";
                });
        });
    },
});

export const { clearWishlistError } = wishlistSlice.actions;

export default wishlistSlice.reducer;

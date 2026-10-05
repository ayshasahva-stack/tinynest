import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    addToWishlist,
    getMyWishlist,
    removeFromWishlist,
    clearWishlist
} from "./wishlistService";

// Add a product to the wishlist
export const addToWishlistThunk = createAsyncThunk(
    "wishlist/addToWishlist",
    async (productId, thunkAPI) => {
        try {
            return await addToWishlist(productId);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to add product to wishlist"
            );
        }
    }
);

// Fetch the logged-in user's wishlist
export const getMyWishlistThunk = createAsyncThunk(
    "wishlist/getMyWishlist",
    async (_, thunkAPI) => {
        try {
            return await getMyWishlist();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to fetch wishlist"
            );
        }
    }
);

// Remove a product from the wishlist
export const removeFromWishlistThunk = createAsyncThunk(
    "wishlist/removeFromWishlist",
    async (productId, thunkAPI) => {
        try {
            return await removeFromWishlist(productId);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to remove product from wishlist"
            );
        }
    }
);

// Clear the entire wishlist
export const clearWishlistThunk = createAsyncThunk(
    "wishlist/clearWishlist",
    async (_, thunkAPI) => {
        try {
            return await clearWishlist();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to clear wishlist"
            );
        }
    }
);
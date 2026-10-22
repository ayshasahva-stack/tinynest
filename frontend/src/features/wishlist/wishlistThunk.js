
import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    addToWishlist,
    addKitToWishlist,
    getMyWishlist,
    removeFromWishlist,
    removeKitFromWishlist,
    clearWishlist,
} from "./wishlistService";

// Shared error handling for wishlist requests.
const getErrorMessage = (error, fallback) =>
    error.response?.data?.message || error.message || fallback;

// Existing product thunk.
export const addToWishlistThunk = createAsyncThunk(
    "wishlist/addToWishlist",
    async (productId, thunkAPI) => {
        try {
            return await addToWishlist(productId);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                getErrorMessage(error, "Failed to add product to wishlist")
            );
        }
    }
);

// New kit thunk.
export const addKitToWishlistThunk = createAsyncThunk(
    "wishlist/addKitToWishlist",
    async (kitId, thunkAPI) => {
        try {
            return await addKitToWishlist(kitId);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                getErrorMessage(error, "Failed to add kit to wishlist")
            );
        }
    }
);

// Fetch products and kits.
export const getMyWishlistThunk = createAsyncThunk(
    "wishlist/getMyWishlist",
    async (_, thunkAPI) => {
        try {
            return await getMyWishlist();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                getErrorMessage(error, "Failed to fetch wishlist")
            );
        }
    }
);

// Existing product removal thunk.
export const removeFromWishlistThunk = createAsyncThunk(
    "wishlist/removeFromWishlist",
    async (productId, thunkAPI) => {
        try {
            return await removeFromWishlist(productId);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                getErrorMessage(error, "Failed to remove product from wishlist")
            );
        }
    }
);

// New kit removal thunk.
export const removeKitFromWishlistThunk = createAsyncThunk(
    "wishlist/removeKitFromWishlist",
    async (kitId, thunkAPI) => {
        try {
            return await removeKitFromWishlist(kitId);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                getErrorMessage(error, "Failed to remove kit from wishlist")
            );
        }
    }
);

// Clear both wishlist item types.
export const clearWishlistThunk = createAsyncThunk(
    "wishlist/clearWishlist",
    async (_, thunkAPI) => {
        try {
            return await clearWishlist();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                getErrorMessage(error, "Failed to clear wishlist")
            );
        }
    }
);

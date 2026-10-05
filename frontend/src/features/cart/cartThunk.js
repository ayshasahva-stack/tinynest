// Import Redux Toolkit's createAsyncThunk
import { createAsyncThunk } from "@reduxjs/toolkit";

// Import cart API functions
import {
    addToCart,
    getMyCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
} from "./cartService";

// Add an item to the cart
export const addToCartThunk = createAsyncThunk(
    "cart/addToCart",
    async (cartData, thunkAPI) => {
        try {
            const response = await addToCart(cartData);

            return response;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to add item to cart";

            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Fetch the logged-in user's cart
export const getMyCartThunk = createAsyncThunk(
    "cart/getMyCart",
    async (_, thunkAPI) => {
        try {
            const response = await getMyCart();

            return response;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch cart";

            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Update cart item quantity
export const updateCartQuantityThunk = createAsyncThunk(
    "cart/updateQuantity",
    async ({ itemType, itemId, quantity }, thunkAPI) => {
        try {
            const response = await updateCartQuantity(
                itemType,
                itemId,
                quantity
            );

            return response;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to update cart quantity";

            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Remove an item from the cart
export const removeFromCartThunk = createAsyncThunk(
    "cart/removeFromCart",
    async ({ itemType, itemId }, thunkAPI) => {
        try {
            const response = await removeFromCart(
                itemType,
                itemId
            );

            return response;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to remove item from cart";

            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Clear the entire cart
export const clearCartThunk = createAsyncThunk(
    "cart/clearCart",
    async (_, thunkAPI) => {
        try {
            const response = await clearCart();

            return response;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to clear cart";

            return thunkAPI.rejectWithValue(message);
        }
    }
);
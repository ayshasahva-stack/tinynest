// Import createAsyncThunk from Redux Toolkit
import { createAsyncThunk } from "@reduxjs/toolkit";

// Import the product API service
import { getProducts } from "./productService";

// Fetch products from the backend
export const fetchProducts = createAsyncThunk(
    "products/fetchProducts",

    async (params = {}, thunkAPI) => {
        try {
            // Call the product service
            const response = await getProducts(params);

            // Return the product API response
            return response.data;
        } catch (error) {
            // Get the backend error message if available
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch products";

            // Send the error message to Redux
            return thunkAPI.rejectWithValue(message);
        }
    }
);
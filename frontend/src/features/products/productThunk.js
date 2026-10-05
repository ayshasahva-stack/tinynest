// Import createAsyncThunk from Redux Toolkit
import { createAsyncThunk } from "@reduxjs/toolkit";

// Import the product API service
import { getProducts ,
    getProductById,
} from "./productService";

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
// Fetch a single product by its ID
export const fetchProductById = createAsyncThunk(
    "products/fetchProductById",

    async (productId, thunkAPI) => {
        try {
            // Request the selected product from the backend
            const response = await getProductById(productId);

            // Return the product response to Redux
            return response;
        } catch (error) {
            // Get the backend error message when available
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch product";

            // Send the error to the rejected Redux action
            return thunkAPI.rejectWithValue(message);
        }
    }
);
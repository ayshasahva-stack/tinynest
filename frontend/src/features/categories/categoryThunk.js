// Import Redux Toolkit's createAsyncThunk
import { createAsyncThunk } from "@reduxjs/toolkit";

// Import the category API service
import { getCategories } from "./categoryService";

// Fetch all active categories
export const fetchCategories = createAsyncThunk(
    "categories/fetchCategories",

    async (_, thunkAPI) => {
        try {
            // Request categories from the backend
            const response = await getCategories();

            // Return the API response to Redux
            return response;
        } catch (error) {
            // Get the backend error message when available
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch categories";

            // Send the error to the rejected Redux action
            return thunkAPI.rejectWithValue(message);
        }
    }
);
// Import Redux Toolkit's createAsyncThunk
import { createAsyncThunk } from "@reduxjs/toolkit";

// Import the category API service
import {
    getCategories,
    getAllCategoriesForAdmin,
    createCategory as createCategoryAPI,
    updateCategory as updateCategoryAPI,
    deactivateCategory as deactivateCategoryAPI,
} from "./categoryService";

// Reusable helper for extracting API error messages
const getErrorMessage = (error, fallback) =>
    error.response?.data?.message || error.message || fallback;
// Fetch all active categories

export const fetchCategories = createAsyncThunk(
    "categories/fetchCategories",
    async (_, thunkAPI) => {
        try {
            // Request active categories from the backend
            return await getCategories();
        } catch (error) {
            // Return a readable error message to Redux
            return thunkAPI.rejectWithValue(
                getErrorMessage(error, "Failed to fetch categories")
            );
        }
    }
);
// Fetch all categories for admin management
export const fetchAdminCategories = createAsyncThunk(
    "categories/fetchAdminCategories",
    async (_, thunkAPI) => {
        try {
            return await getAllCategoriesForAdmin();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                getErrorMessage(error, "Failed to fetch admin categories")
            );
        }
    }
);

// Create a category
export const createCategory = createAsyncThunk(
    "categories/createCategory",
    async (categoryData, thunkAPI) => {
        try {
            return await createCategoryAPI(categoryData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                getErrorMessage(error, "Failed to create category")
            );
        }
    }
);

// Update a category
export const updateCategory = createAsyncThunk(
    "categories/updateCategory",
    async ({ id, categoryData }, thunkAPI) => {
        try {
            return await updateCategoryAPI(id, categoryData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                getErrorMessage(error, "Failed to update category")
            );
        }
    }
);

// Deactivate a category
export const deactivateCategory = createAsyncThunk(
    "categories/deactivateCategory",
    async (id, thunkAPI) => {
        try {
            return await deactivateCategoryAPI(id);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                getErrorMessage(error, "Failed to deactivate category")
            );
        }
    }
);
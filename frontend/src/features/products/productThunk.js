// Import createAsyncThunk from Redux Toolkit
import { createAsyncThunk } from "@reduxjs/toolkit";


// Import product API services
import {
    getProducts,
    getProductById,
    createProduct,
    deleteProduct,
    updateProduct,
} from "./productService";
// ======================================================
// FETCH ALL PRODUCTS
// ======================================================

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


// ======================================================
// FETCH SINGLE PRODUCT
// ======================================================

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


// ======================================================
// CREATE PRODUCT
// ======================================================

// Create a new product.
//
// The argument passed to this thunk is FormData.
//
// FormData contains both:
// - Product information
// - Product image files
export const createProductThunk = createAsyncThunk(
    "products/createProduct",

    async (formData, thunkAPI) => {
        try {

            // Send FormData to the product service
            const response = await createProduct(formData);

            // Return the created product response
            return response;

        } catch (error) {

            // Get the backend error message
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to create product";

            // Send the error message to Redux
            return thunkAPI.rejectWithValue(message);
        }
    }
);
// ======================================================
// DELETE PRODUCT
// ======================================================

// Delete a product by its ID
export const deleteProductThunk = createAsyncThunk(
    "products/deleteProduct",

    async (productId, thunkAPI) => {
        try {
            // Call the delete product service
            const response = await deleteProduct(productId);

            // Return both the response and product ID
            // so the Redux slice knows which product
            // should be removed from the list.
            return {
                productId,
                response,
            };

        } catch (error) {

            // Get the backend error message
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to delete product";

            // Send the error to Redux
            return thunkAPI.rejectWithValue(message);
        }
    }
);
// Update an existing product
export const updateProductThunk = createAsyncThunk(
    "products/updateProduct",

    async (
        { productId, formData },
        thunkAPI
    ) => {
        try {
            // Send the product ID and FormData
            // to the service function.
            const response = await updateProduct(
                productId,
                formData
            );

            // Return the updated product response.
            return response;

        } catch (error) {
            // Get a useful error message from
            // the backend response.
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to update product";

            // Send the error to Redux.
            return thunkAPI.rejectWithValue(
                message
            );
        }
    }
);
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getProducts,
    getProductById,
    createProduct,
    deleteProduct,
    updateProduct,
} from "./productService";
export const fetchProducts = createAsyncThunk(
    "products/fetchProducts",

    async (params = {}, thunkAPI) => {
        try {

            const response = await getProducts(params);

            return response.data;

        } catch (error) {

            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch products";

            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const fetchProductById = createAsyncThunk(
    "products/fetchProductById",

    async (productId, thunkAPI) => {
        try {

            const response = await getProductById(productId);

            return response;

        } catch (error) {

            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch product";

            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const createProductThunk = createAsyncThunk(
    "products/createProduct",

    async (formData, thunkAPI) => {
        try {

            const response = await createProduct(formData);

            return response;

        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to create product";

            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const deleteProductThunk = createAsyncThunk(
    "products/deleteProduct",

    async (productId, thunkAPI) => {
        try {
            const response = await deleteProduct(productId);

            return {
                productId,
                response,
            };

        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to delete product";

            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const updateProductThunk = createAsyncThunk(
    "products/updateProduct",

    async (
        { productId, formData },
        thunkAPI
    ) => {
        try {
            const response = await updateProduct(
                productId,
                formData
            );
            return response;

        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to update product";

            return thunkAPI.rejectWithValue(
                message
            );
        }
    }
);
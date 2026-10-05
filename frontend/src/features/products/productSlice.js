import { createSlice } from "@reduxjs/toolkit";
import {
    fetchProducts,
    fetchProductById,
} from "./productThunk";

const initialState = {
    products: [],
    selectedProduct: null,
    pagination: {
        currentPage: 1,
        limit: 10,
        totalProducts: 0,
        totalPages: 0,
    },
    loading: false,
    error: null,
};

// Create the products slice
const productSlice = createSlice({
    // Name used by Redux for this slice
    name: "products",

    // Set the initial Redux state
    initialState,

    // Handle the different stages of fetchProducts
    extraReducers: (builder) => {
        // Request has started
        builder.addCase(fetchProducts.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        // Request completed successfully
        builder.addCase(fetchProducts.fulfilled, (state, action) => {
            state.loading = false;

            // Store the products returned by the backend
            state.products = action.payload.products;

            // Store the pagination information
            state.pagination = action.payload.pagination;
        });

        // Request failed
        builder.addCase(fetchProducts.rejected, (state, action) => {
            state.loading = false;

            // Store the error message
            state.error = action.payload || "Failed to fetch products";
        });
        // Single product request started
        builder.addCase(fetchProductById.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.selectedProduct = null;
        });

        // Single product request succeeded
        builder.addCase(fetchProductById.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.selectedProduct = action.payload.data;
        });

        // Single product request failed
        builder.addCase(fetchProductById.rejected, (state, action) => {
            state.loading = false;
            state.error =
                action.payload || "Failed to fetch product";
        });
    },
});

// Export the reducer so it can be added to the Redux store
export default productSlice.reducer;
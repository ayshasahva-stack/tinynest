import { createSlice } from "@reduxjs/toolkit";
import { fetchProducts } from "./ProductThunk";

// Initial state for the products feature
const initialState = {
    // Store the products returned from the backend
    products: [],

    // Store pagination information returned by the backend
    pagination: {
        currentPage: 1,
        limit: 10,
        totalProducts: 0,
        totalPages: 0,
    },

    // Track whether the API request is currently running
    loading: false,

    // Store an error message if the request fails
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
    },
});

// Export the reducer so it can be added to the Redux store
export default productSlice.reducer;
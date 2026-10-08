// Import createSlice from Redux Toolkit
import { createSlice } from "@reduxjs/toolkit";


// Import product thunks
import {
    fetchProducts,
    fetchProductById,
    createProductThunk,
    deleteProductThunk,
} from "./productThunk";

// ======================================================
// INITIAL STATE
// ======================================================

const initialState = {

    // Store all products
    products: [],

    // Store the currently selected product
    selectedProduct: null,

    // Store pagination information
    pagination: {
        currentPage: 1,
        limit: 10,
        totalProducts: 0,
        totalPages: 0,
    },

    // Common loading state
    loading: false,

    // Store API error messages
    error: null,
};


// ======================================================
// PRODUCT SLICE
// ======================================================

// Create the products slice
const productSlice = createSlice({

    // Name used by Redux for this slice
    name: "products",

    // Set the initial Redux state
    initialState,

    // Handle async thunk states
    extraReducers: (builder) => {


        // ==================================================
        // FETCH PRODUCTS
        // ==================================================

        // Request has started
        builder.addCase(
            fetchProducts.pending,
            (state) => {

                state.loading = true;
                state.error = null;
            }
        );


        // Request completed successfully
        builder.addCase(
            fetchProducts.fulfilled,
            (state, action) => {

                state.loading = false;
                state.error = null;

                // Store the products returned by the backend
                state.products =
                    action.payload.products;

                // Store pagination information
                state.pagination =
                    action.payload.pagination;
            }
        );


        // Request failed
        builder.addCase(
            fetchProducts.rejected,
            (state, action) => {

                state.loading = false;

                // Store the error message
                state.error =
                    action.payload ||
                    "Failed to fetch products";
            }
        );


        // ==================================================
        // FETCH SINGLE PRODUCT
        // ==================================================

        // Single product request started
        builder.addCase(
            fetchProductById.pending,
            (state) => {

                state.loading = true;
                state.error = null;
                state.selectedProduct = null;
            }
        );


        // Single product request succeeded
        builder.addCase(
            fetchProductById.fulfilled,
            (state, action) => {

                state.loading = false;
                state.error = null;

                // Store the selected product
                state.selectedProduct =
                    action.payload.data;
            }
        );


        // Single product request failed
        builder.addCase(
            fetchProductById.rejected,
            (state, action) => {

                state.loading = false;

                state.error =
                    action.payload ||
                    "Failed to fetch product";
            }
        );


        // ==================================================
        // CREATE PRODUCT
        // ==================================================

        // Product creation started
        builder.addCase(
            createProductThunk.pending,
            (state) => {

                // Show loading state while
                // product is being created
                state.loading = true;

                // Clear previous errors
                state.error = null;
            }
        );


        // Product creation succeeded
        builder.addCase(
            createProductThunk.fulfilled,
            (state, action) => {

                // Stop loading
                state.loading = false;

                // Clear errors
                state.error = null;

                // Add the newly created product
                // to the beginning of the products array.
                //
                // The backend response has:
                // action.payload.data
                if (action.payload?.data) {

                    state.products.unshift(
                        action.payload.data
                    );
                }
            }
        );


        // Product creation failed
        builder.addCase(
            createProductThunk.rejected,
            (state, action) => {

                // Stop loading
                state.loading = false;

                // Store backend error message
                state.error =
                    action.payload ||
                    "Failed to create product";
            }
        );
        // ==================================================
        // DELETE PRODUCT
        // ==================================================

        // Delete request started
        builder.addCase(
            deleteProductThunk.pending,
            (state) => {

                // Show loading state
                state.loading = true;

                // Clear previous errors
                state.error = null;
            }
        );


        // Delete request succeeded
        builder.addCase(
            deleteProductThunk.fulfilled,
            (state, action) => {

                // Stop loading
                state.loading = false;

                // Clear errors
                state.error = null;

                // Get the deleted product ID
                const deletedProductId =
                    action.payload.productId;

                // Remove the deleted product from Redux
                state.products = state.products.filter(
                    (product) =>
                        product._id !== deletedProductId
                );
            }
        );


        // Delete request failed
        builder.addCase(
            deleteProductThunk.rejected,
            (state, action) => {

                // Stop loading
                state.loading = false;

                // Store the error
                state.error =
                    action.payload ||
                    "Failed to delete product";
            }
        );
    },
});


// ======================================================
// EXPORT REDUCER
// ======================================================

// Export the reducer so it can be added to the Redux store
export default productSlice.reducer;
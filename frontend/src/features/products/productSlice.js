import { createSlice } from "@reduxjs/toolkit";
import {
    fetchProducts,
    fetchProductById,
    createProductThunk,
    deleteProductThunk,
    updateProductThunk,
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
const productSlice = createSlice({

    name: "products",

    initialState,

    extraReducers: (builder) => {

        builder.addCase(
            fetchProducts.pending,
            (state) => {

                state.loading = true;
                state.error = null;
            }
        );
        builder.addCase(
            fetchProducts.fulfilled,
            (state, action) => {

                state.loading = false;
                state.error = null;
                state.products =
                    action.payload.products;

                state.pagination =
                    action.payload.pagination;
            }
        );


        builder.addCase(
            fetchProducts.rejected,
            (state, action) => {

                state.loading = false;

                state.error =
                    action.payload ||
                    "Failed to fetch products";
            }
        );
        builder.addCase(
            fetchProductById.pending,
            (state) => {

                state.loading = true;
                state.error = null;
                state.selectedProduct = null;
            }
        );


        builder.addCase(
            fetchProductById.fulfilled,
            (state, action) => {

                state.loading = false;
                state.error = null;

                state.selectedProduct =
                    action.payload.data;
            }
        );


        builder.addCase(
            fetchProductById.rejected,
            (state, action) => {

                state.loading = false;

                state.error =
                    action.payload ||
                    "Failed to fetch product";
            }
        );

        builder.addCase(
            createProductThunk.pending,
            (state) => {

                state.loading = true;
                state.error = null;
            }
        );

        builder.addCase(
            createProductThunk.fulfilled,
            (state, action) => {

                state.loading = false;

                state.error = null;

                if (action.payload?.data) {

                    state.products.unshift(
                        action.payload.data
                    );
                }
            }
        );

        builder.addCase(
            createProductThunk.rejected,
            (state, action) => {

                state.loading = false;
                state.error =
                    action.payload ||
                    "Failed to create product";
            }
        );
        builder.addCase(
            deleteProductThunk.pending,
            (state) => {

                state.loading = true;

                state.error = null;
            }
        );

        builder.addCase(
            deleteProductThunk.fulfilled,
            (state, action) => {

                state.loading = false;

                state.error = null;

                const deletedProductId =
                    action.payload.productId;

                state.products = state.products.filter(
                    (product) =>
                        product._id !== deletedProductId
                );
            }
        );


        builder.addCase(
            deleteProductThunk.rejected,
            (state, action) => {

                state.loading = false;

                state.error =
                    action.payload ||
                    "Failed to delete product";
            }
            
        );

builder.addCase(
    updateProductThunk.pending,
    (state) => {
        state.loading = true;

        state.error = null;
    }
)

builder.addCase(
    updateProductThunk.fulfilled,
    (state, action) => {
        state.loading = false;

        const updatedProduct =
            action.payload.data;
        const index = state.products.findIndex(
            (product) =>
                product._id ===
                updatedProduct._id
        );
        if (index !== -1) {
            state.products[index] =
                updatedProduct;
        }

        if (
            state.selectedProduct?._id ===
            updatedProduct._id
        ) {
            state.selectedProduct =
                updatedProduct;
        }
    }
)

builder.addCase(
    updateProductThunk.rejected,
    (state, action) => {
        state.loading = false;

        state.error =
            action.payload ||
            "Failed to update product";
    }
)
    },
    
});
export default productSlice.reducer;
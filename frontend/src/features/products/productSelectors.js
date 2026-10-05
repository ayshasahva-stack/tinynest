// Select the products array from the Redux store
export const selectProducts = (state) => state.products.products;

// Select the loading state from the Redux store
export const selectProductsLoading = (state) => state.products.loading;

// Select the product error message from the Redux store
export const selectProductsError = (state) => state.products.error;

// Select the product pagination information from the Redux store
export const selectProductsPagination = (state) => state.products.pagination;
// Select the currently selected product
export const selectSelectedProduct = (state) =>
    state.products.selectedProduct;
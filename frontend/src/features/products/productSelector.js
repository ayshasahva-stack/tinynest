// Select the products array from the Redux store
export const selectProducts = (state) => state.products.products;

// Select the loading state from the Redux store
export const selectProductsLoading = (state) => state.products.loading;

// Select the product error message from the Redux store
export const selectProductsError = (state) => state.products.error;
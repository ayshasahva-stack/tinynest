export const selectProducts = (state) => state.products.products;

export const selectProductsLoading = (state) => state.products.loading;

export const selectProductsError = (state) => state.products.error;

export const selectProductsPagination = (state) => state.products.pagination;
export const selectSelectedProduct = (state) =>
    state.products.selectedProduct;
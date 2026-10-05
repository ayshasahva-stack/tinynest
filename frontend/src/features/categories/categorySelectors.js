// Select all categories from Redux
export const selectCategories = (state) =>
    state.categories.categories;

// Select category loading state
export const selectCategoriesLoading = (state) =>
    state.categories.loading;

// Select category error state
export const selectCategoriesError = (state) =>
    state.categories.error;
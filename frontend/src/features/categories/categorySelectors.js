// Select all active categories from Redux
export const selectCategories = (state) =>
    state.categories.categories;

// Select active category loading state
export const selectCategoriesLoading = (state) =>
    state.categories.loading;

// Select active category fetching error
export const selectCategoriesError = (state) =>
    state.categories.error;

// Select all categories for admin, including inactive categories
export const selectAdminCategories = (state) =>
    state.categories.adminCategories;

// Select admin category loading state
export const selectAdminCategoriesLoading = (state) =>
    state.categories.adminLoading;

// Select admin category fetching error
export const selectAdminCategoriesError = (state) =>
    state.categories.adminError;

// Select create, update, or deactivate loading state
export const selectCategorySaving = (state) =>
    state.categories.saving;

// Select create, update, or deactivate error
export const selectCategorySaveError = (state) =>
    state.categories.saveError;
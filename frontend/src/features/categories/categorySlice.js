import { createSlice } from "@reduxjs/toolkit";

import {
    fetchCategories,
    fetchAdminCategories,
    createCategory,
    updateCategory,
    deactivateCategory,
} from "./categoryThunk";

const initialState = {
    // Active categories used by product forms
    categories: [],

    // All categories used by the admin management page
    adminCategories: [],

    loading: false,
    error: null,

    adminLoading: false,
    adminError: null,

    saving: false,
    saveError: null,
};

const categorySlice = createSlice({
    name: "categories",
    initialState,

    reducers: {
        // Clear a previous save/create/update error
        clearCategorySaveError: (state) => {
            state.saveError = null;
        },
    },

    extraReducers: (builder) => {
        // Existing public category fetching
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload.data;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch categories";
            });

        // Admin: fetch active and inactive categories
        builder
            .addCase(fetchAdminCategories.pending, (state) => {
                state.adminLoading = true;
                state.adminError = null;
            })
            .addCase(fetchAdminCategories.fulfilled, (state, action) => {
                state.adminLoading = false;
                state.adminCategories = action.payload.data;
            })
            .addCase(fetchAdminCategories.rejected, (state, action) => {
                state.adminLoading = false;
                state.adminError =
                    action.payload || "Failed to fetch admin categories";
            });

        // Admin: create category
        builder
            .addCase(createCategory.pending, (state) => {
                state.saving = true;
                state.saveError = null;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.saving = false;

                // Add the newly created category to the admin list
                state.adminCategories.unshift(action.payload.data);

                // Add it to the product-form list if active
                if (action.payload.data.isActive) {
                    state.categories.unshift(action.payload.data);
                }
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.saving = false;
                state.saveError = action.payload || "Failed to create category";
            });

        // Admin: update category
        builder
            .addCase(updateCategory.pending, (state) => {
                state.saving = true;
                state.saveError = null;
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.saving = false;

                const updatedCategory = action.payload.data;
                const id = updatedCategory._id;

                // Replace the category in the admin list
                const adminIndex = state.adminCategories.findIndex(
                    (category) => category._id === id
                );

                if (adminIndex !== -1) {
                    state.adminCategories[adminIndex] = updatedCategory;
                }

                // Keep the active-only product-form list synchronized
                state.categories = state.categories.filter(
                    (category) => category._id !== id
                );

                if (updatedCategory.isActive) {
                    state.categories.unshift(updatedCategory);
                }
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.saving = false;
                state.saveError = action.payload || "Failed to update category";
            });

        // Admin: deactivate category
        builder
            .addCase(deactivateCategory.pending, (state) => {
                state.saving = true;
                state.saveError = null;
            })
            .addCase(deactivateCategory.fulfilled, (state, action) => {
                state.saving = false;

                const updatedCategory = action.payload.data;
                const id = updatedCategory._id;

                // Keep the inactive category visible in admin management
                const adminIndex = state.adminCategories.findIndex(
                    (category) => category._id === id
                );

                if (adminIndex !== -1) {
                    state.adminCategories[adminIndex] = updatedCategory;
                }

                // Remove it from product forms because it is no longer active
                state.categories = state.categories.filter(
                    (category) => category._id !== id
                );
            })
            .addCase(deactivateCategory.rejected, (state, action) => {
                state.saving = false;
                state.saveError =
                    action.payload || "Failed to deactivate category";
            });
    },
});

export const { clearCategorySaveError } = categorySlice.actions;
// Export the category reducer
export default categorySlice.reducer;
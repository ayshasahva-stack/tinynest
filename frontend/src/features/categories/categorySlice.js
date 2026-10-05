// Import Redux Toolkit's createSlice
import { createSlice } from "@reduxjs/toolkit";

// Import the category fetching thunk
import { fetchCategories } from "./categoryThunk";

// Initial category state
const initialState = {
    categories: [],
    loading: false,
    error: null,
};

// Create the category slice
const categorySlice = createSlice({
    name: "categories",

    initialState,

    extraReducers: (builder) => {
        // Request started
        builder.addCase(fetchCategories.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        // Request succeeded
        builder.addCase(fetchCategories.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;

            // Store the categories returned by the backend
            state.categories = action.payload.data;
        });

        // Request failed
        builder.addCase(fetchCategories.rejected, (state, action) => {
            state.loading = false;
            state.error =
                action.payload || "Failed to fetch categories";
        });
    },
});

// Export the category reducer
export default categorySlice.reducer;
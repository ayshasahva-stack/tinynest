// Import createSlice from Redux Toolkit
import { createSlice } from "@reduxjs/toolkit";

// Import the registration thunk
import { registerUserThunk } from "./authThunk";
// Initial authentication state
const initialState = {
    user: null,
    token: null,
    loading: false,
    error: null,
    isAuthenticated: false,
};

// Create the authentication Redux slice
const authSlice = createSlice({
    // Name used by Redux for this slice
    name: "auth",

    // Use our authentication initial state
    initialState,

    // Handle asynchronous authentication actions
    extraReducers: (builder) => {
        // Handle registration request started
        builder.addCase(registerUserThunk.pending, (state) => {
            // Show that registration is currently in progress
            state.loading = true;

            // Clear any previous authentication error
            state.error = null;
        });
        // Handle successful registration
builder.addCase(registerUserThunk.fulfilled, (state) => {
    // Registration is no longer in progress
    state.loading = false;

    // Clear any previous error
    state.error = null;
});
// Handle failed registration
builder.addCase(registerUserThunk.rejected, (state, action) => {
    // Registration is no longer in progress
    state.loading = false;

    // Store the error message returned by the thunk
    state.error = action.payload || "Registration failed";
});
    },
});

// Export the authentication reducer
export default authSlice.reducer;
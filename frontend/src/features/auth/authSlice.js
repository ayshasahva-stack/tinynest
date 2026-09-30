// Import createSlice from Redux Toolkit
import { createSlice } from "@reduxjs/toolkit";

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

    // Reducers will be added as we build each auth feature
    reducers: {},
});

// Export the authentication reducer
export default authSlice.reducer;
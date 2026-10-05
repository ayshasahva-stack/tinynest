// Import Redux Toolkit's createSlice function
import { createSlice } from "@reduxjs/toolkit";

// Import the authentication thunks
import {
    registerUserThunk,
    verifyOtpThunk,
    loginUserThunk,
    getProfileThunk
} from "./authThunk";

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
    name: "auth",

    initialState,

   reducers: {
    // Clear all authentication data when the user logs out
    logout: (state) => {
        // Remove the user information from Redux
        state.user = null;

        // Remove the JWT token from Redux
        state.token = null;

        // Mark the user as logged out
        state.isAuthenticated = false;

        // Clear any previous authentication error
        state.error = null;

        // Remove the JWT token from browser storage
        localStorage.removeItem("token");
    },
},

    extraReducers: (builder) => {
        // Registration started
        builder.addCase(registerUserThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        // Registration completed
        builder.addCase(registerUserThunk.fulfilled, (state) => {
            state.loading = false;
        });

        // Registration failed
        builder.addCase(registerUserThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Registration failed";
        });

        // OTP verification started
        builder.addCase(verifyOtpThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        // OTP verification completed
        builder.addCase(verifyOtpThunk.fulfilled, (state) => {
            state.loading = false;
        });

        // OTP verification failed
        builder.addCase(verifyOtpThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "OTP verification failed";
        });

        // Login started
        builder.addCase(loginUserThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        // Login completed successfully
        builder.addCase(loginUserThunk.fulfilled, (state, action) => {
            state.loading = false;

            // Store the JWT token returned by the backend
            // Get the JWT token returned by the backend
            const token = action.payload.data.token;

            // Store the token in Redux
            state.token = token;

            // Persist the token so login survives page refresh
            localStorage.setItem("token", token);

            // Mark the user as authenticated
            state.isAuthenticated = true;
        });

        // Login failed
        builder.addCase(loginUserThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Login failed";
        });
        // Profile request started
builder.addCase(getProfileThunk.pending, (state) => {
    state.loading = true;
    state.error = null;
});

// Profile request completed successfully
builder.addCase(getProfileThunk.fulfilled, (state, action) => {
    state.loading = false;

    // Store the authenticated user's profile
    state.user = action.payload.data;

    // Mark the user as authenticated
    state.isAuthenticated = true;
});

// Profile request failed
builder.addCase(getProfileThunk.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload || "Failed to fetch profile";

    // The token is no longer considered valid
    state.token = null;
    state.user = null;
    state.isAuthenticated = false;

    // Remove the invalid token from browser storage
    localStorage.removeItem("token");
});
    },
});

// Export the logout action
export const { logout } = authSlice.actions;

// Export the authentication reducer
export default authSlice.reducer;
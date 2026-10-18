// Import Redux Toolkit's createSlice function
import { createSlice } from "@reduxjs/toolkit";

// Import the authentication thunks
import {
    registerUserThunk,
    verifyOtpThunk,
    loginUserThunk,
    getProfileThunk,
    updateProfileThunk,
    forgotPasswordThunk,
    verifyResetOtpThunk,
    resetPasswordThunk
} from "./authThunk";

// Initial authentication state
const initialState = {
    user: null,
    token: null,

    // Temporary token used only for password reset
    resetToken: null,

    loading: false,
    error: null,
    isAuthenticated: false,
    // Tracks whether the initial authentication check has finished.
    sessionChecked: false,
    // Track profile saving independently from login and OTP requests.
    profileSaving: false,
    profileError: null,
};

// Create the authentication Redux slice
const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {
        // Clear all authentication data when the user logs out
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.resetToken = null;
            state.isAuthenticated = false;
            state.error = null;
            state.sessionChecked = true;

            localStorage.removeItem("token");
        },
        // Mark the initial session check as complete.
        setSessionChecked: (state) => {
            state.sessionChecked = true;
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
        // Profile request started.
        builder.addCase(getProfileThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.sessionChecked = false;
        });

        // Profile request completed successfully.
        builder.addCase(getProfileThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.data;
            state.isAuthenticated = true;
            state.sessionChecked = true;
        });

        // Profile request failed.
        builder.addCase(getProfileThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to fetch profile";

            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            state.sessionChecked = true;

            localStorage.removeItem("token");
        });
        // Profile update started.
        builder.addCase(updateProfileThunk.pending, (state) => {
            state.profileSaving = true;
            state.profileError = null;
        });

        // Profile update completed successfully.
        builder.addCase(updateProfileThunk.fulfilled, (state, action) => {
            state.profileSaving = false;
            state.profileError = null;

            // Keep the Redux user data in sync with the backend.
            state.user = action.payload.data;
        });

        // Profile update failed.
        builder.addCase(updateProfileThunk.rejected, (state, action) => {
            state.profileSaving = false;
            state.profileError =
                action.payload || "Failed to update profile";
        });
        // Forgot password request started
        builder.addCase(forgotPasswordThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        // Forgot password request completed successfully
        builder.addCase(forgotPasswordThunk.fulfilled, (state) => {
            state.loading = false;
            state.error = null;
        });

        // Forgot password request failed
        builder.addCase(forgotPasswordThunk.rejected, (state, action) => {
            state.loading = false;
            state.error =
                action.payload || "Failed to request password reset";
        });
        // Reset OTP verification completed successfully
        builder.addCase(verifyResetOtpThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;

            // Store the temporary password reset token
            state.resetToken = action.payload.data.resetToken;
        });
        // Password reset request started
        builder.addCase(resetPasswordThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        // Password reset completed successfully
        builder.addCase(resetPasswordThunk.fulfilled, (state) => {
            state.loading = false;
            state.error = null;

            // The temporary reset token is no longer needed
            state.resetToken = null;
        });

        // Password reset failed
        builder.addCase(resetPasswordThunk.rejected, (state, action) => {
            state.loading = false;
            state.error =
                action.payload || "Failed to reset password";
        });
    },

});

// Export the logout action
export const { logout, setSessionChecked } = authSlice.actions;

// Export the authentication reducer
export default authSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

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

const initialState = {
    user: null,
    token: null,

    resetToken: null,

    loading: false,
    error: null,
    isAuthenticated: false,
    sessionChecked: false,
    profileSaving: false,
    profileError: null,
};

const authSlice = createSlice({
    name: "auth",

    initialState,

   reducers: {
    clearAuthError: (state) => {
        state.error = null;
    },

    logout: (state) => {
        state.user = null;
        state.token = null;
        state.resetToken = null;
        state.isAuthenticated = false;
        state.error = null;
        state.sessionChecked = true;

        localStorage.removeItem("token");
    },

    setSessionChecked: (state) => {
        state.sessionChecked = true;
    },
},

    extraReducers: (builder) => {
        builder.addCase(registerUserThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        builder.addCase(registerUserThunk.fulfilled, (state) => {
            state.loading = false;
        });

        builder.addCase(registerUserThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Registration failed";
        });

        builder.addCase(verifyOtpThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        builder.addCase(verifyOtpThunk.fulfilled, (state) => {
            state.loading = false;
        });

        builder.addCase(verifyOtpThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "OTP verification failed";
        });

        builder.addCase(loginUserThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        builder.addCase(loginUserThunk.fulfilled, (state, action) => {
            state.loading = false;

            const token = action.payload.data.token;

            state.token = token;

            localStorage.setItem("token", token);

            state.isAuthenticated = true;
        });

        builder.addCase(loginUserThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Login failed";
        });
        builder.addCase(getProfileThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.sessionChecked = false;
        });

        builder.addCase(getProfileThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.data;
            state.isAuthenticated = true;
            state.sessionChecked = true;
        });
        builder.addCase(getProfileThunk.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to fetch profile";

            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            state.sessionChecked = true;

            localStorage.removeItem("token");
        });
        builder.addCase(updateProfileThunk.pending, (state) => {
            state.profileSaving = true;
            state.profileError = null;
        });

        builder.addCase(updateProfileThunk.fulfilled, (state, action) => {
            state.profileSaving = false;
            state.profileError = null;

            state.user = action.payload.data;
        });

        builder.addCase(updateProfileThunk.rejected, (state, action) => {
            state.profileSaving = false;
            state.profileError =
                action.payload || "Failed to update profile";
        });
        builder.addCase(forgotPasswordThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        builder.addCase(forgotPasswordThunk.fulfilled, (state) => {
            state.loading = false;
            state.error = null;
        });

        builder.addCase(forgotPasswordThunk.rejected, (state, action) => {
            state.loading = false;
            state.error =
                action.payload || "Failed to request password reset";
        });
        builder.addCase(verifyResetOtpThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;

            state.resetToken = action.payload.data.resetToken;
        });
        builder.addCase(resetPasswordThunk.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        builder.addCase(resetPasswordThunk.fulfilled, (state) => {
            state.loading = false;
            state.error = null;

            state.resetToken = null;
        });

        builder.addCase(resetPasswordThunk.rejected, (state, action) => {
            state.loading = false;
            state.error =
                action.payload || "Failed to reset password";
        });
    },

});

export const {
    logout,
    setSessionChecked,
    clearAuthError,
} = authSlice.actions;
export default authSlice.reducer;
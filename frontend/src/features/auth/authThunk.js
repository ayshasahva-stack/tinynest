// Import createAsyncThunk from Redux Toolkit
import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    registerUser,
    verifyOtp,
    loginUser,
    getProfile,
    forgotPassword,
    verifyResetOtp,
    resetPassword
} from "./authService";
// Register a new user
export const registerUserThunk = createAsyncThunk(
    "auth/registerUser",

    async (userData, thunkAPI) => {
        try {
            // Call the registration service
            const response = await registerUser(userData);

            // Return the successful backend response
            return response;
        } catch (error) {
            // Get the backend error message if available
            const message =
                error.response?.data?.message ||
                error.message ||
                "Registration failed";

            // Send the error message to Redux
            return thunkAPI.rejectWithValue(message);
        }
    }
);
// Verify the OTP sent to the user's email
export const verifyOtpThunk = createAsyncThunk(
    "auth/verifyOtp",

    async (otpData, thunkAPI) => {
        try {
            // Call the OTP verification service
            const response = await verifyOtp(otpData);

            // Return the backend response
            return response;
        } catch (error) {
            // Get the backend error message if available
            const message =
                error.response?.data?.message ||
                error.message ||
                "OTP verification failed";

            // Send the error message to Redux
            return thunkAPI.rejectWithValue(message);
        }
    }
);
// Handle user login
export const loginUserThunk = createAsyncThunk(
    "auth/loginUser",

    async (loginData, thunkAPI) => {
        try {
            // Send login data to the backend
            const response = await loginUser(loginData);

            // Return the backend response
            return response;
        } catch (error) {
            // Get the backend error message
            const message =
                error.response?.data?.message ||
                error.message ||
                "Login failed";

            // Send the error to Redux
            return thunkAPI.rejectWithValue(message);
        }
    }
);
// Fetch the currently authenticated user's profile
export const getProfileThunk = createAsyncThunk(
    "auth/getProfile",

    async (_, thunkAPI) => {
        try {
            // Request the user's profile from the protected backend
            const response = await getProfile();

            // Return the profile response
            return response;
        } catch (error) {
            // Get the backend error message
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch profile";

            // Send the error to Redux
            return thunkAPI.rejectWithValue(message);
        }
    }
);
// Request a password reset OTP
export const forgotPasswordThunk = createAsyncThunk(
    "auth/forgotPassword",

    async (email, thunkAPI) => {
        try {
            // Send the email to the backend
            const response = await forgotPassword(email);

            // Return the backend response
            return response;
        } catch (error) {
            // Get the backend error message
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to request password reset";

            // Send the error to Redux
            return thunkAPI.rejectWithValue(message);
        }
    }
);
// Verify the OTP used for password reset
export const verifyResetOtpThunk = createAsyncThunk(
    "auth/verifyResetOtp",

    async (otpData, thunkAPI) => {
        try {
            // Send the email and OTP to the backend
            const response = await verifyResetOtp(otpData);

            // Return the backend response
            return response;
        } catch (error) {
            // Get the backend error message
            const message =
                error.response?.data?.message ||
                error.message ||
                "OTP verification failed";

            // Send the error to Redux
            return thunkAPI.rejectWithValue(message);
        }
    }
);
// Reset the user's password
export const resetPasswordThunk = createAsyncThunk(
    "auth/resetPassword",

    async (resetData, thunkAPI) => {
        try {
            // Send the reset token and new password to the backend
            const response = await resetPassword(resetData);

            // Return the backend response
            return response;
        } catch (error) {
            // Get the backend error message
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to reset password";

            // Send the error to Redux
            return thunkAPI.rejectWithValue(message);
        }
    }
);
import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    registerUser,
    verifyOtp,
    loginUser,
    getProfile,
    updateProfile,
    forgotPassword,
    verifyResetOtp,
    resetPassword
} from "./authService";
export const registerUserThunk = createAsyncThunk(
    "auth/registerUser",

    async (userData, thunkAPI) => {
        try {
            const response = await registerUser(userData);

            return response;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Registration failed";
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const verifyOtpThunk = createAsyncThunk(
    "auth/verifyOtp",

    async (otpData, thunkAPI) => {
        try {
            const response = await verifyOtp(otpData);

            return response;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "OTP verification failed";

            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const loginUserThunk = createAsyncThunk(
    "auth/loginUser",

    async (loginData, thunkAPI) => {
        try {
            const response = await loginUser(loginData);

            return response;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Login failed";

            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const getProfileThunk = createAsyncThunk(
    "auth/getProfile",

    async (_, thunkAPI) => {
        try {
            const response = await getProfile();

            return response;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch profile";

            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const updateProfileThunk = createAsyncThunk(
    "auth/updateProfile",

    async (profileData, thunkAPI) => {
        try {
            const response = await updateProfile(profileData);

            return response;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to update profile";

            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const forgotPasswordThunk = createAsyncThunk(
    "auth/forgotPassword",

    async (email, thunkAPI) => {
        try {
            const response = await forgotPassword(email);

            return response;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to request password reset";

            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const verifyResetOtpThunk = createAsyncThunk(
    "auth/verifyResetOtp",

    async (otpData, thunkAPI) => {
        try {
            const response = await verifyResetOtp(otpData);

            return response;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "OTP verification failed";

            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const resetPasswordThunk = createAsyncThunk(
    "auth/resetPassword",

    async (resetData, thunkAPI) => {
        try {
            const response = await resetPassword(resetData);

            return response;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to reset password";

            return thunkAPI.rejectWithValue(message);
        }
    }
);
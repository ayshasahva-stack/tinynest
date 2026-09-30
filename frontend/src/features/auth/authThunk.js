// Import createAsyncThunk from Redux Toolkit
import { createAsyncThunk } from "@reduxjs/toolkit";

// Import the registration API service
import { registerUser } from "./authService";

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
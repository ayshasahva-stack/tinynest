// Import the shared Axios instance
import api from "../../services/api";

// Register a new user
export const registerUser = async (userData) => {
    // Send registration data to the backend
    const response = await api.post("/auth/register", userData);

    // Return the backend response
    return response.data;
};
// Verify the OTP sent to the user's email
export const verifyOtp = async (otpData) => {
    // Send the email and OTP to the backend
    const response = await api.post("/auth/verify-otp", otpData);

    // Return the backend response
    return response.data;
};
// Login an existing user
export const loginUser = async (loginData) => {
    // Send the email and password to the backend
    const response = await api.post("/auth/login", loginData);

    // Return the backend response
    return response.data;
};  
// Get the currently authenticated user's profile
export const getProfile = async () => {
    // Request the user's profile from the protected backend endpoint
    const response = await api.get("/auth/profile");

    // Return the backend response
    return response.data;
};
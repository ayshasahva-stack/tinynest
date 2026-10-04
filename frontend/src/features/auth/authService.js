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
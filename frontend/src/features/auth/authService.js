import api from "../../services/api";

export const registerUser = async (userData) => {
    const response = await api.post("/auth/register", userData);

    return response.data;
};
export const verifyOtp = async (otpData) => {
    const response = await api.post("/auth/verify-otp", otpData);

    return response.data;
};
export const loginUser = async (loginData) => {
    const response = await api.post("/auth/login", loginData);

    return response.data;
};  
export const getProfile = async () => {
    const response = await api.get("/auth/profile");

    return response.data;
};
export const updateProfile = async (profileData) => {
    const response = await api.patch("/auth/profile", profileData);

    return response.data;
};
export const forgotPassword = async (email) => {
    const response = await api.post("/auth/forgot-password", {
        email,
    });

    return response.data;
};
export const verifyResetOtp = async (otpData) => {
    const response = await api.post(
        "/auth/verify-reset-otp",
        otpData
    );

    return response.data;
};
export const resetPassword = async (resetData) => {
    const response = await api.post(
        "/auth/reset-password",
        resetData
    );

    return response.data;
};
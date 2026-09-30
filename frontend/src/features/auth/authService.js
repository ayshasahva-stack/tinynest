// Import the shared Axios instance
import api from "../../services/api";

// Register a new user
export const registerUser = async (userData) => {
    // Send registration data to the backend
    const response = await api.post("/auth/register", userData);

    // Return the backend response
    return response.data;
};
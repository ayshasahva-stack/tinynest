// Import Axios for making HTTP requests
import axios from 'axios'

// Create a reusable Axios instance for TinyNest API requests
const api = axios.create({
    // Backend API base URL
    baseURL: "http://localhost:3000/api",
});
// Add the JWT token to every API request
api.interceptors.request.use(
    (config) => {
        // Get the saved token from localStorage
        const token = localStorage.getItem("token");

        // Add the Authorization header when a token exists
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Return the updated request configuration
        return config;
    },

    (error) => {
        // Reject the request if an interceptor error occurs
        return Promise.reject(error);
    }
);

// Export the Axios instance
export default api;
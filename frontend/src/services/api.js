// Import Axios for making HTTP requests
import axios from "axios";

// Create a reusable Axios instance for TinyNest API requests
const api = axios.create({
    // Backend API base URL
    baseURL: "http://localhost:3000/api",
});

// Export the Axios instance
export default api;
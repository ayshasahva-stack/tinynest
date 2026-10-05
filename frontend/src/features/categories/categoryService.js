// Import the reusable Axios API instance
import api from "../../services/api";

// Fetch all active categories
export const getCategories = async () => {
    // Send a GET request to the categories endpoint
    const response = await api.get("/categories");

    // Return the backend response
    return response.data;
};
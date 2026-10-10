// Import the reusable Axios API instance
import api from "../../services/api";

// Fetch all active categories
export const getCategories = async () => {
    // Send a GET request to the categories endpoint
    const response = await api.get("/categories");

    // Return the backend response
    return response.data;
};
// Fetch all categories, including inactive ones, for the admin page
export const getAllCategoriesForAdmin = async () => {
    const response = await api.get("/categories/admin/all");
    return response.data;
};

// Create a category
export const createCategory = async (categoryData) => {
    const response = await api.post("/categories", categoryData);
    return response.data;
};

// Update a category by ID
export const updateCategory = async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
};

// Deactivate a category (soft delete)
export const deactivateCategory = async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
};
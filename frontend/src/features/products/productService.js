// Import the shared Axios instance
import api from "../../services/api";

// Fetch products from the backend
export const getProducts = async (params = {}) => {
    // Send a GET request to the products endpoint
    const response = await api.get("/products", {
        params,
    });

    // Return the backend response data
    return response.data;
};

// Temporary test function
export const testProductsApi = async () => {
    // Call the product API
    const data = await getProducts();

    // Display the API response in the browser console
    console.log("Products API response:", data);
};
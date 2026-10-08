// Import the shared Axios instance
import api from "../../services/api";


// ======================================================
// GET ALL PRODUCTS
// ======================================================

// Fetch products from the backend
export const getProducts = async (params = {}) => {
    // Send a GET request to the products endpoint
    const response = await api.get("/products", {
        params,
    });

    // Return the backend response data
    return response.data;
};


// ======================================================
// TEST PRODUCTS API
// ======================================================

// Temporary test function
export const testProductsApi = async () => {
    // Call the product API
    const data = await getProducts();

    // Display the API response in the browser console
    console.log("Products API response:", data);
};


// ======================================================
// GET SINGLE PRODUCT
// ======================================================

// Fetch a single product by its ID
export const getProductById = async (productId) => {
    // Send a GET request for the selected product
    const response = await api.get(
        `/products/${productId}`
    );

    // Return the backend response
    return response.data;
};


// ======================================================
// CREATE PRODUCT
// ======================================================

// Create a new product
//
// formData contains:
// - Product text fields
// - Product image files
//
// We use FormData because images need to be
// uploaded to Cloudinary through the backend.
export const createProduct = async (formData) => {

    // Send the FormData to the backend.
    //
    // IMPORTANT:
    // We do NOT manually set Content-Type here.
    // The browser/Axios will automatically create
    // the correct multipart/form-data boundary.
    const response = await api.post(
        "/products",
        formData
    );

    // Return the backend response
    return response.data;
};
// Update an existing product
export const updateProduct = async (
    productId,
    formData
) => {
    // Send FormData because the request can contain
    // both product fields and new image files.
    const response = await api.put(
        `/products/${productId}`,
        formData
    );

    return response.data;
};
// ======================================================
// DELETE PRODUCT
// ======================================================

// Delete a product by its ID
export const deleteProduct = async (productId) => {
    // Send DELETE request to the backend
    const response = await api.delete(
        `/products/${productId}`
    );

    // Return the backend response
    return response.data;
};
import api from "../../services/api";
export const getProducts = async (params = {}) => {
    const { includeOutOfStock, ...queryParams } = params;

    const endpoint = includeOutOfStock
        ? "/products/admin"
        : "/products";
    const response = await api.get(endpoint, {
        params: queryParams,
    });

    return response.data;
};

export const testProductsApi = async () => {
    const data = await getProducts();
    console.log("Products API response:", data);
};
export const getProductById = async (productId) => {
    const response = await api.get(
        `/products/${productId}`
    );

    return response.data;
};

export const createProduct = async (formData) => {
    const response = await api.post(
        "/products",
        formData
    );
    return response.data;
};
export const updateProduct = async (
    productId,
    formData
) => {
    const response = await api.put(
        `/products/${productId}`,
        formData
    );

    return response.data;
};
export const deleteProduct = async (productId) => {
    const response = await api.delete(
        `/products/${productId}`
    );

    return response.data;
};
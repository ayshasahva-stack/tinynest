import api from "../../services/api";

// Create a new address
export const createAddress = async (addressData) => {
    const response = await api.post("/addresses", addressData);

    return response.data;
};

// Get all addresses of the logged-in user
export const getMyAddresses = async () => {
    const response = await api.get("/addresses");

    return response.data;
};

// Get one address by ID
export const getMyAddressById = async (addressId) => {
    const response = await api.get(`/addresses/${addressId}`);

    return response.data;
};

// Update an existing address
export const updateAddress = async (addressId, addressData) => {
    const response = await api.patch(
        `/addresses/${addressId}`,
        addressData
    );

    return response.data;
};

// Delete an address
export const deleteAddress = async (addressId) => {
    const response = await api.delete(
        `/addresses/${addressId}`
    );

    return response.data;
};

// Set an address as the default address
export const setDefaultAddress = async (addressId) => {
    const response = await api.patch(
        `/addresses/${addressId}/default`
    );

    return response.data;
};
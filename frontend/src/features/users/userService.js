
import api from "../../services/api";

// Fetch all customer accounts from the protected admin endpoint.
export const getAllUsers = async () => {
    const response = await api.get("/users");
    return response.data;
};

// Block a customer account.
export const blockUser = async (userId) => {
    const response = await api.patch(`/users/${userId}/block`);
    return response.data;
};

// Unblock a customer account.
export const unblockUser = async (userId) => {
    const response = await api.patch(`/users/${userId}/unblock`);
    return response.data;
};

// Permanently delete a customer account.
export const deleteUser = async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
};

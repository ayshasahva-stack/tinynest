
import api from "../../services/api";

// =========================================
// CUSTOMER API FUNCTIONS
// =========================================

// Fetch only active kits for customers.
export const getKits = async () => {
    const response = await api.get("/kits");
    return response.data;
};

// Fetch one active kit by ID.
export const getKitById = async (kitId) => {
    const response = await api.get(`/kits/${kitId}`);
    return response.data;
};

// =========================================
// ADMIN API FUNCTIONS
// =========================================

// Fetch all kits, including inactive kits.
export const getAllKitsForAdmin = async () => {
    const response = await api.get("/kits/admin/all");
    return response.data;
};

// Create a new kit.
export const createKit = async (kitData) => {
    const response = await api.post("/kits", kitData);
    return response.data;
};

// Update an existing kit.
export const updateKit = async (kitId, kitData) => {
    const response = await api.patch(`/kits/${kitId}`, kitData);
    return response.data;
};

// Activate or deactivate a kit.
export const updateKitStatus = async (kitId, isActive) => {
    const response = await api.patch(
        `/kits/${kitId}/status`,
        { isActive }
    );

    return response.data;
};

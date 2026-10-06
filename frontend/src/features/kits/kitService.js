import api from "../../services/api";

// -----------------------------------------
// GET ALL ACTIVE KITS
// -----------------------------------------

export const getKits = async () => {
    // Backend returns only active kits
    // and populates the products inside each kit.
    const response = await api.get("/kits");

    return response.data;
};


// -----------------------------------------
// GET ONE KIT
// -----------------------------------------

export const getKitById = async (kitId) => {
    // Fetch one active kit by its MongoDB ID.
    const response = await api.get(`/kits/${kitId}`);

    return response.data;
};
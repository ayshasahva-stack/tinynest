
import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    getKits,
    getKitById,
    getAllKitsForAdmin,
    createKit,
    updateKit,
    updateKitStatus,
} from "./kitService";

// =========================================
// CUSTOMER THUNKS
// =========================================

// Fetch all active kits.
export const fetchKitsThunk = createAsyncThunk(
    "kits/fetchKits",
    async (_, { rejectWithValue }) => {
        try {
            return await getKits();
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch kits"
            );
        }
    }
);

// Fetch one active kit.
export const fetchKitByIdThunk = createAsyncThunk(
    "kits/fetchKitById",
    async (kitId, { rejectWithValue }) => {
        try {
            return await getKitById(kitId);
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch kit"
            );
        }
    }
);

// =========================================
// ADMIN THUNKS
// =========================================

// Fetch all kits, including inactive kits.
export const fetchAllKitsForAdminThunk = createAsyncThunk(
    "kits/fetchAllKitsForAdmin",
    async (_, { rejectWithValue }) => {
        try {
            return await getAllKitsForAdmin();
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch all kits"
            );
        }
    }
);

// Create a new kit.
export const createKitThunk = createAsyncThunk(
    "kits/createKit",
    async (kitData, { rejectWithValue }) => {
        try {
            return await createKit(kitData);
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to create kit"
            );
        }
    }
);

// Update kit details.
export const updateKitThunk = createAsyncThunk(
    "kits/updateKit",
    async ({ kitId, kitData }, { rejectWithValue }) => {
        try {
            return await updateKit(kitId, kitData);
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to update kit"
            );
        }
    }
);

// Activate or deactivate a kit.
export const updateKitStatusThunk = createAsyncThunk(
    "kits/updateKitStatus",
    async ({ kitId, isActive }, { rejectWithValue }) => {
        try {
            return await updateKitStatus(kitId, isActive);
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to update kit status"
            );
        }
    }
);

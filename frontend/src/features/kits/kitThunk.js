import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    getKits,
    getKitById,
} from "./kitService";


// -----------------------------------------
// FETCH ALL KITS
// -----------------------------------------

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


// -----------------------------------------
// FETCH ONE KIT
// -----------------------------------------

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
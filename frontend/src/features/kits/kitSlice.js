import { createSlice } from "@reduxjs/toolkit";

import {
    fetchKitsThunk,
    fetchKitByIdThunk,
} from "./kitThunk";


const initialState = {

    // All available active kits
    kits: [],

    // Currently selected kit
    selectedKit: null,

    // Loading state
    loading: false,

    // Error message
    error: null,

};


const kitSlice = createSlice({

    name: "kits",

    initialState,

    reducers: {

        // Clear the currently selected kit
        clearSelectedKit: (state) => {
            state.selectedKit = null;
        },

        // Clear kit error
        clearKitError: (state) => {
            state.error = null;
        },

    },


    extraReducers: (builder) => {


        // =========================================
        // FETCH ALL KITS
        // =========================================

        builder

            .addCase(
                fetchKitsThunk.pending,
                (state) => {

                    state.loading = true;
                    state.error = null;

                }
            )

            .addCase(
                fetchKitsThunk.fulfilled,
                (state, action) => {

                    state.loading = false;

                    // Backend response:
                    // { success, message, data: [...] }

                    state.kits =
                        action.payload.data || [];

                }
            )

            .addCase(
                fetchKitsThunk.rejected,
                (state, action) => {

                    state.loading = false;

                    state.error = action.payload;

                }
            );


        // =========================================
        // FETCH ONE KIT
        // =========================================

        builder

            .addCase(
                fetchKitByIdThunk.pending,
                (state) => {

                    state.loading = true;
                    state.error = null;

                }
            )

            .addCase(
                fetchKitByIdThunk.fulfilled,
                (state, action) => {

                    state.loading = false;

                    // Backend response:
                    // { success, message, data: kit }

                    state.selectedKit =
                        action.payload.data || null;

                }
            )

            .addCase(
                fetchKitByIdThunk.rejected,
                (state, action) => {

                    state.loading = false;

                    state.error = action.payload;

                }
            );

    },

});


export const {
    clearSelectedKit,
    clearKitError,
} = kitSlice.actions;


export default kitSlice.reducer;
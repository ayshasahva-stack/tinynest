
import { createSlice } from "@reduxjs/toolkit";

import {
    fetchKitsThunk,
    fetchKitByIdThunk,
    fetchAllKitsForAdminThunk,
    createKitThunk,
    updateKitThunk,
    updateKitStatusThunk,
} from "./kitThunk";

const initialState = {
    // Existing customer state.
    kits: [],
    selectedKit: null,
    loading: false,
    error: null,

    // Admin state.
    adminKits: [],
    adminLoading: false,
    adminError: null,

    // Create/edit/status feedback.
    saving: false,
    saveError: null,
    saveSuccess: false,
};

const kitSlice = createSlice({
    name: "kits",
    initialState,

    reducers: {
        clearSelectedKit: (state) => {
            state.selectedKit = null;
        },

        clearKitError: (state) => {
            state.error = null;
        },

        // Clear messages before starting a new admin action.
        clearKitSaveFeedback: (state) => {
            state.saveError = null;
            state.saveSuccess = false;
        },
    },

    extraReducers: (builder) => {
        builder
            // =====================================
            // CUSTOMER: FETCH ACTIVE KITS
            // =====================================
            .addCase(fetchKitsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchKitsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.kits = action.payload.data || [];
            })
            .addCase(fetchKitsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // =====================================
            // CUSTOMER: FETCH ONE KIT
            // =====================================
            .addCase(fetchKitByIdThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchKitByIdThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedKit = action.payload.data || null;
            })
            .addCase(fetchKitByIdThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // =====================================
            // ADMIN: FETCH ALL KITS
            // =====================================
            .addCase(fetchAllKitsForAdminThunk.pending, (state) => {
                state.adminLoading = true;
                state.adminError = null;
            })
            .addCase(fetchAllKitsForAdminThunk.fulfilled, (state, action) => {
                state.adminLoading = false;
                state.adminKits = action.payload.data || [];
            })
            .addCase(fetchAllKitsForAdminThunk.rejected, (state, action) => {
                state.adminLoading = false;
                state.adminError = action.payload;
            })

            // =====================================
            // ADMIN: CREATE KIT
            // =====================================
            .addCase(createKitThunk.pending, (state) => {
                state.saving = true;
                state.saveError = null;
                state.saveSuccess = false;
            })
            .addCase(createKitThunk.fulfilled, (state, action) => {
                state.saving = false;
                state.saveSuccess = true;

                // Add the newly created kit to the admin list.
                const kit = action.payload.data;

                if (kit) {
                    state.adminKits = [
                        kit,
                        ...state.adminKits.filter(
                            (item) => item._id !== kit._id
                        ),
                    ];
                }
            })
            .addCase(createKitThunk.rejected, (state, action) => {
                state.saving = false;
                state.saveError = action.payload;
            })

            // =====================================
            // ADMIN: UPDATE KIT
            // =====================================
            .addCase(updateKitThunk.pending, (state) => {
                state.saving = true;
                state.saveError = null;
                state.saveSuccess = false;
            })
            .addCase(updateKitThunk.fulfilled, (state, action) => {
                state.saving = false;
                state.saveSuccess = true;

                const updatedKit = action.payload.data;

                if (updatedKit) {
                    state.adminKits = state.adminKits.map((kit) =>
                        kit._id === updatedKit._id
                            ? { ...kit, ...updatedKit }
                            : kit
                    );

                    // Keep the customer list in sync if that kit is present.
                    state.kits = state.kits.map((kit) =>
                        kit._id === updatedKit._id
                            ? { ...kit, ...updatedKit }
                            : kit
                    );

                    if (state.selectedKit?._id === updatedKit._id) {
                        state.selectedKit = {
                            ...state.selectedKit,
                            ...updatedKit,
                        };
                    }
                }
            })
            .addCase(updateKitThunk.rejected, (state, action) => {
                state.saving = false;
                state.saveError = action.payload;
            })

            // =====================================
            // ADMIN: ACTIVATE / DEACTIVATE KIT
            // =====================================
            .addCase(updateKitStatusThunk.pending, (state) => {
                state.saving = true;
                state.saveError = null;
                state.saveSuccess = false;
            })
            .addCase(updateKitStatusThunk.fulfilled, (state, action) => {
                state.saving = false;
                state.saveSuccess = true;

                const updatedKit = action.payload.data;

                if (updatedKit) {
                    state.adminKits = state.adminKits.map((kit) =>
                        kit._id === updatedKit._id
                            ? { ...kit, ...updatedKit }
                            : kit
                    );

                    // Public customers should only see active kits.
                    state.kits = state.kits
                        .map((kit) =>
                            kit._id === updatedKit._id
                                ? { ...kit, ...updatedKit }
                                : kit
                        )
                        .filter((kit) => kit.isActive !== false);

                    if (state.selectedKit?._id === updatedKit._id) {
                        state.selectedKit = updatedKit.isActive
                            ? updatedKit
                            : null;
                    }
                }
            })
            .addCase(updateKitStatusThunk.rejected, (state, action) => {
                state.saving = false;
                state.saveError = action.payload;
            });
    },
});

export const {
    clearSelectedKit,
    clearKitError,
    clearKitSaveFeedback,
} = kitSlice.actions;

export default kitSlice.reducer;

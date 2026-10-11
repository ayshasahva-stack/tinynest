
// =========================================
// CUSTOMER SELECTORS
// =========================================

export const selectKits = (state) => state.kits.kits;

export const selectSelectedKit = (state) => state.kits.selectedKit;

export const selectKitLoading = (state) => state.kits.loading;

export const selectKitError = (state) => state.kits.error;

// =========================================
// ADMIN SELECTORS
// =========================================

export const selectAdminKits = (state) => state.kits.adminKits;

export const selectAdminKitsLoading = (state) =>
    state.kits.adminLoading;

export const selectAdminKitsError = (state) =>
    state.kits.adminError;

export const selectKitSaving = (state) => state.kits.saving;

export const selectKitSaveError = (state) => state.kits.saveError;

export const selectKitSaveSuccess = (state) => state.kits.saveSuccess;

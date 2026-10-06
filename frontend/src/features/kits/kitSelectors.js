// Get all kits
export const selectKits = (state) =>
    state.kits.kits;


// Get selected kit
export const selectSelectedKit = (state) =>
    state.kits.selectedKit;


// Get loading state
export const selectKitLoading = (state) =>
    state.kits.loading;


// Get error
export const selectKitError = (state) =>
    state.kits.error;
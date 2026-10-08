// Get the dashboard overview data.
export const selectAdminOverview = (state) =>
    state.admin.overview;

// Get dashboard loading state.
export const selectAdminLoading = (state) =>
    state.admin.loading;

// Get dashboard error.
export const selectAdminError = (state) =>
    state.admin.error;
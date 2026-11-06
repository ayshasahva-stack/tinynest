export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export const selectAuthUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectProfileSaving = (state) =>
    state.auth.profileSaving;

export const selectProfileError = (state) =>
    state.auth.profileError;
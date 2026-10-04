// Select the authentication loading state
export const selectAuthLoading = (state) => state.auth.loading;
// Select the authentication error message
export const selectAuthError = (state) => state.auth.error;

// Select the current authenticated user
export const selectAuthUser = (state) => state.auth.user;
// Select whether the user is authenticated
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

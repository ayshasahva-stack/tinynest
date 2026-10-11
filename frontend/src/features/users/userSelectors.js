
export const selectUsers = (state) => state.users.users;
export const selectUsersLoading = (state) => state.users.loading;
export const selectUsersError = (state) => state.users.error;

export const selectUserActionLoading = (state) =>
    state.users.actionLoading;

export const selectUserActionError = (state) =>
    state.users.actionError;

export const selectUserActionSuccess = (state) =>
    state.users.actionSuccess;

// Customer: select the logged-in user's refund history.
export const selectMyRefunds = (state) => state.refunds.myRefunds;

// Admin: select all refund requests.
export const selectAllRefunds = (state) => state.refunds.refunds;

// Select the currently selected refund.
export const selectCurrentRefund = (state) => state.refunds.currentRefund;

// Select whether refund lists are loading.
export const selectRefundsLoading = (state) => state.refunds.loading;

// Select whether a refund action is in progress.
export const selectRefundActionLoading = (state) =>
    state.refunds.actionLoading;

// Select list-fetching errors.
export const selectRefundsError = (state) => state.refunds.error;

// Select action errors.
export const selectRefundActionError = (state) =>
    state.refunds.actionError;

// Select the latest success message.
export const selectRefundSuccessMessage = (state) =>
    state.refunds.successMessage;
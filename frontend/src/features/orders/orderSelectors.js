
// Existing customer selectors.
export const selectOrders = (state) => state.orders.orders;
export const selectSelectedOrder = (state) => state.orders.selectedOrder;
export const selectOrdersLoading = (state) => state.orders.loading;
export const selectOrdersError = (state) => state.orders.error;

// Admin order selectors.
export const selectAdminOrders = (state) => state.orders.adminOrders;
export const selectAdminOrdersLoading = (state) => state.orders.adminLoading;
export const selectAdminOrdersError = (state) => state.orders.adminError;
export const selectUpdatingOrderId = (state) => state.orders.updatingOrderId;
export const selectOrderUpdateError = (state) => state.orders.updateError;
export const selectOrderUpdateSuccess = (state) => state.orders.updateSuccess;
// Admin COD confirmation selectors.
export const selectConfirmingCodOrderId = (state) =>
    state.orders.confirmingCodOrderId;

export const selectCodPaymentError = (state) =>
    state.orders.codPaymentError;

export const selectCodPaymentSuccess = (state) =>
    state.orders.codPaymentSuccess;
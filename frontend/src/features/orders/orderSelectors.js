// Select all orders
export const selectOrders = (state) =>
    state.orders.orders;

// Select the currently selected order
export const selectSelectedOrder = (state) =>
    state.orders.selectedOrder;

// Select orders loading state
export const selectOrdersLoading = (state) =>
    state.orders.loading;

// Select orders error
export const selectOrdersError = (state) =>
    state.orders.error;
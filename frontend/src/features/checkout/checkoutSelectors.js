// Select the created order
export const selectCheckoutOrder = (state) =>
    state.checkout.order;

// Select checkout loading state
export const selectCheckoutLoading = (state) =>
    state.checkout.loading;

// Select checkout error
export const selectCheckoutError = (state) =>
    state.checkout.error;

// Select whether order creation succeeded
export const selectCheckoutSuccess = (state) =>
    state.checkout.success;
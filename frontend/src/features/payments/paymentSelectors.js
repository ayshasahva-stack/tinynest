
export const selectRazorpayOrder = (state) =>
    state.payments.razorpayOrder;

export const selectPayment = (state) =>
    state.payments.payment;

export const selectPaymentLoading = (state) =>
    state.payments.loading;

export const selectPaymentError = (state) =>
    state.payments.error;

export const selectPaymentVerified = (state) =>
    state.payments.verified;

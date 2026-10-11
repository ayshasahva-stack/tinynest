
 // All selectors read from the "coupons" key in the Redux store.
export const selectCoupons = (state) => state.coupons.coupons;

export const selectCouponsLoading = (state) =>
    state.coupons.loading;

export const selectCouponsError = (state) =>
    state.coupons.error;

export const selectCouponSaving = (state) =>
    state.coupons.saving;

export const selectCouponSaveError = (state) =>
    state.coupons.saveError;

export const selectCouponSaveSuccess = (state) =>
    state.coupons.saveSuccess;

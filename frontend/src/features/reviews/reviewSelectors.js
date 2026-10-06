// Get all reviews
export const selectReviews = (state) =>
    state.reviews.reviews;


// Get review loading state
export const selectReviewLoading = (state) =>
    state.reviews.loading;


// Get review error
export const selectReviewError = (state) =>
    state.reviews.error;
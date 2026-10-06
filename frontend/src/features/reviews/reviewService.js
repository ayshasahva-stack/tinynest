import api from "../../services/api";

// Add a review for a product
export const addReview = async (productId, reviewData) => {
    const response = await api.post(
        `/reviews/${productId}`,
        reviewData
    );

    return response.data;
};


// Get all reviews for a product
export const getProductReviews = async (productId) => {
    const response = await api.get(
        `/reviews/product/${productId}`
    );

    return response.data;
};


// Update the logged-in user's review
export const updateReview = async (reviewId, reviewData) => {
    const response = await api.patch(
        `/reviews/${reviewId}`,
        reviewData
    );

    return response.data;
};


// Delete the logged-in user's review
export const deleteReview = async (reviewId) => {
    const response = await api.delete(
        `/reviews/${reviewId}`
    );

    return response.data;
};
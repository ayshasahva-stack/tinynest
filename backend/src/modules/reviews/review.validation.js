import mongoose from "mongoose";

// Validate the product ID
export const validateReviewProduct = (productId) => {
    if (!productId) {
        return "Product ID is required";
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return "Product ID must be a valid product ID";
    }

    return null;
};

// Validate review data
export const validateReview = (body) => {
    const { rating, comment } = body;

    // Rating is required
    if (rating === undefined || rating === null) {
        return "Rating is required";
    }

    // Rating must be a number
    if (typeof rating !== "number") {
        return "Rating must be a number";
    }

    // Rating must be between 1 and 5
    if (rating < 1 || rating > 5) {
        return "Rating must be between 1 and 5";
    }

    // Comment is optional, but if provided it cannot be empty
    if (
        comment !== undefined &&
        comment !== null &&
        typeof comment !== "string"
    ) {
        return "Comment must be a string";
    }

    return null;
};

// Validation for updating a review
export const validateReviewUpdate = (body) => {
    if (!body || Object.keys(body).length === 0) {
        return "At least one field is required to update the review";
    }

    // Only these fields can be updated
    const allowedFields = ["rating", "comment"];

    for (const field of Object.keys(body)) {
        if (!allowedFields.includes(field)) {
            return `${field} is not allowed`;
        }
    }

    // Validate rating if provided
    if (body.rating !== undefined) {
        if (typeof body.rating !== "number") {
            return "Rating must be a number";
        }

        if (body.rating < 1 || body.rating > 5) {
            return "Rating must be between 1 and 5";
        }
    }

    // Validate comment if provided
    if (body.comment !== undefined && typeof body.comment !== "string") {
        return "Comment must be a string";
    }

    return null;
};
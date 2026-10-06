import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    addReview,
    getProductReviews,
    updateReview,
    deleteReview,
} from "./reviewService";


// -----------------------------------------
// GET PRODUCT REVIEWS
// -----------------------------------------

export const getProductReviewsThunk = createAsyncThunk(
    "reviews/getProductReviews",

    async (productId, { rejectWithValue }) => {
        try {
            return await getProductReviews(productId);
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch reviews"
            );
        }
    }
);


// -----------------------------------------
// ADD REVIEW
// -----------------------------------------

export const addReviewThunk = createAsyncThunk(
    "reviews/addReview",

    async (
        { productId, reviewData },
        { rejectWithValue }
    ) => {
        try {
            return await addReview(
                productId,
                reviewData
            );
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to add review"
            );
        }
    }
);


// -----------------------------------------
// UPDATE REVIEW
// -----------------------------------------

export const updateReviewThunk = createAsyncThunk(
    "reviews/updateReview",

    async (
        { reviewId, reviewData },
        { rejectWithValue }
    ) => {
        try {
            return await updateReview(
                reviewId,
                reviewData
            );
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to update review"
            );
        }
    }
);


// -----------------------------------------
// DELETE REVIEW
// -----------------------------------------

export const deleteReviewThunk = createAsyncThunk(
    "reviews/deleteReview",

    async (reviewId, { rejectWithValue }) => {
        try {
            return await deleteReview(reviewId);
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to delete review"
            );
        }
    }
);
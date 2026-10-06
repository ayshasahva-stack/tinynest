import { createSlice } from "@reduxjs/toolkit";

import {
    getProductReviewsThunk,
    addReviewThunk,
    updateReviewThunk,
    deleteReviewThunk,
} from "./reviewThunk";


const initialState = {

    // Reviews belonging to the currently viewed product
    reviews: [],

    // Loading state
    loading: false,

    // Error message
    error: null,

};


const reviewSlice = createSlice({

    name: "reviews",

    initialState,

    reducers: {

        // Clear reviews when leaving the product page
        clearReviews: (state) => {
            state.reviews = [];
        },

        // Clear review error
        clearReviewError: (state) => {
            state.error = null;
        },

    },


    extraReducers: (builder) => {


        // =========================================
        // GET PRODUCT REVIEWS
        // =========================================

        builder

            .addCase(
                getProductReviewsThunk.pending,
                (state) => {

                    state.loading = true;
                    state.error = null;

                }
            )

            .addCase(
                getProductReviewsThunk.fulfilled,
                (state, action) => {

                    state.loading = false;

                    state.reviews =
                        action.payload.data || [];

                }
            )

            .addCase(
                getProductReviewsThunk.rejected,
                (state, action) => {

                    state.loading = false;

                    state.error = action.payload;

                }
            );


        // =========================================
        // ADD REVIEW
        // =========================================

        builder

            .addCase(
                addReviewThunk.pending,
                (state) => {

                    state.loading = true;
                    state.error = null;

                }
            )

            .addCase(
                addReviewThunk.fulfilled,
                (state, action) => {

                    state.loading = false;

                    const newReview =
                        action.payload.data;

                    // Add the new review to the list
                    state.reviews.unshift(newReview);

                }
            )

            .addCase(
                addReviewThunk.rejected,
                (state, action) => {

                    state.loading = false;

                    state.error = action.payload;

                }
            );


        // =========================================
        // UPDATE REVIEW
        // =========================================

        builder

            .addCase(
                updateReviewThunk.pending,
                (state) => {

                    state.loading = true;
                    state.error = null;

                }
            )

            .addCase(
                updateReviewThunk.fulfilled,
                (state, action) => {

                    state.loading = false;

                    const updatedReview =
                        action.payload.data;

                    state.reviews =
                        state.reviews.map(
                            (review) =>
                                review._id ===
                                updatedReview._id
                                    ? updatedReview
                                    : review
                        );

                }
            )

            .addCase(
                updateReviewThunk.rejected,
                (state, action) => {

                    state.loading = false;

                    state.error = action.payload;

                }
            );


        // =========================================
        // DELETE REVIEW
        // =========================================

        builder

            .addCase(
                deleteReviewThunk.pending,
                (state) => {

                    state.loading = true;
                    state.error = null;

                }
            )

            .addCase(
                deleteReviewThunk.fulfilled,
                (state, action) => {

                    state.loading = false;

                    // The backend returns null after deletion.
                    // We therefore remove the review using
                    // the review ID passed to the thunk.
                    //
                    // The ID is available through
                    // action.meta.arg.

                    const deletedReviewId =
                        action.meta.arg;

                    state.reviews =
                        state.reviews.filter(
                            (review) =>
                                review._id !==
                                deletedReviewId
                        );

                }
            )

            .addCase(
                deleteReviewThunk.rejected,
                (state, action) => {

                    state.loading = false;

                    state.error = action.payload;

                }
            );

    },

});


export const {
    clearReviews,
    clearReviewError,
} = reviewSlice.actions;


export default reviewSlice.reducer;
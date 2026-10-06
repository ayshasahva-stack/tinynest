import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    addReviewThunk,
    updateReviewThunk,
} from "../../../features/reviews/reviewThunk";

import {
    selectReviewLoading,
} from "../../../features/reviews/reviewSelectors";

import Button from "../../../components/Button";


function ReviewForm({
    productId,
    existingReview = null,
    onSuccess,
    onCancel,
}) {

    const dispatch = useDispatch();

    const loading = useSelector(selectReviewLoading);

    // Rating selected by the user
    const [rating, setRating] = useState(
        existingReview?.rating || 0
    );

    // Review comment
    const [comment, setComment] = useState(
        existingReview?.comment || ""
    );

    // Frontend validation error
    const [error, setError] = useState("");


    // Update form when editing a different review
    useEffect(() => {

        setRating(existingReview?.rating || 0);
        setComment(existingReview?.comment || "");
        setError("");

    }, [existingReview]);


    // Handle review submission
    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");


        // Rating is required
        if (!rating) {
            setError("Please select a rating.");
            return;
        }


        try {

            // -----------------------------------------
            // UPDATE EXISTING REVIEW
            // -----------------------------------------

            if (existingReview) {

                await dispatch(
                    updateReviewThunk({
                        reviewId: existingReview._id,

                        reviewData: {
                            rating,
                            comment,
                        },
                    })
                ).unwrap();

            }

            // -----------------------------------------
            // CREATE NEW REVIEW
            // -----------------------------------------

            else {

                await dispatch(
                    addReviewThunk({
                        productId,

                        reviewData: {
                            rating,
                            comment,
                        },
                    })
                ).unwrap();

            }


            // Clear form
            setRating(0);
            setComment("");

            // Tell parent that the operation succeeded
            if (onSuccess) {
                onSuccess();
            }

        } catch (submitError) {

            setError(
                submitError ||
                "Something went wrong. Please try again."
            );

        }

    };


    return (

        <form
            onSubmit={handleSubmit}
            className="rounded-xl bg-gray-50 p-5 dark:bg-gray-900"
        >

            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">

                {existingReview
                    ? "Edit Your Review"
                    : "Write a Review"}

            </h3>


            {/* Validation error */}
            {error && (

                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    {error}
                </div>

            )}


            {/* Rating */}
            <div className="mb-5">

                <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Rating
                </p>


                <div className="flex gap-1">

                    {[1, 2, 3, 4, 5].map((star) => (

                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`text-3xl transition ${
                                star <= rating
                                    ? "text-yellow-400"
                                    : "text-gray-300 dark:text-gray-600"
                            }`}
                            aria-label={`Rate ${star} out of 5`}
                        >
                            ★
                        </button>

                    ))}

                </div>

            </div>


            {/* Comment */}
            <div className="mb-5">

                <label
                    htmlFor="review-comment"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    Comment
                </label>

                <textarea
                    id="review-comment"
                    value={comment}
                    onChange={(event) =>
                        setComment(event.target.value)
                    }
                    rows="4"
                    placeholder="Share your experience with this product..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />

            </div>


            {/* Actions */}
            <div className="flex gap-3">

                <Button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Saving..."
                        : existingReview
                            ? "Update Review"
                            : "Submit Review"}
                </Button>


                {existingReview && (

                    <Button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </Button>

                )}

            </div>

        </form>

    );
}


export default ReviewForm;
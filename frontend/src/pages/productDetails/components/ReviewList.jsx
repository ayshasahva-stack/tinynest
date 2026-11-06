
import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { deleteReviewThunk } from "../../../features/reviews/reviewThunk";

import { selectReviewLoading } from "../../../features/reviews/reviewSelectors";

function ReviewList({ reviews, currentUser, onEdit }) {
    const dispatch = useDispatch();

    const loading = useSelector(selectReviewLoading);

    const [deleteError, setDeleteError] = useState("");

    const isReviewOwnedByUser = (review) => {
        const currentUserId = currentUser?._id || currentUser?.id;
        const reviewUserId = review.user?._id || review.user?.id;

        if (currentUserId && reviewUserId) {
            return String(currentUserId) === String(reviewUserId);
        }

        if (currentUser?.email && review.user?.email) {
            return (
                currentUser.email.toLowerCase() ===
                review.user.email.toLowerCase()
            );
        }

        return false;
    };

    const handleDelete = async (reviewId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this review?"
        );

        if (!confirmed) return;

        setDeleteError("");

        try {
            await dispatch(deleteReviewThunk(reviewId)).unwrap();

        } catch (error) {
            setDeleteError(
                typeof error === "string"
                    ? error
                    : "Failed to delete the review. Please try again."
            );
        }
    };

    if (reviews.length === 0) {
        return (
            <div className="space-y-4">
                {deleteError && (
                    <p
                        role="alert"
                        className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400"
                    >
                        {deleteError}
                    </p>
                )}

                <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">
                        No reviews yet. Be the first to review this product.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {deleteError && (
                <p
                    role="alert"
                    className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400"
                >
                    {deleteError}
                </p>
            )}

            {reviews.map((review) => {
                const isOwnReview = isReviewOwnedByUser(review);

                return (
                    <article
                        key={review._id}
                        className="rounded-xl border border-gray-200 p-5 dark:border-gray-700"
                    >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {review.user?.email || "Customer"}
                                </p>

                                <div className="mt-1 flex items-center gap-2">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                                key={star}
                                                className={
                                                    star <= review.rating
                                                        ? "text-yellow-400"
                                                        : "text-gray-300 dark:text-gray-600"
                                                }
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>

                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {review.rating}/5
                                    </span>
                                </div>
                            </div>

                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {review.createdAt
                                    ? new Date(review.createdAt).toLocaleDateString()
                                    : "Date unavailable"}
                            </span>
                        </div>

                        {review.comment && (
                            <p className="mt-4 leading-7 text-gray-700 dark:text-gray-300">
                                {review.comment}
                            </p>
                        )}

                        {isOwnReview && (
                            <div className="mt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => onEdit(review)}
                                    className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                                >
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleDelete(review._id)}
                                    disabled={loading}
                                    className="text-sm font-medium text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400"
                                >
                                    {loading ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        )}
                    </article>
                );
            })}
        </div>
    );
}

export default ReviewList;
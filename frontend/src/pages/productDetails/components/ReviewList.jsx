// Import Redux hooks
import { useDispatch, useSelector } from "react-redux";

// Import delete review thunk
import {
    deleteReviewThunk,
} from "../../../features/reviews/reviewThunk";

// Import review loading selector
import {
    selectReviewLoading,
} from "../../../features/reviews/reviewSelectors";


function ReviewList({
    reviews,
    currentUser,
    onEdit,
}) {

    const dispatch = useDispatch();

    const loading = useSelector(selectReviewLoading);


    // -----------------------------------------
    // CHECK WHETHER REVIEW BELONGS TO USER
    // -----------------------------------------

    const isReviewOwnedByUser = (review) => {

        // Get current user's ID
        const currentUserId =
            currentUser?._id || currentUser?.id;

        // Get review user's ID
        const reviewUserId =
            review.user?._id || review.user?.id;

        // First try comparing IDs
        if (
            currentUserId &&
            reviewUserId
        ) {
            return currentUserId === reviewUserId;
        }

        // Fallback to email comparison
        // because the backend populates user.email
        if (
            currentUser?.email &&
            review.user?.email
        ) {
            return (
                currentUser.email.toLowerCase() ===
                review.user.email.toLowerCase()
            );
        }

        return false;
    };


    // -----------------------------------------
    // DELETE REVIEW
    // -----------------------------------------

    const handleDelete = async (reviewId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this review?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await dispatch(
                deleteReviewThunk(reviewId)
            ).unwrap();

        } catch (error) {

            console.error(
                "Failed to delete review:",
                error
            );

        }
    };


    // -----------------------------------------
    // EMPTY REVIEWS
    // -----------------------------------------

    if (reviews.length === 0) {

        return (

            <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center dark:border-gray-700">

                <p className="text-gray-500 dark:text-gray-400">
                    No reviews yet. Be the first to review this product.
                </p>

            </div>

        );
    }


    // -----------------------------------------
    // REVIEW LIST
    // -----------------------------------------

    return (

        <div className="space-y-5">

            {reviews.map((review) => {

                // Check whether this is the logged-in user's review
                const isOwnReview =
                    isReviewOwnedByUser(review);


                return (

                    <article
                        key={review._id}
                        className="rounded-xl border border-gray-200 p-5 dark:border-gray-700"
                    >

                        {/* Reviewer information */}
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                            <div>

                                {/* Reviewer email */}
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {review.user?.email ||
                                        "Customer"}
                                </p>


                                {/* Rating */}
                                <div className="mt-1 flex items-center gap-2">

                                    <div className="flex">

                                        {[1, 2, 3, 4, 5].map(
                                            (star) => (

                                                <span
                                                    key={star}
                                                    className={
                                                        star <=
                                                        review.rating
                                                            ? "text-yellow-400"
                                                            : "text-gray-300 dark:text-gray-600"
                                                    }
                                                >
                                                    ★
                                                </span>

                                            )
                                        )}

                                    </div>

                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {review.rating}/5
                                    </span>

                                </div>

                            </div>


                            {/* Review date */}
                            <span className="text-sm text-gray-500 dark:text-gray-400">

                                {new Date(
                                    review.createdAt
                                ).toLocaleDateString()}

                            </span>

                        </div>


                        {/* Review comment */}
                        {review.comment && (

                            <p className="mt-4 leading-7 text-gray-700 dark:text-gray-300">
                                {review.comment}
                            </p>

                        )}


                        {/* -------------------------------- */}
                        {/* OWN REVIEW ACTIONS */}
                        {/* -------------------------------- */}

                        {isOwnReview && (

                            <div className="mt-4 flex gap-4">

                                {/* Edit */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        onEdit(review)
                                    }
                                    className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                                >
                                    Edit
                                </button>


                                {/* Delete */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleDelete(
                                            review._id
                                        )
                                    }
                                    disabled={loading}
                                    className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50 dark:text-red-400"
                                >
                                    Delete
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
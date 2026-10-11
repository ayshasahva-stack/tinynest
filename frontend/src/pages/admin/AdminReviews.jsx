
import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../../services/api";

function AdminReviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [search, setSearch] = useState("");
    const [ratingFilter, setRatingFilter] = useState("all");
    const [deletingId, setDeletingId] = useState(null);

    // Fetch all reviews using the existing admin API.
    const fetchReviews = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get("/reviews/admin");

            // Your backend wraps successful responses in { data: ... }.
            setReviews(response.data.data || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to load reviews. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    // Calculate the average rating and rating distribution.
    const averageRating = useMemo(() => {
        if (reviews.length === 0) return "0.0";

        const total = reviews.reduce(
            (sum, review) => sum + Number(review.rating || 0),
            0
        );

        return (total / reviews.length).toFixed(1);
    }, [reviews]);

    const ratingDistribution = useMemo(() => {
        return [5, 4, 3, 2, 1].map((rating) => ({
            rating,
            count: reviews.filter(
                (review) => Number(review.rating) === rating
            ).length,
        }));
    }, [reviews]);

    // Search by product title, customer email, or comment.
    const filteredReviews = useMemo(() => {
        const query = search.trim().toLowerCase();

        return reviews.filter((review) => {
            const matchesSearch =
                !query ||
                review.product?.title?.toLowerCase().includes(query) ||
                review.user?.email?.toLowerCase().includes(query) ||
                review.comment?.toLowerCase().includes(query);

            const matchesRating =
                ratingFilter === "all" ||
                Number(review.rating) === Number(ratingFilter);

            return matchesSearch && matchesRating;
        });
    }, [reviews, search, ratingFilter]);

    // Delete any review as an administrator.
    const handleDelete = async (review) => {
        const confirmed = window.confirm(
            `Delete this review for "${review.product?.title || "this product"}"?`
        );

        if (!confirmed) return;

        setDeletingId(review._id);
        setDeleteError("");

        try {
            await api.delete(`/reviews/admin/${review._id}`);

            // Update the UI immediately after successful deletion.
            setReviews((previous) =>
                previous.filter((item) => item._id !== review._id)
            );
        } catch (err) {
            setDeleteError(
                err.response?.data?.message ||
                "Failed to delete the review. Please try again."
            );
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <main className="space-y-6 p-4 sm:p-6">
            {/* Page heading */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Reviews & Ratings
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Monitor customer feedback and manage product reviews.
                </p>
            </div>

            {/* Summary cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total Reviews
                    </p>
                    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                        {reviews.length}
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Average Rating
                    </p>
                    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                        {averageRating}{" "}
                        <span className="text-yellow-400">★</span>
                    </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Five-Star Reviews
                    </p>
                    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                        {ratingDistribution.find((item) => item.rating === 5)?.count || 0}
                    </p>
                </div>
            </div>

            {/* Rating distribution */}
            <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
                <h2 className="mb-4 font-semibold text-gray-900 dark:text-white">
                    Rating Distribution
                </h2>

                <div className="space-y-3">
                    {ratingDistribution.map(({ rating, count }) => (
                        <div
                            key={rating}
                            className="flex items-center gap-3 text-sm"
                        >
                            <span className="w-12 text-gray-700 dark:text-gray-300">
                                {rating} ★
                            </span>

                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                <div
                                    className="h-full rounded-full bg-yellow-400"
                                    style={{
                                        width: `${
                                            reviews.length
                                                ? (count / reviews.length) * 100
                                                : 0
                                        }%`,
                                    }}
                                />
                            </div>

                            <span className="w-8 text-right text-gray-500 dark:text-gray-400">
                                {count}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Search and filter */}
            <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search product, customer, or comment..."
                        className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                    />

                    <select
                        value={ratingFilter}
                        onChange={(event) => setRatingFilter(event.target.value)}
                        className="rounded-lg border border-gray-300 px-4 py-3 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                    >
                        <option value="all">All ratings</option>
                        <option value="5">5 stars</option>
                        <option value="4">4 stars</option>
                        <option value="3">3 stars</option>
                        <option value="2">2 stars</option>
                        <option value="1">1 star</option>
                    </select>

                    <button
                        type="button"
                        onClick={fetchReviews}
                        disabled={loading}
                        className="rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium hover:bg-gray-100 disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                        Refresh
                    </button>
                </div>
            </section>

            {/* Error messages */}
            {(error || deleteError) && (
                <div
                    role="alert"
                    className="rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400"
                >
                    {deleteError || error}
                </div>
            )}

            {/* Reviews table */}
            <section className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-700">
                    <h2 className="font-semibold text-gray-900 dark:text-white">
                        Customer Reviews
                    </h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {filteredReviews.length} results
                    </span>
                </div>

                {loading ? (
                    <p className="p-8 text-center text-gray-500 dark:text-gray-400">
                        Loading reviews...
                    </p>
                ) : error ? (
                    <p className="p-8 text-center text-gray-500 dark:text-gray-400">
                        Reviews could not be loaded.
                    </p>
                ) : filteredReviews.length === 0 ? (
                    <p className="p-8 text-center text-gray-500 dark:text-gray-400">
                        No reviews match your search.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[750px] text-left text-sm">
                            <thead className="bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-300">
                                <tr>
                                    <th className="px-5 py-4">Product</th>
                                    <th className="px-5 py-4">Customer</th>
                                    <th className="px-5 py-4">Rating</th>
                                    <th className="px-5 py-4">Comment</th>
                                    <th className="px-5 py-4">Date</th>
                                    <th className="px-5 py-4">Action</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredReviews.map((review) => (
                                    <tr key={review._id}>
                                        <td className="px-5 py-4 font-medium text-gray-900 dark:text-white">
                                            {review.product?.title || "Product unavailable"}
                                        </td>

                                        <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                                            {review.user?.email || "Customer unavailable"}
                                        </td>

                                        <td className="px-5 py-4 whitespace-nowrap">
                                            <span className="text-yellow-400">
                                                {"★".repeat(Number(review.rating) || 0)}
                                            </span>
                                            <span className="ml-1 text-gray-500 dark:text-gray-400">
                                                {review.rating}/5
                                            </span>
                                        </td>

                                        <td className="max-w-xs px-5 py-4 text-gray-600 dark:text-gray-300">
                                            <p className="whitespace-normal break-words">
                                                {review.comment || "No comment"}
                                            </p>
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4 text-gray-600 dark:text-gray-300">
                                            {review.createdAt
                                                ? new Date(review.createdAt).toLocaleDateString()
                                                : "—"}
                                        </td>

                                        <td className="px-5 py-4">
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(review)}
                                                disabled={deletingId === review._id}
                                                className="rounded-lg bg-red-50 px-3 py-2 font-medium text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-900/20 dark:text-red-400"
                                            >
                                                {deletingId === review._id
                                                    ? "Deleting..."
                                                    : "Delete"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </main>
    );
}

export default AdminReviews;

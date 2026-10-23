
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
    <main className="min-h-screen space-y-6 bg-[#f7f9ff] p-4 text-[#263d32] sm:p-6">
        {/* Page heading */}
        <div>
            <h1 className="font-serif text-2xl font-semibold tracking-tight text-[#263d32] sm:text-3xl">
                Reviews & Ratings
            </h1>
            <p className="mt-2 text-sm text-[#77847d]">
                Monitor customer feedback and manage product reviews.
            </p>
        </div>

        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-[#e0e7e3] bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-[#77847d]">
                    Total Reviews
                </p>
                <p className="mt-3 text-3xl font-semibold text-[#263d32]">
                    {reviews.length}
                </p>
                <p className="mt-1 text-xs text-[#77847d]">
                    Customer feedback received
                </p>
            </div>

            <div className="rounded-2xl border border-[#e0e7e3] bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-[#77847d]">
                    Average Rating
                </p>
                <p className="mt-3 flex items-center gap-2 text-3xl font-semibold text-[#263d32]">
                    {averageRating}
                    <span className="text-xl text-[#bd8069]">★</span>
                </p>
                <p className="mt-1 text-xs text-[#77847d]">
                    Average customer satisfaction
                </p>
            </div>

            <div className="rounded-2xl border border-[#e0e7e3] bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-[#77847d]">
                    Five-Star Reviews
                </p>
                <p className="mt-3 text-3xl font-semibold text-[#436558]">
                    {ratingDistribution.find((item) => item.rating === 5)?.count || 0}
                </p>
                <p className="mt-1 text-xs text-[#77847d]">
                    Highest-rated customer reviews
                </p>
            </div>
        </div>

        {/* Rating distribution */}
        <section className="rounded-2xl border border-[#e0e7e3] bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
                <h2 className="font-serif text-lg font-semibold text-[#263d32]">
                    Rating Distribution
                </h2>
                <p className="mt-1 text-sm text-[#77847d]">
                    Breakdown of customer ratings across all reviews.
                </p>
            </div>

            <div className="space-y-4">
                {ratingDistribution.map(({ rating, count }) => (
                    <div
                        key={rating}
                        className="flex items-center gap-3 text-sm"
                    >
                        <span className="w-12 shrink-0 font-medium text-[#46574e]">
                            {rating} ★
                        </span>

                        {/* Rating bar */}
                        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#edf4f0]">
                            <div
                                className="h-full rounded-full bg-[#7a9e8f] transition-all duration-300"
                                style={{
                                    width: `${
                                        reviews.length
                                            ? (count / reviews.length) * 100
                                            : 0
                                    }%`,
                                }}
                            />
                        </div>

                        <span className="w-8 text-right font-medium tabular-nums text-[#77847d]">
                            {count}
                        </span>
                    </div>
                ))}
            </div>
        </section>

        {/* Search and filter */}
        <section className="rounded-2xl border border-[#e0e7e3] bg-white p-5 shadow-sm">
            <div className="mb-4">
                <h2 className="font-serif text-lg font-semibold text-[#263d32]">
                    Find Reviews
                </h2>
                <p className="mt-1 text-sm text-[#77847d]">
                    Search customer feedback or filter by rating.
                </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
                <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search product, customer, or comment..."
                    className="min-w-0 flex-1 rounded-xl border border-[#dce7e2] bg-[#f7f9ff] px-4 py-3 text-sm text-[#263d32] outline-none transition placeholder:text-[#9aa69f] focus:border-[#7a9e8f] focus:ring-2 focus:ring-[#7a9e8f]/20"
                />

                <select
                    value={ratingFilter}
                    onChange={(event) => setRatingFilter(event.target.value)}
                    className="rounded-xl border border-[#dce7e2] bg-[#f7f9ff] px-4 py-3 text-sm text-[#46574e] outline-none focus:border-[#7a9e8f] focus:ring-2 focus:ring-[#7a9e8f]/20"
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
                    className="rounded-xl border border-[#dce7e2] bg-[#edf4f0] px-5 py-3 text-sm font-semibold text-[#436558] transition hover:bg-[#dce7e2] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? "Refreshing..." : "Refresh"}
                </button>
            </div>
        </section>

        {/* Error messages */}
        {(error || deleteError) && (
            <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
                {deleteError || error}
            </div>
        )}

        {/* Reviews table */}
        <section className="overflow-hidden rounded-2xl border border-[#e0e7e3] bg-white shadow-sm">
            <div className="flex flex-col gap-2 border-b border-[#e0e7e3] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div>
                    <h2 className="font-serif text-lg font-semibold text-[#263d32]">
                        Customer Reviews
                    </h2>
                    <p className="mt-1 text-sm text-[#77847d]">
                        Review customer ratings and comments.
                    </p>
                </div>

                <span className="w-fit rounded-full bg-[#edf4f0] px-3 py-1.5 text-xs font-semibold text-[#436558]">
                    {filteredReviews.length} results
                </span>
            </div>

            {loading ? (
                <p className="p-10 text-center text-sm text-[#77847d]">
                    Loading reviews...
                </p>
            ) : error ? (
                <p className="p-10 text-center text-sm text-[#77847d]">
                    Reviews could not be loaded.
                </p>
            ) : filteredReviews.length === 0 ? (
                <p className="p-10 text-center text-sm text-[#77847d]">
                    No reviews match your search.
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[750px] text-left text-sm">
                        <thead className="bg-[#f1f4f9] text-xs uppercase tracking-wide text-[#77847d]">
                            <tr>
                                <th className="px-5 py-4 font-semibold">Product</th>
                                <th className="px-5 py-4 font-semibold">Customer</th>
                                <th className="px-5 py-4 font-semibold">Rating</th>
                                <th className="px-5 py-4 font-semibold">Comment</th>
                                <th className="px-5 py-4 font-semibold">Date</th>
                                <th className="px-5 py-4 font-semibold">Action</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#edf1ee]">
                            {filteredReviews.map((review) => (
                                <tr
                                    key={review._id}
                                    className="transition-colors hover:bg-[#f7f9ff]"
                                >
                                    <td className="px-5 py-4 font-medium text-[#263d32]">
                                        {review.product?.title || "Product unavailable"}
                                    </td>

                                    <td className="px-5 py-4 text-[#46574e]">
                                        {review.user?.email || "Customer unavailable"}
                                    </td>

                                    <td className="whitespace-nowrap px-5 py-4">
                                        <span className="text-[#bd8069]">
                                            {"★".repeat(Number(review.rating) || 0)}
                                        </span>
                                        <span className="ml-1 text-xs text-[#77847d]">
                                            {review.rating}/5
                                        </span>
                                    </td>

                                    <td className="max-w-xs px-5 py-4 text-[#46574e]">
                                        <p className="whitespace-normal break-words leading-6">
                                            {review.comment || "No comment"}
                                        </p>
                                    </td>

                                    <td className="whitespace-nowrap px-5 py-4 text-[#77847d]">
                                        {review.createdAt
                                            ? new Date(review.createdAt).toLocaleDateString()
                                            : "—"}
                                    </td>

                                    <td className="px-5 py-4">
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(review)}
                                            disabled={deletingId === review._id}
                                            className="rounded-lg border border-[#f0d8d0] bg-[#fbf0eb] px-3 py-2 text-xs font-semibold text-[#a65f4c] transition hover:bg-[#f5e2da] disabled:cursor-not-allowed disabled:opacity-50"
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

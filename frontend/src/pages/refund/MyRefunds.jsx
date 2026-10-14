
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getMyRefundsThunk } from "../../features/refund/refundThunk";
import {
    selectMyRefunds,
    selectRefundsLoading,
    selectRefundsError,
} from "../../features/refund/refundSelectors";

// Display readable labels for the backend refund statuses.
const statusLabels = {
    requested: "Requested",
    approved: "Approved",
    rejected: "Rejected",
    processing: "Processing",
    completed: "Completed",
};

// Style each status badge according to its meaning.
const statusStyles = {
    requested: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200",
    approved: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
    processing: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200",
    completed: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
};

function MyRefunds() {
    const dispatch = useDispatch();

    // Read refund history and request state through existing selectors.
    // Read only the logged-in customer's refund history.
const refunds = useSelector(selectMyRefunds);
    const loading = useSelector(selectRefundsLoading);
    const error = useSelector(selectRefundsError);

    // Fetch refund history when the page first opens.
    useEffect(() => {
        dispatch(getMyRefundsThunk());
    }, [dispatch]);

    // Refresh the list when the customer clicks the button.
    const handleRefresh = () => {
        dispatch(getMyRefundsThunk());
    };

    // Format amounts as Indian Rupees.
    const formatAmount = (amount) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount ?? 0);

    // Format request dates for the customer's local timezone.
    const formatDate = (date) => {
        if (!date) return "Date unavailable";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <section className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900 dark:bg-gray-950 dark:text-gray-100 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold sm:text-3xl">
                            My Refunds
                        </h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            View your refund requests and their latest status.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={loading}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:hover:bg-gray-800"
                    >
                        {loading ? "Refreshing..." : "Refresh"}
                    </button>
                </div>

                {error && (
                    <div
                        role="alert"
                        className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                    >
                        {error}
                    </div>
                )}

                {loading && refunds.length === 0 ? (
                    <div className="rounded-xl bg-white p-8 text-center shadow-sm dark:bg-gray-900">
                        Loading your refunds...
                    </div>
                ) : refunds.length === 0 ? (
                    <div className="rounded-xl bg-white p-8 text-center shadow-sm dark:bg-gray-900">
                        <h2 className="text-lg font-semibold">
                            No refund requests yet
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Your refund requests will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {refunds.map((refund) => (
                            <article
                                key={refund._id}
                                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Order ID
                                        </p>
                                        <p className="mt-1 break-all font-medium">
                                            {refund.order?._id || "Unavailable"}
                                        </p>
                                    </div>

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[refund.status] ||
                                            "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                            }`}
                                    >
                                        {statusLabels[refund.status] ||
                                            refund.status}
                                    </span>
                                </div>

                                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Refund amount
                                        </p>
                                        <p className="mt-1 text-lg font-bold">
                                            {formatAmount(refund.amount)}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Request date
                                        </p>
                                        <p className="mt-1 font-medium">
                                            {formatDate(refund.requestedAt)}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Refund type
                                        </p>
                                        <p className="mt-1 font-medium">
                                            {refund.refundType === "order_cancelled"
                                                ? "Order cancellation"
                                                : "Customer request"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Payment status
                                        </p>
                                        <p className="mt-1 font-medium capitalize">
                                            {refund.payment?.status || "Unavailable"}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 border-t border-gray-200 pt-4 dark:border-gray-800">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Reason
                                    </p>
                                    <p className="mt-1 break-words">
                                        {refund.reason || "No reason provided"}
                                    </p>

                                    {refund.adminNote && (
                                        <div className="mt-4">
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Admin note
                                            </p>
                                            <p className="mt-1 break-words">
                                                {refund.adminNote}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default MyRefunds;

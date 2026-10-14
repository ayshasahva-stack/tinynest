
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    getAllRefundsThunk,
    updateRefundStatusThunk,
    processRefundThunk,
    completeRefundThunk,
} from "../../features/refund/refundThunk";

import {
    selectAllRefunds,
    selectRefundsLoading,
    selectRefundsError,
    selectRefundActionLoading,
    selectRefundActionError,
    selectRefundSuccessMessage,
} from "../../features/refund/refundSelectors";

// Readable labels for each refund status.
const statusLabels = {
    requested: "Requested",
    approved: "Approved",
    rejected: "Rejected",
    processing: "Processing",
    completed: "Completed",
};

// Badge styles for refund statuses.
const statusStyles = {
    requested:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200",
    approved:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
    rejected:
        "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
    processing:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200",
    completed:
        "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
};

function AdminRefunds() {
    const dispatch = useDispatch();

    // Read refund data and request states using existing selectors.
    const refunds = useSelector(selectAllRefunds);
    const loading = useSelector(selectRefundsLoading);
    const error = useSelector(selectRefundsError);
    const actionLoading = useSelector(selectRefundActionLoading);
    const actionError = useSelector(selectRefundActionError);
    const successMessage = useSelector(selectRefundSuccessMessage);

    // Store optional admin notes separately for each refund.
    const [adminNotes, setAdminNotes] = useState({});

    // Load all refund requests when the admin page opens.
    useEffect(() => {
        dispatch(getAllRefundsThunk());
    }, [dispatch]);

    // Format refund amounts as Indian Rupees.
    const formatAmount = (amount) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount ?? 0);

    // Format dates in the browser's local timezone.
    const formatDate = (date) => {
        if (!date) return "Unavailable";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // Approve or reject a requested refund.
    const handleDecision = async (refundId, status) => {
        try {
            await dispatch(
                updateRefundStatusThunk({
                    refundId,
                    status,
                    adminNote: adminNotes[refundId] || "",
                })
            ).unwrap();
        } catch {
            // The Redux slice stores the API error for display.
        }
    };

    // Move an approved refund to processing.
    const handleProcess = async (refundId) => {
        try {
            await dispatch(processRefundThunk(refundId)).unwrap();
        } catch {
            // The Redux slice stores the API error for display.
        }
    };

    // Mark a processing refund as completed.
   
  // Check/process the refund, then reload the latest refund details.
  const handleComplete = async (refundId) => {
    const confirmed = window.confirm(
      "Check the Razorpay refund status? Only mark it completed after Razorpay confirms completion."
    );

    if (!confirmed) return;

    try {
      await dispatch(completeRefundThunk(refundId)).unwrap();

      // Reload populated order, customer, and payment details.
      await dispatch(getAllRefundsThunk()).unwrap();
    } catch {
      // Redux stores the error for display.
    }
  };


    return (
        <section className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900 dark:bg-gray-950 dark:text-gray-100 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold sm:text-3xl">
                            Refund Management
                        </h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Review customer refund requests and manage their status.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => dispatch(getAllRefundsThunk())}
                        disabled={loading}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100 disabled:opacity-60 dark:border-gray-700 dark:hover:bg-gray-800"
                    >
                        {loading ? "Refreshing..." : "Refresh"}
                    </button>
                </div>

                {error && (
                    <div
                        role="alert"
                        className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
                    >
                        {error}
                    </div>
                )}

                {actionError && (
                    <div
                        role="alert"
                        className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
                    >
                        {actionError}
                    </div>
                )}

                {successMessage && (
                    <div
                        role="status"
                        className="mb-4 rounded-lg bg-green-50 p-4 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-300"
                    >
                        {successMessage}
                    </div>
                )}

                {loading && refunds.length === 0 ? (
                    <div className="rounded-xl bg-white p-8 text-center shadow-sm dark:bg-gray-900">
                        Loading refund requests...
                    </div>
                ) : refunds.length === 0 ? (
                    <div className="rounded-xl bg-white p-8 text-center shadow-sm dark:bg-gray-900">
                        <h2 className="text-lg font-semibold">
                            No refund requests found
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Customer refund requests will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {refunds.map((refund) => (
                            <article
                                key={refund._id}
                                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <h2 className="text-lg font-semibold">
                                            Refund {refund._id}
                                        </h2>
                                        <p className="mt-1 break-all text-sm text-gray-500 dark:text-gray-400">
                                            Order ID: {refund.order?._id || "Unavailable"}
                                        </p>
                                    </div>

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                            statusStyles[refund.status] ||
                                            "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                        }`}
                                    >
                                        {statusLabels[refund.status] || refund.status}
                                    </span>
                                </div>

                                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Customer email
                                        </p>
                                        <p className="mt-1 break-words font-medium">
                                            {refund.user?.email || "Unavailable"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Refund amount
                                        </p>
                                        <p className="mt-1 font-bold">
                                            {formatAmount(refund.amount)}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Requested on
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

                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Payment method
                                        </p>
                                        <p className="mt-1 font-medium capitalize">
                                            {refund.payment?.paymentMethod || "Unavailable"}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 border-t border-gray-200 pt-4 dark:border-gray-800">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Customer reason
                                    </p>
                                    <p className="mt-1 break-words">
                                        {refund.reason || "No reason provided"}
                                    </p>

                                    {refund.adminNote && (
                                        <div className="mt-4">
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Existing admin note
                                            </p>
                                            <p className="mt-1 break-words">
                                                {refund.adminNote}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {refund.status === "requested" && (
                                    <div className="mt-5 border-t border-gray-200 pt-4 dark:border-gray-800">
                                        <label
                                            htmlFor={`admin-note-${refund._id}`}
                                            className="mb-2 block text-sm font-medium"
                                        >
                                            Admin note (optional)
                                        </label>

                                        <textarea
                                            id={`admin-note-${refund._id}`}
                                            rows={2}
                                            value={adminNotes[refund._id] || ""}
                                            onChange={(event) =>
                                                setAdminNotes((previous) => ({
                                                    ...previous,
                                                    [refund._id]: event.target.value,
                                                }))
                                            }
                                            placeholder="Add a note for this refund..."
                                            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-950"
                                        />

                                        <div className="mt-3 flex flex-wrap gap-3">
                                            <button
                                                type="button"
                                                disabled={actionLoading}
                                                onClick={() =>
                                                    handleDecision(refund._id, "approved")
                                                }
                                                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
                                            >
                                                Approve
                                            </button>

                                            <button
                                                type="button"
                                                disabled={actionLoading}
                                                onClick={() =>
                                                    handleDecision(refund._id, "rejected")
                                                }
                                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {refund.status === "approved" && (
                                    <div className="mt-5 border-t border-gray-200 pt-4 dark:border-gray-800">
                                        <button
                                            type="button"
                                            disabled={actionLoading}
                                            onClick={() => handleProcess(refund._id)}
                                            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-60"
                                        >
                                            Move to Processing
                                        </button>
                                    </div>
                                )}

                                {refund.status === "processing" && (
                                    <div className="mt-5 border-t border-gray-200 pt-4 dark:border-gray-800">
                                        <button
                                            type="button"
                                            disabled={actionLoading}
                                            onClick={() => handleComplete(refund._id)}
                                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                                        >
                                            Mark as Completed
                                        </button>
                                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                            Verify the actual payment-provider refund before completing this record.
                                        </p>
                                    </div>
                                )}
                            </article>
                        ))}
                    </div>
                )}

                {actionLoading && (
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                        Updating refund...
                    </p>
                )}
            </div>
        </section>
    );
}

export default AdminRefunds;

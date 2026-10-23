
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
    <section className="min-h-screen bg-[#f7f9ff] px-4 py-6 text-[#263d32] dark:bg-slate-950 dark:text-gray-100 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
            {/* Page heading and refresh action */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="font-serif text-3xl font-semibold text-[#263d32] dark:text-white">
                        Refund Management
                    </h1>

                    <p className="mt-2 text-sm text-[#77847d] dark:text-gray-400">
                        Review customer refund requests and manage their status.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => dispatch(getAllRefundsThunk())}
                    disabled={loading}
                    className="rounded-lg border border-[#d6e0da] bg-white px-4 py-2.5 text-sm font-medium text-[#436558] transition hover:bg-[#edf4f0] disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-[#b7d0c3] dark:hover:bg-gray-700"
                >
                    {loading ? "Refreshing..." : "Refresh"}
                </button>
            </div>

            {/* API error messages */}
            {error && (
                <div
                    role="alert"
                    className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                >
                    {error}
                </div>
            )}

            {actionError && (
                <div
                    role="alert"
                    className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                >
                    {actionError}
                </div>
            )}

            {/* Success feedback */}
            {successMessage && (
                <div
                    role="status"
                    className="mb-4 rounded-xl border border-[#cbdcd3] bg-[#edf4f0] p-4 text-sm text-[#436558] dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
                >
                    {successMessage}
                </div>
            )}

            {/* Loading and empty states */}
            {loading && refunds.length === 0 ? (
                <div className="rounded-2xl border border-[#e0e7e3] bg-white p-10 text-center text-[#77847d] shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                    Loading refund requests...
                </div>
            ) : refunds.length === 0 ? (
                <div className="rounded-2xl border border-[#e0e7e3] bg-white p-10 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <h2 className="font-serif text-xl font-semibold text-[#263d32] dark:text-white">
                        No refund requests found
                    </h2>

                    <p className="mt-2 text-sm text-[#77847d] dark:text-gray-400">
                        Customer refund requests will appear here.
                    </p>
                </div>
            ) : (
                <div className="space-y-5">
                    {refunds.map((refund) => (
                        <article
                            key={refund._id}
                            className="rounded-2xl border border-[#e0e7e3] bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800 sm:p-6"
                        >
                            {/* Refund ID and status */}
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <h2 className="break-all font-serif text-lg font-semibold text-[#263d32] dark:text-white">
                                        Refund {refund._id}
                                    </h2>

                                    <p className="mt-1 break-all text-sm text-[#77847d] dark:text-gray-400">
                                        Order ID: {refund.order?._id || "Unavailable"}
                                    </p>
                                </div>

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                        statusStyles[refund.status] ||
                                        "bg-[#f1f4f9] text-[#65756c] dark:bg-gray-700 dark:text-gray-200"
                                    }`}
                                >
                                    {statusLabels[refund.status] || refund.status}
                                </span>
                            </div>

                            {/* Refund information */}
                            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                <div className="rounded-xl bg-[#f7f9f8] p-4 dark:bg-gray-700/50">
                                    <p className="text-sm text-[#77847d] dark:text-gray-400">
                                        Customer email
                                    </p>

                                    <p className="mt-1 break-words font-medium text-[#263d32] dark:text-white">
                                        {refund.user?.email || "Unavailable"}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-[#f7f9f8] p-4 dark:bg-gray-700/50">
                                    <p className="text-sm text-[#77847d] dark:text-gray-400">
                                        Refund amount
                                    </p>

                                    <p className="mt-1 text-lg font-bold text-[#436558] dark:text-[#b7d0c3]">
                                        {formatAmount(refund.amount)}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-[#f7f9f8] p-4 dark:bg-gray-700/50">
                                    <p className="text-sm text-[#77847d] dark:text-gray-400">
                                        Requested on
                                    </p>

                                    <p className="mt-1 font-medium text-[#263d32] dark:text-white">
                                        {formatDate(refund.requestedAt)}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-[#f7f9f8] p-4 dark:bg-gray-700/50">
                                    <p className="text-sm text-[#77847d] dark:text-gray-400">
                                        Refund type
                                    </p>

                                    <p className="mt-1 font-medium text-[#263d32] dark:text-white">
                                        {refund.refundType === "order_cancelled"
                                            ? "Order cancellation"
                                            : "Customer request"}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-[#f7f9f8] p-4 dark:bg-gray-700/50">
                                    <p className="text-sm text-[#77847d] dark:text-gray-400">
                                        Payment status
                                    </p>

                                    <p className="mt-1 font-medium capitalize text-[#263d32] dark:text-white">
                                        {refund.payment?.status || "Unavailable"}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-[#f7f9f8] p-4 dark:bg-gray-700/50">
                                    <p className="text-sm text-[#77847d] dark:text-gray-400">
                                        Payment method
                                    </p>

                                    <p className="mt-1 font-medium capitalize text-[#263d32] dark:text-white">
                                        {refund.payment?.paymentMethod || "Unavailable"}
                                    </p>
                                </div>
                            </div>

                            {/* Customer reason and admin note */}
                            <div className="mt-6 border-t border-[#e0e7e3] pt-5 dark:border-gray-700">
                                <p className="text-sm font-medium text-[#77847d] dark:text-gray-400">
                                    Customer reason
                                </p>

                                <p className="mt-2 break-words text-sm leading-6 text-[#46574e] dark:text-gray-200">
                                    {refund.reason || "No reason provided"}
                                </p>

                                {refund.adminNote && (
                                    <div className="mt-4 rounded-xl border border-[#e0e7e3] bg-[#f7f9f8] p-4 dark:border-gray-700 dark:bg-gray-700/50">
                                        <p className="text-sm font-medium text-[#77847d] dark:text-gray-400">
                                            Existing admin note
                                        </p>

                                        <p className="mt-2 break-words text-sm text-[#46574e] dark:text-gray-200">
                                            {refund.adminNote}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Approve or reject a requested refund */}
                            {refund.status === "requested" && (
                                <div className="mt-6 border-t border-[#e0e7e3] pt-5 dark:border-gray-700">
                                    <label
                                        htmlFor={`admin-note-${refund._id}`}
                                        className="mb-2 block text-sm font-semibold text-[#46574e] dark:text-gray-200"
                                    >
                                        Admin note (optional)
                                    </label>

                                    <textarea
                                        id={`admin-note-${refund._id}`}
                                        rows={3}
                                        value={adminNotes[refund._id] || ""}
                                        onChange={(event) =>
                                            setAdminNotes((previous) => ({
                                                ...previous,
                                                [refund._id]: event.target.value,
                                            }))
                                        }
                                        placeholder="Add a note for this refund..."
                                        className="w-full rounded-xl border border-[#d6e0da] bg-white p-3 text-sm text-[#263d32] outline-none transition placeholder:text-[#9aa69f] focus:border-[#7a9e8f] focus:ring-2 focus:ring-[#dce7e2] dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                                    />

                                    <div className="mt-4 flex flex-wrap gap-3">
                                        <button
                                            type="button"
                                            disabled={actionLoading}
                                            onClick={() =>
                                                handleDecision(refund._id, "approved")
                                            }
                                            className="rounded-lg bg-[#436558] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#354f44] disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            Approve
                                        </button>

                                        <button
                                            type="button"
                                            disabled={actionLoading}
                                            onClick={() =>
                                                handleDecision(refund._id, "rejected")
                                            }
                                            className="rounded-lg border border-[#ead2c9] bg-[#fbf0eb] px-5 py-2.5 text-sm font-medium text-[#a85f4a] transition hover:bg-[#f5e3dc] disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/70"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Move approved refunds to processing */}
                            {refund.status === "approved" && (
                                <div className="mt-6 border-t border-[#e0e7e3] pt-5 dark:border-gray-700">
                                    <button
                                        type="button"
                                        disabled={actionLoading}
                                        onClick={() => handleProcess(refund._id)}
                                        className="rounded-lg bg-[#436558] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#354f44] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        Move to Processing
                                    </button>
                                </div>
                            )}

                            {/* Complete processing after verifying the refund */}
                            {refund.status === "processing" && (
                                <div className="mt-6 border-t border-[#e0e7e3] pt-5 dark:border-gray-700">
                                    <button
                                        type="button"
                                        disabled={actionLoading}
                                        onClick={() => handleComplete(refund._id)}
                                        className="rounded-lg bg-[#436558] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#354f44] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        Mark as Completed
                                    </button>

                                    <p className="mt-3 rounded-lg bg-[#fbf0eb] p-3 text-xs leading-5 text-[#a85f4a] dark:bg-amber-950/30 dark:text-amber-200">
                                        Verify the actual payment-provider refund before completing this record.
                                    </p>
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            )}

            {/* Action loading indicator */}
            {actionLoading && (
                <p className="mt-4 text-sm text-[#77847d] dark:text-gray-400">
                    Updating refund...
                </p>
            )}
        </div>
    </section>
);

}

export default AdminRefunds;


import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";

import { getMyRefundsThunk } from "../../features/refund/refundThunk";
import {
    selectMyRefunds,
    selectRefundsLoading,
    selectRefundsError,
} from "../../features/refund/refundSelectors";
import { selectAuthUser } from "../../features/auth/authSelectors";

// Use the same TinyNest sage-green color for the refund status indicators,
// while keeping rejected requests visually distinct.
const refundStatusStyles = {
    requested:
        "bg-[#f8edcf] text-[#80621f] dark:bg-amber-950 dark:text-amber-200",
    approved:
        "bg-[#dce7e2] text-[#436558] dark:bg-emerald-950 dark:text-emerald-300",
    rejected:
        "bg-[#ffdad6] text-[#93000a] dark:bg-red-950 dark:text-red-300",
    processing:
        "bg-[#e9e4f5] text-[#65528b] dark:bg-purple-950 dark:text-purple-300",
    completed:
        "bg-[#dcece4] text-[#315e4d] dark:bg-emerald-950 dark:text-emerald-300",
};

const refundStatusLabels = {
    requested: "Requested",
    approved: "Approved",
    rejected: "Rejected",
    processing: "Processing",
    completed: "Completed",
};

// Small reusable line icons.
function Icon({ type, className = "h-5 w-5" }) {
    const paths = {
        overview: (
            <>
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
            </>
        ),
        orders: (
            <>
                <path d="m12 3 9 5-9 5-9-5 9-5Z" />
                <path d="m3 12 9 5 9-5" />
                <path d="m3 16 9 5 9-5" />
            </>
        ),
        addresses: (
            <>
                <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
            </>
        ),
        wishlist: (
            <path d="M20.8 8.6c0 5.4-8.8 11-8.8 11S3.2 14 3.2 8.6A4.6 4.6 0 0 1 12 6.2a4.6 4.6 0 0 1 8.8 2.4Z" />
        ),
        coupons: (
            <>
                <path d="M3 8a2 2 0 0 0 0 4v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 1 0-4V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2Z" />
                <path d="m9 14 6-6" />
                <circle cx="9" cy="8" r=".7" />
                <circle cx="15" cy="14" r=".7" />
            </>
        ),
        refunds: (
            <>
                <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                <path d="M3 3v5h5" />
                <path d="M12 7v10" />
                <path d="M15 9.5c0-1.2-1.3-2-3-2s-3 .8-3 2 1.3 2 3 2 3 .8 3 2-1.3 2-3 2-3-.8-3-2" />
            </>
        ),
    };

    return (
        <svg
            viewBox="0 0 24 24"
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {paths[type]}
        </svg>
    );
}

// Shared account sidebar, matching the other TinyNest customer pages.
function AccountSidebar({ user }) {
    const links = [
        { to: "/profile", label: "Overview", icon: "overview" },
        { to: "/orders", label: "My Orders", icon: "orders" },
        { to: "/addresses", label: "Saved Addresses", icon: "addresses" },
        { to: "/wishlist", label: "Saved Wishlist", icon: "wishlist" },
        { to: "/coupons", label: "My Coupons", icon: "coupons" },
        { to: "/refunds", label: "My Refunds", icon: "refunds" },
    ];

    return (
        <aside className="space-y-5 lg:sticky lg:top-24">
            {/* Customer identity card */}
            <div className="flex items-center gap-3 rounded-2xl bg-white p-5 shadow-sm dark:bg-gray-900">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#dcece4] text-[#436558]">
                    <svg
                        viewBox="0 0 24 24"
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        aria-hidden="true"
                    >
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 21a8 8 0 0 1 16 0" />
                    </svg>
                </div>

                <div className="min-w-0">
                    <p className="text-xs text-[#717974] dark:text-gray-400">
                        Welcome back,
                    </p>
                    <p className="mt-1 truncate font-semibold text-[#181c20] dark:text-white">
                        {user?.fullName || "TinyNest Customer"}
                    </p>
                    <p className="mt-1 text-xs text-[#436558]">
                        Little things, lots of love
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <nav
                aria-label="Account navigation"
                className="rounded-2xl bg-white p-2.5 shadow-sm dark:bg-gray-900"
            >
                {links.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end
                        className={({ isActive }) =>
                            `mb-1 flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm transition last:mb-0 ${
                                isActive
                                    ? "bg-[#dce7e2] font-semibold text-[#436558] dark:bg-emerald-950 dark:text-emerald-300"
                                    : "text-[#414845] hover:bg-[#f1f4f9] dark:text-gray-200 dark:hover:bg-gray-800"
                            }`
                        }
                    >
                        <Icon type={item.icon} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Concierge card */}
            <div className="rounded-2xl bg-[#f8eeec] p-5 dark:bg-[#382925]">
                <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#8a604c] dark:text-[#e0b8a7]">
                    TinyNest Concierge
                </p>
                <h3 className="mt-2 font-serif text-xl leading-7 text-[#30231e] dark:text-white">
                    Here for your little one's journey.
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#76635b] dark:text-gray-300">
                    Thoughtful essentials and support for every little
                    milestone.
                </p>
                <Link
                    to="/products"
                    className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#8a604c] shadow-sm transition hover:bg-[#fffaf8] dark:bg-gray-900 dark:text-[#e0b8a7]"
                >
                    Explore essentials
                </Link>
            </div>
        </aside>
    );
}

// Main customer refund history page.
function MyRefunds() {
    const dispatch = useDispatch();

    // Keep using the existing Redux selectors and thunk.
    const user = useSelector(selectAuthUser);
    const refunds = useSelector(selectMyRefunds);
    const loading = useSelector(selectRefundsLoading);
    const error = useSelector(selectRefundsError);

    // Fetch the customer's refund history when the page opens.
    useEffect(() => {
        dispatch(getMyRefundsThunk());
    }, [dispatch]);

    // Refresh the existing refund history from the backend.
    const handleRefresh = () => {
        dispatch(getMyRefundsThunk());
    };

    // Format amounts as Indian Rupees.
    const formatAmount = (amount) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        }).format(Number(amount) || 0);

    // Format request dates safely.
    const formatDate = (date) => {
        if (!date) return "Date unavailable";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Date unavailable";
        }

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // Avoid showing a populated order object as [object Object].
    const getOrderId = (order) => {
        if (!order) return "Unavailable";

        const id = typeof order === "object" ? order._id : order;

        return id ? String(id) : "Unavailable";
    };

    const unreadOrPendingCount = refunds.filter(
        (refund) =>
            refund.status === "requested" ||
            refund.status === "approved" ||
            refund.status === "processing"
    ).length;

    return (
        <main className="min-h-screen bg-[#f7f9ff] px-4 py-7 text-[#181c20] dark:bg-gray-950 dark:text-gray-100 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-[1400px]">
                {/* Page header */}
                <header className="mb-7 rounded-2xl bg-gradient-to-r from-white via-[#f1f4f9] to-[#e5f4ed] p-6 dark:from-gray-900 dark:via-gray-900 dark:to-emerald-950/30 sm:p-8">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#436558] dark:text-emerald-300">
                        Your TinyNest account
                    </p>

                    <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
                        <h1 className="font-serif text-4xl font-normal tracking-tight text-[#181c20] dark:text-white sm:text-5xl">
                            My Refunds
                        </h1>

                        <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-[#436558] dark:bg-gray-900 dark:text-emerald-300">
                            <Icon type="refunds" className="h-4 w-4" />
                            {refunds.length}{" "}
                            {refunds.length === 1 ? "request" : "requests"}
                        </span>
                    </div>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[#626c68] dark:text-gray-300">
                        Track your refund requests and follow their progress,
                        from submission to completion.
                    </p>
                </header>

                {/* Sidebar and refund content */}
                <div className="grid items-start gap-6 lg:grid-cols-[290px_minmax(0,1fr)]">
                    <AccountSidebar user={user} />

                    <section className="min-w-0 rounded-2xl bg-white p-5 shadow-sm dark:bg-gray-900 sm:p-7 lg:p-8">
                        {/* Section heading */}
                        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#edf0f5] pb-5 dark:border-gray-800">
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#436558] dark:text-emerald-300">
                                    Refund centre
                                </p>
                                <h2 className="mt-2 font-serif text-2xl text-[#181c20] dark:text-white sm:text-3xl">
                                    Refund History
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-[#626c68] dark:text-gray-400">
                                    Review your requests and their latest
                                    status.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleRefresh}
                                disabled={loading}
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#dfe4e1] px-4 py-2.5 text-sm font-semibold text-[#436558] transition hover:bg-[#e5f4ed] disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:text-emerald-300 dark:hover:bg-emerald-950"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <path d="M20 7v5h-5" />
                                    <path d="M4 17v-5h5" />
                                    <path d="M5.6 9A7 7 0 0 1 18 6l2 6" />
                                    <path d="M18.4 15A7 7 0 0 1 6 18l-2-6" />
                                </svg>
                                {loading ? "Refreshing..." : "Refresh"}
                            </button>
                        </div>

                        {/* Pending summary */}
                        {!loading && refunds.length > 0 && (
                            <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#dce7e2] bg-[#f3f8f5] p-4 dark:border-gray-800 dark:bg-emerald-950/20">
                                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dce7e2] text-[#436558] dark:bg-emerald-950 dark:text-emerald-300">
                                    <Icon type="refunds" />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-[#315e4d] dark:text-emerald-300">
                                        {unreadOrPendingCount > 0
                                            ? `${unreadOrPendingCount} refund ${
                                                  unreadOrPendingCount === 1
                                                      ? "request needs"
                                                      : "requests need"
                                              } follow-up`
                                            : "Your refund requests are up to date"}
                                    </p>
                                    <p className="mt-1 text-sm leading-5 text-[#626c68] dark:text-gray-400">
                                        {unreadOrPendingCount > 0
                                            ? "Requests that are being reviewed or processed will show their latest status below."
                                            : "Check the details below to review your refund history."}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Fetch error */}
                        {error && (
                            <div
                                role="alert"
                                className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                            >
                                {error}
                            </div>
                        )}

                        {/* Loading state */}
                        {loading && refunds.length === 0 ? (
                            <div className="flex min-h-64 flex-col items-center justify-center rounded-xl bg-[#f7f9ff] dark:bg-gray-800">
                                <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#dce7e2] border-t-[#436558]" />
                                <p className="mt-4 text-sm text-[#626c68] dark:text-gray-400">
                                    Loading your refund history...
                                </p>
                            </div>
                        ) : refunds.length === 0 ? (
                            /* Empty state */
                            <div className="flex min-h-72 flex-col items-center justify-center rounded-xl bg-[#f7f9ff] px-5 py-10 text-center dark:bg-gray-800">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#dce7e2] text-[#436558] dark:bg-emerald-950 dark:text-emerald-300">
                                    <Icon
                                        type="refunds"
                                        className="h-8 w-8"
                                    />
                                </div>

                                <h3 className="mt-5 font-serif text-2xl text-[#181c20] dark:text-white">
                                    No refund requests yet
                                </h3>

                                <p className="mt-2 max-w-sm text-sm leading-6 text-[#626c68] dark:text-gray-400">
                                    When you submit a refund request, you can
                                    track its status and details here.
                                </p>

                                <Link
                                    to="/orders"
                                    className="mt-5 inline-flex items-center justify-center rounded-lg bg-[#436558] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#315447]"
                                >
                                    View My Orders
                                </Link>
                            </div>
                        ) : (
                            /* Refund cards */
                            <div className="space-y-5">
                                {refunds.map((refund) => {
                                    const status =
                                        String(refund.status || "")
                                            .toLowerCase();

                                    const statusStyle =
                                        refundStatusStyles[status] ||
                                        "bg-[#f1f4f9] text-[#414845] dark:bg-gray-800 dark:text-gray-200";

                                    const statusLabel =
                                        refundStatusLabels[status] ||
                                        refund.status ||
                                        "Unknown";

                                    const orderId = getOrderId(refund.order);

                                    return (
                                        <article
                                            key={refund._id}
                                            className="overflow-hidden rounded-2xl border border-[#e7ebe8] bg-white transition hover:border-[#cbdad2] dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
                                        >
                                            {/* Card top */}
                                            <div className="flex flex-wrap items-start justify-between gap-4 bg-[#fbfcfb] p-5 dark:bg-gray-900 sm:p-6">
                                                <div className="flex min-w-0 items-start gap-3">
                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e5f0ea] text-[#436558] dark:bg-emerald-950 dark:text-emerald-300">
                                                        <Icon
                                                            type="refunds"
                                                            className="h-5 w-5"
                                                        />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="text-xs font-medium uppercase tracking-[0.1em] text-[#717974] dark:text-gray-400">
                                                            Order reference
                                                        </p>
                                                        <p className="mt-1 break-all text-sm font-semibold text-[#181c20] dark:text-white">
                                                            {orderId}
                                                        </p>
                                                        <p className="mt-2 text-xs text-[#717974] dark:text-gray-400">
                                                            Requested on{" "}
                                                            {formatDate(
                                                                refund.requestedAt
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                <span
                                                    className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyle}`}
                                                >
                                                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                                    {statusLabel}
                                                </span>
                                            </div>

                                            {/* Refund details */}
                                            <div className="grid gap-4 border-t border-[#edf0f5] p-5 dark:border-gray-800 sm:grid-cols-2 sm:p-6">
                                                <div className="rounded-xl bg-[#f7f9ff] p-4 dark:bg-gray-800">
                                                    <p className="text-xs font-medium text-[#717974] dark:text-gray-400">
                                                        Refund amount
                                                    </p>
                                                    <p className="mt-2 text-2xl font-semibold tracking-tight text-[#315e4d] dark:text-emerald-300">
                                                        {formatAmount(
                                                            refund.amount
                                                        )}
                                                    </p>
                                                </div>

                                                <div className="rounded-xl bg-[#f7f9ff] p-4 dark:bg-gray-800">
                                                    <p className="text-xs font-medium text-[#717974] dark:text-gray-400">
                                                        Refund type
                                                    </p>
                                                    <p className="mt-2 font-semibold text-[#181c20] dark:text-white">
                                                        {refund.refundType ===
                                                        "order_cancelled"
                                                            ? "Order cancellation"
                                                            : "Customer request"}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs font-medium text-[#717974] dark:text-gray-400">
                                                        Payment status
                                                    </p>
                                                    <p className="mt-2 text-sm font-semibold capitalize text-[#414845] dark:text-gray-200">
                                                        {refund.payment
                                                            ?.status ||
                                                            "Unavailable"}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs font-medium text-[#717974] dark:text-gray-400">
                                                        Refund request ID
                                                    </p>
                                                    <p className="mt-2 break-all text-sm font-medium text-[#414845] dark:text-gray-200">
                                                        {refund._id ||
                                                            "Unavailable"}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Customer reason and admin note */}
                                            <div className="border-t border-[#edf0f5] p-5 dark:border-gray-800 sm:p-6">
                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#717974] dark:text-gray-400">
                                                        Your reason
                                                    </p>
                                                    <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-[#414845] dark:text-gray-200">
                                                        {refund.reason ||
                                                            "No reason provided"}
                                                    </p>
                                                </div>

                                                {refund.adminNote && (
                                                    <div className="mt-5 rounded-xl border border-[#dce7e2] bg-[#f3f8f5] p-4 dark:border-gray-800 dark:bg-emerald-950/20">
                                                        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#436558] dark:text-emerald-300">
                                                            Update from TinyNest
                                                        </p>
                                                        <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-[#414845] dark:text-gray-200">
                                                            {refund.adminNote}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Card footer */}
                                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#edf0f5] bg-[#fbfcfb] px-5 py-4 dark:border-gray-800 dark:bg-gray-900 sm:px-6">
                                                <p className="text-xs leading-5 text-[#717974] dark:text-gray-400">
                                                    {status === "completed"
                                                        ? "This refund has been marked as completed."
                                                        : status === "rejected"
                                                          ? "Please review the update from TinyNest above, if available."
                                                          : status === "processing"
                                                            ? "Your refund is being processed."
                                                            : status === "approved"
                                                              ? "Your refund request has been approved."
                                                              : "Your refund request is awaiting review."}
                                                </p>

                                                <Link
                                                    to="/orders"
                                                    className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[#436558] transition hover:underline dark:text-emerald-300"
                                                >
                                                    View orders
                                                    <span aria-hidden="true">
                                                        →
                                                    </span>
                                                </Link>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
}

export default MyRefunds;

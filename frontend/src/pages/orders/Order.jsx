
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getMyOrdersThunk } from "../../features/orders/orderThunk";
import {
    selectOrders,
    selectOrdersLoading,
    selectOrdersError,
} from "../../features/orders/orderSelectors";
import { selectAuthUser } from "../../features/auth/authSelectors";
import AccountSidebar from "../../components/AccounSidebar";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import ErrorMessage from "../../components/ErrorMessage";

// Statuses included in the "In Progress" filter.
const IN_PROGRESS_STATUSES = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
];

// Tailwind classes for each order status.
const statusStyles = {
    pending: "bg-[#f1f4f9] text-[#414845]",
    confirmed: "bg-[#e5f4ed] text-[#315e4d]",
    processing: "bg-[#e5f4ed] text-[#315e4d]",
    shipped: "bg-[#e5f4ed] text-[#315e4d]",
    delivered: "bg-[#e5f4ed] text-[#315e4d]",
    cancelled: "bg-[#ffebe7] text-[#8b4d40]",
};

// Format amounts using Indian currency formatting.
function formatCurrency(value) {
    return `₹${Number(value ?? 0).toLocaleString("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })}`;
}

// Format order dates for display.
function formatDate(value) {
    if (!value) return "Date unavailable";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Date unavailable";
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

// Use the order number when available, otherwise fall back to the ID.
function orderNumber(order) {
    return order.orderNumber || order.orderId || order._id || "—";
}

// Small inline SVG icons used in the order cards.
function InlineIcon({ name, className = "h-5 w-5" }) {
    const common = {
        className,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.7,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": true,
    };

    const paths = {
        truck: (
            <>
                <path d="M3 6h11v11H3z" />
                <path d="M14 10h4l3 3v4h-7z" />
                <circle cx="7" cy="18" r="1.7" />
                <circle cx="18" cy="18" r="1.7" />
            </>
        ),
        search: (
            <>
                <circle cx="10.8" cy="10.8" r="6.8" />
                <path d="m16 16 4.2 4.2" />
            </>
        ),
        pin: (
            <>
                <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
                <circle cx="12" cy="10" r="2" />
            </>
        ),
    };

    return <svg {...common}>{paths[name]}</svg>;
}

// Friendly message based on the order's current status.
function getStatusMessage(status) {
    switch (status) {
        case "shipped":
            return {
                title: "Your order is on the way",
                description:
                    "Your order has been shipped. Open order details to see the latest tracking information.",
            };

        case "delivered":
            return {
                title: "Delivered successfully",
                description: "This order has been marked as delivered.",
            };

        case "cancelled":
            return {
                title: "This order was cancelled",
                description: "This order is no longer being processed.",
            };

        case "processing":
            return {
                title: "We're preparing your order",
                description: "Your items are being prepared for dispatch.",
            };

        case "confirmed":
            return {
                title: "Your order is confirmed",
                description:
                    "We've received your order and it is being processed.",
            };

        default:
            return {
                title: "Order received",
                description:
                    "Your order is awaiting confirmation or payment processing.",
            };
    }
}

function Orders() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Read orders and request state from Redux.
    const orders = useSelector(selectOrders) ?? [];
    const loading = useSelector(selectOrdersLoading);
    const error = useSelector(selectOrdersError);
    const user = useSelector(selectAuthUser);

    // Local state for the order filters and search input.
    const [activeFilter, setActiveFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [period, setPeriod] = useState("all");

    // Fetch the current user's orders when this page mounts.
    useEffect(() => {
        dispatch(getMyOrdersThunk());
    }, [dispatch]);

    // Calculate the order totals shown in the page header and filter tabs.
    const counts = useMemo(
        () => ({
            all: orders.length,

            progress: orders.filter((order) =>
                IN_PROGRESS_STATUSES.includes(
                    String(order.status ?? "pending").toLowerCase()
                )
            ).length,

            delivered: orders.filter(
                (order) =>
                    String(order.status).toLowerCase() === "delivered"
            ).length,

            cancelled: orders.filter(
                (order) =>
                    String(order.status).toLowerCase() === "cancelled"
            ).length,
        }),
        [orders]
    );

    // Apply the status, search, and date filters together.
    const filteredOrders = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        const now = new Date();

        return orders.filter((order) => {
            const status = String(
                order.status ?? "pending"
            ).toLowerCase();

            // Check the selected status tab.
            const matchesFilter =
                activeFilter === "all" ||
                (activeFilter === "progress" &&
                    IN_PROGRESS_STATUSES.includes(status)) ||
                status === activeFilter;

            // Search by order number, ID, status, or item title.
            const itemText = (order.items ?? [])
                .map((item) => item.title ?? "")
                .join(" ");

            const searchable =
                `${orderNumber(order)} ${order._id ?? ""} ${status} ${itemText}`
                    .toLowerCase();

            // Check the selected date range.
            const orderDate = order.createdAt
                ? new Date(order.createdAt)
                : null;

            let matchesPeriod = true;

            if (period === "6months") {
                const sixMonthsAgo = new Date(now);
                sixMonthsAgo.setMonth(now.getMonth() - 6);

                matchesPeriod =
                    orderDate &&
                    !Number.isNaN(orderDate.getTime()) &&
                    orderDate >= sixMonthsAgo;
            } else if (period === "year") {
                matchesPeriod =
                    orderDate &&
                    !Number.isNaN(orderDate.getTime()) &&
                    orderDate.getFullYear() === now.getFullYear();
            }

            return (
                matchesFilter &&
                matchesPeriod &&
                (!query || searchable.includes(query))
            );
        });
    }, [orders, activeFilter, searchTerm, period]);

    // Filter tabs display their corresponding order counts.
    const filterTabs = [
        { id: "all", label: "All Orders", count: counts.all },
        {
            id: "progress",
            label: "In Progress",
            count: counts.progress,
            dot: true,
        },
        {
            id: "delivered",
            label: "Delivered",
            count: counts.delivered,
        },
        {
            id: "cancelled",
            label: "Cancelled",
            count: counts.cancelled,
        },
    ];

    // Loading state while the order request is being processed.
    if (loading) {
        return (
            <main className="min-h-[60vh] bg-[#f7f9ff] px-4 py-10 text-[#181c20] dark:bg-gray-950 dark:text-gray-100">
                <div className="mx-auto max-w-7xl">
                    <Loading />
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#f7f9ff] px-4 pb-12 pt-6 font-sans text-[#181c20] dark:bg-gray-950 dark:text-gray-100 sm:px-6 lg:px-8 lg:pt-8">
            <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-8 lg:grid-cols-[290px_minmax(0,1fr)]">

                {/* Shared customer sidebar used on Profile and Addresses too. */}
                <AccountSidebar
                    user={user}
                    
                />

                {/* Main orders content. */}
              <section className="min-w-0 space-y-5">

                    {/* Orders heading and summary counts. */}
                    <header className="flex flex-col justify-between gap-4 rounded-xl bg-white p-5 shadow-[0_1px_3px_rgba(24,28,32,0.035)] dark:bg-gray-900 sm:p-6 md:flex-row md:items-end">
                        <div>
                            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[#e5f4ed] px-2.5 py-1 text-[10px] font-semibold text-[#315e4d] dark:bg-emerald-950 dark:text-emerald-200">
                                <span aria-hidden="true">✓</span>
                                Peace of Mind Returns
                            </span>

                            <h1 className="font-serif text-3xl font-normal tracking-tight text-[#181c20] dark:text-white sm:text-4xl">
                                My Orders
                            </h1>

                            <p className="mt-2 max-w-xl text-sm leading-6 text-[#626c68] dark:text-gray-400">
                                Track your TinyNest purchases and view your
                                order details.
                            </p>
                        </div>

                        <div className="flex gap-3 self-start md:self-auto">
                            <div className="min-w-[82px] rounded-lg bg-[#f1f4f9] px-4 py-2.5 text-center dark:bg-gray-800">
                                <span className="block font-serif text-2xl leading-7">
                                    {counts.all}
                                </span>
                                <span className="mt-1 block text-[9px] uppercase tracking-wider text-[#626c68] dark:text-gray-400">
                                    All-time
                                </span>
                            </div>

                            <div className="min-w-[82px] rounded-lg bg-[#e5f4ed]/70 px-4 py-2.5 text-center dark:bg-emerald-950/50">
                                <span className="block font-serif text-2xl leading-7 text-[#436558] dark:text-emerald-200">
                                    {counts.progress}
                                </span>
                                <span className="mt-1 block text-[9px] uppercase tracking-wider text-[#626c68] dark:text-gray-400">
                                    On the way
                                </span>
                            </div>
                        </div>
                    </header>

                    {/* Display request errors without hiding the sidebar. */}
                    {error && <ErrorMessage message={error} />}

                    {/* Filters appear when the user has orders. */}
                    {!error && orders.length > 0 && (
                        <div className="space-y-3">
                            <div
                                className="flex items-center gap-2 overflow-x-auto pb-1"
                                role="tablist"
                                aria-label="Filter orders"
                            >
                                {filterTabs.map((tab) => {
                                    const active = activeFilter === tab.id;

                                    return (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            role="tab"
                                            aria-selected={active}
                                            onClick={() =>
                                                setActiveFilter(tab.id)
                                            }
                                            className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
                                                active
                                                    ? "bg-[#436558] text-white shadow-sm"
                                                    : "bg-white text-[#414845] shadow-sm hover:bg-[#f1f4f9] dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                                            }`}
                                        >
                                            {tab.label} ({tab.count})

                                            {tab.dot && (
                                                <span
                                                    className={`h-2 w-2 rounded-full ${
                                                        active
                                                            ? "bg-white/80"
                                                            : "bg-[#7d5543]"
                                                    }`}
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Search field and date-range selector. */}
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <label className="relative flex min-w-0 flex-1 items-center">
                                    <InlineIcon
                                        name="search"
                                        className="absolute left-3.5 h-5 w-5 text-[#717974]"
                                    />

                                    <input
                                        type="search"
                                        value={searchTerm}
                                        onChange={(event) =>
                                            setSearchTerm(event.target.value)
                                        }
                                        placeholder="Search orders by ID or item name..."
                                        className="h-11 w-full rounded-lg border-0 bg-white pl-11 pr-4 text-sm text-[#181c20] shadow-sm outline-none placeholder:text-[#717974] focus:ring-1 focus:ring-[#436558] dark:bg-gray-900 dark:text-white"
                                    />
                                </label>

                                <select
                                    value={period}
                                    onChange={(event) =>
                                        setPeriod(event.target.value)
                                    }
                                    aria-label="Filter by order date"
                                    className="h-11 rounded-lg border-0 bg-white px-4 text-sm text-[#414845] shadow-sm outline-none focus:ring-1 focus:ring-[#436558] dark:bg-gray-900 dark:text-gray-200 sm:w-52"
                                >
                                    <option value="all">All time</option>
                                    <option value="6months">
                                        Last 6 months
                                    </option>
                                    <option value="year">This year</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Empty state when the user has not ordered anything. */}
                    {!error && orders.length === 0 && (
                        <div className="rounded-xl bg-white px-5 py-12 text-center shadow-sm dark:bg-gray-900">
                            <EmptyState
                                title="No orders yet"
                                message="You haven't placed any orders yet."
                            />

                            <button
                                type="button"
                                onClick={() => navigate("/products")}
                                className="mt-4 rounded-full bg-[#436558] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#315447]"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    )}

                    {/* Empty state when filters return no matches. */}
                    {!error &&
                        orders.length > 0 &&
                        filteredOrders.length === 0 && (
                            <div className="rounded-xl bg-white px-5 py-12 text-center shadow-sm dark:bg-gray-900">
                                <h2 className="font-serif text-xl">
                                    No matching orders
                                </h2>

                                <p className="mt-2 text-sm text-[#626c68] dark:text-gray-400">
                                    Try another search or date range.
                                </p>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchTerm("");
                                        setActiveFilter("all");
                                        setPeriod("all");
                                    }}
                                    className="mt-4 text-sm font-semibold text-[#436558] underline underline-offset-4 dark:text-emerald-300"
                                >
                                    Clear filters
                                </button>
                            </div>
                        )}

                    {/* Render the filtered order cards. */}
                    {!error && filteredOrders.length > 0 && (
                        <div className="space-y-5">
                            {filteredOrders.map((order) => {
                                const status = String(
                                    order.status ?? "pending"
                                ).toLowerCase();

                                const items = order.items ?? [];
                                const statusMessage =
                                    getStatusMessage(status);

                                const address = order.shippingAddress;

                                const addressText = address
                                    ? [
                                          address.addressLine,
                                          address.city,
                                          address.state,
                                          address.postalCode,
                                      ]
                                          .filter(Boolean)
                                          .join(", ")
                                    : "Delivery address available in order details";

                                return (
                                    <article
                                        key={order._id}
                                        className="overflow-hidden rounded-xl bg-white shadow-[0_2px_5px_rgba(24,28,32,0.08)] transition-shadow hover:shadow-md dark:bg-gray-900"
                                    >
                                        {/* Order number, date, amount, and status. */}
                                        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#f1f4f9] px-5 py-4 sm:px-6">
                                            <div className="flex flex-wrap gap-x-7 gap-y-3">
                                                <div>
                                                    <span className="block text-[10px] uppercase tracking-wider text-[#414845]">
                                                        Order placed
                                                    </span>
                                                    <span className="mt-1 block text-sm font-semibold">
                                                        {formatDate(
                                                            order.createdAt
                                                        )}
                                                    </span>
                                                </div>

                                                <div>
                                                    <span className="block text-[10px] uppercase tracking-wider text-[#414845]">
                                                        Total amount
                                                    </span>
                                                    <span className="mt-1 block text-sm font-bold">
                                                        {formatCurrency(
                                                            order.totalAmount
                                                        )}
                                                    </span>
                                                </div>

                                                <div>
                                                    <span className="block text-[10px] uppercase tracking-wider text-[#414845]">
                                                        Order number
                                                    </span>
                                                    <span className="mt-1 block max-w-[190px] truncate font-mono text-sm font-semibold text-[#436558]">
                                                        #
                                                        {String(
                                                            orderNumber(order)
                                                        ).slice(-12)}
                                                    </span>
                                                </div>
                                            </div>

                                            <span
                                                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold capitalize ${
                                                    statusStyles[status] ??
                                                    statusStyles.pending
                                                }`}
                                            >
                                                <span
                                                    className={`h-2 w-2 rounded-full ${
                                                        status === "cancelled"
                                                            ? "bg-[#a85f50]"
                                                            : "bg-[#436558]"
                                                    }`}
                                                />

                                                {status === "shipped"
                                                    ? "In Transit"
                                                    : status}
                                            </span>
                                        </div>

                                        <div className="space-y-5 p-5 sm:p-6">
                                            {/* Status message and progress indicator. */}
                                            <div className="flex flex-col justify-between gap-3 rounded-lg bg-[#e5f4ed]/55 p-4 sm:flex-row sm:items-center sm:p-5 dark:bg-emerald-950/30">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#436558] text-white">
                                                        <InlineIcon
                                                            name="truck"
                                                            className="h-5 w-5"
                                                        />
                                                    </div>

                                                    <div>
                                                        <h2 className="font-serif text-xl leading-6 text-[#181c20] dark:text-white">
                                                            {
                                                                statusMessage.title
                                                            }
                                                        </h2>

                                                        <p className="mt-1 text-xs leading-5 text-[#626c68] dark:text-gray-400">
                                                            {
                                                                statusMessage.description
                                                            }
                                                        </p>
                                                    </div>
                                                </div>

                                                {status !== "cancelled" && (
                                                    <div
                                                        className="flex min-w-[105px] items-center gap-1.5"
                                                        aria-label={`Order status: ${status}`}
                                                    >
                                                        {[
                                                            "confirmed",
                                                            "processing",
                                                            "shipped",
                                                            "delivered",
                                                        ].map((step, index) => {
                                                            const orderSteps = [
                                                                "pending",
                                                                "confirmed",
                                                                "processing",
                                                                "shipped",
                                                                "delivered",
                                                            ];

                                                            const current =
                                                                orderSteps.indexOf(
                                                                    status
                                                                );

                                                            const filled =
                                                                current >= 0 &&
                                                                (status ===
                                                                "pending"
                                                                    ? index ===
                                                                      0
                                                                    : index <
                                                                          current ||
                                                                      (status ===
                                                                          "delivered" &&
                                                                          index ===
                                                                              3));

                                                            return (
                                                                <span
                                                                    key={step}
                                                                    className={`h-1.5 flex-1 rounded-full ${
                                                                        filled
                                                                            ? "bg-[#436558]"
                                                                            : "bg-[#dfe5e2]"
                                                                    }`}
                                                                />
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Products and kits included in this order. */}
                                            <div className="divide-y divide-[#edf0f5] dark:divide-gray-800">
                                                {items.map((item, index) => (
                                                    <div
                                                        key={`${order._id}-${item.product ?? item.kit ?? index}`}
                                                        className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 sm:gap-4"
                                                    >
                                                        <div className="relative h-[82px] w-[82px] shrink-0 overflow-hidden rounded-lg bg-[#f1f4f9] dark:bg-gray-800">
                                                            {item.image ? (
                                                                <img
                                                                    src={
                                                                        item.image
                                                                    }
                                                                    alt={
                                                                        item.title ??
                                                                        "Ordered item"
                                                                    }
                                                                    loading="lazy"
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="flex h-full items-center justify-center px-1 text-center text-[10px] text-[#717974]">
                                                                    No image
                                                                </div>
                                                            )}

                                                            <span className="absolute right-1.5 top-1.5 rounded bg-white/95 px-1.5 py-0.5 text-[10px] font-semibold text-[#414845]">
                                                                {item.quantity ??
                                                                    1}
                                                                x
                                                            </span>
                                                        </div>

                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#7d5543]">
                                                                {item.itemType ===
                                                                "kit"
                                                                    ? "TinyNest Kit"
                                                                    : "Baby Essentials"}
                                                            </p>

                                                            <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-[#181c20] dark:text-white">
                                                                {item.title ??
                                                                    "Order item"}
                                                            </h3>

                                                            <p className="mt-1 text-xs text-[#626c68] dark:text-gray-400">
                                                                Quantity:{" "}
                                                                {item.quantity ??
                                                                    1}
                                                            </p>
                                                        </div>

                                                        <div className="shrink-0 text-right">
                                                            <p className="text-sm font-semibold text-[#181c20] dark:text-white">
                                                                {formatCurrency(
                                                                    Number(
                                                                        item.price ??
                                                                            0
                                                                    ) *
                                                                        Number(
                                                                            item.quantity ??
                                                                                1
                                                                        )
                                                                )}
                                                            </p>

                                                            <p className="mt-1 text-[11px] text-[#717974]">
                                                                {formatCurrency(
                                                                    item.price
                                                                )}{" "}
                                                                each
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Shipping destination saved with the order. */}
                                            <div className="flex items-start gap-2 border-t border-[#edf0f5] pt-4 text-xs leading-5 text-[#414845] dark:border-gray-800 dark:text-gray-300">
                                                <InlineIcon
                                                    name="pin"
                                                    className="mt-0.5 h-4 w-4 shrink-0 text-[#436558]"
                                                />

                                                <div className="min-w-0">
                                                    <span className="font-semibold">
                                                        Delivering to:{" "}
                                                    </span>
                                                    {addressText}
                                                </div>
                                            </div>

                                            {/* Navigate to the existing order details route. */}
                                            <div className="flex flex-col gap-3 border-t border-[#edf0f5] pt-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
                                                <p className="text-xs text-[#626c68] dark:text-gray-400">
                                                    {items.length}{" "}
                                                    {items.length === 1
                                                        ? "item"
                                                        : "items"}{" "}
                                                    in this order
                                                </p>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/orders/${order._id}`
                                                        )
                                                    }
                                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#436558] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#315447]"
                                                >
                                                    View Order Details
                                                    <span aria-hidden="true">
                                                        →
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

export default Orders;

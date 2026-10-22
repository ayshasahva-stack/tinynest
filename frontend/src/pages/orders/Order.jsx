// My Orders page — styled to match the supplied TinyNest reference design.
// Order data and actions still come from the existing Redux/API implementation.
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getMyOrdersThunk } from "../../features/orders/orderThunk";
import {
    selectOrders,
    selectOrdersLoading,
    selectOrdersError,
} from "../../features/orders/orderSelectors";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import ErrorMessage from "../../components/ErrorMessage";

// Colors and surfaces follow the reference: pale blue-white canvas,
// sage-green actions, muted green status labels, and soft gray-blue order headers.
const inProgressStatuses = ["pending", "confirmed", "processing", "shipped"];

const statusStyles = {
    pending: "bg-[#f1f3f6] text-[#48534e]",
    confirmed: "bg-[#e0f2e9] text-[#315e4d]",
    processing: "bg-[#e0f2e9] text-[#315e4d]",
    shipped: "bg-[#dff2e9] text-[#315e4d]",
    delivered: "bg-[#e0f2e9] text-[#315e4d]",
    cancelled: "bg-[#fbe9e5] text-[#8b4d40]",
};

function formatCurrency(value) {
    return `₹${Number(value ?? 0).toLocaleString("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })}`;
}

function formatDate(value) {
    if (!value) return "Date unavailable";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Date unavailable";
    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function getShortOrderId(order) {
    // Prefer an existing human-readable order number if the API provides one.
    return order.orderNumber || order.orderId || order._id || "—";
}

function Orders() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const orders = useSelector(selectOrders) ?? [];
    const loading = useSelector(selectOrdersLoading);
    const error = useSelector(selectOrdersError);

    const [activeFilter, setActiveFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        dispatch(getMyOrdersThunk());
    }, [dispatch]);

    const counts = useMemo(() => ({
        all: orders.length,
        progress: orders.filter((order) => inProgressStatuses.includes(order.status)).length,
        delivered: orders.filter((order) => order.status === "delivered").length,
        cancelled: orders.filter((order) => order.status === "cancelled").length,
    }), [orders]);

    const filteredOrders = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        return orders.filter((order) => {
            const matchesFilter = activeFilter === "all" ||
                (activeFilter === "progress" && inProgressStatuses.includes(order.status)) ||
                order.status === activeFilter;
            const itemsText = (order.items ?? []).map((item) => item.title ?? "").join(" ");
            const searchableText = `${getShortOrderId(order)} ${order._id ?? ""} ${order.status ?? ""} ${itemsText}`.toLowerCase();
            return matchesFilter && (!query || searchableText.includes(query));
        });
    }, [orders, activeFilter, searchTerm]);

    const filterTabs = [
        { id: "all", label: "All Orders", count: counts.all },
        { id: "progress", label: "In Progress", count: counts.progress },
        { id: "delivered", label: "Delivered", count: counts.delivered },
        { id: "cancelled", label: "Cancelled", count: counts.cancelled },
    ];

    if (loading) {
        return (
            <main className="min-h-[60vh] bg-[#f7f9ff] px-4 py-10 text-[#181c20] dark:bg-gray-950 dark:text-gray-100 sm:px-6">
                <div className="mx-auto max-w-6xl"><Loading /></div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#f7f9ff] px-4 py-7 text-[#181c20] dark:bg-gray-950 dark:text-gray-100 sm:px-6 lg:py-9">
            <div className="mx-auto max-w-6xl">
                {/* Editorial title panel inspired by the supplied screenshot. */}
                <section className="mb-4 flex flex-col justify-between gap-5 rounded-xl border border-[#edf0f5] bg-white px-6 py-6 shadow-[0_2px_10px_rgba(24,28,32,0.025)] dark:border-gray-800 dark:bg-gray-900 sm:px-7 sm:py-7 md:flex-row md:items-end">
                    <div className="max-w-2xl">
                        <span className="inline-flex items-center gap-2 rounded-full bg-[#e5f4ed] px-3 py-1 text-[11px] font-medium tracking-wide text-[#436558] dark:bg-emerald-950 dark:text-emerald-200">
                            <span aria-hidden="true">◉</span> Your TinyNest account
                        </span>
                        <h1 className="mt-2 font-serif text-3xl font-normal tracking-tight text-[#181c20] dark:text-white sm:text-4xl">My Orders</h1>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-[#59635f] dark:text-gray-400">
                            View your recent orders and track their status.
                        </p>
                    </div>
                    <div className="flex gap-3 self-start md:self-auto">
                        <div className="min-w-[88px] rounded-md bg-[#f1f4f9] px-4 py-3 text-center dark:bg-gray-800">
                            <p className="font-serif text-2xl leading-7 text-[#181c20] dark:text-white">{counts.all}</p>
                            <p className="mt-1 text-[9px] uppercase tracking-wide text-[#626c68] dark:text-gray-400">All-time</p>
                        </div>
                        <div className="min-w-[88px] rounded-md bg-[#f0f8f4] px-4 py-3 text-center dark:bg-emerald-950/50">
                            <p className="font-serif text-2xl leading-7 text-[#315e4d] dark:text-emerald-200">{counts.progress}</p>
                            <p className="mt-1 text-[9px] uppercase tracking-wide text-[#626c68] dark:text-gray-400">In progress</p>
                        </div>
                    </div>
                </section>

                {error && <div className="mb-4"><ErrorMessage message={error} /></div>}

                {!error && orders.length > 0 && (
                    <>
                        {/* Compact rounded filters matching the reference's pill controls. */}
                        <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                            {filterTabs.map((tab) => {
                                const active = activeFilter === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setActiveFilter(tab.id)}
                                        aria-pressed={active}
                                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-xs transition-colors ${active
                                            ? "border-[#436558] bg-[#436558] font-semibold text-white"
                                            : "border-[#edf0f5] bg-white text-[#414845] hover:bg-[#f1f4f9] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"}`}
                                    >
                                        {tab.label} <span className={active ? "text-white/80" : "text-[#7b8580]"}>({tab.count})</span>
                                    </button>
                                );
                            })}
                        </div>
                        <label className="mb-4 flex items-center gap-3 rounded-md border border-[#edf0f5] bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
                            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0 text-[#68736e]">
                                <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.6" />
                                <path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                            </svg>
                            <span className="sr-only">Search orders</span>
                            <input
                                type="search"
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                placeholder="Search orders by order ID or item name..."
                                className="w-full bg-transparent text-xs text-[#181c20] outline-none placeholder:text-[#858e89] dark:text-white"
                            />
                        </label>
                    </>
                )}

                {!error && orders.length === 0 && (
                    <div className="rounded-xl border border-[#edf0f5] bg-white px-5 py-12 text-center dark:border-gray-800 dark:bg-gray-900">
                        <EmptyState title="No orders yet" message="You haven't placed any orders yet." />
                        <button type="button" onClick={() => navigate("/products")} className="mt-4 rounded-full bg-[#436558] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#315447]">
                            Continue Shopping
                        </button>
                    </div>
                )}

                {!error && orders.length > 0 && filteredOrders.length === 0 && (
                    <div className="rounded-xl border border-[#edf0f5] bg-white px-5 py-12 text-center dark:border-gray-800 dark:bg-gray-900">
                        <p className="font-serif text-xl">No matching orders</p>
                        <p className="mt-2 text-sm text-[#68736e] dark:text-gray-400">Try another search or choose a different filter.</p>
                        <button type="button" onClick={() => { setSearchTerm(""); setActiveFilter("all"); }} className="mt-4 text-sm font-medium text-[#436558] underline underline-offset-4 dark:text-emerald-300">Clear filters</button>
                    </div>
                )}

                {!error && filteredOrders.length > 0 && (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => {
                            const status = String(order.status ?? "pending").toLowerCase();
                            const items = order.items ?? [];
                            return (
                                <article key={order._id} className="overflow-hidden rounded-xl border border-[#edf0f5] bg-white shadow-[0_2px_8px_rgba(24,28,32,0.02)] dark:border-gray-800 dark:bg-gray-900">
                                    {/* Summary strip: pale blue-gray, like the reference cards. */}
                                    <div className="flex flex-col gap-3 bg-[#f1f4f9] px-4 py-4 dark:bg-gray-800 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                                        <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-3">
                                            <div className="min-w-0">
                                                <p className="text-[9px] uppercase tracking-wide text-[#626c68] dark:text-gray-400">Order placed</p>
                                                <p className="mt-1 text-xs font-medium text-[#181c20] dark:text-white">{formatDate(order.createdAt)}</p>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[9px] uppercase tracking-wide text-[#626c68] dark:text-gray-400">Total amount</p>
                                                <p className="mt-1 text-xs font-medium text-[#181c20] dark:text-white">{formatCurrency(order.totalAmount)}</p>
                                            </div>
                                            <div className="min-w-0 col-span-2 sm:col-span-1">
                                                <p className="text-[9px] uppercase tracking-wide text-[#626c68] dark:text-gray-400">Order number</p>
                                                <p className="mt-1 break-all text-xs font-medium text-[#315e4d] dark:text-emerald-200">#{String(getShortOrderId(order)).slice(-12)}</p>
                                            </div>
                                        </div>
                                        <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium capitalize ${statusStyles[status] ?? statusStyles.pending}`}>
                                            <span aria-hidden="true">{status === "delivered" ? "✓" : status === "cancelled" ? "×" : "◷"}</span>
                                            {status === "shipped" ? "In Transit" : status}
                                        </span>
                                    </div>

                                    {/* Actual ordered items only — no mock shipping or product data. */}
                                    <div className="p-4 sm:p-5">
                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            {items.map((item, index) => (
                                                <div key={`${order._id}-${item.product ?? item.kit ?? index}`} className="flex min-w-0 items-center gap-3 rounded-md bg-[#f7f9fc] p-2.5 dark:bg-gray-800/70">
                                                    <div className="h-[62px] w-[62px] shrink-0 overflow-hidden rounded-md bg-[#edf0f5] dark:bg-gray-700">
                                                        {item.image ? (
                                                            <img src={item.image} alt={item.title ?? "Ordered item"} loading="lazy" className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="flex h-full items-center justify-center px-1 text-center text-[10px] text-[#68736e] dark:text-gray-400">No image</div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-xs font-medium text-[#181c20] dark:text-white">{item.title ?? "Order item"}</p>
                                                        <p className="mt-1 text-[11px] text-[#68736e] dark:text-gray-400">Qty {item.quantity ?? 1}</p>
                                                        <p className="mt-1 text-[11px] font-medium text-[#181c20] dark:text-gray-200">{formatCurrency(Number(item.price ?? 0) * Number(item.quantity ?? 1))}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4 flex flex-col gap-3 border-t border-[#edf0f5] pt-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
                                            <p className="text-xs text-[#68736e] dark:text-gray-400">{items.length} {items.length === 1 ? "item" : "items"} in this order</p>
                                            <button type="button" onClick={() => navigate(`/orders/${order._id}`)} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#436558] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#315447]">
                                                View Order Details <span aria-hidden="true">→</span>
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}

export default Orders;

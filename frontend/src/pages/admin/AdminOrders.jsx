
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    getAllOrdersForAdminThunk,
    updateOrderStatusThunk,
    confirmCodPaymentThunk
} from "../../features/orders/orderThunk";

import {
    selectAdminOrders,
    selectAdminOrdersLoading,
    selectAdminOrdersError,
    selectUpdatingOrderId,
    selectOrderUpdateError,
    selectOrderUpdateSuccess,
    selectConfirmingCodOrderId,
    selectCodPaymentError,
    selectCodPaymentSuccess,
} from "../../features/orders/orderSelectors";

import {
    clearAdminOrderFeedback,
} from "../../features/orders/orderSlice";

// These transitions must match the backend controller.
const allowedTransitions = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["processing", "cancelled"],
    processing: ["shipped"],
    shipped: ["delivered"],
    delivered: [],
    cancelled: [],
};

// Consistent status badge colours.
const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    processing: "bg-purple-100 text-purple-800",
    shipped: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
};

// Format dates for the orders table.
const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

// Format amounts as Indian rupees.
const formatPrice = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

function AdminOrders() {
    const dispatch = useDispatch();

    const orders = useSelector(selectAdminOrders);
    const loading = useSelector(selectAdminOrdersLoading);
    const error = useSelector(selectAdminOrdersError);
    const updatingOrderId = useSelector(selectUpdatingOrderId);
    const updateError = useSelector(selectOrderUpdateError);
    const updateSuccess = useSelector(selectOrderUpdateSuccess);
    const confirmingCodOrderId = useSelector(selectConfirmingCodOrderId);
    const codPaymentError = useSelector(selectCodPaymentError);
    const codPaymentSuccess = useSelector(selectCodPaymentSuccess);
    // Local UI state for searching, filtering, and the details modal.
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Fetch all orders when the page opens.
    useEffect(() => {
        dispatch(getAllOrdersForAdminThunk());
    }, [dispatch]);

    // Remove old update feedback when the page is first mounted.
    useEffect(() => {
        dispatch(clearAdminOrderFeedback());
    }, [dispatch]);

    // Keep the selected modal order in sync with Redux after updates.
    useEffect(() => {
        if (!selectedOrder) return;

        const updatedOrder = orders.find(
            (order) => order._id === selectedOrder._id
        );

        if (updatedOrder) {
            setSelectedOrder(updatedOrder);
        }
    }, [orders, selectedOrder?._id]);

    // Search by order ID, customer email, phone, or customer name.
    // Filter by status without changing the stored Redux list.
    const filteredOrders = useMemo(() => {
        const searchText = search.trim().toLowerCase();

        return orders.filter((order) => {
            const address = order.shippingAddress || {};
            const customer = order.user || {};

            const searchableText = [
                order._id,
                customer.email,
                customer.phone,
                address.fullName,
                address.phone,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            const matchesSearch = searchableText.includes(searchText);

            const matchesStatus =
                statusFilter === "all" ||
                order.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [orders, search, statusFilter]);

 // Confirm COD collection after delivery.
const handleConfirmCodPayment = async (order) => {
    const confirmed = window.confirm(
        `Confirm that ₹${Number(order.paymentDetails?.amount ?? order.totalAmount).toFixed(2)} has been collected for this delivered COD order?`
    );

    if (!confirmed) return;

    dispatch(clearAdminOrderFeedback());

    try {
        // The thunk updates the matching order in Redux on success.
        await dispatch(
            confirmCodPaymentThunk(order._id)
        ).unwrap();
    } catch {
        // Redux stores the error for display on the page.
    }
};

    // Send the status update to the backend.
    const handleStatusChange = async (orderId, status) => {
        const confirmed = window.confirm(
            `Change this order's status to "${status}"?`
        );

        if (!confirmed) return;

        dispatch(clearAdminOrderFeedback());

        try {
            await dispatch(
                updateOrderStatusThunk({ orderId, status })
            ).unwrap();
        } catch {
            // Redux stores the error for display below.
        }
    };

    // Count orders in each status for the summary cards.
    const statusCounts = useMemo(() => {
        return {
            total: orders.length,
            pending: orders.filter((order) => order.status === "pending").length,
            processing: orders.filter(
                (order) => order.status === "processing"
            ).length,
            delivered: orders.filter(
                (order) => order.status === "delivered"
            ).length,
        };
    }, [orders]);

  return (
    <div className="min-h-screen bg-[#f7f9ff] p-4 text-[#263d32] dark:bg-slate-950 dark:text-white md:p-8">
        {/* Page heading */}
        <div className="mb-8">
            <h1 className="font-serif text-3xl font-semibold text-[#263d32] dark:text-white">
                Order Management
            </h1>

            <p className="mt-1 text-[#77847d] dark:text-gray-400">
                View customer orders and manage their status.
            </p>
        </div>

        {/* Order summary cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
                {
                    label: "Total Orders",
                    value: statusCounts.total,
                    color: "text-[#436558]",
                },
                {
                    label: "Pending Orders",
                    value: statusCounts.pending,
                    color: "text-[#bd8069]",
                },
                {
                    label: "Processing Orders",
                    value: statusCounts.processing,
                    color: "text-[#65756c]",
                },
                {
                    label: "Delivered Orders",
                    value: statusCounts.delivered,
                    color: "text-[#436558]",
                },
            ].map((card) => (
                <div
                    key={card.label}
                    className="rounded-2xl border border-[#e0e7e3] bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                >
                    <p className="text-sm text-[#77847d] dark:text-gray-400">
                        {card.label}
                    </p>

                    <p className={`mt-2 text-2xl font-bold ${card.color}`}>
                        {card.value}
                    </p>
                </div>
            ))}
        </div>

        {/* Search and status filter */}
        <div className="mb-6 grid grid-cols-1 gap-4 rounded-2xl border border-[#e0e7e3] bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:grid-cols-3">
            <div className="md:col-span-2">
                <label
                    htmlFor="orderSearch"
                    className="mb-2 block text-sm font-semibold text-[#46574e] dark:text-gray-200"
                >
                    Search Orders
                </label>

                <input
                    id="orderSearch"
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search order ID, customer, email, or phone..."
                    className="w-full rounded-lg border border-[#d6e0da] bg-white px-4 py-2.5 text-[#263d32] outline-none placeholder:text-[#9aa69f] focus:border-[#7a9e8f] focus:ring-2 focus:ring-[#dce7e2] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
            </div>

            <div>
                <label
                    htmlFor="statusFilter"
                    className="mb-2 block text-sm font-semibold text-[#46574e] dark:text-gray-200"
                >
                    Filter by Status
                </label>

                <select
                    id="statusFilter"
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className="w-full rounded-lg border border-[#d6e0da] bg-white px-4 py-2.5 text-[#263d32] outline-none focus:border-[#7a9e8f] focus:ring-2 focus:ring-[#dce7e2] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                    <option value="all">All statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>
        </div>

        {/* API and update feedback */}
        {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                {error}
            </div>
        )}

        {updateError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                Status update failed: {updateError}
            </div>
        )}

        {updateSuccess && (
            <div className="mb-4 rounded-xl border border-[#cbdcd3] bg-[#edf4f0] p-4 text-[#436558] dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
                Order status updated successfully.
            </div>
        )}

        {codPaymentError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                COD payment confirmation failed: {codPaymentError}
            </div>
        )}

        {codPaymentSuccess && (
            <div className="mb-4 rounded-xl border border-[#cbdcd3] bg-[#edf4f0] p-4 text-[#436558] dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
                COD payment confirmed successfully.
            </div>
        )}

        {/* Orders table */}
        <div className="overflow-hidden rounded-2xl border border-[#e0e7e3] bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#dce7e2] border-t-[#436558]" />

                    <p className="mt-4 text-[#77847d] dark:text-gray-400">
                        Loading orders...
                    </p>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="py-16 text-center">
                    <h3 className="font-serif text-lg font-semibold text-[#263d32] dark:text-white">
                        No orders found
                    </h3>

                    <p className="mt-1 text-[#77847d] dark:text-gray-400">
                        Try changing your search or status filter.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-[#e0e7e3] bg-[#f1f4f9] dark:border-gray-700 dark:bg-gray-700">
                            <tr>
                                {[
                                    "Order",
                                    "Customer",
                                    "Date",
                                    "Total",
                                    "Status",
                                    "Payment",
                                    "Actions",
                                ].map((heading) => (
                                    <th
                                        key={heading}
                                        className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-[#46574e] dark:text-gray-200"
                                    >
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#edf1ee] dark:divide-gray-700">
                            {filteredOrders.map((order) => {
                                const customer = order.user || {};
                                const address = order.shippingAddress || {};
                                const nextStatuses =
                                    allowedTransitions[order.status] || [];

                                return (
                                    <tr
                                        key={order._id}
                                        className="transition-colors hover:bg-[#f7f9f8] dark:hover:bg-gray-700/50"
                                    >
                                        {/* Order information */}
                                        <td className="px-5 py-4">
                                            <p className="font-semibold text-[#263d32] dark:text-white">
                                                #{order._id.slice(-8).toUpperCase()}
                                            </p>

                                            <p className="mt-1 text-xs text-[#9aa69f]">
                                                {order.items?.length || 0} item(s)
                                            </p>
                                        </td>

                                        {/* Customer information */}
                                        <td className="px-5 py-4">
                                            <p className="text-sm font-medium text-[#46574e] dark:text-gray-200">
                                                {address.fullName || "Customer"}
                                            </p>

                                            <p className="mt-1 text-xs text-[#77847d] dark:text-gray-400">
                                                {customer.email || "No email"}
                                            </p>
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4 text-sm text-[#65756c] dark:text-gray-300">
                                            {formatDate(order.createdAt)}
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-[#263d32] dark:text-white">
                                            {formatPrice(order.totalAmount)}
                                        </td>

                                        {/* Order status */}
                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
                                                    statusStyles[order.status] ||
                                                    "bg-[#f1f4f9] text-[#65756c]"
                                                }`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>

                                        {/* Payment method and status */}
                                        <td className="min-w-52 px-5 py-4">
                                            <div className="flex flex-col items-start gap-2">
                                                {order.paymentDetails ? (
                                                    <>
                                                        <span className="text-xs font-medium text-[#65756c] dark:text-gray-300">
                                                            {order.paymentDetails.paymentMethod === "cod"
                                                                ? "Cash on Delivery"
                                                                : "Online Payment"}
                                                        </span>

                                                        <span
                                                            className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
                                                                order.paymentDetails.status === "paid"
                                                                    ? "bg-[#edf4f0] text-[#436558]"
                                                                    : order.paymentDetails.status === "pending"
                                                                      ? "bg-[#fbf0eb] text-[#a85f4a]"
                                                                      : order.paymentDetails.status === "failed"
                                                                        ? "bg-red-100 text-red-800"
                                                                        : "bg-[#f1f4f9] text-[#65756c]"
                                                            }`}
                                                        >
                                                            {order.paymentDetails.status || "unknown"}
                                                        </span>

                                                        {order.paymentDetails.status === "paid" &&
                                                            order.paymentDetails.paidAt && (
                                                                <span className="text-xs text-[#77847d] dark:text-gray-400">
                                                                    Paid: {formatDate(order.paymentDetails.paidAt)}
                                                                </span>
                                                            )}
                                                    </>
                                                ) : (
                                                    <span className="text-xs text-[#77847d] dark:text-gray-400">
                                                        No payment record
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Order actions */}
                                        <td className="min-w-52 px-5 py-4">
                                            <div className="flex flex-col items-start gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="rounded-lg border border-[#cbdcd3] px-3 py-1.5 text-sm font-medium text-[#436558] transition hover:bg-[#edf4f0] dark:border-[#536e61] dark:text-[#b7d0c3] dark:hover:bg-gray-700"
                                                >
                                                    View Details
                                                </button>

                                                {/* Only allow COD confirmation for delivered, unpaid COD orders */}
                                                {order.status === "delivered" &&
                                                    order.paymentDetails?.paymentMethod === "cod" &&
                                                    order.paymentDetails?.status === "pending" && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleConfirmCodPayment(order)}
                                                            disabled={confirmingCodOrderId === order._id}
                                                            className="rounded-lg bg-[#436558] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#354f44] disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            {confirmingCodOrderId === order._id
                                                                ? "Confirming..."
                                                                : "Confirm COD Payment"}
                                                        </button>
                                                    )}

                                                {nextStatuses.length > 0 && (
                                                    <select
                                                        aria-label={`Update status for order ${order._id}`}
                                                        value=""
                                                        disabled={updatingOrderId === order._id}
                                                        onChange={(event) => {
                                                            const nextStatus = event.target.value;

                                                            if (nextStatus) {
                                                                handleStatusChange(
                                                                    order._id,
                                                                    nextStatus
                                                                );
                                                            }
                                                        }}
                                                        className="max-w-full rounded-lg border border-[#d6e0da] bg-white px-2 py-1.5 text-sm text-[#46574e] outline-none focus:border-[#7a9e8f] disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                    >
                                                        <option value="">
                                                            {updatingOrderId === order._id
                                                                ? "Updating..."
                                                                : "Update status"}
                                                        </option>

                                                        {nextStatuses.map((status) => (
                                                            <option
                                                                key={status}
                                                                value={status}
                                                            >
                                                                {status}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Result count */}
            {!loading && filteredOrders.length > 0 && (
                <div className="border-t border-[#e0e7e3] px-5 py-4 text-sm text-[#77847d] dark:border-gray-700 dark:text-gray-400">
                    Showing {filteredOrders.length} of {orders.length} orders
                </div>
            )}
        </div>

        {/* Order details modal */}
        {selectedOrder && (
            <div
                className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 py-8"
                onClick={() => setSelectedOrder(null)}
            >
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="orderDetailsTitle"
                    className="my-auto w-full max-w-3xl rounded-2xl border border-[#e0e7e3] bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800"
                    onClick={(event) => event.stopPropagation()}
                >
                    <div className="mb-6 flex items-start justify-between gap-4">
                        <div>
                            <h2
                                id="orderDetailsTitle"
                                className="font-serif text-xl font-semibold text-[#263d32] dark:text-white"
                            >
                                Order Details
                            </h2>

                            <p className="mt-1 break-all text-sm text-[#77847d] dark:text-gray-400">
                                ID: {selectedOrder._id}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setSelectedOrder(null)}
                            className="rounded-lg px-3 py-1 text-2xl text-[#65756c] transition hover:bg-[#f1f4f9] dark:hover:bg-gray-700"
                            aria-label="Close order details"
                        >
                            ×
                        </button>
                    </div>

                    {/* Customer and shipping details */}
                    <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div className="rounded-xl border border-[#e0e7e3] bg-[#f7f9f8] p-4 dark:border-gray-700 dark:bg-gray-700/50">
                            <h3 className="mb-3 font-semibold text-[#263d32] dark:text-white">
                                Customer
                            </h3>

                            <p className="text-sm text-[#46574e] dark:text-gray-200">
                                {selectedOrder.shippingAddress?.fullName || "N/A"}
                            </p>

                            <p className="mt-1 break-all text-sm text-[#77847d] dark:text-gray-400">
                                {selectedOrder.user?.email || "N/A"}
                            </p>

                            <p className="mt-1 text-sm text-[#77847d] dark:text-gray-400">
                                {selectedOrder.user?.phone ||
                                    selectedOrder.shippingAddress?.phone ||
                                    "N/A"}
                            </p>
                        </div>

                        <div className="rounded-xl border border-[#e0e7e3] bg-[#f7f9f8] p-4 dark:border-gray-700 dark:bg-gray-700/50">
                            <h3 className="mb-3 font-semibold text-[#263d32] dark:text-white">
                                Shipping Address
                            </h3>

                            {[
                                selectedOrder.shippingAddress?.addressLine,
                                selectedOrder.shippingAddress?.city,
                                selectedOrder.shippingAddress?.state,
                                selectedOrder.shippingAddress?.postalCode,
                                selectedOrder.shippingAddress?.country,
                            ]
                                .filter(Boolean)
                                .map((line, index) => (
                                    <p
                                        key={`${line}-${index}`}
                                        className="text-sm text-[#65756c] dark:text-gray-300"
                                    >
                                        {line}
                                    </p>
                                ))}
                        </div>
                    </div>

                    {/* Payment details */}
                    <div className="mb-6 rounded-xl border border-[#e0e7e3] p-4 dark:border-gray-700">
                        <h3 className="mb-3 font-semibold text-[#263d32] dark:text-white">
                            Payment Details
                        </h3>

                        <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                            <p className="text-[#65756c] dark:text-gray-300">
                                Method:{" "}
                                <span className="font-medium text-[#263d32] dark:text-white">
                                    {selectedOrder.paymentDetails?.paymentMethod === "cod"
                                        ? "Cash on Delivery"
                                        : selectedOrder.paymentDetails?.paymentMethod === "online"
                                          ? "Online Payment"
                                          : "N/A"}
                                </span>
                            </p>

                            <p className="text-[#65756c] dark:text-gray-300">
                                Payment status:{" "}
                                <span className="font-medium capitalize text-[#263d32] dark:text-white">
                                    {selectedOrder.paymentDetails?.status || "N/A"}
                                </span>
                            </p>

                            <p className="text-[#65756c] dark:text-gray-300">
                                Payment amount:{" "}
                                <span className="font-medium text-[#263d32] dark:text-white">
                                    {selectedOrder.paymentDetails
                                        ? formatPrice(selectedOrder.paymentDetails.amount)
                                        : "N/A"}
                                </span>
                            </p>

                            {selectedOrder.paymentDetails?.paidAt && (
                                <p className="text-[#65756c] dark:text-gray-300">
                                    Paid on:{" "}
                                    <span className="font-medium text-[#263d32] dark:text-white">
                                        {formatDate(selectedOrder.paymentDetails.paidAt)}
                                    </span>
                                </p>
                            )}

                            {selectedOrder.paymentDetails?.transactionId && (
                                <p className="break-all text-[#65756c] dark:text-gray-300 sm:col-span-2">
                                    Transaction ID:{" "}
                                    <span className="font-medium text-[#263d32] dark:text-white">
                                        {selectedOrder.paymentDetails.transactionId}
                                    </span>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Purchased items */}
                    <h3 className="mb-3 font-semibold text-[#263d32] dark:text-white">
                        Ordered Items
                    </h3>

                    <div className="mb-6 overflow-x-auto rounded-xl border border-[#e0e7e3] dark:border-gray-700">
                        <table className="w-full text-left">
                            <thead className="bg-[#f1f4f9] dark:bg-gray-700">
                                <tr>
                                    <th className="px-4 py-3 text-sm font-semibold text-[#46574e] dark:text-gray-200">
                                        Item
                                    </th>
                                    <th className="px-4 py-3 text-sm font-semibold text-[#46574e] dark:text-gray-200">
                                        Qty
                                    </th>
                                    <th className="px-4 py-3 text-sm font-semibold text-[#46574e] dark:text-gray-200">
                                        Price
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[#edf1ee] dark:divide-gray-700">
                                {(selectedOrder.items || []).map((item, index) => (
                                    <tr key={`${item._id || item.product || item.kit || index}`}>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {item.image && (
                                                    <img
                                                        src={item.image}
                                                        alt={item.title || "Order item"}
                                                        className="h-12 w-12 rounded-lg border border-[#e0e7e3] object-cover dark:border-gray-600"
                                                    />
                                                )}

                                                <div>
                                                    <p className="font-medium text-[#263d32] dark:text-gray-200">
                                                        {item.title || "Item"}
                                                    </p>

                                                    <p className="text-xs capitalize text-[#77847d] dark:text-gray-400">
                                                        {item.itemType || "product"}
                                                    </p>

                                                    {item.itemType === "kit" &&
                                                        item.kitItems?.length > 0 && (
                                                            <p className="mt-1 text-xs text-[#77847d] dark:text-gray-400">
                                                                Contains:{" "}
                                                                {item.kitItems
                                                                    .map((kitItem) => kitItem.title)
                                                                    .filter(Boolean)
                                                                    .join(", ")}
                                                            </p>
                                                        )}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 py-3 text-sm text-[#65756c] dark:text-gray-300">
                                            {item.quantity}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-[#263d32] dark:text-gray-200">
                                            {formatPrice(item.price)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Order price breakdown */}
                    <div className="ml-auto max-w-sm space-y-2 text-sm">
                        <div className="flex justify-between gap-4 text-[#65756c] dark:text-gray-300">
                            <span>Subtotal</span>
                            <span>{formatPrice(selectedOrder.subtotal)}</span>
                        </div>

                        <div className="flex justify-between gap-4 text-[#65756c] dark:text-gray-300">
                            <span>Discount</span>
                            <span>-{formatPrice(selectedOrder.discount)}</span>
                        </div>

                        <div className="flex justify-between gap-4 text-[#65756c] dark:text-gray-300">
                            <span>Shipping Fee</span>
                            <span>{formatPrice(selectedOrder.shippingFee)}</span>
                        </div>

                        <div className="flex justify-between gap-4 border-t border-[#e0e7e3] pt-3 text-base font-bold text-[#263d32] dark:border-gray-700 dark:text-white">
                            <span>Total</span>
                            <span>{formatPrice(selectedOrder.totalAmount)}</span>
                        </div>

                        <div className="pt-2 text-right text-xs text-[#77847d] dark:text-gray-400">
                            Placed on {formatDate(selectedOrder.createdAt)}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            type="button"
                            onClick={() => setSelectedOrder(null)}
                            className="rounded-lg bg-[#436558] px-5 py-2.5 font-medium text-white transition hover:bg-[#354f44]"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
);
}

export default AdminOrders;

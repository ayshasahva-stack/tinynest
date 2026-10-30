
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";

import {
    getMyOrderByIdThunk,
    cancelMyOrderThunk,
} from "../../features/orders/orderThunk";

import {
    selectSelectedOrder,
    selectOrdersLoading,
    selectOrdersError,
} from "../../features/orders/orderSelectors";

import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import OrderStatusTimeline from "./components/OrderStatusTimeline";
import socket from "../../realtime/socket";

// Format currency consistently throughout the page.
const formatPrice = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

// Convert order status to a customer-friendly label.
const getStatusLabel = (status = "pending") =>
    status.charAt(0).toUpperCase() + status.slice(1);

// Choose a badge color based on the real order status.
const getStatusClasses = (status) => {
    const styles = {
        pending: "bg-[#f7e1a9] text-[#6d5d31]",
        confirmed: "bg-[#dcece4] text-[#315e4d]",
        processing: "bg-[#dcece4] text-[#315e4d]",
        shipped: "bg-[#dcece4] text-[#315e4d]",
        delivered: "bg-[#c5ebda] text-[#2b4d41]",
        cancelled: "bg-[#ffdad6] text-[#93000a]",
    };

    return styles[status] || "bg-[#ebeef3] text-[#414845]";
};

// Reusable card heading in the TinyNest style.
function SectionHeading({ eyebrow, children }) {
    return (
        <div className="mb-5">
            {eyebrow && (
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#436558]">
                    {eyebrow}
                </p>
            )}

            <h2 className="font-serif text-2xl font-normal text-[#181c20] dark:text-white">
                {children}
            </h2>
        </div>
    );
}

// Reusable row for order totals and payment information.
function SummaryRow({ label, value, valueClass = "" }) {
    return (
        <div className="flex items-start justify-between gap-4 text-sm">
            <span className="text-[#626c68] dark:text-gray-400">
                {label}
            </span>

            <span
                className={`text-right font-medium text-[#181c20] dark:text-white ${valueClass}`}
            >
                {value}
            </span>
        </div>
    );
}

function OrderDetails() {
    const { orderId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const order = useSelector(selectSelectedOrder);
    const loading = useSelector(selectOrdersLoading);
    const error = useSelector(selectOrdersError);

    const cancellingOrder = useSelector(
        (state) => state.orders.cancellingOrder
    );

    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [cancelMessage, setCancelMessage] = useState("");
    const [cancelMessageType, setCancelMessageType] = useState("");

    // Load the requested order from the existing backend API.
    useEffect(() => {
        if (orderId) {
            dispatch(getMyOrderByIdThunk(orderId));
        }
    }, [dispatch, orderId]);

    // Keep the page updated when the backend emits an order status change.
    useEffect(() => {
        const handleOrderStatusUpdate = (data) => {
            if (String(data.orderId) === String(orderId)) {
                dispatch(getMyOrderByIdThunk(orderId));
            }
        };

        socket.on("order:statusUpdated", handleOrderStatusUpdate);

        return () => {
            socket.off("order:statusUpdated", handleOrderStatusUpdate);
        };
    }, [dispatch, orderId]);

    // Use the existing cancellation thunk and backend rules.
    const handleCancelOrder = async () => {
        if (!["pending", "confirmed"].includes(order?.status)) {
            return;
        }

        try {
            setCancelMessage("");
            await dispatch(cancelMyOrderThunk(orderId)).unwrap();

            setShowCancelConfirm(false);
            setCancelMessage("Your order has been cancelled successfully.");
            setCancelMessageType("success");

            // Refresh the order so the page displays the latest status.
            await dispatch(getMyOrderByIdThunk(orderId));
        } catch (err) {
            setCancelMessage(
                typeof err === "string"
                    ? err
                    : "Unable to cancel this order. Please try again."
            );
            setCancelMessageType("error");
        }
    };

    // Loading state.
    if (loading) {
        return (
            <main className="min-h-screen bg-[#f7f9ff] px-4 py-10 dark:bg-gray-950">
                <div className="mx-auto max-w-7xl">
                    <Loading />
                </div>
            </main>
        );
    }

    // API error state.
    if (error) {
        return (
            <main className="min-h-screen bg-[#f7f9ff] px-4 py-10 dark:bg-gray-950">
                <div className="mx-auto max-w-7xl">
                    <ErrorMessage message={error} />

                    <button
                        type="button"
                        onClick={() => navigate("/orders")}
                        className="mt-5 rounded-lg bg-[#436558] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#315447]"
                    >
                        Back to My Orders
                    </button>
                </div>
            </main>
        );
    }

    // Handle a missing order.
    if (!order) {
        return (
            <main className="min-h-screen bg-[#f7f9ff] px-4 py-10 dark:bg-gray-950">
                <div className="mx-auto max-w-7xl rounded-xl bg-white p-8 dark:bg-gray-900">
                    <h1 className="font-serif text-3xl text-[#181c20] dark:text-white">
                        Order not found
                    </h1>

                    <p className="mt-2 text-sm text-[#626c68] dark:text-gray-400">
                        This order may no longer be available.
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/orders")}
                        className="mt-5 rounded-lg bg-[#436558] px-5 py-3 text-sm font-semibold text-white hover:bg-[#315447]"
                    >
                        Back to My Orders
                    </button>
                </div>
            </main>
        );
    }

    const shippingAddress = order.shippingAddress || {};
    const payment = order.paymentDetails;
    const isCancelled = order.status === "cancelled";
    const canCancel = ["pending", "confirmed"].includes(order.status);

    return (
        <main className="min-h-screen bg-[#f7f9ff] px-4 pb-12 pt-6 text-[#181c20] dark:bg-gray-950 dark:text-gray-100 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-[1400px]">

                {/* Breadcrumb navigation. */}
                <nav
                    aria-label="Breadcrumb"
                    className="mb-5 flex flex-wrap items-center gap-2 text-xs text-[#626c68] dark:text-gray-400"
                >
                    <Link to="/" className="hover:text-[#436558]">
                        Home
                    </Link>
                    <span>/</span>
                    <Link to="/orders" className="hover:text-[#436558]">
                        My Account
                    </Link>
                    <span>/</span>
                    <Link to="/orders" className="hover:text-[#436558]">
                        Orders
                    </Link>
                    <span>/</span>
                    <span className="font-medium text-[#436558]">
                        #{String(order._id).slice(-8).toUpperCase()}
                    </span>
                </nav>

                {/* Order heading and primary actions. */}
                <header className="mb-6 rounded-xl bg-gradient-to-r from-white via-[#f1f4f9] to-[#e5f4ed] p-5 dark:from-gray-900 dark:via-gray-900 dark:to-emerald-950/30 sm:p-7 lg:p-8">
                    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                        <div>
                            <div className="mb-3 flex flex-wrap items-center gap-2">
                                <span
                                    className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide ${getStatusClasses(order.status)}`}
                                >
                                    {getStatusLabel(order.status)}
                                </span>

                                <span className="text-xs text-[#626c68] dark:text-gray-400">
                                    TinyNest order
                                </span>
                            </div>

                            <h1 className="font-serif text-4xl font-normal tracking-tight text-[#181c20] dark:text-white sm:text-5xl">
                                Order Details
                            </h1>

                            <p className="mt-3 break-all text-sm text-[#626c68] dark:text-gray-400">
                                Order ID: #{order._id}
                            </p>

                            <p className="mt-1 text-xs text-[#626c68] dark:text-gray-400">
                                Placed on{" "}
                                {new Date(order.createdAt).toLocaleString(
                                    "en-IN",
                                    {
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                    }
                                )}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => navigate("/orders")}
                            className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-[#c1c8c3] bg-white px-4 py-2.5 text-sm font-semibold text-[#436558] transition hover:bg-[#e5f4ed] dark:border-gray-700 dark:bg-gray-900 dark:text-emerald-300 md:self-auto"
                        >
                            <span aria-hidden="true">←</span>
                            Back to My Orders
                        </button>
                    </div>
                </header>

                {/* Horizontal order progress, styled in the same palette. */}
                <div className="mb-6">
                    <OrderStatusTimeline status={order.status} />
                </div>

                {/* Customer cancellation feedback. */}
                {cancelMessage && (
                    <div
                        role="status"
                        className={`mb-6 rounded-lg p-4 text-sm ${
                            cancelMessageType === "success"
                                ? "bg-[#e5f4ed] text-[#315e4d] dark:bg-emerald-950 dark:text-emerald-200"
                                : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-200"
                        }`}
                    >
                        {cancelMessage}
                    </div>
                )}

                {/* Main two-column layout. */}
                <div className="grid items-start gap-6 lg:grid-cols-12">

                    {/* Left column: items, delivery, cancellation. */}
                    <div className="space-y-6 lg:col-span-8">

                        {/* Ordered products and kits. */}
                        <section className="rounded-xl bg-white p-5 shadow-[0_2px_10px_rgba(24,28,32,0.035)] dark:bg-gray-900 sm:p-6">
                            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#edf0f5] pb-4 dark:border-gray-800">
                                <SectionHeading eyebrow="Your TinyNest package">
                                    Items in this order
                                </SectionHeading>

                                <span className="mb-5 rounded-full bg-[#f1f4f9] px-3 py-1.5 text-[10px] font-semibold text-[#414845] dark:bg-gray-800 dark:text-gray-300">
                                    {order.items.length}{" "}
                                    {order.items.length === 1 ? "item" : "items"}
                                </span>
                            </div>

                            <div className="divide-y divide-[#edf0f5] dark:divide-gray-800">
                                {order.items.map((item, index) => {
                                    const isKit = item.itemType === "kit";
                                    const kit = item.kit;
                                    const quantity = Number(item.quantity || 0);
                                    const price = Number(item.price || 0);
                                    const originalPrice = isKit
                                        ? Number(kit?.price || 0)
                                        : 0;
                                    const kitDiscount = isKit
                                        ? Number(kit?.discount || 0)
                                        : 0;

                                    return (
                                        <article
                                            key={`${order._id}-${index}`}
                                            className="flex flex-col gap-4 py-5 first:pt-5 sm:flex-row"
                                        >
                                            {/* Product image. */}
                                            <div className="h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-[#f1f4f9] dark:bg-gray-800">
                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        alt={item.title || "Ordered item"}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center px-2 text-center text-xs text-[#717974]">
                                                        Image unavailable
                                                    </div>
                                                )}
                                            </div>

                                            {/* Item details. */}
                                            <div className="min-w-0 flex-1">
                                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                                    {isKit && (
                                                        <span className="rounded-full bg-[#f7e1a9] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#6d5d31]">
                                                            Baby Kit
                                                        </span>
                                                    )}

                                                    <span className="text-[10px] uppercase tracking-wide text-[#717974]">
                                                        Qty: {quantity}
                                                    </span>
                                                </div>

                                                <h3 className="font-serif text-xl leading-7 text-[#181c20] dark:text-white">
                                                    {item.title}
                                                </h3>

                                                <p className="mt-2 text-sm text-[#626c68] dark:text-gray-400">
                                                    {formatPrice(price)} each
                                                </p>

                                                {isKit && kitDiscount > 0 && (
                                                    <p className="mt-2 text-xs font-medium text-[#436558] dark:text-emerald-300">
                                                        {kitDiscount}% kit discount
                                                        {originalPrice > 0 && (
                                                            <>
                                                                {" "}· Original price{" "}
                                                                {formatPrice(originalPrice)}
                                                            </>
                                                        )}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Item total. */}
                                            <div className="shrink-0 sm:text-right">
                                                <p className="text-[10px] uppercase tracking-wide text-[#717974]">
                                                    Item total
                                                </p>

                                                <p className="mt-1 text-lg font-semibold text-[#181c20] dark:text-white">
                                                    {formatPrice(price * quantity)}
                                                </p>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Delivery address. */}
                        <section className="rounded-xl bg-white p-5 shadow-[0_2px_10px_rgba(24,28,32,0.035)] dark:bg-gray-900 sm:p-6">
                            <div className="mb-5 flex items-start justify-between gap-3">
                                <SectionHeading eyebrow="Shipping information">
                                    Delivery Address
                                </SectionHeading>

                                <span className="rounded-full bg-[#e5f4ed] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#315e4d] dark:bg-emerald-950 dark:text-emerald-200">
                                    Delivery
                                </span>
                            </div>

                            <div className="rounded-lg bg-[#f1f4f9] p-4 dark:bg-gray-800 sm:p-5">
                                <p className="font-semibold text-[#181c20] dark:text-white">
                                    {shippingAddress.fullName || "Recipient"}
                                </p>

                                <p className="mt-2 text-sm leading-6 text-[#414845] dark:text-gray-300">
                                    {shippingAddress.addressLine}
                                </p>

                                <p className="text-sm leading-6 text-[#414845] dark:text-gray-300">
                                    {[
                                        shippingAddress.city,
                                        shippingAddress.state,
                                        shippingAddress.postalCode,
                                    ]
                                        .filter(Boolean)
                                        .join(", ")}
                                </p>

                                {shippingAddress.country && (
                                    <p className="text-sm text-[#414845] dark:text-gray-300">
                                        {shippingAddress.country}
                                    </p>
                                )}

                                {shippingAddress.phone && (
                                    <p className="mt-4 border-t border-[#dce2e8] pt-3 text-sm text-[#436558] dark:border-gray-700 dark:text-emerald-300">
                                        Phone: {shippingAddress.phone}
                                    </p>
                                )}
                            </div>
                        </section>

                        {/* Cancellation controls remain subject to backend rules. */}
                        {canCancel && (
                            <section className="rounded-xl border border-[#edf0f5] bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
                                <SectionHeading eyebrow="Order management">
                                    Need to cancel?
                                </SectionHeading>

                                <p className="text-sm leading-6 text-[#626c68] dark:text-gray-400">
                                    You can request cancellation while your order is pending or confirmed. The server checks the current order and payment state before processing your request.
                                </p>

                                {!showCancelConfirm ? (
                                    <button
                                        type="button"
                                        disabled={cancellingOrder}
                                        onClick={() => setShowCancelConfirm(true)}
                                        className="mt-4 rounded-lg border border-[#c1c8c3] px-4 py-2.5 text-sm font-semibold text-[#7d5543] transition hover:bg-[#f8eeec] disabled:opacity-50 dark:border-gray-700 dark:text-[#e0b8a7]"
                                    >
                                        Cancel Order
                                    </button>
                                ) : (
                                    <div className="mt-4 rounded-lg bg-[#f8eeec] p-4 dark:bg-[#382925]">
                                        <p className="text-sm text-[#7d5543] dark:text-[#e0b8a7]">
                                            Are you sure you want to cancel this order?
                                        </p>

                                        <div className="mt-4 flex flex-wrap gap-3">
                                            <button
                                                type="button"
                                                disabled={cancellingOrder}
                                                onClick={handleCancelOrder}
                                                className="rounded-lg bg-[#7d5543] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#623e2d] disabled:opacity-50"
                                            >
                                                {cancellingOrder
                                                    ? "Cancelling..."
                                                    : "Confirm Cancellation"}
                                            </button>

                                            <button
                                                type="button"
                                                disabled={cancellingOrder}
                                                onClick={() => setShowCancelConfirm(false)}
                                                className="rounded-lg border border-[#c1c8c3] bg-white px-4 py-2.5 text-sm font-semibold text-[#414845] hover:bg-[#f1f4f9] disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                                            >
                                                Keep Order
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* Order cancellation confirmation. */}
                        {isCancelled && (
                            <section className="rounded-xl bg-[#ffdad6] p-5 text-[#93000a] dark:bg-red-950 dark:text-red-200">
                                <h2 className="font-semibold">
                                    This order has been cancelled
                                </h2>
                                <p className="mt-1 text-sm">
                                    The current order status is cancelled.
                                </p>
                            </section>
                        )}
                    </div>

                    {/* Right column: summary and payment. */}
                    <aside className="space-y-6 lg:sticky lg:top-28 lg:col-span-4">

                        {/* Order summary. */}
                        <section className="overflow-hidden rounded-xl bg-white shadow-[0_2px_10px_rgba(24,28,32,0.035)] dark:bg-gray-900">
                            <div className="bg-[#f1f4f9] p-5 dark:bg-gray-800">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#626c68] dark:text-gray-400">
                                    Payment overview
                                </p>

                                <h2 className="mt-2 font-serif text-2xl text-[#181c20] dark:text-white">
                                    Order Summary
                                </h2>
                            </div>

                            <div className="space-y-4 p-5">
                                <SummaryRow
                                    label="Subtotal"
                                    value={formatPrice(order.subtotal)}
                                />

                                <SummaryRow
                                    label="Coupon Discount"
                                    value={
                                        Number(order.discount) > 0
                                            ? `− ${formatPrice(order.discount)}`
                                            : formatPrice(0)
                                    }
                                    valueClass={
                                        Number(order.discount) > 0
                                            ? "text-[#436558] dark:text-emerald-300"
                                            : ""
                                    }
                                />

                                <SummaryRow
                                    label="Shipping"
                                    value={
                                        Number(order.shippingFee) === 0
                                            ? "Free"
                                            : formatPrice(order.shippingFee)
                                    }
                                    valueClass={
                                        Number(order.shippingFee) === 0
                                            ? "text-[#436558] dark:text-emerald-300"
                                            : ""
                                    }
                                />

                                <div className="border-t border-[#edf0f5] pt-4 dark:border-gray-800">
                                    <div className="flex items-end justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-[#181c20] dark:text-white">
                                                Total Paid
                                            </p>
                                            <p className="mt-1 text-[10px] text-[#717974]">
                                                Final order amount
                                            </p>
                                        </div>

                                        <p className="font-serif text-2xl font-semibold text-[#436558] dark:text-emerald-300">
                                            {formatPrice(order.totalAmount)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Payment information. */}
                        <section className="rounded-xl bg-white p-5 shadow-[0_2px_10px_rgba(24,28,32,0.035)] dark:bg-gray-900">
                            <SectionHeading eyebrow="Transaction information">
                                Payment Details
                            </SectionHeading>

                            <div className="space-y-4">
                                <SummaryRow
                                    label="Method"
                                    value={
                                        payment?.paymentMethod === "cod"
                                            ? "Cash on Delivery"
                                            : payment?.paymentMethod === "online"
                                                ? "Razorpay"
                                                : "Not available"
                                    }
                                />

                                <div className="flex items-center justify-between gap-3 text-sm">
                                    <span className="text-[#626c68] dark:text-gray-400">
                                        Payment Status
                                    </span>

                                    {payment ? (
                                        <span
                                            className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                                                payment.status === "paid"
                                                    ? "bg-[#c5ebda] text-[#2b4d41]"
                                                    : payment.status === "pending"
                                                        ? "bg-[#f7e1a9] text-[#6d5d31]"
                                                        : "bg-[#ebeef3] text-[#414845]"
                                            }`}
                                        >
                                            {payment.status}
                                        </span>
                                    ) : (
                                        <span className="text-xs text-[#717974]">
                                            No payment record
                                        </span>
                                    )}
                                </div>

                                {payment?.transactionId && (
                                    <div className="border-t border-[#edf0f5] pt-4 dark:border-gray-800">
                                        <p className="text-xs text-[#626c68] dark:text-gray-400">
                                            Transaction ID
                                        </p>
                                        <p className="mt-1 break-all text-xs font-medium text-[#181c20] dark:text-white">
                                            {payment.transactionId}
                                        </p>
                                    </div>
                                )}

                                {payment?.paymentMethod === "cod" &&
                                    payment.status === "pending" && (
                                        <p className="rounded-lg bg-[#f1f4f9] p-3 text-xs leading-5 text-[#626c68] dark:bg-gray-800 dark:text-gray-300">
                                            Payment is due when your order is delivered.
                                        </p>
                                    )}
                            </div>
                        </section>

                        {/* Customer reassurance panel. */}
                        <section className="rounded-xl bg-gradient-to-br from-[#e5f4ed] to-[#f1f4f9] p-5 dark:from-emerald-950/50 dark:to-gray-900">
                            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#436558] dark:text-emerald-300">
                                The TinyNest Promise
                            </p>

                            <h2 className="mt-2 font-serif text-xl text-[#181c20] dark:text-white">
                                Little things, lots of love.
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-[#626c68] dark:text-gray-300">
                                We want every TinyNest order to make caring for your little one feel a little easier.
                            </p>

                            <Link
                                to="/orders"
                                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#436558] hover:text-[#315447] dark:text-emerald-300"
                            >
                                View all orders
                                <span aria-hidden="true">→</span>
                            </Link>
                        </section>
                    </aside>
                </div>
            </div>
        </main>
    );
}

export default OrderDetails;

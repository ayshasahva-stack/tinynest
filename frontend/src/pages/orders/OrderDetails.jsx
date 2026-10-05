// Import React's useEffect hook
import { useEffect } from "react";

// Import Redux hooks
import { useDispatch, useSelector } from "react-redux";

// Import React Router hooks
import { useNavigate, useParams } from "react-router-dom";

// Import order thunk
import { getMyOrderByIdThunk } from "../../features/orders/orderThunk";

// Import order selectors
import {
    selectSelectedOrder,
    selectOrdersLoading,
    selectOrdersError,
} from "../../features/orders/orderSelectors";

// Import reusable components
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

// Import order status timeline component
import OrderStatusTimeline from "./components/OrderStatusTimeline";

function OrderDetails() {
    // Get order ID from the URL
    const { orderId } = useParams();

    // Redux dispatch function
    const dispatch = useDispatch();

    // Navigation function
    const navigate = useNavigate();

    // Get selected order from Redux
    const order = useSelector(selectSelectedOrder);

    // Get loading state
    const loading = useSelector(selectOrdersLoading);

    // Get error state
    const error = useSelector(selectOrdersError);

    // Fetch the order when the order ID changes
    useEffect(() => {
        if (orderId) {
            dispatch(getMyOrderByIdThunk(orderId));
        }
    }, [dispatch, orderId]);

    // Show loading state
    if (loading) {
        return (
            <main className="mx-auto max-w-6xl px-4 py-10">
                <Loading />
            </main>
        );
    }

    // Show error
    if (error) {
        return (
            <main className="mx-auto max-w-6xl px-4 py-10">
                <ErrorMessage message={error} />

                <button
                    type="button"
                    onClick={() => navigate("/orders")}
                    className="mt-6 rounded-lg bg-gray-900 px-5 py-3 font-medium text-white dark:bg-white dark:text-gray-900"
                >
                    Back to Orders
                </button>
            </main>
        );
    }

    // Show message if order doesn't exist
    if (!order) {
        return (
            <main className="mx-auto max-w-6xl px-4 py-10">
                <p className="text-gray-600 dark:text-gray-400">
                    Order not found.
                </p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-900">
            <div className="mx-auto max-w-6xl">

                {/* Back button */}
                <button
                    type="button"
                    onClick={() => navigate("/orders")}
                    className="mb-6 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                    ← Back to Orders
                </button>

                {/* Page heading */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Order Details
                    </h1>

                    <p className="mt-2 break-all text-sm text-gray-500 dark:text-gray-400">
                        Order #{order._id}
                    </p>
                </div>

                {/* Order date and current status */}
                <section className="mb-6 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        {/* Order date */}
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Order Date
                            </p>

                            <p className="mt-1 font-medium text-gray-900 dark:text-white">
                                {new Date(
                                    order.createdAt
                                ).toLocaleDateString()}
                            </p>
                        </div>

                        {/* Current order status */}
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Status
                            </p>

                            <span className="mt-1 inline-block rounded-full bg-yellow-100 px-4 py-1.5 text-sm font-semibold capitalize text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                                {order.status}
                            </span>
                        </div>

                    </div>
                </section>

                {/* Order status timeline */}
                <div className="mb-6">
                    <OrderStatusTimeline
                        status={order.status}
                    />
                </div>

                {/* Main order information */}
                <div className="grid gap-6 lg:grid-cols-3">

                    {/* Ordered products */}
                    <section className="rounded-xl bg-white p-6 shadow-sm lg:col-span-2 dark:bg-gray-800">

                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Ordered Items
                        </h2>

                        <div className="mt-6 space-y-5">

                            {order.items.map((item, index) => (
                                <div
                                    key={`${order._id}-${index}`}
                                    className="flex gap-4 border-b border-gray-200 pb-5 last:border-0 last:pb-0 dark:border-gray-700"
                                >

                                    {/* Product image */}
                                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">

                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-xs text-gray-500">
                                                No image
                                            </div>
                                        )}

                                    </div>

                                    {/* Product information */}
                                    <div className="min-w-0 flex-1">

                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {item.title}
                                        </h3>

                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            Quantity: {item.quantity}
                                        </p>

                                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                            ₹{item.price} each
                                        </p>

                                    </div>

                                    {/* Item total */}
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        ₹{(
                                            item.price *
                                            item.quantity
                                        ).toFixed(2)}
                                    </p>

                                </div>
                            ))}

                        </div>
                    </section>

                    {/* Right side information */}
                    <aside className="space-y-6">

                        {/* Order summary */}
                        <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">

                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Order Summary
                            </h2>

                            <div className="mt-6 space-y-3">

                                {/* Subtotal */}
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        Subtotal
                                    </span>

                                    <span className="font-medium text-gray-900 dark:text-white">
                                        ₹{order.subtotal.toFixed(2)}
                                    </span>
                                </div>

                                {/* Discount */}
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        Discount
                                    </span>

                                    <span className="font-medium text-green-600">
                                        - ₹{order.discount.toFixed(2)}
                                    </span>
                                </div>

                                {/* Shipping */}
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        Shipping
                                    </span>

                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {order.shippingFee === 0
                                            ? "Free"
                                            : `₹${order.shippingFee.toFixed(2)}`}
                                    </span>
                                </div>

                                {/* Total */}
                                <div className="flex justify-between border-t border-gray-200 pt-4 text-lg font-bold dark:border-gray-700">

                                    <span className="text-gray-900 dark:text-white">
                                        Total
                                    </span>

                                    <span className="text-gray-900 dark:text-white">
                                        ₹{order.totalAmount.toFixed(2)}
                                    </span>

                                </div>

                            </div>
                        </section>

                        {/* Delivery address */}
                        <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">

                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Delivery Address
                            </h2>

                            <div className="mt-4 space-y-1 text-sm text-gray-600 dark:text-gray-400">

                                {/* Name */}
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {order.shippingAddress.fullName}
                                </p>

                                {/* Phone */}
                                <p>
                                    {order.shippingAddress.phone}
                                </p>

                                {/* Address */}
                                <p>
                                    {order.shippingAddress.addressLine}
                                </p>

                                {/* City and state */}
                                <p>
                                    {order.shippingAddress.city},{" "}
                                    {order.shippingAddress.state}
                                </p>

                                {/* Postal code */}
                                <p>
                                    {order.shippingAddress.postalCode}
                                </p>

                                {/* Country */}
                                <p>
                                    {order.shippingAddress.country}
                                </p>

                            </div>
                        </section>

                    </aside>
                </div>
            </div>
        </main>
    );
}

export default OrderDetails;
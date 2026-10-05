// Import React's useEffect hook
import { useEffect } from "react";

// Import Redux hooks
import { useDispatch, useSelector } from "react-redux";

// Import React Router navigation
import { useNavigate } from "react-router-dom";

// Import Orders thunk
import { getMyOrdersThunk } from "../../features/orders/orderThunk";

// Import Orders selectors
import {
    selectOrders,
    selectOrdersLoading,
    selectOrdersError,
} from "../../features/orders/orderSelectors";

// Import reusable components
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import ErrorMessage from "../../components/ErrorMessage";

function Orders() {
    // Redux dispatch function
    const dispatch = useDispatch();

    // Navigation function
    const navigate = useNavigate();

    // Get orders from Redux
    const orders = useSelector(selectOrders);

    // Get loading state
    const loading = useSelector(selectOrdersLoading);

    // Get error state
    const error = useSelector(selectOrdersError);

    // Fetch the user's orders when the page loads
    useEffect(() => {
        dispatch(getMyOrdersThunk());
    }, [dispatch]);

    // Show loading state
    if (loading) {
        return (
            <main className="mx-auto max-w-7xl px-4 py-10">
                <Loading />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-900">
            <div className="mx-auto max-w-6xl">

                {/* Page heading */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        My Orders
                    </h1>

                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        View your recent orders and track their status.
                    </p>
                </div>

                {/* Error message */}
                {error && (
                    <ErrorMessage message={error} />
                )}

                {/* Empty orders */}
                {!error && orders.length === 0 && (
                    <EmptyState
                        title="No orders yet"
                        message="You haven't placed any orders yet."
                    />
                )}

                {/* Orders list */}
                {!error && orders.length > 0 && (
                    <div className="space-y-6">

                        {orders.map((order) => (
                            <article
                                key={order._id}
                                className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800"
                            >

                                {/* Order header */}
                                <div className="flex flex-col gap-4 border-b border-gray-200 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-700">

                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Order ID
                                        </p>

                                        <p className="mt-1 break-all font-medium text-gray-900 dark:text-white">
                                            #{order._id}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Date
                                        </p>

                                        <p className="mt-1 text-gray-900 dark:text-white">
                                            {new Date(
                                                order.createdAt
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>

                                    {/* Order status */}
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Status
                                        </p>

                                        <span className="mt-1 inline-block rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium capitalize text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Order items */}
                                <div className="mt-5 space-y-4">

                                    {order.items.map((item, index) => (
                                        <div
                                            key={`${order._id}-${index}`}
                                            className="flex gap-4"
                                        >

                                            {/* Product image */}
                                            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
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
                                                <h2 className="font-medium text-gray-900 dark:text-white">
                                                    {item.title}
                                                </h2>

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

                                {/* Order footer */}
                                <div className="mt-6 flex flex-col gap-4 border-t border-gray-200 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-gray-700">

                                    <div>
                                        <span className="text-gray-600 dark:text-gray-400">
                                            Total:
                                        </span>

                                        <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                                            ₹{order.totalAmount.toFixed(2)}
                                        </span>
                                    </div>

                                    {/* View order details */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                `/orders/${order._id}`
                                            )
                                        }
                                        className="rounded-lg bg-gray-900 px-5 py-2.5 font-medium text-white transition hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

export default Orders;
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

// Import order status timeline
import OrderStatusTimeline from "./components/OrderStatusTimeline";


// Order details page
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


    // ================================================
    // FETCH ORDER
    // ================================================

    useEffect(() => {

        if (orderId) {
            dispatch(getMyOrderByIdThunk(orderId));
        }

    }, [dispatch, orderId]);


    // ================================================
    // LOADING STATE
    // ================================================

    if (loading) {

        return (
            <main className="mx-auto max-w-6xl px-4 py-10">
                <Loading />
            </main>
        );

    }


    // ================================================
    // ERROR STATE
    // ================================================

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


    // ================================================
    // ORDER NOT FOUND
    // ================================================

    if (!order) {

        return (
            <main className="mx-auto max-w-6xl px-4 py-10">

                <p className="text-gray-600 dark:text-gray-400">
                    Order not found.
                </p>

            </main>
        );

    }


    // ================================================
    // PAGE
    // ================================================

    return (

        <main className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-900">

            <div className="mx-auto max-w-6xl">


                {/* ======================================== */}
                {/* BACK BUTTON */}
                {/* ======================================== */}

                <button
                    type="button"
                    onClick={() => navigate("/orders")}
                    className="mb-6 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                    ← Back to Orders
                </button>


                {/* ======================================== */}
                {/* PAGE HEADING */}
                {/* ======================================== */}

                <div className="mb-8">

                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Order Details
                    </h1>

                    <p className="mt-2 break-all text-sm text-gray-500 dark:text-gray-400">
                        Order #{order._id}
                    </p>

                </div>


                {/* ======================================== */}
                {/* ORDER DATE + STATUS */}
                {/* ======================================== */}

                <section className="mb-6 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">

                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

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


                        {/* Current status */}
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


                {/* ======================================== */}
                {/* ORDER STATUS TIMELINE */}
                {/* ======================================== */}

                <div className="mb-6">

                    <OrderStatusTimeline
                        status={order.status}
                    />

                </div>


                {/* ======================================== */}
                {/* MAIN CONTENT */}
                {/* ======================================== */}

                <div className="grid gap-6 lg:grid-cols-3">


                    {/* ==================================== */}
                    {/* ORDERED ITEMS */}
                    {/* ==================================== */}

                    <section className="rounded-xl bg-white p-6 shadow-sm lg:col-span-2 dark:bg-gray-800">

                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Ordered Items
                        </h2>


                        <div className="mt-6 space-y-5">

                            {order.items.map((item, index) => {

                                // Check whether this is a kit
                                const isKit =
                                    item.itemType === "kit";


                                // Get the populated kit
                                const kit = item.kit;


                                // Calculate kit discount
                                let originalPrice = null;
                                let savedAmount = 0;
                                let discountPercentage = 0;


                                if (
                                    isKit &&
                                    kit
                                ) {

                                    originalPrice =
                                        Number(kit.price);

                                    discountPercentage =
                                        Number(kit.discount || 0);

                                    savedAmount =
                                        (
                                            originalPrice *
                                            discountPercentage
                                        ) / 100;

                                }


                                return (

                                    <div
                                        key={`${order._id}-${index}`}
                                        className="flex flex-col gap-4 border-b border-gray-200 pb-5 last:border-0 last:pb-0 sm:flex-row dark:border-gray-700"
                                    >


                                        {/* ================================= */}
                                        {/* ITEM IMAGE */}
                                        {/* ================================= */}

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


                                        {/* ================================= */}
                                        {/* ITEM INFORMATION */}
                                        {/* ================================= */}

                                        <div className="min-w-0 flex-1">

                                            {/* Item type */}
                                            {isKit && (

                                                <span className="mb-2 inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                                                    Kit
                                                </span>

                                            )}


                                            {/* Item title */}
                                            <h3 className="font-semibold capitalize text-gray-900 dark:text-white">
                                                {item.title}
                                            </h3>


                                            {/* Quantity */}
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                Quantity: {item.quantity}
                                            </p>


                                            {/* ================================= */}
                                            {/* KIT PRICE DETAILS */}
                                            {/* ================================= */}

                                            {isKit && kit ? (

                                                <div className="mt-2">

                                                    <div className="flex flex-wrap items-center gap-2">

                                                        {/* Final price */}
                                                        <span className="font-semibold text-gray-900 dark:text-white">
                                                            ₹{Number(
                                                                item.price
                                                            ).toFixed(2)}
                                                        </span>


                                                        {/* Original price */}
                                                        {discountPercentage > 0 && (

                                                            <span className="text-sm text-gray-400 line-through">
                                                                ₹{originalPrice.toFixed(2)}
                                                            </span>

                                                        )}


                                                        {/* Discount percentage */}
                                                        {discountPercentage > 0 && (

                                                            <span className="text-sm font-medium text-green-600">
                                                                {discountPercentage}% OFF
                                                            </span>

                                                        )}

                                                    </div>


                                                    {/* Amount saved */}
                                                    {discountPercentage > 0 && (

                                                        <p className="mt-1 text-sm text-green-600">
                                                            You save ₹{savedAmount.toFixed(2)}
                                                        </p>

                                                    )}

                                                </div>

                                            ) : (

                                                /* ================================= */
                                                /* PRODUCT PRICE */
                                                /* ================================= */

                                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                                    ₹{Number(
                                                        item.price
                                                    ).toFixed(2)} each
                                                </p>

                                            )}

                                        </div>


                                        {/* ================================= */}
                                        {/* ITEM TOTAL */}
                                        {/* ================================= */}

                                        <div className="font-semibold text-gray-900 dark:text-white">

                                            ₹{(
                                                Number(item.price) *
                                                item.quantity
                                            ).toFixed(2)}

                                        </div>

                                    </div>

                                );

                            })}

                        </div>

                    </section>


                    {/* ==================================== */}
                    {/* RIGHT SIDEBAR */}
                    {/* ==================================== */}

                    <aside className="space-y-6">


                        {/* ================================= */}
                        {/* ORDER SUMMARY */}
                        {/* ================================= */}

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
                                        ₹{Number(
                                            order.subtotal
                                        ).toFixed(2)}
                                    </span>

                                </div>


                                {/* Coupon discount */}
                                <div className="flex justify-between text-sm">

                                    <span className="text-gray-600 dark:text-gray-400">
                                        Coupon Discount
                                    </span>

                                    <span className="font-medium text-green-600">

                                        {Number(order.discount) > 0
                                            ? `- ₹${Number(
                                                order.discount
                                            ).toFixed(2)}`
                                            : "₹0.00"
                                        }

                                    </span>

                                </div>


                                {/* Explanation when there is no coupon */}
                                {Number(order.discount) === 0 && (

                                    <p className="text-xs text-gray-500 dark:text-gray-400">

                                        Product and kit discounts are already
                                        included in the item prices.

                                    </p>

                                )}


                                {/* Shipping */}
                                <div className="flex justify-between text-sm">

                                    <span className="text-gray-600 dark:text-gray-400">
                                        Shipping
                                    </span>

                                    <span className="font-medium text-gray-900 dark:text-white">

                                        {Number(
                                            order.shippingFee
                                        ) === 0

                                            ? "Free"

                                            : `₹${Number(
                                                order.shippingFee
                                            ).toFixed(2)}`

                                        }

                                    </span>

                                </div>


                                {/* Total */}
                                <div className="flex justify-between border-t border-gray-200 pt-4 text-lg font-bold dark:border-gray-700">

                                    <span className="text-gray-900 dark:text-white">
                                        Total
                                    </span>

                                    <span className="text-gray-900 dark:text-white">
                                        ₹{Number(
                                            order.totalAmount
                                        ).toFixed(2)}
                                    </span>

                                </div>

                            </div>

                        </section>


                        {/* ================================= */}
                        {/* DELIVERY ADDRESS */}
                        {/* ================================= */}

                        <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">

                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Delivery Address
                            </h2>


                            <div className="mt-4 space-y-1 text-sm text-gray-600 dark:text-gray-400">

                                <p className="font-medium text-gray-900 dark:text-white">
                                    {order.shippingAddress.fullName}
                                </p>

                                <p>
                                    {order.shippingAddress.phone}
                                </p>

                                <p>
                                    {order.shippingAddress.addressLine}
                                </p>

                                <p>
                                    {order.shippingAddress.city},{" "}
                                    {order.shippingAddress.state}
                                </p>

                                <p>
                                    {order.shippingAddress.postalCode}
                                </p>

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
// Import React hooks
import { useEffect, useState } from "react";

// Import Redux hooks
import { useDispatch, useSelector } from "react-redux";

// Import React Router navigation
import { Link, useNavigate } from "react-router-dom";

// Import cart thunk
import { getMyCartThunk } from "../../features/cart/cartThunk";

// Import checkout thunk
import { createOrderThunk } from "../../features/checkout/checkoutThunk";

// Import address thunk
import {
    getMyAddressesThunk,
} from "../../features/addresses/addressThunk";

// Import address selector
import {
    selectAddresses,
} from "../../features/addresses/addressSelectors";
import {
    createRazorpayOrderThunk,
    verifyRazorpayPaymentThunk,
    createPaymentThunk,
} from "../../features/payments/paymentThunk";

import {
    selectPaymentLoading,
    selectPaymentError,
} from "../../features/payments/paymentSelectors";
// Import cart selectors
import {
    selectCartItems,
    selectCartLoading,
    selectCartError,
} from "../../features/cart/cartSelectors";

// Import checkout selectors
import {
    selectCheckoutLoading,
    selectCheckoutError,
} from "../../features/checkout/checkoutSelectors";
import { applyCouponThunk } from "../../features/coupons/couponThunk";
// Import reusable components
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import ErrorMessage from "../../components/ErrorMessage";


function Checkout() {
    const [paymentMethod, setPaymentMethod] = useState("online");
    // Tracks whether Razorpay Checkout has loaded successfully
    const [razorpayLoaded, setRazorpayLoaded] = useState(
        () => Boolean(window.Razorpay)
    );
    // Stores the coupon code entered by the customer.
    const [couponCode, setCouponCode] = useState("");
    // Stores the coupon details returned by the backend.
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    // Tracks the Apply Coupon request.
    const [couponLoading, setCouponLoading] = useState(false);

    // Displays coupon-specific error messages.
    const [couponError, setCouponError] = useState("");
    // Redux dispatch function
    const dispatch = useDispatch();

    // Navigation function
    const navigate = useNavigate();


    // -----------------------------------
    // REDUX STATE
    // -----------------------------------

    // Get saved addresses
    const addresses = useSelector(selectAddresses);

    // Get cart items
    const cartItems = useSelector(selectCartItems);

    // Get cart loading state
    const cartLoading = useSelector(selectCartLoading);

    // Get cart error
    const cartError = useSelector(selectCartError);

    // Get checkout loading state
    const checkoutLoading = useSelector(selectCheckoutLoading);

    // Get checkout error
    const checkoutError = useSelector(selectCheckoutError);


    // Selected payment method

    // Payment loading and error states from Redux
    const paymentLoading = useSelector(selectPaymentLoading);
    const paymentError = useSelector(selectPaymentError);
    // -----------------------------------
    // LOCAL STATE
    // -----------------------------------

    // Stores the ID of the selected address
    const [selectedAddressId, setSelectedAddressId] = useState("");

    // Stores frontend validation errors
    const [validationError, setValidationError] = useState("");


    // -----------------------------------
    // FETCH CART + ADDRESSES
    // -----------------------------------

    useEffect(() => {

        // Fetch current cart
        dispatch(getMyCartThunk());

        // Fetch saved addresses
        dispatch(getMyAddressesThunk());

    }, [dispatch]);


    // -----------------------------------
    // SELECT DEFAULT ADDRESS
    // -----------------------------------

    useEffect(() => {

        // If there are no addresses,
        // there is nothing to select.
        if (addresses.length === 0) {
            setSelectedAddressId("");
            return;
        }

        // Find the user's default address
        const defaultAddress = addresses.find(
            (address) => address.isDefault
        );

        // Select the default address.
        // If no default exists, select the first address.
        setSelectedAddressId(
            defaultAddress?._id || addresses[0]._id
        );

    }, [addresses]);


    // -----------------------------------
    // GET SELECTED ADDRESS
    // -----------------------------------

    const selectedAddress = addresses.find(
        (address) => address._id === selectedAddressId
    );





    // -----------------------------------
    // HANDLE ADDRESS SELECTION
    // -----------------------------------

    const handleAddressChange = (event) => {

        setSelectedAddressId(event.target.value);

        // Clear previous validation error
        setValidationError("");

    };



    // -----------------------------------
    // CALCULATE SUBTOTAL
    // -----------------------------------

    // Use the same calculated prices returned by the backend.

    // Calculate subtotal using the same prices returned by the backend.
    const subtotal = cartItems.reduce((total, item) => {
        // Regular products: use the active-offer price.
        if (item.itemType === "product" && item.product) {
            const unitPrice =
                item.pricing?.unitPrice ?? item.product.price;

            return total + unitPrice * item.quantity;
        }

        // Kits: use the calculated kit price when available.
        if (item.itemType === "kit" && item.kit) {
            const unitPrice =
                item.pricing?.unitPrice ??
                (
                    item.kit.price -
                    (item.kit.price * (item.kit.discount || 0)) / 100
                );

            return total + unitPrice * item.quantity;
        }

        // Ignore invalid cart items.
        return total;
    }, 0);



    // -----------------------------------
    // CALCULATE SHIPPING
    // -----------------------------------

    // Backend uses:
    // ₹50 shipping below ₹1000
    // Free shipping for ₹1000 or more
    const shippingFee = subtotal >= 1000 ? 0 : 50;


    // -----------------------------------
    // CALCULATE FINAL TOTAL
    // -----------------------------------

    const totalAmount = subtotal + shippingFee;


    // Use the backend's validated coupon totals when a coupon is applied.
    // Otherwise, show the normal checkout totals.
    const displaySubtotal = appliedCoupon
        ? appliedCoupon.subtotal
        : subtotal;

    const displayDiscount = appliedCoupon
        ? appliedCoupon.discount
        : 0;

    const displayShippingFee = appliedCoupon
        ? appliedCoupon.shippingFee
        : shippingFee;

    const displayTotal = appliedCoupon
        ? appliedCoupon.totalAmount
        : totalAmount;

    /**
     * Validate the entered coupon against the user's current cart.
     */
    const handleApplyCoupon = async () => {
        const code = couponCode.trim().toUpperCase();

        if (!code) {
            setCouponError("Please enter a coupon code.");
            return;
        }

        setCouponLoading(true);
        setCouponError("");
        setValidationError("");

        try {
            // The backend calculates and validates the coupon.
            const result = await dispatch(
                applyCouponThunk(code)
            ).unwrap();

            // Save the validated preview for the price breakdown.
            setAppliedCoupon(result);

            // Keep the input consistent with the applied code.
            setCouponCode(result.code);
        } catch (error) {
            // Do not keep showing an old discount after a failure.
            setAppliedCoupon(null);

            setCouponError(
                typeof error === "string"
                    ? error
                    : "Unable to apply this coupon. Please try again."
            );
        } finally {
            setCouponLoading(false);
        }
    };

    /**
     * Remove the applied coupon and restore normal totals.
     */
    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode("");
        setCouponError("");
    };

    // -----------------------------------
    // HANDLE ORDER SUBMISSION
    // -----------------------------------

    const handleSubmit = async (event) => {
        event.preventDefault();
        setValidationError("");

        if (cartItems.length === 0) {
            setValidationError("Your cart is empty.");
            return;
        }

        if (!selectedAddress) {
            setValidationError("Please select a delivery address.");
            return;
        }

        try {
            // Step 1: Create the order using the existing checkout API.
            // Send the shipping address and optional coupon to the backend.
            const orderResult = await dispatch(
                createOrderThunk({
                    shippingAddress: {
                        fullName: selectedAddress.fullName,
                        phone: selectedAddress.phone,
                        addressLine: selectedAddress.addressLine,
                        city: selectedAddress.city,
                        state: selectedAddress.state,
                        postalCode: selectedAddress.postalCode,
                        country: selectedAddress.country,
                    },

                    // Don't send an empty coupon code.
                    // Only send a coupon that was successfully applied.
                    ...(appliedCoupon && {
                        couponCode: appliedCoupon.code,
                    }),
                })
            ).unwrap();

            const order = orderResult.data;
            const orderId = order?._id;

            if (!orderId) {
                throw new Error("The created order ID was not returned.");
            }
            // The backend clears the cart when the order is created.
            // Fetch the latest cart so the Redux navbar badge updates.
            dispatch(getMyCartThunk());
            // Step 2: Handle Cash on Delivery separately.
            if (paymentMethod === "cod") {
                await dispatch(
                    createPaymentThunk({
                        orderId,
                        paymentMethod: "cod",
                    })
                ).unwrap();

                navigate("/orders");
                return;
            }

            // Step 3: Make sure the Razorpay Checkout script loaded.
            if (!razorpayLoaded || !window.Razorpay) {
                throw new Error(
                    "Razorpay Checkout has not loaded. Please refresh and try again."
                );
            }

            // Step 4: Create a Razorpay order through our backend.
            const razorpayResult = await dispatch(
                createRazorpayOrderThunk(orderId)
            ).unwrap();

            const razorpayOrder = razorpayResult.data;

            // Step 5: Open Razorpay Checkout.
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: "TinyNest",
                description: "Baby essentials order",
                order_id: razorpayOrder.razorpayOrderId,

                handler: async (response) => {
                    try {
                        // Step 6: Verify the payment on the backend.
                        await dispatch(
                            verifyRazorpayPaymentThunk({
                                razorpay_order_id:
                                    response.razorpay_order_id,
                                razorpay_payment_id:
                                    response.razorpay_payment_id,
                                razorpay_signature:
                                    response.razorpay_signature,
                            })
                        ).unwrap();

                        // Navigate only after backend verification succeeds.
                        navigate("/orders");
                    } catch (error) {
                        console.error(
                            "Payment verification failed:",
                            error
                        );

                        setValidationError(
                            typeof error === "string"
                                ? error
                                : "Payment verification failed. Please contact support before retrying."
                        );
                    }
                },

                modal: {
                    ondismiss: () => {
                        setValidationError(
                            "Payment was not completed. Your order remains pending."
                        );
                    },
                },

                theme: {
                    color: "#2563eb",
                },
            };

            const razorpay = new window.Razorpay(options);

            // Display payment failure feedback.
            razorpay.on("payment.failed", (response) => {
                setValidationError(
                    response.error?.description ||
                    "Payment failed. Please try again."
                );
            });

            razorpay.open();
        } catch (error) {
            console.error("Checkout failed:", error);

            setValidationError(
                typeof error === "string"
                    ? error
                    : error.message || "Unable to complete checkout."
            );
        }
    };
    // Load Razorpay Checkout script and track loading status
    useEffect(() => {
        if (window.Razorpay) {
            setRazorpayLoaded(true);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;

        script.onload = () => setRazorpayLoaded(true);
        script.onerror = () => {
            setRazorpayLoaded(false);
            setValidationError(
                "Unable to load Razorpay. Check your internet connection and refresh."
            );
        };

        document.body.appendChild(script);

        return () => {
            // Remove only this script element on unmount
            script.remove();
        };
    }, []);

    // -----------------------------------
    // CART LOADING
    // -----------------------------------

    if (cartLoading && cartItems.length === 0) {
        return <Loading />;
    }


    // -----------------------------------
    // EMPTY CART
    // -----------------------------------

    if (!cartLoading && cartItems.length === 0) {

        return (

            <main className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-900">

                <div className="mx-auto max-w-4xl">

                    <EmptyState
                        title="Your cart is empty"
                        message="Add some products before proceeding to checkout."
                    />

                    <button
                        type="button"
                        onClick={() => navigate("/products")}
                        className="mt-6 rounded-lg bg-gray-900 px-6 py-3 font-medium text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900"
                    >
                        Continue Shopping
                    </button>

                </div>

            </main>

        );
    }


    // -----------------------------------
    // CHECKOUT PAGE
    // -----------------------------------

    return (

        <main className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-900">

            <div className="mx-auto max-w-6xl">

                {/* Page heading */}
                <div className="mb-8">

                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Checkout
                    </h1>

                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Select your delivery address and place your order.
                    </p>

                </div>


                {/* Cart error */}
                {cartError && (
                    <div className="mb-6">
                        <ErrorMessage message={cartError} />
                    </div>
                )}


                {/* Checkout error */}
                {checkoutError && (
                    <div className="mb-6">
                        <ErrorMessage message={checkoutError} />
                    </div>
                )}


                {/* Frontend validation error */}
                {validationError && (

                    <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20">
                        {validationError}
                    </div>

                )}


                <div className="grid gap-8 lg:grid-cols-3">


                    {/* ========================================= */}
                    {/* DELIVERY ADDRESS SECTION */}
                    {/* ========================================= */}

                    <section className="lg:col-span-2">

                        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">

                            {/* Section heading */}
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                                <div>

                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Delivery Address
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Select a saved address for this order.
                                    </p>

                                </div>


                                {/* Manage addresses link */}
                                <Link
                                    to="/addresses"
                                    className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                                >
                                    Manage Addresses
                                </Link>

                            </div>


                            {/* --------------------------------- */}
                            {/* NO SAVED ADDRESSES */}
                            {/* --------------------------------- */}

                            {addresses.length === 0 ? (

                                <div className="mt-6 rounded-lg border border-dashed border-gray-300 p-6 text-center dark:border-gray-600">

                                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                                        You don't have any saved addresses yet.
                                    </p>

                                    <Link
                                        to="/addresses"
                                        className="inline-block rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900"
                                    >
                                        Add Address
                                    </Link>

                                </div>

                            ) : (

                                /* --------------------------------- */
                                /* SAVED ADDRESSES */
                                /* --------------------------------- */

                                <div className="mt-6 space-y-3">

                                    {addresses.map((address) => (

                                        <label
                                            key={address._id}
                                            className={`block cursor-pointer rounded-xl border p-4 transition ${selectedAddressId === address._id
                                                ? "border-blue-600 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20"
                                                : "border-gray-200 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-500"
                                                }`}
                                        >

                                            <div className="flex gap-3">

                                                {/* Radio button */}
                                                <input
                                                    type="radio"
                                                    name="selectedAddress"
                                                    value={address._id}
                                                    checked={
                                                        selectedAddressId === address._id
                                                    }
                                                    onChange={handleAddressChange}
                                                    className="mt-1 h-4 w-4"
                                                />


                                                {/* Address information */}
                                                <div className="flex-1">

                                                    {/* Name + default badge */}
                                                    <div className="flex flex-wrap items-center gap-2">

                                                        <p className="font-semibold text-gray-900 dark:text-white">
                                                            {address.fullName}
                                                        </p>

                                                        {address.isDefault && (

                                                            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                                Default
                                                            </span>

                                                        )}

                                                    </div>


                                                    {/* Address */}
                                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                                        {address.addressLine}
                                                    </p>


                                                    {/* City + State + Postal */}
                                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                                        {address.city}, {address.state} - {address.postalCode}
                                                    </p>


                                                    {/* Country */}
                                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                                        {address.country}
                                                    </p>


                                                    {/* Phone */}
                                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                                        Phone: {address.phone}
                                                    </p>

                                                </div>

                                            </div>

                                        </label>

                                    ))}

                                </div>

                            )}

                        </div>

                    </section>


                    {/* ========================================= */}
                    {/* ORDER SUMMARY */}
                    {/* ========================================= */}

                    <aside>

                        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">

                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Order Summary
                            </h2>

                            {/* Coupon input and application status */}
                            <div className="mt-5 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    Apply Coupon
                                </h3>

                                {appliedCoupon ? (
                                    // Show the successfully applied coupon.
                                    <div className="mt-3">
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <p className="font-medium text-green-700 dark:text-green-400">
                                                    {appliedCoupon.code} applied
                                                </p>

                                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                    You saved ₹{Number(
                                                        appliedCoupon.discount
                                                    ).toFixed(2)}
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={handleRemoveCoupon}
                                                className="text-sm font-medium text-red-600 hover:underline"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // Allow the customer to enter a coupon code.
                                    <div className="mt-3">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={couponCode}
                                                onChange={(event) => {
                                                    setCouponCode(event.target.value);
                                                    setCouponError("");
                                                }}
                                                placeholder="Enter coupon code"
                                                disabled={couponLoading}
                                                className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                                            />

                                            <button
                                                type="button"
                                                onClick={handleApplyCoupon}
                                                disabled={couponLoading || !couponCode.trim()}
                                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {couponLoading ? "Applying..." : "Apply"}
                                            </button>
                                        </div>

                                        {couponError && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {couponError}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>



                            {/* Cart products */}
                            <div className="mt-6 space-y-4">

                                {cartItems.map((item) => {

                                    const product = item.product;

                                    // Skip invalid product
                                    if (!product) {
                                        return null;
                                    }

                                    return (

                                        <div
                                            key={product._id}
                                            className="flex gap-3"
                                        >

                                            {/* Product image */}
                                            <img
                                                src={product.images?.[0]}
                                                alt={product.title}
                                                className="h-16 w-16 rounded-lg object-cover"
                                            />


                                            {/* Product information */}
                                            <div className="min-w-0 flex-1">

                                                <p className="truncate font-medium text-gray-900 dark:text-white">
                                                    {product.title}
                                                </p>

                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Qty: {item.quantity}
                                                </p>

                                            </div>



                                            {/* Item price: show the offer price and original price. */}
                                            <div className="text-right">
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    ₹{(
                                                        (item.pricing?.unitPrice ?? product.price) *
                                                        item.quantity
                                                    ).toFixed(2)}
                                                </p>

                                                {/* Show the original price only when an offer reduces it. */}
                                                {(item.pricing?.unitPrice ?? product.price) <
                                                    product.price && (
                                                        <p className="text-sm text-gray-500 line-through">
                                                            ₹{(product.price * item.quantity).toFixed(2)}
                                                        </p>
                                                    )}

                                                {item.pricing?.discount > 0 && (
                                                    <p className="text-xs text-green-600">
                                                        Save ₹{(
                                                            item.pricing.discount * item.quantity
                                                        ).toFixed(2)}
                                                    </p>
                                                )}
                                            </div>


                                        </div>

                                    );

                                })}

                            </div>



                            {/* Price breakdown */}
                            <div className="mt-6 space-y-3 border-t border-gray-200 pt-6 dark:border-gray-700">

                                {/* Subtotal after any product/kit discounts, before coupon discount */}
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        Subtotal
                                    </span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        ₹{Number(displaySubtotal).toFixed(2)}
                                    </span>
                                </div>

                                {/* Show coupon savings only when a coupon is applied */}
                                {appliedCoupon && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-green-700 dark:text-green-400">
                                            Coupon discount ({appliedCoupon.code})
                                        </span>
                                        <span className="font-medium text-green-700 dark:text-green-400">
                                            -₹{Number(displayDiscount).toFixed(2)}
                                        </span>
                                    </div>
                                )}

                                {/* Shipping fee */}
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        Shipping
                                    </span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {Number(displayShippingFee) === 0
                                            ? "Free"
                                            : `₹${Number(displayShippingFee).toFixed(2)}`}
                                    </span>
                                </div>

                                {/* Final amount payable */}
                                <div className="flex justify-between border-t border-gray-200 pt-3 text-lg font-bold dark:border-gray-700">
                                    <span className="text-gray-900 dark:text-white">
                                        Total
                                    </span>
                                    <span className="text-gray-900 dark:text-white">
                                        ₹{Number(displayTotal).toFixed(2)}
                                    </span>
                                </div>

                            </div>


                            {/* Choose how to pay */}
                            <div className="mt-6 space-y-3">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    Payment Method
                                </h3>

                                <label className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="online"
                                        checked={paymentMethod === "online"}
                                        onChange={(event) => setPaymentMethod(event.target.value)}
                                    />
                                    <span className="text-gray-700 dark:text-gray-200">
                                        Pay online with Razorpay
                                    </span>
                                </label>

                                <label className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cod"
                                        checked={paymentMethod === "cod"}
                                        onChange={(event) => setPaymentMethod(event.target.value)}
                                    />
                                    <span className="text-gray-700 dark:text-gray-200">
                                        Cash on Delivery
                                    </span>
                                </label>
                            </div>

                            {paymentError && (
                                <p className="mt-3 text-sm text-red-600">
                                    {paymentError}
                                </p>
                            )}
                            {/* --------------------------------- */}
                            {/* PLACE ORDER BUTTON */}
                            {/* --------------------------------- */}


                            {/* Place order or start online payment */}
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={checkoutLoading || paymentLoading || !selectedAddress}
                                className="mt-6 w-full rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                            >
                                {checkoutLoading || paymentLoading
                                    ? "Processing..."
                                    : paymentMethod === "cod"
                                        ? "Place Order"
                                        : "Pay Online"}
                            </button>


                        </div>

                    </aside>

                </div>

            </div>

        </main>

    );
}

export default Checkout;
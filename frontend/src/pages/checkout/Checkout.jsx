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
    selectCheckoutSuccess,
} from "../../features/checkout/checkoutSelectors";

// Import reusable components
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import ErrorMessage from "../../components/ErrorMessage";


function Checkout() {

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

    // Check whether order creation succeeded
    const checkoutSuccess = useSelector(selectCheckoutSuccess);


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
    // NAVIGATE AFTER SUCCESSFUL ORDER
    // -----------------------------------

    useEffect(() => {

        if (checkoutSuccess) {
            navigate("/orders");
        }

    }, [checkoutSuccess, navigate]);


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

    const subtotal = cartItems.reduce((total, item) => {

        const product = item.product;

        // Skip invalid cart items
        if (!product) {
            return total;
        }

        // Add product price × quantity
        return total + product.price * item.quantity;

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


    // -----------------------------------
    // HANDLE ORDER SUBMISSION
    // -----------------------------------

    const handleSubmit = async (event) => {

        event.preventDefault();

        // Clear previous validation error
        setValidationError("");


        // -----------------------------------
        // VALIDATE CART
        // -----------------------------------

        if (cartItems.length === 0) {

            setValidationError(
                "Your cart is empty."
            );

            return;
        }


        // -----------------------------------
        // VALIDATE ADDRESS
        // -----------------------------------

        if (!selectedAddress) {

            setValidationError(
                "Please select a delivery address."
            );

            return;
        }


        // -----------------------------------
        // CREATE ORDER
        // -----------------------------------

        try {

            await dispatch(
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
                })
            ).unwrap();

        } catch (error) {

            // Redux stores the backend error.
            console.error(
                "Order creation failed:",
                error
            );

        }
    };


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
                                            className={`block cursor-pointer rounded-xl border p-4 transition ${
                                                selectedAddressId === address._id
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


                                            {/* Item total */}
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                ₹{product.price * item.quantity}
                                            </p>

                                        </div>

                                    );

                                })}

                            </div>


                            {/* Price breakdown */}
                            <div className="mt-6 space-y-3 border-t border-gray-200 pt-6 dark:border-gray-700">

                                {/* Subtotal */}
                                <div className="flex justify-between text-sm">

                                    <span className="text-gray-600 dark:text-gray-400">
                                        Subtotal
                                    </span>

                                    <span className="font-medium text-gray-900 dark:text-white">
                                        ₹{subtotal.toFixed(2)}
                                    </span>

                                </div>


                                {/* Shipping */}
                                <div className="flex justify-between text-sm">

                                    <span className="text-gray-600 dark:text-gray-400">
                                        Shipping
                                    </span>

                                    <span className="font-medium text-gray-900 dark:text-white">

                                        {shippingFee === 0
                                            ? "Free"
                                            : `₹${shippingFee}`}

                                    </span>

                                </div>


                                {/* Total */}
                                <div className="flex justify-between border-t border-gray-200 pt-3 text-lg font-bold dark:border-gray-700">

                                    <span className="text-gray-900 dark:text-white">
                                        Total
                                    </span>

                                    <span className="text-gray-900 dark:text-white">
                                        ₹{totalAmount.toFixed(2)}
                                    </span>

                                </div>

                            </div>


                            {/* --------------------------------- */}
                            {/* PLACE ORDER BUTTON */}
                            {/* --------------------------------- */}

                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={
                                    checkoutLoading ||
                                    addresses.length === 0
                                }
                                className="mt-6 w-full rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                            >

                                {checkoutLoading
                                    ? "Placing Order..."
                                    : "Place Order"}

                            </button>

                        </div>

                    </aside>

                </div>

            </div>

        </main>

    );
}

export default Checkout;
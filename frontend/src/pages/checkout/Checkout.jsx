// Import React hooks
import { useEffect, useState } from "react";

// Import Redux hooks
import { useDispatch, useSelector } from "react-redux";

// Import React Router navigation
import { useNavigate } from "react-router-dom";

// Import cart thunk
import { getMyCartThunk } from "../../features/cart/cartThunk";

// Import checkout thunk
import { createOrderThunk } from "../../features/checkout/checkoutThunk";

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

    // Get cart items from Redux
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

    // Shipping address form state
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        addressLine: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
    });

    // Store frontend validation errors
    const [validationError, setValidationError] = useState("");

    // Fetch the current cart when Checkout loads
    useEffect(() => {
        dispatch(getMyCartThunk());
    }, [dispatch]);

    // Navigate to orders after successful order creation
    useEffect(() => {
        if (checkoutSuccess) {
            navigate("/orders");
        }
    }, [checkoutSuccess, navigate]);

    // Handle input changes
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));

        // Clear previous validation message
        setValidationError("");
    };

    // Calculate subtotal
    const subtotal = cartItems.reduce((total, item) => {
        const product = item.product;

        if (!product) {
            return total;
        }

        return total + product.price * item.quantity;
    }, 0);

    // Calculate shipping fee
    // Backend uses ₹50 shipping below ₹1000
    // and free shipping for orders of ₹1000 or more.
    const shippingFee = subtotal >= 1000 ? 0 : 50;

    // Calculate final total
    const totalAmount = subtotal + shippingFee;

    // Handle order submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Basic frontend validation
        if (
            !formData.fullName.trim() ||
            !formData.phone.trim() ||
            !formData.addressLine.trim() ||
            !formData.city.trim() ||
            !formData.state.trim() ||
            !formData.postalCode.trim() ||
            !formData.country.trim()
        ) {
            setValidationError(
                "Please fill in all shipping address fields."
            );

            return;
        }

        // Make sure the cart contains products
        if (cartItems.length === 0) {
            setValidationError(
                "Your cart is empty."
            );

            return;
        }

        // Send shipping address to backend
        await dispatch(
            createOrderThunk({
                shippingAddress: formData,
            })
        );
    };

    // Show cart loading state
    if (cartLoading && cartItems.length === 0) {
        return <Loading />;
    }

    // Show empty cart
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

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-900">
            <div className="mx-auto max-w-6xl">

                {/* Page heading */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Checkout
                    </h1>

                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Enter your delivery details and place your order.
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

                    {/* Shipping address */}
                    <section className="lg:col-span-2">
                        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">

                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Delivery Address
                            </h2>

                            <form
                                onSubmit={handleSubmit}
                                className="mt-6 space-y-5"
                            >

                                {/* Full name */}
                                <div>
                                    <label
                                        htmlFor="fullName"
                                        className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        Full Name
                                    </label>

                                    <input
                                        id="fullName"
                                        name="fullName"
                                        type="text"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label
                                        htmlFor="phone"
                                        className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        Phone
                                    </label>

                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Enter your phone number"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                {/* Address */}
                                <div>
                                    <label
                                        htmlFor="addressLine"
                                        className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        Address
                                    </label>

                                    <textarea
                                        id="addressLine"
                                        name="addressLine"
                                        value={formData.addressLine}
                                        onChange={handleChange}
                                        placeholder="House number, street, area"
                                        rows="3"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                {/* City and state */}
                                <div className="grid gap-5 sm:grid-cols-2">

                                    <div>
                                        <label
                                            htmlFor="city"
                                            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            City
                                        </label>

                                        <input
                                            id="city"
                                            name="city"
                                            type="text"
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="City"
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="state"
                                            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            State
                                        </label>

                                        <input
                                            id="state"
                                            name="state"
                                            type="text"
                                            value={formData.state}
                                            onChange={handleChange}
                                            placeholder="State"
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                </div>

                                {/* Postal code and country */}
                                <div className="grid gap-5 sm:grid-cols-2">

                                    <div>
                                        <label
                                            htmlFor="postalCode"
                                            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Postal Code
                                        </label>

                                        <input
                                            id="postalCode"
                                            name="postalCode"
                                            type="text"
                                            value={formData.postalCode}
                                            onChange={handleChange}
                                            placeholder="Postal code"
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="country"
                                            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Country
                                        </label>

                                        <input
                                            id="country"
                                            name="country"
                                            type="text"
                                            value={formData.country}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                </div>

                                {/* Place order button */}
                                <button
                                    type="submit"
                                    disabled={checkoutLoading}
                                    className="w-full rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                                >
                                    {checkoutLoading
                                        ? "Placing Order..."
                                        : "Place Order"}
                                </button>
                            </form>
                        </div>
                    </section>

                    {/* Order summary */}
                    <aside>
                        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">

                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Order Summary
                            </h2>

                            {/* Cart products */}
                            <div className="mt-6 space-y-4">
                                {cartItems.map((item) => {
                                    const product = item.product;

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

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        Subtotal
                                    </span>

                                    <span className="font-medium text-gray-900 dark:text-white">
                                        ₹{subtotal}
                                    </span>
                                </div>

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

                                <div className="flex justify-between border-t border-gray-200 pt-3 text-lg font-bold dark:border-gray-700">
                                    <span className="text-gray-900 dark:text-white">
                                        Total
                                    </span>

                                    <span className="text-gray-900 dark:text-white">
                                        ₹{totalAmount}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}

export default Checkout;
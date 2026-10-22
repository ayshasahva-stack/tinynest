
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
    getMyCartThunk,
    clearCartThunk,
} from "../../features/cart/cartThunk";

import {
    selectCartItems,
    selectCartLoading,
    selectCartError,
} from "../../features/cart/cartSelectors";

import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import ErrorMessage from "../../components/ErrorMessage";
import CartItem from "./components/CartItem";

function Cart() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Read cart data and request status from Redux.
    const items = useSelector(selectCartItems);
    const loading = useSelector(selectCartLoading);
    const error = useSelector(selectCartError);

    // Fetch the logged-in customer's cart when the page opens.
    useEffect(() => {
        dispatch(getMyCartThunk());
    }, [dispatch]);

    // Calculate discounted prices consistently for products and kits.
    const getSellingPrice = (item) => {
        const entry =
            item.itemType === "kit" ? item.kit : item.product;

        if (!entry) return 0;

        const price = Number(entry.price) || 0;
        const discount = Number(entry.discount) || 0;

        return Math.max(0, price - (price * discount) / 100);
    };

    // Subtotal is the sum of discounted item prices.
    const subtotal = items.reduce((total, item) => {
        return total + getSellingPrice(item) * item.quantity;
    }, 0);

    // Calculate total savings against original prices.
    const totalSavings = items.reduce((total, item) => {
        const entry =
            item.itemType === "kit" ? item.kit : item.product;

        if (!entry) return total;

        const originalPrice = Number(entry.price) || 0;
        const sellingPrice = getSellingPrice(item);

        return total + (originalPrice - sellingPrice) * item.quantity;
    }, 0);

    // Count individual units rather than distinct cart rows.
    const itemCount = items.reduce(
        (total, item) => total + (Number(item.quantity) || 0),
        0
    );

    // Keep the existing clear-cart Redux action.
    const handleClearCart = () => {
        dispatch(clearCartThunk());
    };

    return (
        <main className="min-h-screen bg-[#f7f9ff] px-4 py-8 text-[#181c20] dark:bg-gray-950 dark:text-white sm:px-6 lg:px-8 lg:py-12">
            <div className="mx-auto max-w-7xl">

                {/* Breadcrumb and item count */}
                <nav
                    aria-label="Breadcrumb"
                    className="mb-7 flex flex-wrap items-center gap-2 text-sm text-[#626c68] dark:text-gray-400"
                >
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="transition hover:text-[#436558]"
                    >
                        Home
                    </button>

                    <span aria-hidden="true">/</span>

                    <span className="font-medium text-[#181c20] dark:text-white">
                        Shopping Bag
                    </span>

                    {!loading && !error && (
                        <span className="rounded-full bg-[#dce7e2] px-2.5 py-1 text-xs font-medium text-[#436558] dark:bg-gray-800 dark:text-emerald-200">
                            {itemCount} {itemCount === 1 ? "Item" : "Items"}
                        </span>
                    )}
                </nav>

                {/* Loading state */}
                {loading && <Loading />}

                {/* Error state */}
                {!loading && error && (
                    <ErrorMessage
                        title="Unable to load cart"
                        message={error}
                    />
                )}

                {/* Empty cart */}
                {!loading && !error && items.length === 0 && (
                    <section className="rounded-3xl bg-white px-5 py-12 text-center shadow-sm dark:bg-gray-900 sm:py-16">
                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#dce7e2] text-3xl text-[#436558] dark:bg-gray-800">
                            ♡
                        </div>

                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8b6048]">
                            Little things, lots of love
                        </p>

                        <h1 className="font-serif text-3xl text-[#181c20] dark:text-white">
                            Your nursery bag is empty
                        </h1>

                        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#626c68] dark:text-gray-400">
                            Discover thoughtful essentials for your little
                            one and add your favourites to your bag.
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate("/products")}
                            className="mt-7 rounded-full bg-[#436558] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#315447] focus:outline-none focus:ring-2 focus:ring-[#436558] focus:ring-offset-2"
                        >
                            Explore Essentials
                        </button>
                    </section>
                )}

                {/* Shopping bag and order summary */}
                {!loading && !error && items.length > 0 && (
                    <>
                        <header className="mb-7">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8b6048]">
                                Little things, lots of love
                            </p>

                            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                                <div>
                                    <h1 className="font-serif text-4xl font-normal tracking-tight text-[#181c20] dark:text-white sm:text-5xl">
                                        Your Nursery Bag
                                    </h1>

                                    <p className="mt-2 text-sm text-[#626c68] dark:text-gray-400">
                                        A little collection of essentials
                                        for your little one.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleClearCart}
                                    className="self-start text-sm font-medium text-[#626c68] underline decoration-[#c8d0cb] underline-offset-4 transition hover:text-red-600 sm:self-auto dark:text-gray-400"
                                >
                                    Clear bag
                                </button>
                            </div>
                        </header>

                        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_350px] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_390px]">

                            {/* Cart item cards */}
                            <section
                                aria-label="Items in your shopping bag"
                                className="min-w-0 space-y-4"
                            >
                                {items.map((item, index) => (
                                    <CartItem
                                        key={
                                            item.itemType === "kit"
                                                ? `kit-${item.kit?._id || item.kit}`
                                                : `product-${item.product?._id || item.product}`
                                        }
                                        item={item}
                                        index={index}
                                    />
                                ))}

                                {/* Brand reassurance panel */}
                                <div className="grid grid-cols-1 gap-4 rounded-2xl bg-[#f1f4f9] p-5 dark:bg-gray-900 sm:grid-cols-3">
                                    <div className="flex items-start gap-3">
                                        <span
                                            className="text-xl text-[#436558]"
                                            aria-hidden="true"
                                        >
                                            ♧
                                        </span>

                                        <div>
                                            <p className="text-xs font-semibold text-[#181c20] dark:text-white">
                                                Thoughtful essentials
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-[#626c68] dark:text-gray-400">
                                                Chosen for little ones
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <span
                                            className="text-xl text-[#8b6048]"
                                            aria-hidden="true"
                                        >
                                            ◇
                                        </span>

                                        <div>
                                            <p className="text-xs font-semibold text-[#181c20] dark:text-white">
                                                Simple shopping
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-[#626c68] dark:text-gray-400">
                                                Manage your bag with ease
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <span
                                            className="text-xl text-[#436558]"
                                            aria-hidden="true"
                                        >
                                            ♡
                                        </span>

                                        <div>
                                            <p className="text-xs font-semibold text-[#181c20] dark:text-white">
                                                Made for your family
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-[#626c68] dark:text-gray-400">
                                                Little things matter
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Order summary */}
                            <aside className="lg:sticky lg:top-6">
                                <div className="rounded-3xl bg-white p-5 shadow-[0_4px_24px_-8px_rgba(43,47,51,0.12)] dark:bg-gray-900 dark:ring-1 dark:ring-gray-800 sm:p-6">
                                    <div className="flex items-center justify-between border-b border-[#edf0f5] pb-4 dark:border-gray-800">
                                        <h2 className="font-serif text-2xl text-[#181c20] dark:text-white">
                                            Order Summary
                                        </h2>

                                        <span
                                            className="text-lg text-[#436558]"
                                            aria-hidden="true"
                                        >
                                            ♧
                                        </span>
                                    </div>

                                    <div className="mt-5 space-y-4 text-sm">
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-[#626c68] dark:text-gray-400">
                                                Items ({itemCount})
                                            </span>

                                            <span className="font-medium">
                                                ₹{subtotal.toFixed(2)}
                                            </span>
                                        </div>

                                        {totalSavings > 0 && (
                                            <div className="flex items-center justify-between gap-4">
                                                <span className="text-[#626c68] dark:text-gray-400">
                                                    You save
                                                </span>

                                                <span className="font-medium text-[#436558] dark:text-[#a9cfbe]">
                                                    −₹{totalSavings.toFixed(2)}
                                                </span>
                                            </div>
                                        )}

                                        <p className="text-xs leading-5 text-[#626c68] dark:text-gray-400">
                                            Delivery charges and any applicable
                                            taxes will be calculated according
                                            to your checkout details.
                                        </p>
                                    </div>

                                    <div className="my-5 border-t border-[#e5e9e6] dark:border-gray-800" />

                                    <div className="flex items-end justify-between gap-3">
                                        <div>
                                            <p className="font-serif text-xl text-[#181c20] dark:text-white">
                                                Total
                                            </p>

                                            <p className="mt-1 text-xs text-[#626c68] dark:text-gray-400">
                                                Before checkout charges
                                            </p>
                                        </div>

                                        <p className="font-serif text-3xl font-medium tracking-tight text-[#436558] dark:text-[#a9cfbe]">
                                            ₹{subtotal.toFixed(2)}
                                        </p>
                                    </div>

                                    {totalSavings > 0 && (
                                        <p className="mt-4 rounded-xl bg-[#dce7e2] px-3 py-2.5 text-center text-xs font-medium text-[#315447] dark:bg-emerald-950 dark:text-emerald-200">
                                            You saved ₹{totalSavings.toFixed(2)} on this order.
                                        </p>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => navigate("/checkout")}
                                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#436558] px-5 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#315447] focus:outline-none focus:ring-2 focus:ring-[#436558] focus:ring-offset-2"
                                    >
                                        <span aria-hidden="true">♧</span>
                                        Proceed to Checkout
                                        <span aria-hidden="true">→</span>
                                    </button>

                                    <p className="mt-4 text-center text-xs leading-5 text-[#626c68] dark:text-gray-400">
                                        Your order details will be confirmed
                                        during checkout.
                                    </p>
                                </div>
                            </aside>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}

export default Cart;

// Import React's useEffect hook
import { useEffect } from "react";

// Import Redux hooks
import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
// Import cart thunk
import {
    getMyCartThunk,
    clearCartThunk,
} from "../../features/cart/cartThunk";

// Import cart selectors
import {
    selectCartItems,
    selectCartLoading,
    selectCartError,
} from "../../features/cart/cartSelectors";

// Import reusable components
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import ErrorMessage from "../../components/ErrorMessage";

// Import cart item component
import CartItem from "./components/CartItem";

// Cart page component
function Cart() {
    // Get the Redux dispatch function
    const dispatch = useDispatch();
const navigate = useNavigate();
    // Get cart items from Redux
    const items = useSelector(selectCartItems);

    // Get cart loading state
    const loading = useSelector(selectCartLoading);

    // Get cart error
    const error = useSelector(selectCartError);

    // Fetch the user's cart when the page loads
    useEffect(() => {
        dispatch(getMyCartThunk());
    }, [dispatch]);

    // Calculate the total price
    const totalPrice = items.reduce((total, item) => {
        // Only calculate product items for now
        if (item.itemType !== "product" || !item.product) {
            return total;
        }

        return total + item.product.price * item.quantity;
    }, 0);

    // Clear the cart
    const handleClearCart = () => {
        dispatch(clearCartThunk());
    };

    return (
        <main className="mx-auto max-w-5xl px-4 py-10">
            {/* Page heading */}
            <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
                Your Cart
            </h1>

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
                <EmptyState
                    title="Your cart is empty"
                    message="Add some products to your cart to get started."
                />
            )}

            {/* Cart items */}
            {!loading && !error && items.length > 0 && (
                <>
                    <section>
                        {items.map((item) => (
                            <CartItem
                                key={
                                    item.product?._id ||
                                    item.kit?._id
                                }
                                item={item}
                            />
                        ))}
                    </section>

                    {/* Cart summary */}
                    <section className="mt-8 flex flex-col items-start justify-between gap-5 border-t border-gray-200 pt-6 sm:flex-row sm:items-center dark:border-gray-700">
                        <button
                            type="button"
                            onClick={handleClearCart}
                            className="text-sm font-medium text-red-600 hover:text-red-700"
                        >
                            Clear Cart
                        </button>

                        <div className="text-right">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Total
                            </p>

                            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                                ₹{totalPrice}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate("/checkout")}
                            className="mt-4 w-full rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                        >
                            Proceed to Checkout
                        </button>
                    </section>
                </>
            )}
        </main>
    );
}

export default Cart;
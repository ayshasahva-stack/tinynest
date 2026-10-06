// Import React's useEffect hook
import { useEffect } from "react";

// Import Redux hooks
import {
    useDispatch,
    useSelector,
} from "react-redux";

// Import navigation
import { useNavigate } from "react-router-dom";

// Import cart thunks
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

    // Get Redux dispatch function
    const dispatch = useDispatch();

    // Get navigation function
    const navigate = useNavigate();


    // ------------------------------------------------
    // REDUX STATE
    // ------------------------------------------------

    // Get cart items
    const items = useSelector(selectCartItems);

    // Get cart loading state
    const loading = useSelector(selectCartLoading);

    // Get cart error
    const error = useSelector(selectCartError);


    // ------------------------------------------------
    // FETCH CART
    // ------------------------------------------------

    useEffect(() => {

        // Load the logged-in user's cart
        dispatch(getMyCartThunk());

    }, [dispatch]);


    // Calculate the total price of all cart items
const totalPrice = items.reduce((total, item) => {

    // --------------------------------
    // PRODUCT
    // --------------------------------

    if (
        item.itemType === "product" &&
        item.product
    ) {
        return (
            total +
            item.product.price * item.quantity
        );
    }


    // --------------------------------
    // KIT
    // --------------------------------

    if (
        item.itemType === "kit" &&
        item.kit
    ) {
        // Calculate kit discount
        const discountAmount =
            (item.kit.price * item.kit.discount) / 100;

        // Calculate discounted kit price
        const kitSellingPrice =
            item.kit.price - discountAmount;

        return (
            total +
            kitSellingPrice * item.quantity
        );
    }


    // Ignore invalid items
    return total;

}, 0);

    // ------------------------------------------------
    // CLEAR CART
    // ------------------------------------------------

    const handleClearCart = () => {

        dispatch(clearCartThunk());

    };


    // ------------------------------------------------
    // PAGE
    // ------------------------------------------------

    return (

        <main className="mx-auto max-w-5xl px-4 py-10">


            {/* ======================================== */}
            {/* PAGE HEADING */}
            {/* ======================================== */}

            <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">

                Your Cart

            </h1>


            {/* ======================================== */}
            {/* LOADING */}
            {/* ======================================== */}

            {loading && <Loading />}


            {/* ======================================== */}
            {/* ERROR */}
            {/* ======================================== */}

            {!loading && error && (

                <ErrorMessage
                    title="Unable to load cart"
                    message={error}
                />

            )}


            {/* ======================================== */}
            {/* EMPTY CART */}
            {/* ======================================== */}

            {!loading &&
                !error &&
                items.length === 0 && (

                    <EmptyState
                        title="Your cart is empty"
                        message="Add some products or kits to your cart to get started."
                    />

                )}


            {/* ======================================== */}
            {/* CART CONTENT */}
            {/* ======================================== */}

            {!loading &&
                !error &&
                items.length > 0 && (

                    <>


                        {/* -------------------------------- */}
                        {/* CART ITEMS */}
                        {/* -------------------------------- */}

                        <section>

                            {items.map((item) => (

                                <CartItem
                                    key={
                                        item.itemType === "kit"
                                            ? `kit-${item.kit?._id}`
                                            : `product-${item.product?._id}`
                                    }
                                    item={item}
                                />

                            ))}

                        </section>


                        {/* -------------------------------- */}
                        {/* CART SUMMARY */}
                        {/* -------------------------------- */}

                        <section className="mt-8 flex flex-col gap-5 border-t border-gray-200 pt-6 dark:border-gray-700">


                            {/* ================================= */}
                            {/* SUMMARY ROW */}
                            {/* ================================= */}

                            <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">


                                {/* Clear cart */}
                                <button
                                    type="button"
                                    onClick={handleClearCart}
                                    className="text-sm font-medium text-red-600 hover:text-red-700"
                                >

                                    Clear Cart

                                </button>


                                {/* Total */}
                                <div className="text-right">

                                    <p className="text-sm text-gray-500 dark:text-gray-400">

                                        Total

                                    </p>


                                    <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">

                                        ₹{totalPrice.toFixed(2)}

                                    </p>

                                </div>

                            </div>


                            {/* ================================= */}
                            {/* CHECKOUT BUTTON */}
                            {/* ================================= */}

                            <button
                                type="button"
                                onClick={() => navigate("/checkout")}
                                className="w-full rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
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
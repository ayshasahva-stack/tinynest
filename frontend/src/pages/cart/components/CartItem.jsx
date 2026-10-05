// Import Redux hooks
import { useDispatch } from "react-redux";

// Import cart update and remove thunks
import {
    updateCartQuantityThunk,
    removeFromCartThunk,
} from "../../../features/cart/cartThunk";

// Cart item component
function CartItem({ item }) {
    // Get the Redux dispatch function
    const dispatch = useDispatch();

    // Get the populated product
    const product = item.product;

    // Increase product quantity
    const handleIncrease = () => {
        dispatch(
            updateCartQuantityThunk({
                itemType: "product",
                itemId: product._id,
                quantity: item.quantity + 1,
            })
        );
    };

    // Decrease product quantity
    const handleDecrease = () => {
        // Don't allow quantity below 1
        if (item.quantity <= 1) {
            return;
        }

        dispatch(
            updateCartQuantityThunk({
                itemType: "product",
                itemId: product._id,
                quantity: item.quantity - 1,
            })
        );
    };

    // Remove the product from the cart
    const handleRemove = () => {
        dispatch(
            removeFromCartThunk({
                itemType: "product",
                itemId: product._id,
            })
        );
    };

    return (
        <article className="flex flex-col gap-4 border-b border-gray-200 py-6 sm:flex-row dark:border-gray-700">
            {/* Product image */}
            <div className="h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                {product.images?.length > 0 ? (
                    <img
                        src={product.images[0]}
                        alt={product.title}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-xs text-gray-500">
                        No image
                    </div>
                )}
            </div>

            {/* Product information */}
            <div className="flex flex-1 flex-col justify-between">
                <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">
                        {product.title}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        ₹{product.price}
                    </p>
                </div>

                {/* Quantity and remove controls */}
                <div className="mt-4 flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleDecrease}
                        disabled={item.quantity <= 1}
                        className="h-9 w-9 rounded-lg border border-gray-300 text-lg disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700"
                    >
                        -
                    </button>

                    <span className="min-w-8 text-center font-medium text-gray-900 dark:text-white">
                        {item.quantity}
                    </span>

                    <button
                        type="button"
                        onClick={handleIncrease}
                        disabled={item.quantity >= product.stock}
                        className="h-9 w-9 rounded-lg border border-gray-300 text-lg disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700"
                    >
                        +
                    </button>

                    <button
                        type="button"
                        onClick={handleRemove}
                        className="ml-3 text-sm font-medium text-red-600 hover:text-red-700"
                    >
                        Remove
                    </button>
                </div>
            </div>

            {/* Item total */}
            <div className="font-semibold text-gray-900 dark:text-white">
                ₹{product.price * item.quantity}
            </div>
        </article>
    );
}

export default CartItem;
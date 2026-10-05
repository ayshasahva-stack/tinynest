import { useDispatch } from "react-redux";

import { removeFromWishlistThunk } from "../../../features/wishlist/wishlistThunk";
function WishlistItem({ product }) {
    const dispatch = useDispatch();

    // Remove this product from the wishlist
    const handleRemove = () => {
        dispatch(removeFromWishlistThunk(product._id));
    };

    return (
        <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:flex-row sm:items-center">

            {/* Product image */}
            <img
                src={product.images?.[0]}
                alt={product.title}
                className="h-32 w-full rounded-lg object-cover sm:h-24 sm:w-24"
            />

            {/* Product information */}
            <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {product.title}
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {product.brand}
                </p>

                <p className="mt-2 font-semibold text-gray-900 dark:text-white">
                    ₹{product.price}
                </p>
            </div>

            {/* Remove button */}
            <button
                type="button"
                onClick={handleRemove}
                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
            >
                Remove
            </button>
        </div>
    );
}

export default WishlistItem;    
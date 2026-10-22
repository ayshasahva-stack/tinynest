
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { removeFromWishlistThunk } from "../../../features/wishlist/wishlistThunk";

function WishlistItem({ product }) {
    const dispatch = useDispatch();

    // Remove only this product from the wishlist.
    const handleRemove = () => {
        dispatch(removeFromWishlistThunk(product._id));
    };

    // Use the first product image, with a fallback for older records.
    const image = product.images?.[0] || product.image;
    const title = product.title || "Baby essential";
    const price = Number(product.price) || 0;
    const discount = Number(product.discount) || 0;

    // Calculate the original price when discount is a percentage.
    const originalPrice =
        discount > 0 && discount < 100
            ? price / (1 - discount / 100)
            : null;

    return (
        <article className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#E5E8ED] bg-white p-2.5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md dark:border-gray-700 dark:bg-gray-900">

            {/* Product image and discount badge. */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#F1F4F9] dark:bg-gray-800">
                {image ? (
                    <img
                        src={image}
                        alt={title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        onError={(event) => {
                            // Hide a broken image instead of showing a broken-image icon.
                            event.currentTarget.style.visibility = "hidden";
                        }}
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">
                        No image available
                    </div>
                )}

                 {discount > 0 && (
                    <span className="absolute bottom-2 left-2 rounded-full bg-[#FFC9B2] px-2 py-1 text-[10px] font-bold text-[#7A5240]">
                        SAVE {discount}%
                    </span>
                )}


                {/* Heart button removes the product from the wishlist. */}
                <button
                    type="button"
                    onClick={handleRemove}
                    aria-label={`Remove ${title} from wishlist`}
                    title="Remove from wishlist"
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-lg text-[#436558] shadow-sm transition hover:bg-red-50 hover:text-red-600"
                >
                    ♥
                </button>
            </div>

            {/* Product information follows the kit card layout. */}
            <div className="flex flex-1 flex-col px-1.5 pb-1 pt-3">
                <p className="mb-1 text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {product.brand || "TinyNest Essential"}
                </p>

                <h2 className="line-clamp-2 min-h-10 font-serif text-base font-medium text-[#181C20] dark:text-white">
                    {title}
                </h2>

                <div className="mt-2 flex flex-wrap items-baseline gap-2">
                    <span className="text-sm font-bold text-[#181C20] dark:text-white">
                        ₹{price.toLocaleString("en-IN")}
                    </span>

                    {originalPrice && (
                        <span className="text-xs text-gray-400 line-through">
                            ₹{Math.round(originalPrice).toLocaleString("en-IN")}
                        </span>
                    )}
                </div>

                {/* Keep the action at the bottom of every card. */}
                <div className="mt-auto pt-4">
                    <Link
                        to={`/products/${product._id}`}
                        className="flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#436558] px-3 py-2 text-center text-xs font-semibold text-white transition hover:bg-[#345246]"
                    >
                        View Product <span aria-hidden="true">→</span>
                    </Link>
                </div>
            </div>
        </article>
    );
}

export default WishlistItem;

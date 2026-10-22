
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { addToCartThunk } from "../../../features/cart/cartThunk";

import {
    addToWishlistThunk,
    removeFromWishlistThunk,
} from "../../../features/wishlist/wishlistThunk";

import { selectWishlistProducts } from "../../../features/wishlist/wishlistSelectors";
import { selectIsAuthenticated } from "../../../features/auth/authSelectors";

function ProductCard({ product }) {
    const dispatch = useDispatch();

    // Get the current wishlist and authentication status from Redux.
    const wishlistProducts = useSelector(selectWishlistProducts);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    // Preserve the existing product image and error handling.
    const productImage = product.images?.[0] || product.image;
    const [imageError, setImageError] = useState(false);

    // Track cart request status and errors.
    const [addingToCart, setAddingToCart] = useState(false);
    const [cartError, setCartError] = useState("");
    const [wishlistError, setWishlistError] = useState("");

    const productName = product.title || product.name || "Untitled product";
    const price = Number(product.price) || 0;
    const discount = Math.min(
        100,
        Math.max(0, Number(product.discount) || 0)
    );

    // Match KitCard's discounted-price layout.
    const discountedPrice = price - (price * discount) / 100;

    const formattedPrice = discountedPrice.toLocaleString("en-IN", {
        maximumFractionDigits: 2,
    });

    const formattedOriginalPrice = price.toLocaleString("en-IN", {
        maximumFractionDigits: 2,
    });

    const isOutOfStock = Number(product.stock) <= 0;

    // Support the wishlist's populated product records.
    const isInWishlist = wishlistProducts.some(
        (item) =>
            String(item?._id || item?.product?._id || item?.product || item) ===
            String(product._id)
    );

    // Add one product to the cart without leaving the page.
    const handleAddToCart = async () => {
        if (!isAuthenticated || addingToCart || isOutOfStock) {
            return;
        }

        setAddingToCart(true);
        setCartError("");

        try {
            await dispatch(
                addToCartThunk({
                    itemType: "product",
                    product: product._id,
                    quantity: 1,
                })
            ).unwrap();
        } catch (error) {
            setCartError(
                typeof error === "string"
                    ? error
                    : "Could not add this item. Please try again."
            );
        } finally {
            setAddingToCart(false);
        }
    };

    // Toggle this product in the wishlist.
    const handleWishlistToggle = async () => {
        if (!isAuthenticated) {
            setWishlistError("Please log in to use your wishlist.");
            return;
        }

        setWishlistError("");

        try {
            if (isInWishlist) {
                await dispatch(
                    removeFromWishlistThunk(product._id)
                ).unwrap();
            } else {
                await dispatch(
                    addToWishlistThunk(product._id)
                ).unwrap();
            }
        } catch (error) {
            setWishlistError(
                typeof error === "string"
                    ? error
                    : "Could not update your wishlist. Please try again."
            );
        }
    };

    return (
        <article className="group flex h-full flex-col rounded-2xl border border-[#ECEDE6] bg-white p-2.5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 sm:p-3">

            {/* Same image proportions and rounded corners as KitCard. */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#F1F4F9] dark:bg-gray-800">
                <Link
                    to={`/products/${product._id}`}
                    aria-label={`View ${productName}`}
                    className="block h-full w-full"
                >
                    {productImage && !imageError ? (
                        <img
                            src={productImage}
                            alt={productName}
                            loading="lazy"
                            onError={() => setImageError(true)}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-2 px-3 text-center text-sm text-gray-500 dark:text-gray-400">
                            <span className="text-3xl" aria-hidden="true">
                                ♡
                            </span>
                            <span>Image unavailable</span>
                        </div>
                    )}
                </Link>

                {/* Show the real product discount, matching KitCard's badge. */}
                {discount > 0 && (
                    <span className="absolute left-3 top-3 rounded-full bg-[#FFC9B2] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#623E2D] shadow-sm">
                        {discount}% OFF
                    </span>
                )}

                {/* Retain the actual age-group information when available. */}
                {!discount && product.ageGroup && (
                    <span className="absolute left-3 top-3 max-w-[70%] truncate rounded-full bg-[#E1E9DC] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#405B43] dark:bg-[#344638] dark:text-[#E2EBDD]">
                        {product.ageGroup}
                    </span>
                )}

                {/* Preserve the functional wishlist heart. */}
                <button
                    type="button"
                    onClick={handleWishlistToggle}
                    aria-label={
                        isInWishlist
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                    }
                    aria-pressed={isInWishlist}
                    title={
                        isAuthenticated
                            ? isInWishlist
                                ? "Remove from wishlist"
                                : "Add to wishlist"
                            : "Log in to use your wishlist"
                    }
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-xl text-[#4B6656] shadow-sm transition hover:bg-[#E1E9DC] dark:bg-gray-900/95 dark:text-[#B5D0AC]"
                >
                    {isInWishlist ? "♥" : "♡"}
                </button>
            </div>

            {/* Same details padding and vertical structure as KitCard. */}
            <div className="flex flex-1 flex-col px-1 pb-1 pt-3">

                {/* Brand replaces the kit's collection label. */}
                <p className="mb-1 truncate text-[10px] uppercase tracking-wide text-[#777C75] dark:text-gray-400">
                    {product.brand || "TinyNest Essential"}
                </p>

                {/* Product name uses the same font and height as the kit name. */}
                <Link to={`/products/${product._id}`}>
                    <h2 className="line-clamp-2 min-h-10 font-serif text-base leading-5 text-[#292D29] transition-colors group-hover:text-[#52745C] dark:text-gray-100 dark:group-hover:text-[#B5D0AC]">
                        {productName}
                    </h2>
                </Link>

                {/* Preserve the actual description. */}
                {product.description && (
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#777C75] dark:text-gray-400">
                        {product.description}
                    </p>
                )}

                {/* Keep real ratings, using a consistent reserved row. */}
                <div className="mt-2 flex min-h-[18px] items-center gap-1.5 text-xs text-[#876B3D]">
                    {(Number(product.averageRating ?? product.rating) > 0) && (
                        <>
                            <span aria-hidden="true">★</span>
                            <span>
                                {Number(
                                    product.averageRating ?? product.rating
                                ).toFixed(1)}
                            </span>

                            {Number(product.reviewCount) > 0 && (
                                <span className="text-gray-500 dark:text-gray-400">
                                    ({product.reviewCount})
                                </span>
                            )}
                        </>
                    )}
                </div>

                {/* Match KitCard's bottom-aligned price and action row. */}
                <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                    <div className="flex min-w-0 flex-wrap items-baseline gap-1.5">
                        <span className="font-serif text-lg font-medium text-[#292D29] dark:text-white">
                            ₹{formattedPrice}
                        </span>

                        {discount > 0 && (
                            <span className="text-xs text-gray-400 line-through">
                                ₹{formattedOriginalPrice}
                            </span>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={
                            !isAuthenticated ||
                            addingToCart ||
                            isOutOfStock
                        }
                        className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-[#45695A] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#355346] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#607D5F] dark:hover:bg-[#49634B]"
                    >
                        <span aria-hidden="true">♧</span>
                        {addingToCart
                            ? "Adding..."
                            : isOutOfStock
                                ? "Sold out"
                                : "Add"}
                    </button>
                </div>

                {/* Keep error messages inside the card without breaking its layout. */}
                {cartError && (
                    <p role="alert" className="mt-2 text-xs text-red-600 dark:text-red-400">
                        {cartError}
                    </p>
                )}

                {wishlistError && (
                    <p role="alert" className="mt-2 text-xs text-red-600 dark:text-red-400">
                        {wishlistError}
                    </p>
                )}

                {!isAuthenticated && (
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Log in to add items to your cart or wishlist.
                    </p>
                )}
            </div>
        </article>
    );
}

export default ProductCard;


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

    // Read the current user's wishlist and login status from Redux.
    const wishlistProducts = useSelector(selectWishlistProducts);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    // Use the first product image from TinyNest's existing data.
    const productImage = product.images?.[0];

    // Handle missing or broken image URLs.
    const [imageError, setImageError] = useState(false);

    // Track the Add button's request state and any error.
    const [addingToCart, setAddingToCart] = useState(false);
    const [cartError, setCartError] = useState("");

    const productName = product.title || product.name || "Untitled product";
    const formattedPrice = Number(product.price || 0).toLocaleString("en-IN");

    // Check whether this product already exists in the wishlist.
    const isInWishlist = wishlistProducts.some(
        (item) => (item._id || item.product?._id || item.product) === product._id
    );

    // Add one item to the user's cart without leaving the page.
    const handleAddToCart = async () => {
        if (!isAuthenticated || addingToCart || product.stock <= 0) {
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

    // Add or remove this product using the existing wishlist thunks.
    const handleWishlistToggle = async () => {
        if (!isAuthenticated) {
            return;
        }

        if (isInWishlist) {
            await dispatch(removeFromWishlistThunk(product._id));
        } else {
            await dispatch(addToWishlistThunk(product._id));
        }
    };

    return (
        <article className="group flex h-full flex-col rounded-2xl border border-[#ECEDE6] bg-white p-2.5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 sm:p-3">

            {/* Tall product image with a badge and wishlist button. */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#EEECE3] dark:bg-gray-800">
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
                        <div className="flex h-full items-center justify-center px-4 text-center text-sm text-gray-500 dark:text-gray-400">
                            Image unavailable
                        </div>
                    )}
                </Link>

                {/* Use the real age-group value; don't invent product badges. */}
                {product.ageGroup && (
                    <span className="absolute left-3 top-3 max-w-[70%] truncate rounded-full bg-[#E1E9DC] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#405B43] dark:bg-[#344638] dark:text-[#E2EBDD]">
                        {product.ageGroup}
                    </span>
                )}

                {/* Functional wishlist button styled like the reference. */}
                <button
                    type="button"
                    onClick={handleWishlistToggle}
                    disabled={!isAuthenticated}
                    aria-label={
                        isInWishlist ? "Remove from wishlist" : "Add to wishlist"
                    }
                    aria-pressed={isInWishlist}
                    title={
                        isAuthenticated
                            ? isInWishlist
                                ? "Remove from wishlist"
                                : "Add to wishlist"
                            : "Log in to use your wishlist"
                    }
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-xl text-[#4B6656] shadow-sm transition hover:bg-[#E1E9DC] disabled:cursor-not-allowed disabled:opacity-70 dark:bg-gray-900/95 dark:text-[#B5D0AC]"
                >
                    {isInWishlist ? "♥" : "♡"}
                </button>
            </div>

            {/* Product details and price. */}
            <div className="flex flex-1 flex-col px-1 pb-1 pt-3">

                {/* Display a rating only if TinyNest has real rating data. */}
               
{/* Show a valid rating even if reviewCount is not provided. */}
{(product.averageRating != null || product.rating != null) &&
    Number(product.averageRating ?? product.rating) > 0 && (
        <div className="mb-1.5 flex items-center gap-1.5 text-xs text-[#876B3D]">
            <span aria-hidden="true">★</span>

            <span>
                {Number(
                    product.averageRating ?? product.rating
                ).toFixed(1)}
            </span>

            {/* Display the review count only when it is greater than zero. */}
            {Number(product.reviewCount) > 0 && (
                <span className="text-gray-500 dark:text-gray-400">
                    ({product.reviewCount})
                </span>
            )}
        </div>
    )}


                <Link to={`/products/${product._id}`}>
                    <h3 className="line-clamp-2 min-h-10 font-serif text-base leading-5 text-[#292D29] transition-colors group-hover:text-[#52745C] dark:text-gray-100 dark:group-hover:text-[#B5D0AC]">
                        {productName}
                    </h3>
                </Link>

                {product.description && (
                    <p className="mt-1 line-clamp-1 text-xs leading-5 text-[#777C75] dark:text-gray-400">
                        {product.description}
                    </p>
                )}

                {/* Price on the left and compact Add button on the right. */}
                <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                    <p className="font-serif text-lg font-medium text-[#292D29] dark:text-white">
                        ₹{formattedPrice}
                    </p>

                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={
                            !isAuthenticated ||
                            addingToCart ||
                            product.stock <= 0
                        }
                        className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-[#45695A] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#355346] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#607D5F] dark:hover:bg-[#49634B]"
                    >
                        <span aria-hidden="true">♧</span>
                        {addingToCart
                            ? "Adding..."
                            : product.stock <= 0
                                ? "Sold out"
                                : "Add"}
                    </button>
                </div>

                {/* Show cart errors without replacing the product content. */}
                {cartError && (
                    <p role="alert" className="mt-2 text-xs text-red-600 dark:text-red-400">
                        {cartError}
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

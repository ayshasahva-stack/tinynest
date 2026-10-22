
import { useEffect,useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../features/auth/authSelectors";
import { fetchKitByIdThunk } from "../../features/kits/kitThunk";
import FeaturedProducts from "../home/components/FeaturedProducts"
import {
    selectSelectedKit,
    selectKitLoading,
    selectKitError,
} from "../../features/kits/kitSelectors";
import {
    addKitToWishlistThunk,
    removeKitFromWishlistThunk,
    getMyWishlistThunk,
} from "../../features/wishlist/wishlistThunk"

import { selectWishlistKits } from "../../features/wishlist/wishlistSelectors";
import { addToCartThunk } from "../../features/cart/cartThunk";
import { selectCartLoading } from "../../features/cart/cartSelectors";

import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

// Kit details page styled to match the TinyNest product details page.
function KitDetails() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { kitId } = useParams();

    // Read the selected kit and request status from Redux.
    const kit = useSelector(selectSelectedKit);
    const loading = useSelector(selectKitLoading);
    const error = useSelector(selectKitError);
    const cartLoading = useSelector(selectCartLoading);
// Selected quantity for the kit.
const [quantity, setQuantity] = useState(1);

// Show the actual reason if adding the kit fails.
const [cartError, setCartError] = useState("");

// Check whether the user is logged in.
// Read the saved kits and authentication status from Redux.
const wishlistKits = useSelector(selectWishlistKits);
const isAuthenticated = useSelector(selectIsAuthenticated);

// Display errors if a wishlist request fails.
const [wishlistError, setWishlistError] = useState("");

// Check whether the current kit is already saved.
const isInWishlist = wishlistKits.some(
    (item) => (item?._id || item?.kit?._id || item?.kit || item) === kit?._id
);

// Load the user's wishlist when authenticated.
useEffect(() => {
    if (isAuthenticated) {
        dispatch(getMyWishlistThunk());
    }
}, [dispatch, isAuthenticated]);
    // Fetch the selected kit whenever its URL ID changes.
    useEffect(() => {
        if (kitId) {
            dispatch(fetchKitByIdThunk(kitId));
        }
    }, [dispatch, kitId]);

    // Convert API values safely before calculating the final price.
    const price = Number(kit?.price) || 0;
    const discount = Math.min(
        100,
        Math.max(0, Number(kit?.discount) || 0)
    );

    const finalPrice = price - (price * discount) / 100;

    // The API may return populated products inside kit.items.
    const kitItems = Array.isArray(kit?.items) ? kit.items : [];

    // Format prices using Indian number formatting.
    const formatPrice = (amount) =>
        Number(amount).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
        setWishlistError("Please log in to use your wishlist.");
        return;
    }

    if (!kit?._id) return;

    setWishlistError("");

    try {
        if (isInWishlist) {
            await dispatch(removeKitFromWishlistThunk(kit._id)).unwrap();
        } else {
            await dispatch(addKitToWishlistThunk(kit._id)).unwrap();
        }
    } catch (error) {
        setWishlistError(
            typeof error === "string"
                ? error
                : "Could not update your wishlist. Please try again."
        );
    }
};
    // Add the kit using the existing cart thunk.
   const handleAddToCart = async () => {
    if (!kit || cartLoading) return;

    if (!isAuthenticated) {
        setCartError("Please log in to add this kit to your cart.");
        return;
    }

    setCartError("");

    try {
        // Send the kit ID and selected quantity to the existing cart API.
        await dispatch(
            addToCartThunk({
                itemType: "kit",
                kit: kit._id,
                quantity,
            })
        ).unwrap();

        // Navigate only after the request succeeds.
        navigate("/cart");
    } catch (error) {
        // Display the backend's actual error instead of hiding it.
        setCartError(
            typeof error === "string"
                ? error
                : error?.message || "Could not add this kit. Please try again."
        );
    }
};

    // Loading state.
    if (loading) {
        return (
            <main className="min-h-screen bg-[#F7F9FF] px-4 py-10 dark:bg-gray-950 sm:px-6">
                <div className="mx-auto max-w-6xl">
                    <Loading />
                </div>
            </main>
        );
    }

    // Error state.
    if (error) {
        return (
            <main className="min-h-screen bg-[#F7F9FF] px-4 py-10 dark:bg-gray-950 sm:px-6">
                <div className="mx-auto max-w-6xl">
                    <ErrorMessage
                        title="Unable to load kit"
                        message={error}
                    />
                </div>
            </main>
        );
    }

    // Handle missing kits.
    if (!kit) {
        return (
            <main className="min-h-screen bg-[#F7F9FF] px-4 py-10 dark:bg-gray-950 sm:px-6">
                <div className="mx-auto max-w-6xl">
                    <p className="text-gray-600 dark:text-gray-400">
                        Kit not found.
                    </p>

                    <Link
                        to="/kits"
                        className="mt-4 inline-flex text-sm font-semibold text-[#436558] hover:underline dark:text-[#C5EBDA]"
                    >
                        ← Back to Baby Kits
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#F7F9FF] px-4 py-7 text-[#181C20] transition-colors duration-300 dark:bg-gray-950 dark:text-gray-100 sm:px-6 sm:py-10">

            <div className="mx-auto max-w-6xl">

                {/* Breadcrumb navigation. */}
                <nav
                    aria-label="Breadcrumb"
                    className="mb-7 flex flex-wrap items-center gap-2 text-sm text-[#717974] dark:text-gray-400"
                >
                    <Link
                        to="/"
                        className="transition hover:text-[#436558] dark:hover:text-[#C5EBDA]"
                    >
                        Home
                    </Link>

                    <span>/</span>

                    <Link
                        to="/kits"
                        className="transition hover:text-[#436558] dark:hover:text-[#C5EBDA]"
                    >
                        Baby Kits
                    </Link>

                    <span>/</span>

                    <span className="font-medium capitalize text-[#436558] dark:text-[#C5EBDA]">
                        {kit.name}
                    </span>
                </nav>

                {/* Main kit image and information. */}
                <section className="grid items-start gap-8 md:grid-cols-2 md:gap-10 lg:gap-12">

                    {/* Kit image. */}
                    <div className="overflow-hidden rounded-2xl border border-[#E6EAF0] bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-5">
                        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#F1F4F9] dark:bg-gray-800">
                            {kit.image ? (
                                <img
                                    src={kit.image}
                                    alt={kit.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                                    Image unavailable
                                </div>
                            )}

                            {/* Show the actual discount, if available. */}
                            {discount > 0 && (
                                <span className="absolute left-4 top-4 rounded-full bg-[#FFC9B2] px-3 py-2 text-xs font-semibold text-[#623E2D] shadow-sm">
                                    {discount}% OFF
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Kit information. */}
                    <div className="pt-1">

                        <div className="mb-4 flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-[#C5EBDA] px-3 py-1.5 text-xs font-medium text-[#2B4D41]">
                                Baby Essentials Kit
                            </span>

                            <span className="rounded-full bg-[#F1F4F9] px-3 py-1.5 text-xs text-[#414845] dark:bg-gray-800 dark:text-gray-300">
                                {kitItems.length}{" "}
                                {kitItems.length === 1 ? "included product" : "included products"}
                            </span>
                        </div>

                        <h1 className="font-serif text-3xl font-normal capitalize tracking-tight text-[#181C20] dark:text-white sm:text-4xl lg:text-5xl">
                            {kit.name}
                        </h1>

                        {/* Display the actual kit description. */}
                        {kit.description && (
                            <p className="mt-5 text-[15px] leading-7 text-[#414845] dark:text-gray-300">
                                {kit.description}
                            </p>
                        )}

                        {/* Price and discount information. */}
                        <div className="mt-7 border-y border-[#E0E5E8] py-5 dark:border-gray-800">
                            <div className="flex flex-wrap items-baseline gap-3">
                                <span className="font-serif text-3xl font-normal text-[#436558] dark:text-[#C5EBDA] sm:text-4xl">
                                    ₹{formatPrice(finalPrice)}
                                </span>

                                {discount > 0 && (
                                    <span className="text-base text-[#717974] line-through dark:text-gray-500">
                                        ₹{formatPrice(price)}
                                    </span>
                                )}
                            </div>

                            {discount > 0 && (
                                <p className="mt-2 text-sm font-medium text-[#436558] dark:text-[#C5EBDA]">
                                    You save ₹{formatPrice(price - finalPrice)}
                                </p>
                            )}
                        </div>

                        {/* Existing add-to-cart behavior. */}
                      {/* Quantity selector */}
<div className="mt-6">
    <p className="mb-3 text-sm font-medium text-[#414845] dark:text-gray-300">
        Quantity
    </p>

    <div className="inline-flex items-center rounded-full border border-[#D9E1DC] bg-white dark:border-gray-700 dark:bg-gray-900">
        <button
            type="button"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="h-11 w-11 rounded-full text-lg text-[#436558] disabled:opacity-40 dark:text-[#C5EBDA]"
        >
            −
        </button>

        <span
            aria-live="polite"
            className="min-w-8 text-center text-sm font-semibold"
        >
            {quantity}
        </span>

        <button
            type="button"
            onClick={() => setQuantity((current) => current + 1)}
            aria-label="Increase quantity"
            className="h-11 w-11 rounded-full text-lg text-[#436558] dark:text-[#C5EBDA]"
        >
            +
        </button>
    </div>
</div>

{/* Cart and wishlist actions */}
<div className="mt-5 flex flex-col gap-3 sm:flex-row">
    <button
        type="button"
        onClick={handleAddToCart}
        disabled={cartLoading}
        className="flex min-h-12 flex-1 items-center justify-center rounded-full bg-[#436558] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2B4D41] disabled:cursor-not-allowed disabled:opacity-60"
    >
        {cartLoading ? "Adding to Cart..." : "Add Kit to Cart"}
    </button>

    {/* Wishlist requires backend support for kit items; see below. */}
   
<button
    type="button"
    onClick={handleWishlistToggle}
    aria-pressed={isInWishlist}
    aria-label={
        isInWishlist ? "Remove kit from wishlist" : "Add kit to wishlist"
    }
    className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full border border-[#D9E1DC] bg-white px-5 py-3 text-sm font-medium text-[#436558] transition hover:bg-[#EAF3EE] focus:outline-none focus:ring-2 focus:ring-[#789E8E] dark:border-gray-700 dark:bg-gray-900 dark:text-[#C5EBDA] dark:hover:bg-gray-800"
>
    <span aria-hidden="true" className="text-lg">
        {isInWishlist ? "♥" : "♡"}
    </span>

    {isInWishlist ? "Saved to Wishlist" : "Add to Wishlist"}
</button>
{wishlistError && (
    <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">
        {wishlistError}
    </p>
)}
</div>

{/* Show cart failures visibly */}
{cartError && (
    <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">
        {cartError}
    </p>
)}

                       </div>
                </section>

                {/* Included products section. */}
                <section className="mt-14 sm:mt-20">

                    <div className="mb-7">
                        <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-[#71877D] dark:text-[#C5EBDA]">
                            Inside Your Kit
                        </p>

                        <h2 className="font-serif text-3xl font-normal tracking-tight text-[#181C20] dark:text-white sm:text-4xl">
                            What's Included
                        </h2>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#717974] dark:text-gray-400">
                            Explore the products included in this baby essentials kit.
                        </p>
                    </div>

                    {kitItems.length === 0 ? (
                        <div className="rounded-2xl border border-[#E6EAF0] bg-white p-6 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
                            No included products are available to display.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                            {kitItems.map((item, index) => {
                                const product = item.product;

                                // Skip items whose product data is missing.
                                if (!product) {
                                    return null;
                                }

                                return (
                                    <article
                                        key={product._id || index}
                                        className="flex gap-4 rounded-2xl border border-[#E6EAF0] bg-white p-3 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900 sm:p-4"
                                    >
                                        {/* Included product image. */}
                                        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#F1F4F9] dark:bg-gray-800 sm:h-28 sm:w-28">
                                            {product.images?.[0] ? (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.title || "Included product"}
                                                    loading="lazy"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center px-2 text-center text-xs text-gray-500 dark:text-gray-400">
                                                    Image unavailable
                                                </div>
                                            )}
                                        </div>

                                        {/* Included product details. */}
                                        <div className="flex min-w-0 flex-1 flex-col justify-center">
                                            <h3 className="line-clamp-2 font-serif text-lg leading-snug text-[#292D29] dark:text-white">
                                                {product.title || "Untitled product"}
                                            </h3>

                                            {product.brand && (
                                                <p className="mt-1 text-xs text-[#717974] dark:text-gray-400">
                                                    Brand: {product.brand}
                                                </p>
                                            )}

                                            <p className="mt-2 text-sm font-semibold text-[#436558] dark:text-[#C5EBDA]">
                                                ₹{formatPrice(product.price || 0)}
                                            </p>

                                            <span className="mt-2 self-start rounded-full bg-[#F1F4F9] px-3 py-1 text-xs text-[#414845] dark:bg-gray-800 dark:text-gray-300">
                                                Quantity: {Number(item.quantity) || 1}
                                            </span>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>
                <FeaturedProducts />
            </div>
        </main>
    );
}

export default KitDetails;

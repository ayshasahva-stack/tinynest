
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { selectIsAuthenticated } from "../../features/auth/authSelectors";

import { fetchKitByIdThunk } from "../../features/kits/kitThunk";
import {
    selectSelectedKit,
    selectKitLoading,
    selectKitError,
} from "../../features/kits/kitSelectors";

import {
    addKitToWishlistThunk,
    removeKitFromWishlistThunk,
    getMyWishlistThunk,
} from "../../features/wishlist/wishlistThunk";

import { selectWishlistKits } from "../../features/wishlist/wishlistSelectors";

import { addToCartThunk } from "../../features/cart/cartThunk";
import { selectCartLoading } from "../../features/cart/cartSelectors";

import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import FeaturedProducts from "../home/components/FeaturedProducts";

function KitDetails() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { kitId } = useParams();

    // Read the selected kit and request states from Redux.
    const kit = useSelector(selectSelectedKit);
    const loading = useSelector(selectKitLoading);
    const error = useSelector(selectKitError);
    const cartLoading = useSelector(selectCartLoading);

    // Read authentication and saved kits.
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const wishlistKits = useSelector(selectWishlistKits);

    // Local state for the gallery, quantity, and visible errors.
    const [selectedImage, setSelectedImage] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [cartError, setCartError] = useState("");
    const [wishlistError, setWishlistError] = useState("");

    // Fetch the selected kit whenever its route ID changes.
    useEffect(() => {
        if (kitId) {
            dispatch(fetchKitByIdThunk(kitId));
        }
    }, [dispatch, kitId]);

    // Fetch the user's wishlist when authenticated.
    useEffect(() => {
        if (isAuthenticated) {
            dispatch(getMyWishlistThunk());
        }
    }, [dispatch, isAuthenticated]);

    // Reset gallery and quantity when a different kit loads.
    useEffect(() => {
        setSelectedImage(kit?.image || "");
        setQuantity(1);
    }, [kit?._id, kit?.image]);

    // Convert kit prices safely and calculate the discounted price.
    const price = Number(kit?.price) || 0;
    const discount = Math.min(
        100,
        Math.max(0, Number(kit?.discount) || 0)
    );
    const finalPrice = price - (price * discount) / 100;

    // Kit items may contain populated product objects.
    const kitItems = Array.isArray(kit?.items) ? kit.items : [];

    // Format prices using Indian number formatting.
    const formatPrice = (amount) =>
        Number(amount).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    // Compare IDs as strings to support populated and unpopulated records.
    const isInWishlist = wishlistKits.some((item) => {
        const savedKitId = item?._id || item?.kit?._id || item?.kit || item;
        return String(savedKitId) === String(kit?._id);
    });

    // Add the selected kit quantity to the cart.
    const handleAddToCart = async () => {
        if (!kit?._id || cartLoading) return;

        if (!isAuthenticated) {
            setCartError("Please log in to add this kit to your cart.");
            return;
        }

        setCartError("");

        try {
            await dispatch(
                addToCartThunk({
                    itemType: "kit",
                    kit: kit._id,
                    quantity,
                })
            ).unwrap();

            // Navigate only after the cart request succeeds.
            navigate("/cart");
        } catch (requestError) {
            setCartError(
                typeof requestError === "string"
                    ? requestError
                    : requestError?.message ||
                    "Could not add this kit. Please try again."
            );
        }
    };

    // Add or remove this kit from the user's wishlist.
    const handleWishlistToggle = async () => {
        if (!isAuthenticated) {
            setWishlistError("Please log in to use your wishlist.");
            return;
        }

        if (!kit?._id) return;

        setWishlistError("");

        try {
            if (isInWishlist) {
                await dispatch(
                    removeKitFromWishlistThunk(kit._id)
                ).unwrap();
            } else {
                await dispatch(
                    addKitToWishlistThunk(kit._id)
                ).unwrap();
            }
        } catch (requestError) {
            setWishlistError(
                typeof requestError === "string"
                    ? requestError
                    : "Could not update your wishlist. Please try again."
            );
        }
    };

    // Loading state.
    if (loading) {
        return (
            <main className="min-h-screen bg-[#F7F9FF] px-4 py-10 dark:bg-gray-950 sm:px-6">
                <div className="mx-auto max-w-[1240px]">
                    <Loading />
                </div>
            </main>
        );
    }

    // Error state.
    if (error) {
        return (
            <main className="min-h-screen bg-[#F7F9FF] px-4 py-10 dark:bg-gray-950 sm:px-6">
                <div className="mx-auto max-w-[1240px]">
                    <ErrorMessage
                        title="Unable to load kit"
                        message={error}
                    />
                </div>
            </main>
        );
    }

    // Missing-kit state.
    if (!kit) {
        return (
            <main className="min-h-screen bg-[#F7F9FF] px-4 py-10 dark:bg-gray-950 sm:px-6">
                <div className="mx-auto max-w-[1240px]">
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
        <main className="min-h-screen bg-[#F7F9FF] px-4 py-7 text-[#181C20] transition-colors dark:bg-gray-950 dark:text-gray-100 sm:px-6 lg:py-10">
            <div className="mx-auto max-w-[1240px]">

                {/* Breadcrumb spacing and typography match ProductDetails. */}
                <nav
                    aria-label="Breadcrumb"
                    className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[#414845] dark:text-gray-400"
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

                    <span className="font-semibold text-[#436558] dark:text-[#C5EBDA]">
                        {kit.name}
                    </span>
                </nav>

                {/* Main layout: gallery on the left, kit information on the right. */}
                <section className="grid grid-cols-1 items-start gap-7 lg:grid-cols-12 lg:gap-10">

                    {/* Kit image gallery — same proportions and spacing as products. */}
                    <div className="lg:col-span-6">
                        <div className="relative flex min-h-[350px] items-center justify-center sm:min-h-[500px]">
                            {discount > 0 && (
                                <span className="absolute left-4 top-4 z-10 rounded-full bg-[#FFC9B2] px-3 py-2 text-xs font-semibold text-[#623E2D]">
                                    {discount}% OFF
                                </span>
                            )}

                            {selectedImage ? (
                                <img
                                    src={selectedImage}
                                    alt={kit.name}
                                    className="max-h-[520px] w-full object-contain"
                                    onError={() => setSelectedImage("")}
                                />
                            ) : (
                                <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 text-center text-[#717974] dark:text-gray-400">
                                    <span className="text-4xl" aria-hidden="true">
                                        ♡
                                    </span>
                                    <p>Kit image coming soon</p>
                                </div>
                            )}
                        </div>

                        {/* Show a thumbnail only if the kit actually has extra images. */}
                        {Array.isArray(kit.images) && kit.images.length > 1 && (
                            <div className="mt-4 flex flex-wrap gap-3">
                                {kit.images.map((image, index) => (
                                    <button
                                        key={`${image}-${index}`}
                                        type="button"
                                        onClick={() => setSelectedImage(image)}
                                        aria-label={`View kit image ${index + 1}`}
                                        aria-pressed={selectedImage === image}
                                        className={`h-[76px] w-[76px] overflow-hidden rounded-xl border-2 bg-white p-1 transition dark:bg-gray-900 ${selectedImage === image
                                                ? "border-[#436558] ring-2 ring-[#C5EBDA]"
                                                : "border-[#E0E3E8] hover:border-[#7A9E8F] dark:border-gray-700"
                                            }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${kit.name}, view ${index + 1}`}
                                            className="h-full w-full rounded-lg object-contain"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Same compact information-card styling as ProductDetails. */}
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <div className="rounded-xl bg-[#F1F4F9] p-4 dark:bg-gray-900">
                                <p className="font-semibold text-[#436558] dark:text-[#C5EBDA]">
                                    Baby essentials
                                </p>
                                <p className="mt-1 text-xs leading-5 text-[#414845] dark:text-gray-400">
                                    A curated collection for your little one.
                                </p>
                            </div>

                            <div className="rounded-xl bg-[#F1F4F9] p-4 dark:bg-gray-900">
                                <p className="font-semibold text-[#436558] dark:text-[#C5EBDA]">
                                    Explore more
                                </p>
                                <p className="mt-1 text-xs leading-5 text-[#414845] dark:text-gray-400">
                                    Browse our other baby essentials kits.
                                </p>
                                <Link
                                    to="/kits"
                                    className="mt-1 inline-block text-xs font-semibold text-[#436558] underline underline-offset-4 dark:text-[#C5EBDA]"
                                >
                                    Browse kits
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Kit information and purchase actions. */}
                    <div className="flex flex-col py-2 lg:col-span-6 lg:pt-4">

                        <div className="mb-5 flex flex-wrap gap-2">
                            <span className="rounded-full bg-[#C5EBDA] px-3 py-2 text-xs font-medium text-[#2B4D41]">
                                Baby Essentials Kit
                            </span>

                            <span className="rounded-full bg-[#F1F4F9] px-3 py-2 text-xs text-[#414845] dark:bg-gray-800 dark:text-gray-300">
                                {kitItems.length}{" "}
                                {kitItems.length === 1
                                    ? "included product"
                                    : "included products"}
                            </span>
                        </div>

                        {/* Product title with a smaller, responsive font size */}
                        <h1 className="font-serif text-2xl font-normal leading-tight tracking-tight text-[#181C20] dark:text-white sm:text-3xl lg:text-4xl">
                            {kit.name}
                        </h1>
                        {/* Use the saved kit description. */}
                        {kit.description && (
                            <p className="mt-6 whitespace-pre-line text-[15px] leading-7 text-[#414845] dark:text-gray-300">
                                {kit.description}
                            </p>
                        )}

                        {/* Same price divider and padding as ProductDetails. */}
                        <div className="mt-7 border-y border-[#E0E3E8] py-6 dark:border-gray-800">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="font-serif text-4xl font-normal text-[#436558] dark:text-[#C5EBDA]">
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

                        {/* Same large pill buttons and spacing as ProductDetails. */}
                        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                disabled={cartLoading}
                                className="flex min-h-14 flex-1 items-center justify-center rounded-full bg-[#436558] px-6 py-4 font-semibold text-white transition hover:bg-[#2B4D41] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {cartLoading
                                    ? "Adding to Cart…"
                                    : `Add to Cart`}
                            </button>

                            <button
                                type="button"
                                onClick={handleWishlistToggle}
                                aria-pressed={isInWishlist}
                                disabled={!isAuthenticated}
                                aria-label={
                                    isInWishlist
                                        ? "Remove kit from wishlist"
                                        : "Add kit to wishlist"
                                }
                                className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-full border border-[#C1C8C3] bg-white px-6 py-4 font-semibold text-[#436558] transition hover:bg-[#F1F4F9] disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-[#C5EBDA] dark:hover:bg-gray-800"
                            >
                                <span aria-hidden="true" className="text-xl">
                                    {isInWishlist ? "♥" : "♡"}
                                </span>
                                {isInWishlist
                                    ? "Saved to Wishlist"
                                    : "Add to Wishlist"}
                            </button>
                        </div>

                        {cartError && (
                            <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">
                                {cartError}
                            </p>
                        )}

                        {wishlistError && (
                            <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">
                                {wishlistError}
                            </p>
                        )}

                        {!isAuthenticated && (
                            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                                Log in to add this kit to your cart or wishlist.
                            </p>
                        )}
                    </div>
                </section>

                {/* Kit contents section uses the same spacious product-detail rhythm. */}
                <section className="mt-12 scroll-mt-6 sm:mt-16">
                    <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-gray-900">

                        <div className="border-b border-[#E0E3E8] p-5 dark:border-gray-800 sm:p-8">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#436558] dark:text-[#C5EBDA]">
                                Inside Your Kit
                            </p>

                            <h2 className="font-serif text-3xl font-normal tracking-tight sm:text-4xl">
                                What's Included
                            </h2>

                            <p className="mt-3 max-w-3xl text-[15px] leading-7 text-[#414845] dark:text-gray-300">
                                Explore the products included in this baby essentials kit.
                            </p>
                        </div>

                        <div className="p-5 sm:p-8">
                            {kitItems.length === 0 ? (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    No included products are available to display.
                                </p>
                            ) : (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {kitItems.map((item, index) => {
                                        const product = item.product;

                                        // Skip entries without populated product data.
                                        if (!product) return null;

                                        return (
                                            <article
                                                key={product._id || index}
                                                className="flex gap-4 rounded-2xl border border-[#E6EAF0] bg-white p-3 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900 sm:p-4"
                                            >
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
                        </div>
                    </div>
                </section>

                {/* Keep the existing recommendations section. */}
                <div className="mt-12 sm:mt-16">
                    <FeaturedProducts />
                </div>
            </div>
        </main>
    );
}

export default KitDetails;

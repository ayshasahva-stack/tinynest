import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    getMyWishlistThunk,
    clearWishlistThunk,
} from "../../features/wishlist/wishlistThunk";

import {
    selectWishlistProducts,
    selectWishlistKits,
    selectWishlistLoading,
    selectWishlistError,
} from "../../features/wishlist/wishlistSelectors";

import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import ErrorMessage from "../../components/ErrorMessage";

import WishlistItem from "./components/WishlistItem";
import WishlistKitItem from "./components/WishListKitItem";

function Wishlist() {
    const dispatch = useDispatch();

    const products = useSelector(selectWishlistProducts);
    const kits = useSelector(selectWishlistKits);
    const loading = useSelector(selectWishlistLoading);
    const error = useSelector(selectWishlistError);

    // Count both saved products and saved kits.
    const totalItems = products.length + kits.length;

    // Fetch both wishlist collections when the page loads.
    useEffect(() => {
        dispatch(getMyWishlistThunk());
    }, [dispatch]);

    // Clear products and kits together.
    const handleClearWishlist = () => {
        if (totalItems > 0 && window.confirm("Clear your entire wishlist?")) {
            dispatch(clearWishlistThunk());
        }
    };

    // Display the loading component during the initial fetch.
    if (loading && totalItems === 0) {
        return <Loading />;
    }

    return (
        <main className="min-h-screen bg-[#F7F9FF] px-4 py-8 text-[#181C20] dark:bg-gray-950 dark:text-white sm:px-6 lg:px-10">
            <div className="mx-auto max-w-[1440px]">

                {/* Breadcrumb navigation from the TinyNest reference. */}
                <nav
                    aria-label="Breadcrumb"
                    className="mb-5 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"
                >
                    <Link to="/" className="transition hover:text-[#436558]">
                        Home
                    </Link>
                    <span>/</span>
                    <span>My Account</span>
                    <span>/</span>
                    <span aria-current="page" className="font-semibold text-gray-800 dark:text-gray-200">
                        Wishlist
                    </span>
                </nav>

                {/* Editorial header inspired by the uploaded design. */}
                <section className="mb-6 flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-sm dark:bg-gray-900 sm:p-7 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-[#C5EBDA] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#2B4D41]">
                                Curated Sanctuary
                            </span>

                            <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#436558]" />
                                Your saved essentials
                            </span>
                        </div>

                        <h1 className="font-serif text-3xl font-medium tracking-tight sm:text-4xl">
                            My Gentle Wishlist
                        </h1>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600 dark:text-gray-400">
                            <span className="font-semibold text-gray-900 dark:text-white">
                                {totalItems} saved {totalItems === 1 ? "essential" : "essentials"}
                            </span>{" "}
                            waiting for your little one. Thoughtfully saved for your
                            baby's everyday comfort.
                        </p>
                    </div>

                    {totalItems > 0 && (
                        <button
                            type="button"
                            onClick={handleClearWishlist}
                            disabled={loading}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#436558] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#345246] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <span aria-hidden="true">⌫</span>
                            Clear Wishlist
                        </button>
                    )}
                </section>

                {/* Show API errors without hiding the saved items. */}
                {error && (
                    <div className="mb-5">
                        <ErrorMessage message={error} />
                    </div>
                )}

                {totalItems === 0 && !loading ? (
                    <section className="rounded-2xl bg-white p-6 text-center shadow-sm dark:bg-gray-900 sm:p-10">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF3EE] text-3xl text-[#436558]">
                            ♡
                        </div>

                        <EmptyState
                            title="Your wishlist is waiting"
                            message="Save products and newborn kits you love, and find all your favourites here."
                        />

                        <Link
                            to="/products"
                            className="mt-5 inline-flex rounded-full bg-[#436558] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#345246]"
                        >
                            Explore Essentials
                        </Link>
                    </section>
                ) : (
                    <>
                        {/* Saved products and kits use the same responsive grid. */}
                        <section aria-label="Saved wishlist items">
                            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                    <span className="rounded-full bg-white px-3 py-2 shadow-sm dark:bg-gray-900">
                                        ♡ Active Wishlist
                                        <span className="ml-2 font-semibold text-[#436558]">
                                            {totalItems}
                                        </span>
                                    </span>

                                    <span className="rounded-full bg-white px-3 py-2 shadow-sm dark:bg-gray-900">
                                        {products.length} {products.length === 1 ? "product" : "products"}
                                    </span>

                                    <span className="rounded-full bg-white px-3 py-2 shadow-sm dark:bg-gray-900">
                                        {kits.length} {kits.length === 1 ? "kit" : "kits"}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {products.map((product) => (
                                    <WishlistItem
                                        key={`product-${product._id}`}
                                        product={product}
                                    />
                                ))}

                                {kits.map((kit) => (
                                    <WishlistKitItem
                                        key={`kit-${kit._id}`}
                                        kit={kit}
                                    />
                                ))}
                            </div>
                        </section>
                    </>
                )}

                {/* Helpful discovery section without fabricated product data. */}
                <section className="mt-12 rounded-2xl bg-[#EAF0F8] p-6 dark:bg-gray-900 sm:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#436558]">
                                Thoughtfully paired
                            </p>

                            <h2 className="font-serif text-2xl font-medium sm:text-3xl">
                                Complete Your Little One's Nursery
                            </h2>

                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Explore essentials and curated kits for your baby's needs.
                            </p>
                        </div>

                        <Link
                            to="/products"
                            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[#436558] transition hover:underline dark:text-[#C5EBDA]"
                        >
                            Explore Essentials <span aria-hidden="true">→</span>
                        </Link>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                        <Link
                            to="/products"
                            className="rounded-full border border-[#C1C8C3] bg-white px-5 py-2.5 text-sm font-medium text-[#436558] transition hover:bg-[#F1F4F9] dark:border-gray-700 dark:bg-gray-800 dark:text-[#C5EBDA]"
                        >
                            Shop Products
                        </Link>

                        <Link
                            to="/kits"
                            className="rounded-full bg-[#436558] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#345246]"
                        >
                            Explore Newborn Kits
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default Wishlist;
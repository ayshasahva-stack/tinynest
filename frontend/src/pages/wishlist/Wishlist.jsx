import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    getMyWishlistThunk,
    clearWishlistThunk
} from "../../features/wishlist/wishlistThunk";

import {
    selectWishlistProducts,
    selectWishlistLoading,
    selectWishlistError
} from "../../features/wishlist/wishlistSelectors";

import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import ErrorMessage from "../../components/ErrorMessage";

import WishlistItem from "./components/WishlistItem";

function Wishlist() {
    const dispatch = useDispatch();

    const products = useSelector(selectWishlistProducts);
    const loading = useSelector(selectWishlistLoading);
    const error = useSelector(selectWishlistError);

    // Fetch the wishlist when the page loads
    useEffect(() => {
        dispatch(getMyWishlistThunk());
    }, [dispatch]);

    // Clear the entire wishlist
    const handleClearWishlist = () => {
        dispatch(clearWishlistThunk());
    };

    // Show loading state while fetching wishlist
    if (loading && products.length === 0) {
        return <Loading />;
    }

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-900">
            <div className="mx-auto max-w-6xl">

                {/* Page heading */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            My Wishlist
                        </h1>

                        <p className="mt-1 text-gray-600 dark:text-gray-400">
                            Products you have saved for later
                        </p>
                    </div>

                    {/* Clear wishlist button */}
                    {products.length > 0 && (
                        <button
                            type="button"
                            onClick={handleClearWishlist}
                            disabled={loading}
                            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-800 dark:hover:bg-red-900/20"
                        >
                            Clear Wishlist
                        </button>
                    )}
                </div>

                {/* Error message */}
                {error && <ErrorMessage message={error} />}

                {/* Empty wishlist */}
                {!loading && products.length === 0 ? (
                    <EmptyState
                        title="Your wishlist is empty"
                        message="Save products you love and find them here later."
                    />
                ) : (
                    /* Wishlist products */
                    <div className="space-y-4">
                        {products.map((product) => (
                            <WishlistItem
                                key={product._id}
                                product={product}
                            />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

export default Wishlist;
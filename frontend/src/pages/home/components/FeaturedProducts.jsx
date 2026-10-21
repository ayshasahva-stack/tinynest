
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

// Read the existing TinyNest product data and request status from Redux.
import {
    selectProducts,
    selectProductsLoading,
    selectProductsError,
} from "../../../features/products/productSelectors";

// Reuse existing loading, error, and empty-state components.
import Loading from "../../../components/Loading";
import EmptyState from "../../../components/EmptyState";
import ErrorMessage from "../../../components/ErrorMessage";

// Keep using TinyNest's existing product card and its functionality.
import ProductCard from "../../products/components/ProductCard";

function FeaturedProducts() {
    // Get the real products from the Redux store.
    const products = useSelector(selectProducts);
    const loading = useSelector(selectProductsLoading);
    const error = useSelector(selectProductsError);

    return (
        <section className="w-full bg-[#F7F9FF] px-5 py-14 transition-colors duration-300 dark:bg-gray-950 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
            <div className="mx-auto max-w-7xl">

                {/* Reference-style heading and catalogue link. */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#52745C] dark:text-[#B5D0AC]">
                            Parent Favorites
                        </span>

                        <h2 className="mt-1 font-serif text-3xl font-normal tracking-tight text-[#292D29] dark:text-white sm:text-4xl">
                            Featured Essentials
                        </h2>
                    </div>

                    {/* Navigate to the existing product catalogue. */}
                    <Link
                        to="/products"
                        className="inline-flex w-fit items-center gap-2 text-sm font-medium text-[#52745C] transition-colors hover:text-[#344E3A] dark:text-[#B5D0AC] dark:hover:text-white"
                    >
                        <span>View all products</span>
                        <span aria-hidden="true">→</span>
                    </Link>
                </div>

                {/* Preserve the existing API request states. */}
                {loading ? (
                    <Loading />
                ) : error ? (
                    <ErrorMessage
                        title="Unable to load products"
                        message={error}
                    />
                ) : products.length === 0 ? (
                    <EmptyState
                        title="No products found"
                        message="There are no products available right now."
                    />
                ) : (
                    /*
                     * Show up to four real products, matching the
                     * four-column desktop layout in the reference.
                     */
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                        {products.slice(0, 4).map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default FeaturedProducts;

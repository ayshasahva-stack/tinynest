
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchProducts } from "../../features/products/productThunk";
import { fetchCategories } from "../../features/categories/categoryThunk";

import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import ErrorMessage from "../../components/ErrorMessage";

import ProductGrid from "./components/ProductGrid";
import ProductFilters from "./components/ProductFilters";

import {
    selectProducts,
    selectProductsError,
    selectProductsLoading,
    selectProductsPagination,
} from "../../features/products/productSelectors";

function Products() {
    // Search input and debounced search value
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Selected category and current page
    const [category, setCategory] = useState("");
    const [page, setPage] = useState(1);

    const dispatch = useDispatch();

    // Read product data and request status from Redux
    const products = useSelector(selectProducts);
    const pagination = useSelector(selectProductsPagination);
    const loading = useSelector(selectProductsLoading);
    const error = useSelector(selectProductsError);

    // Wait 500ms after typing before searching
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    // Fetch products when search, category, or page changes
    useEffect(() => {
        dispatch(
            fetchProducts({
                search: debouncedSearch,
                category,
                page,
            })
        );
    }, [dispatch, debouncedSearch, category, page]);

    // Return to page one when the search or category changes
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, category]);

    // Load categories for the sidebar
    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    // Pagination helper
    const currentPage = pagination.currentPage || page;
    const totalPages = pagination.totalPages || 1;

    return (
        <main className="min-h-screen bg-[#FAFAF5] px-4 py-8 transition-colors duration-300 dark:bg-gray-950 sm:px-6 lg:px-8">

            <div className="mx-auto max-w-[1440px]">

                {/* Page heading */}
                <header className="mb-8">
                    <span className="inline-block rounded-full bg-[#E4EBDD] px-3 py-1.5 text-xs font-semibold text-[#49634B] dark:bg-[#26372A] dark:text-[#C9DFC5]">
                        TinyNest collection
                    </span>

                    <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Shop All
                    </h1>

                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Explore essentials for your little one.
                    </p>
                </header>

                {/* Sidebar and product area */}
                <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[220px_minmax(0,1fr)] xl:gap-10">

                    {/* Left sidebar: existing search and category filters */}
                    <aside className="min-w-0">
                        <ProductFilters
                            search={search}
                            setSearch={setSearch}
                            category={category}
                            setCategory={setCategory}
                        />
                    </aside>

                    {/* Right side: toolbar, products, and pagination */}
                    <section className="min-w-0">

                        {/* Results toolbar */}
                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E8E5DA] bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900">

                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                {loading
                                    ? "Loading products..."
                                    : `Showing ${products.length} product${products.length === 1 ? "" : "s"}`}
                            </p>

                            {/* Sorting is not added here because the existing
                                backend sorting options have not been confirmed. */}
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                Page {currentPage} of {totalPages}
                            </span>
                        </div>

                        {/* Loading state */}
                        {loading && <Loading />}

                        {/* Error state */}
                        {!loading && error && (
                            <ErrorMessage
                                title="Unable to load products"
                                message={error}
                            />
                        )}

                        {/* Empty state */}
                        {!loading && !error && products.length === 0 && (
                            <EmptyState
                                title="No products found"
                                message="Try another search term or category."
                            />
                        )}

                        {/* Existing product grid and cards remain unchanged */}
                        {!loading && !error && products.length > 0 && (
                            <ProductGrid products={products} />
                        )}

                        {/* Pagination */}
                        {!loading && !error && totalPages > 1 && (
                            <nav
                                aria-label="Product pagination"
                                className="mt-10 flex flex-wrap items-center justify-center gap-3"
                            >
                                <button
                                    type="button"
                                    disabled={currentPage <= 1}
                                    onClick={() =>
                                        setPage((value) => value - 1)
                                    }
                                    className="rounded-lg border border-[#D7DCCF] bg-white px-4 py-2 text-sm font-medium text-[#49634B] transition hover:bg-[#E4EBDD] disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-[#C9DFC5] dark:hover:bg-gray-800"
                                >
                                    ← Previous
                                </button>

                                <span
                                    aria-current="page"
                                    className="rounded-lg bg-[#496F49] px-4 py-2 text-sm font-semibold text-white"
                                >
                                    {currentPage}
                                </span>

                                <span className="px-1 text-sm text-gray-600 dark:text-gray-400">
                                    of {totalPages}
                                </span>

                                <button
                                    type="button"
                                    disabled={currentPage >= totalPages}
                                    onClick={() =>
                                        setPage((value) => value + 1)
                                    }
                                    className="rounded-lg border border-[#D7DCCF] bg-white px-4 py-2 text-sm font-medium text-[#49634B] transition hover:bg-[#E4EBDD] disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-[#C9DFC5] dark:hover:bg-gray-800"
                                >
                                    Next →
                                </button>
                            </nav>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
}

export default Products;

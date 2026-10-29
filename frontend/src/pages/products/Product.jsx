
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
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

import { selectCategories } from "../../features/categories/categorySelectors";

function Product() {
    const [searchParams] = useSearchParams();

// Read the category ID selected from the home page.
const requestedCategory = searchParams.get("category") || "";

// Initialize the category filter using the URL value.
const [category, setCategory] = useState(requestedCategory);
    // Search text, selected category, current page, and mobile filters.
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [page, setPage] = useState(1);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    // Additional product filter values.
    const [ageGroup, setAgeGroup] = useState("");

    const [brand, setBrand] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const dispatch = useDispatch();

    // Existing product and category data from Redux.
    const products = useSelector(selectProducts);
    const categories = useSelector(selectCategories);
    const pagination = useSelector(selectProductsPagination);
    const loading = useSelector(selectProductsLoading);
    const error = useSelector(selectProductsError);

    // Update the category when the URL changes.
useEffect(() => {
    setCategory(requestedCategory);
    setPage(1);
}, [requestedCategory]);
    // Debounce search so we don't request products on every keystroke.
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    // Fetch products when a search, category, or page changes.
    // Fetch products whenever an applied filter or page changes.

   useEffect(() => {
    dispatch(
        fetchProducts({
            search: debouncedSearch,
            category: category,
            ageGroup: ageGroup.trim(),
            brand: brand.trim(),
            minPrice,
            maxPrice,
            page,
        })
    );
}, [
    dispatch,
    debouncedSearch,
    category,
    ageGroup,
    brand,
    minPrice,
    maxPrice,
    page,
]);

    // Reset pagination when the applied filters change.
    // Start at page 1 whenever the applied filters change.

    useEffect(() => {
        // Return to page 1 when an applied filter changes.
        setPage(1);
    }, [
        debouncedSearch,
        category,
        ageGroup,
        brand,
        minPrice,
        maxPrice,
    ]);

    // Load real categories for the chips and sidebar.
    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const currentPage = pagination.currentPage || page;
    const totalPages = pagination.totalPages || 1;

    // Keep the page title accurate when a category is selected.
    const selectedCategory = categories.find(
        (item) => item._id === category
    );

    return (
        <main className="min-h-screen bg-[#F7F9FF] pb-12 text-[#181C20] transition-colors duration-300 dark:bg-gray-950 dark:text-white">

            <div className="mx-auto max-w-[1440px] px-4 pt-6 sm:px-6 lg:px-8">

                {/* Breadcrumbs use existing app routes. */}
                <nav
                    aria-label="Breadcrumb"
                    className="mb-5 flex flex-wrap items-center gap-2 text-xs text-[#68716D] dark:text-gray-400"
                >
                    <Link to="/" className="transition hover:text-[#436558] dark:hover:text-[#B5D0AC]">
                        Home
                    </Link>
                    <span aria-hidden="true">›</span>
                    <span className="font-medium text-[#414845] dark:text-gray-200">
                        {selectedCategory?.name || "All Baby Essentials"}
                    </span>
                </nav>

                {/* Catalog hero inspired by the Stitch reference. */}
                <section className="relative isolate mb-7 overflow-hidden rounded-2xl bg-[#F1F4F9] px-5 py-7 sm:px-8 sm:py-9 dark:bg-gray-900">
                    {/* Soft decorative shapes stay behind the text. */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-12 -top-16 -z-10 h-56 w-56 rounded-full bg-[#C5EBDA]/50 blur-3xl dark:bg-[#436558]/20"
                    />
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-20 right-1/4 -z-10 h-48 w-48 rounded-full bg-[#FFDBCD]/40 blur-3xl dark:bg-[#7D5543]/10"
                    />

                    <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#C5EBDA] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#2B4D41] dark:bg-[#344638] dark:text-[#E2EBDD]">
                        <span aria-hidden="true">♡</span>
                        The TinyNest collection
                    </p>

                    <h1 className="max-w-3xl font-serif text-3xl font-normal leading-tight tracking-tight text-[#181C20] sm:text-4xl dark:text-white">
                        {selectedCategory?.name || "All Baby Essentials"}
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[#59635E] sm:text-[15px] dark:text-gray-300">
                        Thoughtfully selected essentials for your little
                        one's everyday comfort, care, play, and rest.
                    </p>

                    {/* Category chips use categories loaded from Redux. */}
                    <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
                        <button
                            type="button"
                            onClick={() => setCategory("")}
                            aria-pressed={!category}
                            className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${!category
                                ? "bg-[#436558] text-white dark:bg-[#B5D0AC] dark:text-gray-900"
                                : "bg-white text-[#414845] hover:bg-[#EBEEF3] dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                                }`}
                        >
                            All Categories
                        </button>

                        {categories.map((item) => (
                            <button
                                key={item._id}
                                type="button"
                                onClick={() => setCategory(item._id)}
                                aria-pressed={category === item._id}
                                className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${category === item._id
                                    ? "bg-[#436558] text-white dark:bg-[#B5D0AC] dark:text-gray-900"
                                    : "bg-white text-[#414845] hover:bg-[#EBEEF3] dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                                    }`}
                            >
                                {item.name}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Catalog body: filters beside the product grid. */}
                <div className="flex items-start gap-6 lg:gap-7">

                    {/* Desktop filter sidebar. */}
                    <aside className="sticky top-28 hidden max-h-[calc(100vh-8rem)] w-64 shrink-0 space-y-4 overflow-y-auto pr-1 lg:block">
                        <ProductFilters
                            search={search}
                            setSearch={setSearch}
                            category={category}
                            setCategory={setCategory}
                            ageGroup={ageGroup}
                            setAgeGroup={setAgeGroup}
                            brand={brand}
                            setBrand={setBrand}
                            minPrice={minPrice}
                            setMinPrice={setMinPrice}
                            maxPrice={maxPrice}
                            setMaxPrice={setMaxPrice}
                        />
                    </aside>

                    {/* Product results and toolbar. */}
                    <section className="min-w-0 flex-1">

                        {/* Results toolbar. */}
                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E0E3E8] bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
                            <div>
                                <p className="text-sm font-medium text-[#414845] dark:text-gray-200">
                                    {loading
                                        ? "Finding your essentials..."
                                        : `Showing ${products.length} product${products.length === 1 ? "" : "s"}`}
                                </p>

                                {!loading && (
                                    <p className="mt-1 text-xs text-[#68716D] dark:text-gray-400">
                                        Page {currentPage} of {totalPages}
                                    </p>
                                )}
                            </div>

                            {/* Filters are collapsible on smaller screens. */}
                            <button
                                type="button"
                                onClick={() =>
                                    setShowMobileFilters((visible) => !visible)
                                }
                                aria-expanded={showMobileFilters}
                                aria-controls="mobile-product-filters"
                                className="inline-flex items-center gap-2 rounded-full border border-[#DCE1E6] bg-[#F7F9FF] px-4 py-2 text-xs font-semibold text-[#414845] transition hover:bg-[#EBEEF3] lg:hidden dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                            >
                                <span aria-hidden="true">☷</span>
                                {showMobileFilters ? "Hide filters" : "Filters"}
                            </button>
                        </div>

                        {/* Mobile filters appear only when requested. */}
                        {showMobileFilters && (
                            <div
                                id="mobile-product-filters"
                                className="mb-5 lg:hidden"
                            >
                                <ProductFilters
                                    search={search}
                                    setSearch={setSearch}
                                    category={category}
                                    setCategory={setCategory}
                                    ageGroup={ageGroup}
                                    setAgeGroup={setAgeGroup}
                                    brand={brand}
                                    setBrand={setBrand}
                                    minPrice={minPrice}
                                    setMinPrice={setMinPrice}
                                    maxPrice={maxPrice}
                                    setMaxPrice={setMaxPrice}
                                />
                            </div>
                        )}

                        {/* Loading, error, and empty states remain intact. */}
                        {loading && <Loading />}

                        {!loading && error && (
                            <ErrorMessage
                                title="Unable to load products"
                                message={error}
                            />
                        )}

                        {!loading && !error && products.length === 0 && (
                            <EmptyState
                                title="No products found"
                                message="Try another search term or category."
                            />
                        )}

                        {/* Reuse your existing real-data product cards. */}
                        {!loading && !error && products.length > 0 && (
                            <ProductGrid products={products} />
                        )}

                        {/* Existing backend pagination. */}
                        {!loading && !error && totalPages > 1 && (
                            <nav
                                aria-label="Product pagination"
                                className="mt-8 flex flex-wrap items-center justify-center gap-2 rounded-xl border border-[#E0E3E8] bg-white px-3 py-4 dark:border-gray-800 dark:bg-gray-900"
                            >
                                <button
                                    type="button"
                                    disabled={currentPage <= 1}
                                    onClick={() => setPage((value) => value - 1)}
                                    className="rounded-lg border border-[#DCE1E6] px-3 py-2 text-xs font-semibold text-[#414845] transition hover:bg-[#EBEEF3] disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                                >
                                    ← Previous
                                </button>

                                <span
                                    aria-current="page"
                                    className="rounded-lg bg-[#436558] px-4 py-2 text-xs font-bold text-white dark:bg-[#B5D0AC] dark:text-gray-900"
                                >
                                    {currentPage}
                                </span>

                                <span className="px-1 text-xs text-[#68716D] dark:text-gray-400">
                                    of {totalPages}
                                </span>

                                <button
                                    type="button"
                                    disabled={currentPage >= totalPages}
                                    onClick={() => setPage((value) => value + 1)}
                                    className="rounded-lg border border-[#DCE1E6] px-3 py-2 text-xs font-semibold text-[#414845] transition hover:bg-[#EBEEF3] disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
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

export default Product;

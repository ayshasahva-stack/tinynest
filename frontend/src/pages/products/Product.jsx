// Import React hooks
import { useState, useEffect } from "react";

// Import Redux hooks
import { useDispatch, useSelector } from "react-redux";

// Import the product fetching thunk
import { fetchProducts } from "../../features/products/productThunk";

// Import the category fetching thunk
import { fetchCategories } from "../../features/categories/categoryThunk";

// Import reusable UI components
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import ErrorMessage from "../../components/ErrorMessage";

// Import the reusable product grid
import ProductGrid from "./components/ProductGrid";

// Import the product filters component
import ProductFilters from "./components/ProductFilters";

// Import product selectors
import {
    selectProducts,
    selectProductsError,
    selectProductsLoading,
    selectProductsPagination,
} from "../../features/products/productSelectors";

// Products page component
function Products() {
    // Store the text entered in the search box
    const [search, setSearch] = useState("");

    // Store the search value after the user stops typing
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Store the selected category ID
    const [category, setCategory] = useState("");

    // Store the current product page
    const [page, setPage] = useState(1);

    // Get the Redux dispatch function
    const dispatch = useDispatch();

    // Get products from Redux
    const products = useSelector(selectProducts);

    // Get pagination information from Redux
    const pagination = useSelector(selectProductsPagination);

    // Get loading state from Redux
    const loading = useSelector(selectProductsLoading);

    // Get error state from Redux
    const error = useSelector(selectProductsError);

    // Wait until the user stops typing before updating the search value
    useEffect(() => {
        // Create a timer that waits 500 milliseconds
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        // Clear the previous timer when the search value changes
        return () => {
            clearTimeout(timer);
        };
    }, [search]);

    // Fetch products whenever search, category, or page changes
    useEffect(() => {
        dispatch(
            fetchProducts({
                search: debouncedSearch,
                category,
                page,
            })
        );
    }, [dispatch, debouncedSearch, category, page]);

    // Reset to the first page when filters change
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, category]);

    // Fetch categories when the Products page loads
    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    return (
        <main className="mx-auto max-w-7xl px-4 py-10">
            {/* Page heading */}
            <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
                All Products
            </h1>

            {/* Product search and filters */}
            <ProductFilters
                search={search}
                setSearch={setSearch}
                category={category}
                setCategory={setCategory}
            />

            {/* Show loading state while products are being fetched */}
            {loading && <Loading />}

            {/* Show error state when the API request fails */}
            {!loading && error && (
                <ErrorMessage
                    title="Unable to load products"
                    message={error}
                />
            )}

            {/* Show empty state when no products are found */}
            {!loading && !error && products.length === 0 && (
                <EmptyState
                    title="No products found"
                    message="There are no products available right now."
                />
            )}

            {/* Display products using the reusable ProductGrid component */}
            {!loading && !error && products.length > 0 && (
                <ProductGrid products={products} />
            )}

            {/* Pagination controls */}
            {!loading && !error && pagination.totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-4">
                    {/* Previous page button */}
                    <button
                        type="button"
                        disabled={pagination.currentPage === 1}
                        onClick={() =>
                            setPage((currentPage) => currentPage - 1)
                        }
                        className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                        Previous
                    </button>

                    {/* Current page information */}
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        Page {pagination.currentPage} of{" "}
                        {pagination.totalPages}
                    </span>

                    {/* Next page button */}
                    <button
                        type="button"
                        disabled={
                            pagination.currentPage ===
                            pagination.totalPages
                        }
                        onClick={() =>
                            setPage((currentPage) => currentPage + 1)
                        }
                        className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                        Next
                    </button>
                </div>
            )}
        </main>
    );
}

export default Products;
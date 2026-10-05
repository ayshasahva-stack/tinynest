// Import React's useEffect hook
import { useEffect } from "react";

// Import Redux hooks
import { useDispatch, useSelector } from "react-redux";

// Import the product fetching thunk
import { fetchProducts } from "../../features/products/ProductThunk";
import ProductCard from "../../features/products/components/ProductCard";
// Import reusable UI state components
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import ErrorMessage from "../../components/ErrorMessage";
// Import product selectors
import {
    selectProducts,
    selectProductsError,
    selectProductsLoading
} from "../../features/products/productSelectors";

// Products page component
function Products() {
    // Get the Redux dispatch function
    const dispatch = useDispatch();

    // Get products from Redux
    const products = useSelector(selectProducts);

    // Get loading state from Redux
    const loading = useSelector(selectProductsLoading);

    // Get error state from Redux
    const error = useSelector(selectProductsError);
    console.log("Products from Redux:", products);

    // Fetch products when the Products page loads
    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    return (
    <main className="mx-auto max-w-7xl px-4 py-10">
        {/* Page heading */}
        <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
            All Products
        </h1>

        {/* Show loading state while products are being fetched */}
        {loading && <Loading />}

        {/* Show error state when the API request fails */}
        {!loading && error && (
            <ErrorMessage
                title="Unable to load products"
                message={error}
            />
        )}

        {/* Show empty state when the API succeeds but no products exist */}
        {!loading && !error && products.length === 0 && (
            <EmptyState
                title="No products found"
                message="There are no products available right now."
            />
        )}

        {/* Product grid */}
        {!loading && !error && products.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {/* Render each product using the reusable ProductCard */}
                {products.map((product) => (
                    <ProductCard
                        key={product._id}
                        product={product}
                    />
                ))}
            </div>
        )}
    </main>
);
}

export default Products;
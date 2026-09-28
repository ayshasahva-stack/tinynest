// Import useSelector to read data from Redux
import { useSelector } from "react-redux";

// Import the product selector
import {
    selectProducts,
    selectProductsLoading,
    selectProductsError,
} from '../../../features/products/productSelectors'
// Import the loading selector
import Loading from "../../../components/Loading";
import EmptyState from "../../../components/EmptyState";
import ErrorMessage from "../../../components/ErrorMessage";

// Import the reusable ProductCard component
import ProductCard from "../../../features/products/components/ProductCard";

// Featured products section
function FeaturedProducts() {
    // Get the products stored in Redux
    const products = useSelector(selectProducts);
    // Get the product loading state from Redux
    const loading = useSelector(selectProductsLoading);
    // Get the product error message from Redux
    const error = useSelector(selectProductsError);

    return (
        <section className="bg-gray-50 py-16 dark:bg-gray-900">

            {/* Section container */}
            <div className="mx-auto max-w-7xl px-4">

                {/* Section heading */}
                <div className="text-center">

                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Featured Products
                    </h2>

                    <p className="mt-3 text-gray-600 dark:text-gray-400">
                        Discover some of our popular baby essentials.
                    </p>

                </div>

                {/* Product content */}
                <div className="mt-10">

                    {loading ? (
                        // Show loading while the API request is running
                        <Loading />
                    ) : products.length === 0 ? (
                        // Show empty state when no products are available
                        <EmptyState
                            title="No products found"
                            message="There are no products available right now."
                        />
                    ) : (
                        // Show products when data is available
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

                            {products.map((product) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                />
                            ))}

                        </div>
                    )}

                </div>
            </div>
        </section>
    );
}

export default FeaturedProducts;
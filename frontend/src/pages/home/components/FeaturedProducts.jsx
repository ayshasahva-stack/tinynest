// Import useSelector to read data from Redux
import { useSelector } from "react-redux";

// Import the product selector
import {selectProducts} from '../../../features/products/productSelector'
// Import the loading selector
import { selectProductsLoading } from "../../../features/products/productSelector";

// Import the reusable ProductCard component
import ProductCard from "../../../features/products/components/ProductCard";

// Featured products section
function FeaturedProducts() {
    // Get the products stored in Redux
    const products = useSelector(selectProducts);
    // Get the product loading state from Redux
const loading = useSelector(selectProductsLoading);

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
        // Show this while products are being fetched
        <div className="flex min-h-40 items-center justify-center">
            <p className="text-gray-600 dark:text-gray-400">
                Loading products...
            </p>
        </div>
    ) : (
        // Show the products after the API request finishes
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
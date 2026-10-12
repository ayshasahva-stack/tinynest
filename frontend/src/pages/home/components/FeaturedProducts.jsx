// Import useSelector to read data from Redux
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
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
    <section className="bg-[#FBF7F0] py-14 transition-colors duration-300 dark:bg-gray-950 sm:py-20">

        {/* Main section container */}
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

            {/* Section heading */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                <div>
                    {/* Small decorative label */}
                    <span className="inline-block rounded-full bg-[#E4EBDD] px-4 py-2 text-sm font-semibold text-[#49634B] dark:bg-[#26372A] dark:text-[#C9DFC5]">
                        Little favourites
                    </span>

                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                        Featured Products
                    </h2>

                    <p className="mt-3 max-w-xl leading-7 text-gray-600 dark:text-gray-400">
                        Discover thoughtfully selected essentials
                        for your little one's everyday moments.
                    </p>
                </div>

                {/* Link to the existing products page */}
                <Link
                    to="/products"
                    className="inline-flex w-fit items-center gap-2 font-semibold text-[#607D5F] transition-colors hover:text-[#49634B] dark:text-[#B5D0AC] dark:hover:text-white"
                >
                    View all products
                    <span aria-hidden="true">→</span>
                </Link>
            </div>

            {/* Product content: preserve existing states */}
            <div className="mt-10 sm:mt-12">

                {loading ? (
                    // Display the existing loading component
                    <Loading />
                ) : error ? (
                    // Display the existing error component
                    <ErrorMessage
                        title="Unable to load products"
                        message={error}
                    />
                ) : products.length === 0 ? (
                    // Display the existing empty state
                    <EmptyState
                        title="No products found"
                        message="There are no products available right now."
                    />
                ) : (
                    // Keep using your existing Redux product data and card
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">

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
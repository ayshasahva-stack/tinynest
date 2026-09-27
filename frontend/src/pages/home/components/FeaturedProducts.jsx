// Import the reusable ProductCard component
import ProductCard from "../../../features/products/components/ProductCard";

// Temporary product data for UI development
const featuredProducts = [
    {
        id: 1,
        name: "Soft Baby Blanket",
        description: "Soft and comfortable blanket for your little one.",
        price: 799,
        image: "",
    },
    {
        id: 2,
        name: "Baby Feeding Bottle",
        description: "Comfortable feeding bottle for everyday use.",
        price: 499,
        image: "",
    },
    {
        id: 3,
        name: "Baby Cotton Romper",
        description: "Soft cotton romper designed for everyday comfort.",
        price: 599,
        image: "",
    },
    {
        id: 4,
        name: "Educational Baby Toy",
        description: "Fun and engaging toy for early learning.",
        price: 899,
        image: "",
    },
];

// Featured products section
function FeaturedProducts() {
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

                {/* Product grid */}
                <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

                    {featuredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}

                </div>

            </div>

        </section>
    );
}

export default FeaturedProducts;
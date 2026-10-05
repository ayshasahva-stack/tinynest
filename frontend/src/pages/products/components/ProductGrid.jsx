// Import the reusable ProductCard component
import ProductCard from "../../../features/products/components/ProductCard";

// ProductGrid component
function ProductGrid({ products }) {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {/* Render each product using the reusable ProductCard */}
            {products.map((product) => (
                <ProductCard
                    key={product._id}
                    product={product}
                />
            ))}
        </div>
    );
}

export default ProductGrid;
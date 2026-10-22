
import ProductCard from "./ProductCard";

// Responsive grid using the existing TinyNest product card.
function ProductGrid({ products }) {
    return (
        <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:gap-5 xl:grid-cols-3">
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

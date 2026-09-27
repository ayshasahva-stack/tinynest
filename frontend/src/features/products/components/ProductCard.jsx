// ProductCard displays a single product
function ProductCard({ product }) {
    return (
        <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900">

            {/* Product image area */}
            <div className="aspect-square bg-gray-100 dark:bg-gray-800">

                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                        No image
                    </div>
                )}

            </div>

            {/* Product information */}
            <div className="p-5">

                {/* Product name */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {product.name}
                </h3>

                {/* Product description */}
                <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                    {product.description}
                </p>

                {/* Product price and action */}
                <div className="mt-4 flex items-center justify-between">

                    {/* Product price */}
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                        ₹{product.price}
                    </span>

                    {/* View product button */}
                    <button
                        type="button"
                        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                    >
                        View
                    </button>

                </div>

            </div>

        </article>
    );
}

export default ProductCard;
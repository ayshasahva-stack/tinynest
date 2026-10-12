
import { Link } from "react-router-dom";

// Displays a single TinyNest product in a compact card
function ProductCard({ product }) {
    // Use the first product image when available
    const productImage = product.images?.[0];

    return (
        <article className="group overflow-hidden rounded-xl border border-[#EAE9DF] bg-[#FAFAF5] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md dark:border-gray-700 dark:bg-gray-900">

            {/* Product image and age-group badge */}
            <Link
                to={`/products/${product._id}`}
                className="block"
                aria-label={`View ${product.title || product.name}`}
            >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#EEEDE5] dark:bg-gray-800">

                    {productImage ? (
                        <img
                            src={productImage}
                            alt={product.title || product.name || "Baby product"}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                            No image available
                        </div>
                    )}

                    {/* Age-group badge: display only when the product has one */}
                    {product.ageGroup && (
                        <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-gray-700 shadow-sm dark:bg-gray-900/90 dark:text-gray-200">
                            {product.ageGroup}
                        </span>
                    )}

                    {/* Wishlist button styling placeholder.
                        Connect this to your existing wishlist Redux action next. */}
                    <span
                        aria-hidden="true"
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-lg text-[#82917A] shadow-sm dark:bg-gray-900"
                    >
                        ♡
                    </span>
                </div>
            </Link>

            {/* Product information */}
            <div className="p-3 sm:p-4">

                {/* Rating placeholder: show real ratings after connecting your review data */}
                <div className="mb-2 flex items-center gap-1 text-xs text-[#A45F72]">
                    <span aria-hidden="true" className="tracking-wide">
                        ★ ★ ★ ★ ☆
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                        Ratings
                    </span>
                </div>

                {/* Product name */}
                <Link to={`/products/${product._id}`}>
                    <h3 className="line-clamp-2 min-h-10 text-sm font-semibold text-gray-900 transition-colors group-hover:text-[#607D5F] dark:text-white dark:group-hover:text-[#B5D0AC]">
                        {product.title || product.name || "Untitled product"}
                    </h3>
                </Link>

                {/* Product price */}
                <p className="mt-1 text-sm font-bold text-[#496F49] dark:text-[#B5D0AC]">
                    ₹{Number(product.price || 0).toLocaleString("en-IN")}
                </p>

                {/* Styled action button; product details page remains functional */}
                <Link
                    to={`/products/${product._id}`}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-[#789474] px-3 py-2 text-xs font-semibold text-[#496F49] transition-colors hover:bg-[#E4EBDD] focus:outline-none focus:ring-2 focus:ring-[#789474] dark:border-[#718B70] dark:text-[#C9DFC5] dark:hover:bg-[#26372A] sm:text-sm"
                >
                    View Product
                    <span aria-hidden="true">→</span>
                </Link>
            </div>
        </article>
    );
}

export default ProductCard;

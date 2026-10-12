
import { Link } from "react-router-dom";

// Display one baby kit using the TinyNest product-card style
function KitCard({ kit }) {
    // Calculate the discounted price
    const discountedPrice =
        kit.price - (kit.price * kit.discount) / 100;

    return (
        <article className="group overflow-hidden rounded-xl border border-[#EAE9DF] bg-[#FAFAF5] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md dark:border-gray-700 dark:bg-gray-900">

            {/* Kit image */}
            <Link
                to={`/kits/${kit._id}`}
                aria-label={`View ${kit.name} kit details`}
                className="block"
            >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#EEEDE5] dark:bg-gray-800">
                    {kit.image ? (
                        <img
                            src={kit.image}
                            alt={kit.name}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                            No image available
                        </div>
                    )}

                    {/* Discount badge */}
                    {kit.discount > 0 && (
                        <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-[#496F49] shadow-sm dark:bg-gray-900 dark:text-[#B5D0AC]">
                            {kit.discount}% OFF
                        </span>
                    )}
                </div>
            </Link>

            {/* Kit information */}
            <div className="p-3 sm:p-4">

                {/* Kit name */}
                <Link to={`/kits/${kit._id}`}>
                    <h2 className="line-clamp-2 min-h-10 text-sm font-semibold capitalize text-gray-900 transition-colors group-hover:text-[#607D5F] dark:text-white dark:group-hover:text-[#B5D0AC]">
                        {kit.name}
                    </h2>
                </Link>

                {/* Kit description */}
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-600 dark:text-gray-400">
                    {kit.description}
                </p>

                {/* Discounted and original prices */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-[#496F49] dark:text-[#B5D0AC]">
                        ₹{discountedPrice.toFixed(2)}
                    </span>

                    {kit.discount > 0 && (
                        <span className="text-xs text-gray-400 line-through">
                            ₹{kit.price.toFixed(2)}
                        </span>
                    )}
                </div>

                {/* Number of included products */}
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {kit.items.length}{" "}
                    {kit.items.length === 1 ? "product" : "products"} included
                </p>

                {/* View kit details */}
                <Link
                    to={`/kits/${kit._id}`}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-[#789474] px-3 py-2 text-xs font-semibold text-[#496F49] transition-colors hover:bg-[#E4EBDD] focus:outline-none focus:ring-2 focus:ring-[#789474] dark:border-[#718B70] dark:text-[#C9DFC5] dark:hover:bg-[#26372A] sm:text-sm"
                >
                    View Kit
                    <span aria-hidden="true">→</span>
                </Link>
            </div>
        </article>
    );
}

export default KitCard;


import { Link } from "react-router-dom";

// Baby kit card styled consistently with the TinyNest ProductCard.
function KitCard({ kit }) {
    // Convert API values to numbers before calculating the discounted price.
    const price = Number(kit.price) || 0;
    const discount = Math.min(
        100,
        Math.max(0, Number(kit.discount) || 0)
    );

    const discountedPrice = price - (price * discount) / 100;

    // Safely handle a kit without an items array.
    const itemCount = Array.isArray(kit.items) ? kit.items.length : 0;

    // Format prices using the Indian numbering system.
    const formattedPrice = discountedPrice.toLocaleString("en-IN", {
        maximumFractionDigits: 2,
    });

    const formattedOriginalPrice = price.toLocaleString("en-IN", {
        maximumFractionDigits: 2,
    });

    return (
        <article className="group flex h-full flex-col rounded-2xl border border-[#ECEDE6] bg-white p-2.5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 sm:p-3">

            {/* Kit image with a discount badge. */}
            <Link
                to={`/kits/${kit._id}`}
                aria-label={`View ${kit.name} kit details`}
                className="block"
            >
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#F1F4F9] dark:bg-gray-800">
                    {kit.image ? (
                        <img
                            src={kit.image}
                            alt={kit.name}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-2 px-3 text-center text-sm text-gray-500 dark:text-gray-400">
                            <span className="text-3xl" aria-hidden="true">
                                ♡
                            </span>
                            <span>Image unavailable</span>
                        </div>
                    )}

                    {/* Display the real discount only when one exists. */}
                    {discount > 0 && (
                        <span className="absolute left-3 top-3 rounded-full bg-[#FFC9B2] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#623E2D] shadow-sm">
                            {discount}% OFF
                        </span>
                    )}
                </div>
            </Link>

            {/* Kit information follows the ProductCard spacing. */}
            <div className="flex flex-1 flex-col px-1 pb-1 pt-3">

                {/* Kit name. */}
                <Link to={`/kits/${kit._id}`}>
                    <h2 className="line-clamp-2 min-h-10 font-serif text-base leading-5 text-[#292D29] transition-colors group-hover:text-[#52745C] dark:text-gray-100 dark:group-hover:text-[#B5D0AC]">
                        {kit.name || "Untitled kit"}
                    </h2>
                </Link>

                {/* Kit description. */}
                {kit.description && (
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#777C75] dark:text-gray-400">
                        {kit.description}
                    </p>
                )}

                {/* Number of included products. */}
                <p className="mt-2 text-xs text-[#777C75] dark:text-gray-400">
                    {itemCount}{" "}
                    {itemCount === 1 ? "product" : "products"} included
                </p>

                {/* Price and compact action button, like ProductCard. */}
                <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                    <div className="flex min-w-0 flex-wrap items-baseline gap-1.5">
                        <span className="font-serif text-lg font-medium text-[#292D29] dark:text-white">
                            ₹{formattedPrice}
                        </span>

                        {discount > 0 && (
                            <span className="text-xs text-gray-400 line-through">
                                ₹{formattedOriginalPrice}
                            </span>
                        )}
                    </div>

                    <Link
                        to={`/kits/${kit._id}`}
                        aria-label={`View ${kit.name} kit`}
                        className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-[#45695A] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#355346] focus:outline-none focus:ring-2 focus:ring-[#789474] dark:bg-[#607D5F] dark:hover:bg-[#49634B]"
                    >
                        View
                        <span aria-hidden="true">→</span>
                    </Link>
                </div>
            </div>
        </article>
    );
}

export default KitCard;

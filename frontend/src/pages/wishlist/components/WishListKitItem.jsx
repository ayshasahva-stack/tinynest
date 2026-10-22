import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { removeKitFromWishlistThunk } from "../../../features/wishlist/wishlistThunk";
function WishlistKitItem({ kit }) {
    // Your kit card JSX goes here.

    const dispatch = useDispatch();

    // Remove only this kit from the wishlist.
    const handleRemove = () => {
        dispatch(removeKitFromWishlistThunk(kit._id));
    };

    const title = kit.name || "Newborn kit";
    const price = Number(kit.price) || 0;
    const image = kit.image || kit.images?.[0];
    const discount = Number(kit.discount) || 0;

    return (
        <article className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#E5E8ED] bg-white p-2.5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md dark:border-gray-700 dark:bg-gray-900">

            {/* Kit image and remove button. */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#F1F4F9] dark:bg-gray-800">
                {image ? (
                    <img
                        src={image}
                        alt={title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">
                        No image available
                    </div>
                )}

                <span className="absolute left-2 top-2 rounded-full bg-[#C5EBDA] px-2 py-1 text-[10px] font-bold text-[#2B4D41]">
                    NEWBORN KIT
                </span>

                {discount > 0 && (
                    <span className="absolute bottom-2 left-2 rounded-full bg-[#FFC9B2] px-2 py-1 text-[10px] font-bold text-[#7A5240]">
                        SAVE {discount}%
                    </span>
                )}

                <button
                    type="button"
                    onClick={handleRemove}
                    aria-label={`Remove ${title} from wishlist`}
                    title="Remove from wishlist"
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-lg text-[#436558] shadow-sm transition hover:bg-red-50 hover:text-red-600"
                >
                    ♥
                </button>
            </div>

            {/* Kit details from the actual database record. */}
            <div className="flex flex-1 flex-col px-1.5 pb-1 pt-3">
                <p className="mb-1 text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    TinyNest curated collection
                </p>

                <h2 className="line-clamp-2 min-h-10 font-serif text-base font-medium text-[#181C20] dark:text-white">
                    {title}
                </h2>

                <div className="mt-2 flex flex-wrap items-baseline gap-2">
                    <span className="text-sm font-bold text-[#181C20] dark:text-white">
                        ₹{price.toLocaleString("en-IN")}
                    </span>
                </div>

                {kit.items?.length > 0 && (
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        {kit.items.length} {kit.items.length === 1 ? "item" : "items"} included
                    </p>
                )}

                <div className="mt-auto pt-4">
                    <Link
                        to={`/kits/${kit._id}`}
                        className="flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#436558] px-3 py-2 text-center text-xs font-semibold text-white transition hover:bg-[#345246]"
                    >
                        View Kit <span aria-hidden="true">→</span>
                    </Link>
                </div>
            </div>
        </article>
    );
}

export default WishlistKitItem;

import { useDispatch } from "react-redux";

import {
    updateCartQuantityThunk,
    removeFromCartThunk,
} from "../../../features/cart/cartThunk";

function CartItem({ item }) {
    const dispatch = useDispatch();

    // Work out the discounted price in one reusable function.
    const getSellingPrice = (entry) => {
        const price = Number(entry?.price) || 0;
        const discount = Number(entry?.discount) || 0;

        return Math.max(0, price - (price * discount) / 100);
    };

    // Shared styling for the quantity controls.
    const quantityButtonClass =
        "flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-lg text-gray-700 transition hover:border-[#436558] hover:text-[#436558] disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200";

    // ---------------------------------------------
    // PRODUCT ITEM
    // ---------------------------------------------
    if (item.itemType === "product") {
        const product = item.product;

        // Handle products that no longer exist in the database.
        if (!product || typeof product !== "object") {
            return (
                <article className="rounded-2xl border border-red-100 bg-white p-5 dark:border-red-900 dark:bg-gray-900">
                    <p className="text-sm text-red-600">
                        This product is no longer available.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            dispatch(
                                removeFromCartThunk({
                                    itemType: "product",
                                    itemId: product?._id || item.product,
                                })
                            )
                        }
                        className="mt-3 text-sm font-semibold text-red-600 underline underline-offset-4"
                    >
                        Remove from bag
                    </button>
                </article>
            );
        }

        const sellingPrice = getSellingPrice(product);
        const discountAmount =
            (Number(product.price || 0) * Number(product.discount || 0)) / 100;

        const handleQuantityChange = (quantity) => {
            if (quantity < 1) return;

            // Prevent increasing beyond the available stock.
            if (product.stock != null && quantity > product.stock) return;

            dispatch(
                updateCartQuantityThunk({
                    itemType: "product",
                    itemId: product._id,
                    quantity,
                })
            );
        };

        const handleRemove = () => {
            dispatch(
                removeFromCartThunk({
                    itemType: "product",
                    itemId: product._id,
                })
            );
        };

        return (
            <article className="rounded-2xl bg-white p-4 shadow-[0_2px_14px_-8px_rgba(43,47,51,0.12)] transition-shadow hover:shadow-[0_6px_22px_-10px_rgba(43,47,51,0.2)] sm:p-5 dark:bg-gray-900 dark:ring-1 dark:ring-gray-800">
                <div className="flex gap-4 sm:gap-5">
                    {/* Product image */}
                    <div className="h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-[#f0f1f2] sm:h-32 sm:w-32 dark:bg-gray-800">
                        {product.images?.length > 0 ? (
                            <img
                                src={product.images[0]}
                                alt={product.title}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center px-2 text-center text-xs text-gray-400">
                                No image
                            </div>
                        )}
                    </div>

                    {/* Product details and controls */}
                    <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8b6048]">
                                    Baby essentials
                                </p>

                                <h2 className="font-serif text-lg leading-snug text-gray-900 sm:text-xl dark:text-white">
                                    {product.title}
                                </h2>

                                <span className="mt-2 inline-flex rounded-full bg-[#edf1f5] px-2.5 py-1 text-[10px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                    Product
                                </span>
                            </div>

                            {/* Item total */}
                            <div className="shrink-0 text-right">
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    ₹{(sellingPrice * item.quantity).toFixed(2)}
                                </p>

                                {product.discount > 0 && (
                                    <p className="mt-1 text-xs text-gray-400 line-through">
                                        ₹{(
                                            Number(product.price || 0) *
                                            item.quantity
                                        ).toFixed(2)}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Unit price and discount */}
                        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                            <span className="font-medium text-gray-700 dark:text-gray-200">
                                ₹{sellingPrice.toFixed(2)} each
                            </span>

                            {product.discount > 0 && (
                                <span className="text-xs font-medium text-[#436558] dark:text-[#a9cfbe]">
                                    Save ₹{discountAmount.toFixed(2)} each
                                </span>
                            )}
                        </div>

                        {/* Quantity and remove actions */}
                        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                            <div className="flex items-center gap-3 rounded-full bg-[#f4f5f7] p-1 dark:bg-gray-800">
                                <button
                                    type="button"
                                    aria-label={`Decrease quantity of ${product.title}`}
                                    onClick={() =>
                                        handleQuantityChange(item.quantity - 1)
                                    }
                                    disabled={item.quantity <= 1}
                                    className={quantityButtonClass}
                                >
                                    −
                                </button>

                                <span className="min-w-5 text-center text-sm font-semibold">
                                    {item.quantity}
                                </span>

                                <button
                                    type="button"
                                    aria-label={`Increase quantity of ${product.title}`}
                                    onClick={() =>
                                        handleQuantityChange(item.quantity + 1)
                                    }
                                    disabled={
                                        product.stock != null &&
                                        item.quantity >= product.stock
                                    }
                                    className={quantityButtonClass}
                                >
                                    +
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={handleRemove}
                                className="text-xs font-medium text-gray-500 underline decoration-gray-300 underline-offset-4 transition hover:text-red-600 dark:text-gray-400"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        );
    }

    // ---------------------------------------------
    // KIT ITEM
    // ---------------------------------------------
    if (item.itemType === "kit") {
        const kit = item.kit;

        // Keep stale kit entries removable from the cart.
        if (!kit || typeof kit !== "object") {
            return (
                <article className="rounded-2xl border border-red-100 bg-white p-5 dark:border-red-900 dark:bg-gray-900">
                    <p className="text-sm text-red-600">
                        This kit is no longer available.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            dispatch(
                                removeFromCartThunk({
                                    itemType: "kit",
                                    itemId: kit?._id || item.kit,
                                })
                            )
                        }
                        className="mt-3 text-sm font-semibold text-red-600 underline underline-offset-4"
                    >
                        Remove from bag
                    </button>
                </article>
            );
        }

        const sellingPrice = getSellingPrice(kit);
        const discountAmount =
            (Number(kit.price || 0) * Number(kit.discount || 0)) / 100;

        const handleQuantityChange = (quantity) => {
            if (quantity < 1) return;

            dispatch(
                updateCartQuantityThunk({
                    itemType: "kit",
                    itemId: kit._id,
                    quantity,
                })
            );
        };

        const handleRemove = () => {
            dispatch(
                removeFromCartThunk({
                    itemType: "kit",
                    itemId: kit._id,
                })
            );
        };

        return (
            <article className="rounded-2xl bg-white p-4 shadow-[0_2px_14px_-8px_rgba(43,47,51,0.12)] transition-shadow hover:shadow-[0_6px_22px_-10px_rgba(43,47,51,0.2)] sm:p-5 dark:bg-gray-900 dark:ring-1 dark:ring-gray-800">
                <div className="flex gap-4 sm:gap-5">
                    {/* Kit image */}
                    <div className="h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-[#f0f1f2] sm:h-32 sm:w-32 dark:bg-gray-800">
                        {kit.image ? (
                            <img
                                src={kit.image}
                                alt={kit.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center px-2 text-center text-xs text-gray-400">
                                No image
                            </div>
                        )}
                    </div>

                    {/* Kit details and controls */}
                    <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8b6048]">
                                    Thoughtful bundle
                                </p>

                                <h2 className="font-serif text-lg leading-snug text-gray-900 sm:text-xl dark:text-white">
                                    {kit.name}
                                </h2>

                                <span className="mt-2 inline-flex rounded-full bg-[#e4eee8] px-2.5 py-1 text-[10px] font-medium text-[#436558] dark:bg-gray-800 dark:text-[#a9cfbe]">
                                    Kit
                                </span>
                            </div>

                            {/* Kit total */}
                            <div className="shrink-0 text-right">
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    ₹{(sellingPrice * item.quantity).toFixed(2)}
                                </p>

                                {kit.discount > 0 && (
                                    <p className="mt-1 text-xs text-gray-400 line-through">
                                        ₹{(
                                            Number(kit.price || 0) *
                                            item.quantity
                                        ).toFixed(2)}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Unit price and discount */}
                        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                            <span className="font-medium text-gray-700 dark:text-gray-200">
                                ₹{sellingPrice.toFixed(2)} each
                            </span>

                            {kit.discount > 0 && (
                                <span className="text-xs font-medium text-[#436558] dark:text-[#a9cfbe]">
                                    Save ₹{discountAmount.toFixed(2)} each
                                </span>
                            )}
                        </div>

                        {/* Quantity and remove actions */}
                        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                            <div className="flex items-center gap-3 rounded-full bg-[#f4f5f7] p-1 dark:bg-gray-800">
                                <button
                                    type="button"
                                    aria-label={`Decrease quantity of ${kit.name}`}
                                    onClick={() =>
                                        handleQuantityChange(item.quantity - 1)
                                    }
                                    disabled={item.quantity <= 1}
                                    className={quantityButtonClass}
                                >
                                    −
                                </button>

                                <span className="min-w-5 text-center text-sm font-semibold">
                                    {item.quantity}
                                </span>

                                <button
                                    type="button"
                                    aria-label={`Increase quantity of ${kit.name}`}
                                    onClick={() =>
                                        handleQuantityChange(item.quantity + 1)
                                    }
                                    className={quantityButtonClass}
                                >
                                    +
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={handleRemove}
                                className="text-xs font-medium text-gray-500 underline decoration-gray-300 underline-offset-4 transition hover:text-red-600 dark:text-gray-400"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>

                {/* Display the kit's included products when available. */}
                {kit.items?.length > 0 && (
                    <div className="mt-4 rounded-xl bg-[#f7f8fb] p-4 dark:bg-gray-800">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            What's included
                        </p>

                        <ul className="space-y-2">
                            {kit.items.map((kitItem, index) => (
                                <li
                                    key={kitItem.product?._id || index}
                                    className="flex items-start justify-between gap-3 text-sm"
                                >
                                    <span className="text-gray-700 dark:text-gray-200">
                                        {kitItem.product?.title || "Product"}
                                    </span>

                                    <span className="shrink-0 text-gray-500 dark:text-gray-400">
                                        × {kitItem.quantity}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </article>
        );
    }

    // Don't render unsupported cart item types.
    return null;
}

export default CartItem;

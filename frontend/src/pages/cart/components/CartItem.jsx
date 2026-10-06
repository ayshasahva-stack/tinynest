// Import Redux hook
import { useDispatch } from "react-redux";

// Import cart update and remove thunks
import {
    updateCartQuantityThunk,
    removeFromCartThunk,
} from "../../../features/cart/cartThunk";


// Cart item component
function CartItem({ item }) {

    // Get Redux dispatch function
    const dispatch = useDispatch();


    // ==================================================
    // PRODUCT CART ITEM
    // ==================================================

    if (item.itemType === "product") {

        const product = item.product;

        // Make sure the product still exists
        if (!product) {
            return (
                <article className="border-b border-gray-200 py-6 dark:border-gray-700">
                    <p className="text-sm text-red-600">
                        This product is no longer available.
                    </p>
                </article>
            );
        }


        // Calculate discounted product price
        const discountAmount =
            (product.price * product.discount) / 100;

        const productSellingPrice =
            product.price - discountAmount;


        // Increase product quantity
        const handleIncrease = () => {

            dispatch(
                updateCartQuantityThunk({
                    itemType: "product",
                    itemId: product._id,
                    quantity: item.quantity + 1,
                })
            );

        };


        // Decrease product quantity
        const handleDecrease = () => {

            // Don't allow quantity below 1
            if (item.quantity <= 1) {
                return;
            }

            dispatch(
                updateCartQuantityThunk({
                    itemType: "product",
                    itemId: product._id,
                    quantity: item.quantity - 1,
                })
            );

        };


        // Remove product
        const handleRemove = () => {

            dispatch(
                removeFromCartThunk({
                    itemType: "product",
                    itemId: product._id,
                })
            );

        };


        return (
            <article className="flex flex-col gap-4 border-b border-gray-200 py-6 sm:flex-row dark:border-gray-700">

                {/* Product image */}
                <div className="h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">

                    {product.images?.length > 0 ? (

                        <img
                            src={product.images[0]}
                            alt={product.title}
                            className="h-full w-full object-cover"
                        />

                    ) : (

                        <div className="flex h-full items-center justify-center text-xs text-gray-500">
                            No image
                        </div>

                    )}

                </div>


                {/* Product information */}
                <div className="flex flex-1 flex-col justify-between">

                    <div>

                        <div className="mb-1 flex items-center gap-2">

                            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                Product
                            </span>

                        </div>


                        <h2 className="font-semibold text-gray-900 dark:text-white">
                            {product.title}
                        </h2>


                        {/* Price information */}
                        <div className="mt-2">

                            <div className="flex items-center gap-2">

                                <span className="font-semibold text-gray-900 dark:text-white">
                                    ₹{productSellingPrice.toFixed(2)}
                                </span>

                                {product.discount > 0 && (
                                    <>

                                        <span className="text-sm text-gray-400 line-through">
                                            ₹{product.price.toFixed(2)}
                                        </span>

                                        <span className="text-sm font-medium text-green-600">
                                            {product.discount}% OFF
                                        </span>

                                    </>
                                )}

                            </div>


                            {product.discount > 0 && (
                                <p className="mt-1 text-sm text-green-600">
                                    You save ₹{discountAmount.toFixed(2)}
                                </p>
                            )}

                        </div>

                    </div>


                    {/* Quantity controls */}
                    <div className="mt-4 flex items-center gap-3">

                        <button
                            type="button"
                            onClick={handleDecrease}
                            disabled={item.quantity <= 1}
                            className="h-9 w-9 rounded-lg border border-gray-300 text-lg disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700"
                        >
                            -
                        </button>


                        <span className="min-w-8 text-center font-medium text-gray-900 dark:text-white">
                            {item.quantity}
                        </span>


                        <button
                            type="button"
                            onClick={handleIncrease}
                            disabled={item.quantity >= product.stock}
                            className="h-9 w-9 rounded-lg border border-gray-300 text-lg disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700"
                        >
                            +
                        </button>


                        <button
                            type="button"
                            onClick={handleRemove}
                            className="ml-3 text-sm font-medium text-red-600 hover:text-red-700"
                        >
                            Remove
                        </button>

                    </div>

                </div>


                {/* Product total */}
                <div className="font-semibold text-gray-900 dark:text-white">

                    ₹{(productSellingPrice * item.quantity).toFixed(2)}

                </div>

            </article>
        );
    }


    // ==================================================
    // KIT CART ITEM
    // ==================================================

    if (item.itemType === "kit") {

        const kit = item.kit;

        // Make sure the kit still exists
        if (!kit) {
            return (
                <article className="border-b border-gray-200 py-6 dark:border-gray-700">
                    <p className="text-sm text-red-600">
                        This kit is no longer available.
                    </p>
                </article>
            );
        }


        // Calculate kit discount
        const discountAmount =
            (kit.price * kit.discount) / 100;

        // Calculate final kit selling price
        const kitSellingPrice =
            kit.price - discountAmount;


        // Increase kit quantity
        const handleIncrease = () => {

            dispatch(
                updateCartQuantityThunk({
                    itemType: "kit",
                    itemId: kit._id,
                    quantity: item.quantity + 1,
                })
            );

        };


        // Decrease kit quantity
        const handleDecrease = () => {

            if (item.quantity <= 1) {
                return;
            }

            dispatch(
                updateCartQuantityThunk({
                    itemType: "kit",
                    itemId: kit._id,
                    quantity: item.quantity - 1,
                })
            );

        };


        // Remove kit
        const handleRemove = () => {

            dispatch(
                removeFromCartThunk({
                    itemType: "kit",
                    itemId: kit._id,
                })
            );

        };


        return (
            <article className="border-b border-gray-200 py-6 dark:border-gray-700">

                <div className="flex flex-col gap-4 sm:flex-row">

                    {/* Kit image */}
                    <div className="h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">

                        {kit.image ? (

                            <img
                                src={kit.image}
                                alt={kit.name}
                                className="h-full w-full object-cover"
                            />

                        ) : (

                            <div className="flex h-full items-center justify-center text-xs text-gray-500">
                                No image
                            </div>

                        )}

                    </div>


                    {/* Kit information */}
                    <div className="flex flex-1 flex-col justify-between">

                        <div>

                            <div className="mb-1 flex items-center gap-2">

                                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                                    Kit
                                </span>

                            </div>


                            <h2 className="font-semibold capitalize text-gray-900 dark:text-white">
                                {kit.name}
                            </h2>


                            {/* Kit price */}
                            <div className="mt-2">

                                <div className="flex items-center gap-2">

                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        ₹{kitSellingPrice.toFixed(2)}
                                    </span>


                                    {kit.discount > 0 && (
                                        <>

                                            <span className="text-sm text-gray-400 line-through">
                                                ₹{kit.price.toFixed(2)}
                                            </span>

                                            <span className="text-sm font-medium text-green-600">
                                                {kit.discount}% OFF
                                            </span>

                                        </>
                                    )}

                                </div>


                                {kit.discount > 0 && (
                                    <p className="mt-1 text-sm text-green-600">
                                        You save ₹{discountAmount.toFixed(2)}
                                    </p>
                                )}

                            </div>

                        </div>


                        {/* Quantity controls */}
                        <div className="mt-4 flex items-center gap-3">

                            <button
                                type="button"
                                onClick={handleDecrease}
                                disabled={item.quantity <= 1}
                                className="h-9 w-9 rounded-lg border border-gray-300 text-lg disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700"
                            >
                                -
                            </button>


                            <span className="min-w-8 text-center font-medium text-gray-900 dark:text-white">
                                {item.quantity}
                            </span>


                            <button
                                type="button"
                                onClick={handleIncrease}
                                className="h-9 w-9 rounded-lg border border-gray-300 text-lg dark:border-gray-700"
                            >
                                +
                            </button>


                            <button
                                type="button"
                                onClick={handleRemove}
                                className="ml-3 text-sm font-medium text-red-600 hover:text-red-700"
                            >
                                Remove
                            </button>

                        </div>

                    </div>


                    {/* Kit total */}
                    <div className="font-semibold text-gray-900 dark:text-white">

                        ₹{(kitSellingPrice * item.quantity).toFixed(2)}

                    </div>

                </div>


                {/* Kit contents */}
                {kit.items?.length > 0 && (

                    <div className="mt-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">

                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            What's included
                        </p>


                        <div className="mt-2 space-y-1">

                            {kit.items.map((kitItem, index) => (

                                <div
                                    key={kitItem.product?._id || index}
                                    className="flex justify-between text-sm text-gray-600 dark:text-gray-400"
                                >

                                    <span>
                                        {kitItem.product?.title || "Product"}
                                    </span>

                                    <span>
                                        × {kitItem.quantity}
                                    </span>

                                </div>

                            ))}

                        </div>

                    </div>

                )}

            </article>
        );
    }


    // Unknown cart item type
    return null;
}

export default CartItem;
// Import React's useEffect hook
import { useEffect } from "react";

// Import Redux hooks
import { useDispatch, useSelector } from "react-redux";

// Import React Router hooks
import { useNavigate, useParams } from "react-router-dom";

// Import the product fetching thunk
import { fetchProductById } from "../../features/products/productThunk";

// Import the cart thunk
import { addToCartThunk } from "../../features/cart/cartThunk";

// Import product selectors
import {
    selectSelectedProduct,
    selectProductsLoading,
    selectProductsError,
} from "../../features/products/productSelectors";

// Import cart selectors
import {
    selectCartLoading,
    selectCartError,
} from "../../features/cart/cartSelectors";

// Product Details page component
function ProductDetails() {
    // Get the product ID from the URL
    const { id } = useParams();

    // Get the Redux dispatch function
    const dispatch = useDispatch();

    // Get navigation function
    const navigate = useNavigate();

    // Get the selected product from Redux
    const product = useSelector(selectSelectedProduct);

    // Get product loading state
    const productLoading = useSelector(selectProductsLoading);

    // Get product error
    const productError = useSelector(selectProductsError);

    // Get cart loading state
    const cartLoading = useSelector(selectCartLoading);

    // Get cart error
    const cartError = useSelector(selectCartError);

    // Fetch the selected product when the ID changes
    useEffect(() => {
        if (id) {
            dispatch(fetchProductById(id));
        }
    }, [dispatch, id]);

    // Handle Add to Cart
    const handleAddToCart = async () => {
        // Make sure a product exists
        if (!product) {
            return;
        }

        // Add one quantity of the selected product
        const result = await dispatch(
            addToCartThunk({
                itemType: "product",
                product: product._id,
                quantity: 1,
            })
        );

        // Navigate to cart only when the request succeeds
        if (addToCartThunk.fulfilled.match(result)) {
            navigate("/cart");
        }
    };

    // Show loading while product is being fetched
    if (productLoading) {
        return (
            <main className="mx-auto max-w-7xl px-4 py-10">
                <p className="text-gray-600 dark:text-gray-400">
                    Loading product...
                </p>
            </main>
        );
    }

    // Show product error
    if (productError) {
        return (
            <main className="mx-auto max-w-7xl px-4 py-10">
                <p className="text-red-600">
                    {productError}
                </p>
            </main>
        );
    }

    // Show message when product doesn't exist
    if (!product) {
        return (
            <main className="mx-auto max-w-7xl px-4 py-10">
                <p className="text-gray-600 dark:text-gray-400">
                    Product not found.
                </p>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-10">
            {/* Product details layout */}
            <div className="grid gap-10 md:grid-cols-2">

                {/* Product image */}
                <div className="overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
                    {product.images?.length > 0 ? (
                        <img
                            src={product.images[0]}
                            alt={product.title}
                            className="h-full min-h-96 w-full object-cover"
                        />
                    ) : (
                        <div className="flex min-h-96 items-center justify-center text-gray-500 dark:text-gray-400">
                            No image available
                        </div>
                    )}
                </div>

                {/* Product information */}
                <div>
                    {/* Product title */}
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {product.title}
                    </h1>

                    {/* Product brand */}
                    <p className="mt-3 text-gray-600 dark:text-gray-400">
                        Brand: {product.brand}
                    </p>

                    {/* Product category */}
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Category: {product.category?.name}
                    </p>

                    {/* Product age group */}
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Age Group: {product.ageGroup}
                    </p>

                    {/* Product description */}
                    <p className="mt-6 leading-7 text-gray-700 dark:text-gray-300">
                        {product.description}
                    </p>

                    {/* Product price */}
                    <p className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
                        ₹{product.price}
                    </p>

                    {/* Discount */}
                    {product.discount > 0 && (
                        <p className="mt-2 text-green-600">
                            {product.discount}% off
                        </p>
                    )}

                    {/* Stock information */}
                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                        {product.stock > 0
                            ? `${product.stock} items available`
                            : "Out of stock"}
                    </p>

                    {/* Cart error */}
                    {cartError && (
                        <p className="mt-4 text-sm text-red-600">
                            {cartError}
                        </p>
                    )}

                    {/* Add to Cart button */}
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={
                            product.stock <= 0 ||
                            cartLoading
                        }
                        className="mt-6 w-full rounded-lg bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                    >
                        {cartLoading
                            ? "Adding to Cart..."
                            : product.stock > 0
                              ? "Add to Cart"
                              : "Out of Stock"}
                    </button>
                </div>
            </div>
        </main>
    );
}

export default ProductDetails;
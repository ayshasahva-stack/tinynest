// Import React hooks
import { useEffect, useState } from "react";

// Import Redux hooks
import { useDispatch, useSelector } from "react-redux";

// Import React Router hooks
import { useNavigate, useParams } from "react-router-dom";

// -----------------------------------------
// PRODUCT IMPORTS
// -----------------------------------------

// Import the product fetching thunk
import {
    fetchProductById,
} from "../../features/products/productThunk";

// -----------------------------------------
// CART IMPORTS
// -----------------------------------------

// Import cart thunk
import {
    addToCartThunk,
} from "../../features/cart/cartThunk";

// -----------------------------------------
// WISHLIST IMPORTS
// -----------------------------------------

// Import wishlist thunks
import {
    addToWishlistThunk,
    getMyWishlistThunk,
    removeFromWishlistThunk,
} from "../../features/wishlist/wishlistThunk";

// -----------------------------------------
// AUTH IMPORTS
// -----------------------------------------

// Import authentication selectors
import {
    selectAuthUser,
    selectIsAuthenticated,
} from "../../features/auth/authSelectors";

// -----------------------------------------
// PRODUCT SELECTORS
// -----------------------------------------

// Import product selectors
import {
    selectSelectedProduct,
    selectProductsLoading,
    selectProductsError,
} from "../../features/products/productSelectors";

// -----------------------------------------
// CART SELECTORS
// -----------------------------------------

// Import cart selectors
import {
    selectCartLoading,
    selectCartError,
} from "../../features/cart/cartSelectors";

// -----------------------------------------
// WISHLIST SELECTORS
// -----------------------------------------

// Import wishlist selectors
import {
    selectWishlistLoading,
    selectWishlistProducts,
} from "../../features/wishlist/wishlistSelectors";

// -----------------------------------------
// REVIEW IMPORTS
// -----------------------------------------

// Import review thunk
import {
    getProductReviewsThunk,
} from "../../features/reviews/reviewThunk";

// Import review selectors
import {
    selectReviews,
    selectReviewLoading,
    selectReviewError,
} from "../../features/reviews/reviewSelectors";

// -----------------------------------------
// REVIEW COMPONENTS
// -----------------------------------------

import ReviewForm from "./components/ReviewForm";
import ReviewList from "./components/ReviewList";


// Product Details page component
function ProductDetails() {

    // -----------------------------------------
    // URL PARAMETERS
    // -----------------------------------------

    // Get the product ID from the URL
    const { id } = useParams();


    // -----------------------------------------
    // REDUX
    // -----------------------------------------

    // Get Redux dispatch function
    const dispatch = useDispatch();

    // Get navigation function
    const navigate = useNavigate();


    // -----------------------------------------
    // AUTH STATE
    // -----------------------------------------

    // Get the currently logged-in user
    const user = useSelector(selectAuthUser);

    // Check whether the user is authenticated
    const isAuthenticated = useSelector(
        selectIsAuthenticated
    );


    // -----------------------------------------
    // PRODUCT STATE
    // -----------------------------------------

    // Get selected product from Redux
    const product = useSelector(selectSelectedProduct);

    // Get product loading state
    const productLoading = useSelector(
        selectProductsLoading
    );

    // Get product error
    const productError = useSelector(
        selectProductsError
    );


    // -----------------------------------------
    // CART STATE
    // -----------------------------------------

    // Get cart loading state
    const cartLoading = useSelector(
        selectCartLoading
    );

    // Get cart error
    const cartError = useSelector(
        selectCartError
    );


    // -----------------------------------------
    // WISHLIST STATE
    // -----------------------------------------

    // Get wishlist loading state
    const wishlistLoading = useSelector(
        selectWishlistLoading
    );

    // Get all products currently saved in wishlist
    const wishlistProducts = useSelector(
        selectWishlistProducts
    );


    // -----------------------------------------
    // REVIEW STATE
    // -----------------------------------------

    // Get reviews for the current product
    const reviews = useSelector(
        selectReviews
    );

    // Get review loading state
    const reviewsLoading = useSelector(
        selectReviewLoading
    );

    // Get review error
    const reviewsError = useSelector(
        selectReviewError
    );


    // -----------------------------------------
    // REVIEW FORM STATE
    // -----------------------------------------

    // Controls whether the new review form is visible
    const [showReviewForm, setShowReviewForm] =
        useState(false);

    // Stores the review currently being edited
    const [editingReview, setEditingReview] =
        useState(null);

// Stores the image currently displayed in the gallery.
const [selectedImage, setSelectedImage] = useState("");
    // -----------------------------------------
    // FETCH PRODUCT, WISHLIST AND REVIEWS
    // -----------------------------------------

    useEffect(() => {

        // Fetch the selected product
        dispatch(fetchProductById(id));

        // Fetch the user's wishlist
        dispatch(getMyWishlistThunk());

        // Fetch reviews for this product
        dispatch(getProductReviewsThunk(id));

    }, [dispatch, id]);
// Select the first product image whenever the product changes.
useEffect(() => {
    setSelectedImage(product?.images?.[0] || "");
}, [product?._id, product?.images]);

    // -----------------------------------------
    // CHECK WISHLIST STATUS
    // -----------------------------------------

    // Check whether this product is already
    // inside the user's wishlist
    const isInWishlist =
        product &&
        wishlistProducts.some(
            (wishlistProduct) =>
                wishlistProduct._id === product._id
        );


    // -----------------------------------------
    // CALCULATE AVERAGE RATING
    // -----------------------------------------

    const averageRating =
        reviews.length > 0
            ? (
                reviews.reduce(
                    (total, review) =>
                        total + review.rating,
                    0
                ) / reviews.length
            ).toFixed(1)
            : "0.0";

    const hasOwnReview = reviews.some((review) => {

        const currentUserId =
            user?._id || user?.id;

        const reviewUserId =
            review.user?._id || review.user?.id;

        // Compare IDs when available
        if (
            currentUserId &&
            reviewUserId
        ) {
            return currentUserId === reviewUserId;
        }

        // Fallback to email comparison
        if (
            user?.email &&
            review.user?.email
        ) {
            return (
                user.email.toLowerCase() ===
                review.user.email.toLowerCase()
            );
        }

        return false;
    });
    // -----------------------------------------
    // HANDLE ADD TO CART
    // -----------------------------------------

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


    // -----------------------------------------
    // HANDLE WISHLIST TOGGLE
    // -----------------------------------------

    const handleWishlistToggle = () => {

        // Make sure a product exists
        if (!product) {
            return;
        }

        // If product is already in wishlist,
        // remove it
        if (isInWishlist) {

            dispatch(
                removeFromWishlistThunk(product._id)
            );

        } else {

            // Otherwise add it to wishlist
            dispatch(
                addToWishlistThunk(product._id)
            );

        }
    };


    // -----------------------------------------
    // PRODUCT LOADING
    // -----------------------------------------

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


    // -----------------------------------------
    // PRODUCT ERROR
    // -----------------------------------------

    if (productError) {

        return (

            <main className="mx-auto max-w-7xl px-4 py-10">

                <p className="text-red-600">
                    {productError}
                </p>

            </main>

        );
    }


    // -----------------------------------------
    // PRODUCT NOT FOUND
    // -----------------------------------------

    if (!product) {

        return (

            <main className="mx-auto max-w-7xl px-4 py-10">

                <p className="text-gray-600 dark:text-gray-400">
                    Product not found.
                </p>

            </main>

        );
    }


    // -----------------------------------------
    // PAGE
    // -----------------------------------------

  return (
    <main className="min-h-screen bg-[#FBF7F0] px-4 py-8 text-gray-800 transition-colors dark:bg-gray-950 dark:text-gray-100 sm:px-6 lg:py-12">
        <div className="mx-auto max-w-7xl">

            {/* Breadcrumb navigation */}
            <nav className="mb-8 text-sm text-gray-500 dark:text-gray-400">
                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="transition hover:text-[#496F49]"
                >
                    Home
                </button>
                <span className="mx-2">/</span>
                <button
                    type="button"
                    onClick={() => navigate("/products")}
                    className="transition hover:text-[#496F49]"
                >
                    Products
                </button>
                <span className="mx-2">/</span>
                <span className="text-gray-800 dark:text-gray-200">
                    {product.title}
                </span>
            </nav>

            {/* Product information and image gallery */}
            <section className="grid gap-8 lg:grid-cols-2 lg:gap-14">

                {/* LEFT: Product image gallery */}
                <div>
                    <div className="relative flex min-h-[350px] items-center justify-center overflow-hidden rounded-3xl border border-[#E9E1D5] bg-white p-5 dark:border-gray-800 dark:bg-gray-900 sm:min-h-[500px] sm:p-8">
                        {product.discount > 0 && (
                            <span className="absolute left-5 top-5 z-10 rounded-full bg-[#F3DFD9] px-4 py-2 text-sm font-semibold text-[#874C47]">
                                {product.discount}% OFF
                            </span>
                        )}

                        {product.images?.length > 0 ? (
                            <img
                                src={
                                    selectedImage ||
                                    product.images[0]
                                }
                                alt={product.title}
                                className="max-h-[460px] w-full object-contain transition duration-300"
                            />
                        ) : (
                            <div className="flex min-h-[300px] items-center justify-center text-gray-400">
                                No image available
                            </div>
                        )}
                    </div>

                    {/* Thumbnail buttons appear when multiple images exist */}
                    {product.images?.length > 1 && (
                        <div className="mt-4 flex flex-wrap gap-3">
                            {product.images.map((image, index) => (
                                <button
                                    key={`${image}-${index}`}
                                    type="button"
                                    onClick={() => setSelectedImage(image)}
                                    aria-label={`View product image ${index + 1}`}
                                    aria-pressed={
                                        selectedImage === image
                                    }
                                    className={`h-20 w-20 overflow-hidden rounded-xl border-2 bg-white p-1 transition dark:bg-gray-900 ${
                                        selectedImage === image
                                            ? "border-[#718B70] ring-2 ring-[#718B70]/20"
                                            : "border-[#E9E1D5] hover:border-[#A5B99D] dark:border-gray-700"
                                    }`}
                                >
                                    <img
                                        src={image}
                                        alt={`${product.title} view ${index + 1}`}
                                        className="h-full w-full rounded-lg object-contain"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* RIGHT: Product information */}
                <div className="flex flex-col justify-center py-2">

                    {/* Category and age-group labels */}
                    <div className="mb-5 flex flex-wrap gap-2">
                        {product.category?.name && (
                            <span className="rounded-full bg-[#E7EDE2] px-4 py-2 text-xs font-semibold text-[#496F49] dark:bg-[#263629] dark:text-[#C6D7BE]">
                                {product.category.name}
                            </span>
                        )}

                        {product.ageGroup && (
                            <span className="rounded-full bg-[#F3DFD9] px-4 py-2 text-xs font-semibold text-[#874C47] dark:bg-[#432F2D] dark:text-[#F0C8BE]">
                                {product.ageGroup}
                            </span>
                        )}
                    </div>

                    {/* Product title and brand */}
                    <h1 className="text-3xl font-bold leading-tight tracking-tight text-[#303C30] dark:text-white sm:text-4xl lg:text-5xl">
                        {product.title}
                    </h1>

                    {product.brand && (
                        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                            Brand:{" "}
                            <span className="font-semibold text-[#496F49] dark:text-[#A5B99D]">
                                {product.brand}
                            </span>
                        </p>
                    )}

                    {/* Customer rating summary */}
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                        <div className="flex" aria-label={`Rated ${averageRating} out of 5`}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={`text-xl ${
                                        star <=
                                        Math.round(Number(averageRating))
                                            ? "text-amber-400"
                                            : "text-gray-300 dark:text-gray-600"
                                    }`}
                                >
                                    ★
                                </span>
                            ))}
                        </div>

                        <span className="text-sm font-semibold">
                            {averageRating} / 5
                        </span>

                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            ({reviews.length}{" "}
                            {reviews.length === 1
                                ? "review"
                                : "reviews"})
                        </span>
                    </div>

                    {/* Product description */}
                    <p className="mt-6 text-base leading-8 text-gray-600 dark:text-gray-300">
                        {product.description}
                    </p>

                    {/* Product pricing — preserve the existing price value */}
                    <div className="mt-7 border-y border-[#E9E1D5] py-6 dark:border-gray-800">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-3xl font-bold text-[#496F49] dark:text-[#A5B99D] sm:text-4xl">
                                ₹{product.price}
                            </span>

                            {product.discount > 0 && (
                                <span className="rounded-full bg-[#F3DFD9] px-3 py-1 text-sm font-semibold text-[#874C47]">
                                    Save {product.discount}%
                                </span>
                            )}
                        </div>

                        <p className={`mt-3 flex items-center gap-2 text-sm font-medium ${
                            product.stock > 0
                                ? "text-[#496F49] dark:text-[#A5B99D]"
                                : "text-red-600 dark:text-red-400"
                        }`}>
                            <span className={`h-2.5 w-2.5 rounded-full ${
                                product.stock > 0
                                    ? "bg-[#718B70]"
                                    : "bg-red-500"
                            }`} />

                            {product.stock > 0
                                ? `${product.stock} items available`
                                : "Out of stock"}
                        </p>
                    </div>

                    {/* Cart errors from Redux */}
                    {cartError && (
                        <p
                            role="alert"
                            className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400"
                        >
                            {cartError}
                        </p>
                    )}

                    {/* Purchase and wishlist actions */}
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            disabled={product.stock <= 0 || cartLoading}
                            className="flex-1 rounded-full bg-[#496F49] px-7 py-4 font-semibold text-white shadow-sm transition hover:bg-[#38573A] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {cartLoading
                                ? "Adding to Cart..."
                                : product.stock > 0
                                    ? "Add to Cart"
                                    : "Out of Stock"}
                        </button>

                        <button
                            type="button"
                            onClick={handleWishlistToggle}
                            disabled={wishlistLoading}
                            aria-label={
                                isInWishlist
                                    ? "Remove from wishlist"
                                    : "Add to wishlist"
                            }
                            className="flex items-center justify-center gap-2 rounded-full border border-[#C9D5C3] bg-white px-6 py-4 font-semibold text-[#496F49] transition hover:bg-[#E7EDE2] disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-[#C6D7BE] dark:hover:bg-gray-800"
                        >
                            <span className="text-xl">
                                {wishlistLoading
                                    ? "..."
                                    : isInWishlist
                                        ? "♥"
                                        : "♡"}
                            </span>
                            <span>
                                {isInWishlist
                                    ? "Saved"
                                    : "Wishlist"}
                            </span>
                        </button>
                    </div>

                    {/* Small reassurance cards */}
                    <div className="mt-7 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl bg-[#E7EDE2] p-4 dark:bg-[#202B22]">
                            <p className="text-sm font-semibold text-[#38573A] dark:text-[#C6D7BE]">
                                Made for little ones
                            </p>
                            <p className="mt-1 text-xs leading-5 text-gray-600 dark:text-gray-400">
                                Thoughtful essentials for your baby.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-[#F3DFD9] p-4 dark:bg-[#352725]">
                            <p className="text-sm font-semibold text-[#874C47] dark:text-[#F0C8BE]">
                                Shop with confidence
                            </p>
                            <p className="mt-1 text-xs leading-5 text-gray-600 dark:text-gray-400">
                                Find everyday baby essentials in one place.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Customer reviews */}
            <section className="mt-12 rounded-3xl border border-[#E9E1D5] bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:mt-16 sm:p-8">

                {/* Reviews heading and summary */}
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-widest text-[#718B70]">
                            Your feedback matters
                        </p>

                        <h2 className="mt-2 text-2xl font-bold text-[#303C30] dark:text-white sm:text-3xl">
                            Customer Reviews
                        </h2>

                        <div className="mt-3 flex flex-wrap items-center gap-3">
                            <span className="text-3xl font-bold text-[#496F49] dark:text-[#A5B99D]">
                                {averageRating}
                            </span>

                            <div>
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            className={`text-lg ${
                                                star <=
                                                Math.round(Number(averageRating))
                                                    ? "text-amber-400"
                                                    : "text-gray-300 dark:text-gray-600"
                                            }`}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>

                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Based on {reviews.length}{" "}
                                    {reviews.length === 1
                                        ? "review"
                                        : "reviews"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Only authenticated users without an existing review can start one */}
                    {isAuthenticated &&
                        !hasOwnReview &&
                        !editingReview && (
                            <button
                                type="button"
                                onClick={() =>
                                    setShowReviewForm((previous) => !previous)
                                }
                                className="rounded-full bg-[#496F49] px-6 py-3 font-semibold text-white transition hover:bg-[#38573A]"
                            >
                                {showReviewForm
                                    ? "Close Review Form"
                                    : "Write a Review"}
                            </button>
                        )}
                </div>

                {/* Create review form */}
                {isAuthenticated &&
                    showReviewForm &&
                    !editingReview && (
                        <div className="mt-7 rounded-2xl bg-[#FBF7F0] p-4 dark:bg-gray-800 sm:p-6">
                            <ReviewForm
                                productId={id}
                                onSuccess={() => setShowReviewForm(false)}
                            />
                        </div>
                    )}

                {/* Edit existing review form */}
                {isAuthenticated && editingReview && (
                    <div className="mt-7 rounded-2xl bg-[#FBF7F0] p-4 dark:bg-gray-800 sm:p-6">
                        <ReviewForm
                            productId={id}
                            existingReview={editingReview}
                            onSuccess={() => setEditingReview(null)}
                            onCancel={() => setEditingReview(null)}
                        />
                    </div>
                )}

                {/* Review loading state */}
                {reviewsLoading && (
                    <div className="mt-7 py-8 text-center text-gray-500 dark:text-gray-400">
                        Loading reviews...
                    </div>
                )}

                {/* Review error state */}
                {reviewsError && (
                    <div
                        role="alert"
                        className="mt-7 rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400"
                    >
                        {reviewsError}
                    </div>
                )}

                {/* Existing review list and edit action */}
                {!reviewsLoading && !reviewsError && (
                    <div className="mt-7 border-t border-[#E9E1D5] pt-6 dark:border-gray-800">
                        <ReviewList
                            reviews={reviews}
                            currentUser={user}
                            onEdit={(review) => {
                                // Close the new review form before editing.
                                setShowReviewForm(false);

                                // Open the selected review for editing.
                                setEditingReview(review);
                            }}
                        />
                    </div>
                )}
            </section>
        </div>
    </main>
);
}


export default ProductDetails;
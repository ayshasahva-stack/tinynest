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

        <main className="mx-auto max-w-7xl px-4 py-10">

            {/* ========================================= */}
            {/* PRODUCT DETAILS */}
            {/* ========================================= */}

            <div className="grid gap-10 md:grid-cols-2">


                {/* ------------------------------------- */}
                {/* PRODUCT IMAGE */}
                {/* ------------------------------------- */}

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


                {/* ------------------------------------- */}
                {/* PRODUCT INFORMATION */}
                {/* ------------------------------------- */}

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


                    {/* Product action buttons */}
                    <div className="mt-6 flex gap-3">


                        {/* Add to Cart */}
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            disabled={
                                product.stock <= 0 ||
                                cartLoading
                            }
                            className="flex-1 rounded-lg bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                        >

                            {cartLoading
                                ? "Adding to Cart..."
                                : product.stock > 0
                                    ? "Add to Cart"
                                    : "Out of Stock"}

                        </button>


                        {/* Wishlist */}
                        <button
                            type="button"
                            onClick={handleWishlistToggle}
                            disabled={wishlistLoading}
                            className="rounded-lg border border-gray-300 px-5 py-3 text-xl transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-700"
                            aria-label={
                                isInWishlist
                                    ? "Remove from wishlist"
                                    : "Add to wishlist"
                            }
                        >

                            {wishlistLoading
                                ? "..."
                                : isInWishlist
                                    ? "♥"
                                    : "♡"}

                        </button>

                    </div>

                </div>

            </div>


            {/* ========================================= */}
            {/* REVIEWS SECTION */}
            {/* ========================================= */}

            <section className="mt-10 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">


                {/* ------------------------------------- */}
                {/* REVIEWS HEADER */}
                {/* ------------------------------------- */}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">


                    <div>

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">

                            Customer Reviews

                        </h2>


                        {/* Rating summary */}
                        <div className="mt-2 flex flex-wrap items-center gap-3">


                            {/* Average rating */}
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">

                                {averageRating}

                            </span>


                            {/* Stars */}
                            <div className="flex">

                                {[1, 2, 3, 4, 5].map(
                                    (star) => (

                                        <span
                                            key={star}
                                            className={
                                                star <=
                                                    Math.round(
                                                        Number(
                                                            averageRating
                                                        )
                                                    )
                                                    ? "text-xl text-yellow-400"
                                                    : "text-xl text-gray-300 dark:text-gray-600"
                                            }
                                        >
                                            ★
                                        </span>

                                    )
                                )}

                            </div>


                            {/* Review count */}
                            <span className="text-sm text-gray-500 dark:text-gray-400">

                                {reviews.length}{" "}

                                {reviews.length === 1
                                    ? "review"
                                    : "reviews"}

                            </span>

                        </div>

                    </div>


                    {/* --------------------------------- */}
                    {/* WRITE REVIEW BUTTON */}
                    {/* --------------------------------- */}

                    {isAuthenticated &&
                        !hasOwnReview &&
                        !editingReview && (

                            <button
                                type="button"
                                onClick={() =>
                                    setShowReviewForm(
                                        (previous) =>
                                            !previous
                                    )
                                }
                                className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900"
                            >

                                {showReviewForm
                                    ? "Close"
                                    : "Write a Review"}

                            </button>

                        )}

                </div>


                {/* ========================================= */}
                {/* ADD REVIEW FORM */}
                {/* ========================================= */}

                {isAuthenticated &&
                    showReviewForm &&
                    !editingReview && (

                        <div className="mt-6">

                            <ReviewForm
                                productId={id}
                                onSuccess={() => {

                                    // Close form
                                    setShowReviewForm(
                                        false
                                    );

                                }}
                            />

                        </div>

                    )}


                {/* ========================================= */}
                {/* EDIT REVIEW FORM */}
                {/* ========================================= */}

                {isAuthenticated &&
                    editingReview && (

                        <div className="mt-6">

                            <ReviewForm
                                productId={id}
                                existingReview={
                                    editingReview
                                }
                                onSuccess={() => {

                                    // Close edit mode
                                    setEditingReview(
                                        null
                                    );

                                }}
                                onCancel={() => {

                                    // Cancel editing
                                    setEditingReview(
                                        null
                                    );

                                }}
                            />

                        </div>

                    )}


                {/* ========================================= */}
                {/* REVIEW LOADING */}
                {/* ========================================= */}

                {reviewsLoading && (

                    <div className="mt-6 text-center text-gray-500 dark:text-gray-400">

                        Loading reviews...

                    </div>

                )}


                {/* ========================================= */}
                {/* REVIEW ERROR */}
                {/* ========================================= */}

                {reviewsError && (

                    <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">

                        {reviewsError}

                    </div>

                )}


                {/* ========================================= */}
                {/* REVIEW LIST */}
                {/* ========================================= */}

                {!reviewsLoading &&
                    !reviewsError && (

                        <div className="mt-6">

                            <ReviewList
                                reviews={reviews}
                                currentUser={user}
                                onEdit={(review) => {

                                    // Close new review form
                                    setShowReviewForm(
                                        false
                                    );

                                    // Open edit form
                                    setEditingReview(
                                        review
                                    );

                                }}
                            />

                        </div>

                    )}

            </section>

        </main>

    );
}


export default ProductDetails;
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

import BabyKitSection from "../home/components/BabyKitSection"

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
    // Controls which product-details tab is currently visible.
    const [activeTab, setActiveTab] = useState("description");

    // Stores the quantity the customer wants to purchase.
    const [quantity, setQuantity] = useState(1);
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
    // Reset the gallery and quantity when a different product loads.
    useEffect(() => {
        setSelectedImage(product?.images?.[0] || "");
        setQuantity(1);
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

    // Add the selected quantity of this product to the cart.
    const handleAddToCart = async () => {
        if (!product || product.stock <= 0) {
            return;
        }

        // Never request more items than are currently in stock.
        const safeQuantity = Math.min(quantity, product.stock);

        const result = await dispatch(
            addToCartThunk({
                itemType: "product",
                product: product._id,
                quantity: safeQuantity,
            })
        );

        // Navigate only after Redux confirms the cart update succeeded.
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
        <main className="min-h-screen bg-[#F7F9FF] px-4 py-7 text-[#181C20] transition-colors dark:bg-gray-950 dark:text-gray-100 sm:px-6 lg:py-10">
            <div className="mx-auto max-w-[1240px]">

                {/* Breadcrumbs: preserve the existing application routes. */}
                <nav
                    aria-label="Breadcrumb"
                    className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[#414845] dark:text-gray-400"
                >
                    <button onClick={() => navigate("/")} type="button"
                        className="transition hover:text-[#436558]">
                        Home
                    </button>
                    <span>/</span>
                    <button onClick={() => navigate("/products")} type="button"
                        className="transition hover:text-[#436558]">
                        Shop
                    </button>
                    <span>/</span>
                    {product.category?.name && (
                        <>
                            <span>{product.category.name}</span>
                            <span>/</span>
                        </>
                    )}
                    <span className="font-semibold text-[#436558] dark:text-[#C5EBDA]">
                        {product.title}
                    </span>
                </nav>

                {/* Main product showcase: gallery left, information right. */}
                <section className="grid grid-cols-1 items-start gap-7 lg:grid-cols-12 lg:gap-10">

                    {/* Product image gallery */}
                    <div className="lg:col-span-6">
                        <div className="relative flex min-h-[350px] items-center justify-center overflow-hidden rounded-2xl bg-white p-5 shadow-sm dark:bg-gray-900 sm:min-h-[500px] sm:p-8">
                            {product.discount > 0 && (
                                <span className="absolute left-4 top-4 z-10 rounded-full bg-[#FFC9B2] px-3 py-2 text-xs font-semibold text-[#623E2D]">
                                    {product.discount}% OFF
                                </span>
                            )}

                            {product.images?.length > 0 ? (
                                <img
                                    src={selectedImage || product.images[0]}
                                    alt={product.title}
                                    className="max-h-[520px] w-full object-contain"
                                />
                            ) : (
                                <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 text-center text-[#717974] dark:text-gray-400">
                                    <span className="text-4xl" aria-hidden="true">♡</span>
                                    <p>Product image coming soon</p>
                                </div>
                            )}
                        </div>

                        {/* Thumbnails only appear when multiple real images exist. */}
                        {product.images?.length > 1 && (
                            <div className="mt-4 flex flex-wrap gap-3">
                                {product.images.map((image, index) => (
                                    <button
                                        key={`${image}-${index}`}
                                        type="button"
                                        onClick={() => setSelectedImage(image)}
                                        aria-label={`View product image ${index + 1}`}
                                        aria-pressed={selectedImage === image}
                                        className={`h-[76px] w-[76px] overflow-hidden rounded-xl border-2 bg-white p-1 transition dark:bg-gray-900 ${selectedImage === image
                                                ? "border-[#436558] ring-2 ring-[#C5EBDA]"
                                                : "border-[#E0E3E8] hover:border-[#7A9E8F] dark:border-gray-700"
                                            }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.title}, view ${index + 1}`}
                                            className="h-full w-full rounded-lg object-contain"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Small information cards use no unsupported product claims. */}
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <div className="rounded-xl bg-[#F1F4F9] p-4 dark:bg-gray-900">
                                <p className="font-semibold text-[#436558] dark:text-[#C5EBDA]">
                                    Baby essentials
                                </p>
                                <p className="mt-1 text-xs leading-5 text-[#414845] dark:text-gray-400">
                                    Explore everyday essentials for little ones.
                                </p>
                            </div>
                            <div className="rounded-xl bg-[#F1F4F9] p-4 dark:bg-gray-900">
                                <p className="font-semibold text-[#436558] dark:text-[#C5EBDA]">
                                    Need more choices?
                                </p>
                                <button
                                    type="button"
                                    onClick={() => navigate("/products")}
                                    className="mt-1 text-left text-xs underline underline-offset-4 hover:text-[#436558]"
                                >
                                    Browse all products
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Product information and purchase actions */}
                    <div className="flex flex-col py-2 lg:col-span-6 lg:pt-4">
                        <div className="mb-5 flex flex-wrap gap-2">
                            {product.category?.name && (
                                <span className="rounded-full bg-[#C5EBDA] px-3 py-2 text-xs font-medium text-[#2B4D41]">
                                    {product.category.name}
                                </span>
                            )}
                            {product.ageGroup && (
                                <span className="rounded-full bg-[#FFC9B2] px-3 py-2 text-xs font-medium text-[#623E2D]">
                                    {product.ageGroup}
                                </span>
                            )}
                        </div>

                        {/* Newsreader-style serif heading, matching the reference. */}
                        <h1 className="font-serif text-4xl font-normal leading-tight tracking-tight text-[#181C20] dark:text-white sm:text-5xl">
                            {product.title}
                        </h1>

                        {product.brand && (
                            <p className="mt-4 text-sm text-[#414845] dark:text-gray-400">
                                Brand:{" "}
                                <span className="font-semibold text-[#436558] dark:text-[#C5EBDA]">
                                    {product.brand}
                                </span>
                            </p>
                        )}

                        {/* Never show a fake 0.0 rating when there are no reviews. */}
                        {reviews.length > 0 && (
                            <div className="mt-5 flex flex-wrap items-center gap-2">
                                <div
                                    className="flex text-[#8A6A32]"
                                    aria-label={`Rated ${averageRating} out of 5`}
                                >
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span key={star} aria-hidden="true"
                                            className={star <= Math.round(Number(averageRating))
                                                ? "text-base"
                                                : "text-base text-gray-300 dark:text-gray-600"}>
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <span className="text-sm font-semibold">
                                    {averageRating}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setActiveTab("reviews");
                                        document.getElementById("product-details-tabs")
                                            ?.scrollIntoView({ behavior: "smooth" });
                                    }}
                                    className="text-sm text-[#414845] underline underline-offset-4 hover:text-[#436558] dark:text-gray-400"
                                >
                                    {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                                </button>
                            </div>
                        )}

                        <p className="mt-6 whitespace-pre-line text-[15px] leading-7 text-[#414845] dark:text-gray-300">
                            {product.description}
                        </p>

                        {/* Price and stock */}
                        <div className="mt-7 border-y border-[#E0E3E8] py-6 dark:border-gray-800">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="font-serif text-4xl font-normal text-[#436558] dark:text-[#C5EBDA]">
                                    ₹{Number(product.price).toLocaleString("en-IN")}
                                </span>
                                {product.discount > 0 && (
                                    <span className="rounded-full bg-[#FFC9B2] px-3 py-1.5 text-xs font-semibold text-[#623E2D]">
                                        {product.discount}% off
                                    </span>
                                )}
                            </div>

                            <p className={`mt-4 flex items-center gap-2 text-sm ${product.stock > 0
                                    ? "text-[#436558] dark:text-[#C5EBDA]"
                                    : "text-red-600 dark:text-red-400"
                                }`}>
                                <span className={`h-2.5 w-2.5 rounded-full ${product.stock > 0 ? "bg-[#436558]" : "bg-red-500"
                                    }`} />
                                {product.stock > 0
                                    ? `${product.stock} items available`
                                    : "Out of stock"}
                            </p>
                        </div>

                        {/* Quantity selector; it cannot exceed current stock. */}
                        <div className="mt-6 flex flex-wrap items-center gap-4">
                            <span className="text-sm font-semibold">Quantity</span>
                            <div className="flex items-center overflow-hidden rounded-full border border-[#C1C8C3] bg-white dark:border-gray-700 dark:bg-gray-900">
                                <button
                                    type="button"
                                    aria-label="Decrease quantity"
                                    disabled={quantity <= 1}
                                    onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                                    className="h-11 w-11 text-lg transition hover:bg-[#F1F4F9] disabled:opacity-40 dark:hover:bg-gray-800"
                                >
                                    −
                                </button>
                                <span aria-live="polite" className="min-w-10 text-center text-sm font-semibold">
                                    {quantity}
                                </span>
                                <button
                                    type="button"
                                    aria-label="Increase quantity"
                                    disabled={quantity >= product.stock}
                                    onClick={() => setQuantity((current) => Math.min(product.stock, current + 1))}
                                    className="h-11 w-11 text-lg transition hover:bg-[#F1F4F9] disabled:opacity-40 dark:hover:bg-gray-800"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {cartError && (
                            <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
                                {cartError}
                            </p>
                        )}

                        {wishlistLoading && (
                            <p className="mt-3 text-sm text-[#717974] dark:text-gray-400">
                                Updating wishlist…
                            </p>
                        )}

                        {/* Primary Add to Cart and secondary Wishlist actions. */}
                        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                disabled={product.stock <= 0 || cartLoading}
                                className="flex min-h-14 flex-1 items-center justify-center rounded-full bg-[#436558] px-6 py-4 font-semibold text-white transition hover:bg-[#2B4D41] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {cartLoading
                                    ? "Adding to Cart…"
                                    : product.stock > 0
                                        ? `Add ${quantity} to Cart`
                                        : "Out of Stock"}
                            </button>

                            <button
                                type="button"
                                onClick={handleWishlistToggle}
                                disabled={wishlistLoading}
                                aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                                className="flex min-h-14 items-center justify-center gap-2 rounded-full border border-[#C1C8C3] bg-white px-6 py-4 font-semibold text-[#436558] transition hover:bg-[#F1F4F9] disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-[#C5EBDA] dark:hover:bg-gray-800"
                            >
                                <span aria-hidden="true" className="text-xl">
                                    {isInWishlist ? "♥" : "♡"}
                                </span>
                                {isInWishlist ? "Saved to Wishlist" : "Add to Wishlist"}
                            </button>
                        </div>
                    </div>
                </section>

                {/* Tab navigation inspired by the Stitch product-details reference. */}
                <section id="product-details-tabs" className="mt-12 scroll-mt-6 sm:mt-16">
                    <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-gray-900">
                        <div
                            role="tablist"
                            aria-label="Product information"
                            className="flex gap-1 overflow-x-auto border-b border-[#E0E3E8] p-2 dark:border-gray-800 sm:justify-center sm:p-3"
                        >
                            {[
                                { id: "description", label: "Description" },
                                { id: "details", label: "Details" },
                                { id: "care", label: "Care Information" },
                                { id: "reviews", label: `Parent Reviews (${reviews.length})` },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    role="tab"
                                    id={`tab-${tab.id}`}
                                    aria-selected={activeTab === tab.id}
                                    aria-controls={`panel-${tab.id}`}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`shrink-0 rounded-xl px-4 py-3 text-sm font-semibold transition sm:px-6 ${activeTab === tab.id
                                            ? "bg-[#436558] text-white"
                                            : "text-[#414845] hover:bg-[#F1F4F9] dark:text-gray-300 dark:hover:bg-gray-800"
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="p-5 sm:p-8">
                            {/* Description tab: show the actual saved description. */}
                            {activeTab === "description" && (
                                <div
                                    role="tabpanel"
                                    id="panel-description"
                                    aria-labelledby="tab-description"
                                >
                                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#436558] dark:text-[#C5EBDA]">
                                        About this product
                                    </p>
                                    <h2 className="mb-4 font-serif text-3xl font-normal">
                                        Made for everyday moments
                                    </h2>
                                    <p className="max-w-3xl whitespace-pre-line text-[15px] leading-7 text-[#414845] dark:text-gray-300">
                                        {product.description || "No additional description has been provided for this product yet."}
                                    </p>
                                </div>
                            )}

                            {/* Details tab: only display fields actually available in the product record. */}
                            {activeTab === "details" && (
                                <div
                                    role="tabpanel"
                                    id="panel-details"
                                    aria-labelledby="tab-details"
                                >
                                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#436558] dark:text-[#C5EBDA]">
                                        Product information
                                    </p>
                                    <h2 className="mb-6 font-serif text-3xl font-normal">
                                        Fabric & Details
                                    </h2>

                                    <dl className="grid gap-4 sm:grid-cols-2">
                                        {[
                                            ["Product", product.title],
                                            ["Brand", product.brand],
                                            ["Category", product.category?.name],
                                            ["Age group", product.ageGroup],
                                            ["Available stock", String(product.stock ?? 0)],
                                        ]
                                            .filter(([, value]) => value != null && value !== "")
                                            .map(([label, value]) => (
                                                <div key={label} className="rounded-xl bg-[#F1F4F9] p-4 dark:bg-gray-800">
                                                    <dt className="text-xs font-medium uppercase tracking-wider text-[#717974] dark:text-gray-400">
                                                        {label}
                                                    </dt>
                                                    <dd className="mt-2 font-semibold">{value}</dd>
                                                </div>
                                            ))}
                                    </dl>

                                    {product.tags?.length > 0 && (
                                        <div className="mt-6">
                                            <h3 className="mb-3 font-semibold">Product tags</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {product.tags.map((tag, index) => (
                                                    <span key={`${tag}-${index}`} className="rounded-full bg-[#C5EBDA] px-3 py-2 text-xs text-[#2B4D41]">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Care tab: avoid inventing material-specific instructions. */}
                            {activeTab === "care" && (
                                <div
                                    role="tabpanel"
                                    id="panel-care"
                                    aria-labelledby="tab-care"
                                >
                                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#436558] dark:text-[#C5EBDA]">
                                        Product care
                                    </p>
                                    <h2 className="mb-4 font-serif text-3xl font-normal">
                                        Care Information
                                    </h2>
                                    <p className="max-w-3xl text-[15px] leading-7 text-[#414845] dark:text-gray-300">
                                        Specific washing and care instructions have not been provided in this product's current details. Please follow the care label or instructions supplied with the product.
                                    </p>
                                </div>
                            )}

                            {/* Parent Reviews tab: retain existing review CRUD and ownership logic. */}
                            {activeTab === "reviews" && (
                                <div
                                    role="tabpanel"
                                    id="panel-reviews"
                                    aria-labelledby="tab-reviews"
                                >
                                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#436558] dark:text-[#C5EBDA]">
                                                Your feedback matters
                                            </p>
                                            <h2 className="font-serif text-3xl font-normal">
                                                Parent Reviews
                                            </h2>

                                            {reviews.length > 0 && (
                                                <div className="mt-3 flex items-center gap-3">
                                                    <span className="font-serif text-4xl text-[#436558] dark:text-[#C5EBDA]">
                                                        {averageRating}
                                                    </span>
                                                    <div>
                                                        <div className="text-[#8A6A32]" aria-hidden="true">
                                                            {"★".repeat(Math.round(Number(averageRating)))}
                                                            <span className="text-gray-300 dark:text-gray-600">
                                                                {"★".repeat(5 - Math.round(Number(averageRating)))}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-[#717974] dark:text-gray-400">
                                                            Based on {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {isAuthenticated && !hasOwnReview && !editingReview && (
                                            <button
                                                type="button"
                                                onClick={() => setShowReviewForm((previous) => !previous)}
                                                className="rounded-full bg-[#436558] px-6 py-3 font-semibold text-white transition hover:bg-[#2B4D41]"
                                            >
                                                {showReviewForm ? "Close Review Form" : "Write a Review"}
                                            </button>
                                        )}
                                    </div>

                                    {isAuthenticated && showReviewForm && !editingReview && (
                                        <div className="mt-6 rounded-xl bg-[#F1F4F9] p-4 dark:bg-gray-800 sm:p-6">
                                            <ReviewForm
                                                productId={id}
                                                onSuccess={() => setShowReviewForm(false)}
                                            />
                                        </div>
                                    )}

                                    {isAuthenticated && editingReview && (
                                        <div className="mt-6 rounded-xl bg-[#F1F4F9] p-4 dark:bg-gray-800 sm:p-6">
                                            <ReviewForm
                                                productId={id}
                                                existingReview={editingReview}
                                                onSuccess={() => setEditingReview(null)}
                                                onCancel={() => setEditingReview(null)}
                                            />
                                        </div>
                                    )}

                                    {reviewsLoading && (
                                        <p className="py-8 text-center text-[#717974] dark:text-gray-400">
                                            Loading reviews…
                                        </p>
                                    )}

                                    {reviewsError && (
                                        <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
                                            {reviewsError}
                                        </p>
                                    )}

                                    {!reviewsLoading && !reviewsError && (
                                        <div className="mt-6 border-t border-[#E0E3E8] pt-6 dark:border-gray-800">
                                            <ReviewList
                                                reviews={reviews}
                                                currentUser={user}
                                                onEdit={(review) => {
                                                    setShowReviewForm(false);
                                                    setEditingReview(review);
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
                <BabyKitSection />
            </div>
        </main>
    );


}


export default ProductDetails;
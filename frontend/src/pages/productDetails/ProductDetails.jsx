import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate, useParams } from "react-router-dom";

import {
    fetchProductById,
} from "../../features/products/productThunk";

import {
    addToCartThunk,
} from "../../features/cart/cartThunk";

import {
    addToWishlistThunk,
    getMyWishlistThunk,
    removeFromWishlistThunk,
} from "../../features/wishlist/wishlistThunk";

import {
    selectAuthUser,
    selectIsAuthenticated,
} from "../../features/auth/authSelectors";

import {
    selectSelectedProduct,
    selectProductsLoading,
    selectProductsError,
} from "../../features/products/productSelectors";

import {
    selectCartLoading,
    selectCartError,
} from "../../features/cart/cartSelectors";

import {
    selectWishlistLoading,
    selectWishlistProducts,
} from "../../features/wishlist/wishlistSelectors";

import {
    getProductReviewsThunk,
} from "../../features/reviews/reviewThunk";

import {
    selectReviews,
    selectReviewLoading,
    selectReviewError,
} from "../../features/reviews/reviewSelectors";


import ReviewForm from "./components/ReviewForm";
import ReviewList from "./components/ReviewList";

import BabyKitSection from "../home/components/BabyKitSection"


function ProductDetails() {

    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectAuthUser);

    const isAuthenticated = useSelector(
        selectIsAuthenticated
    );

    const product = useSelector(selectSelectedProduct);
    useEffect(() => {
        if (product) {
            console.log("Product title:", product.title);
            console.log("Product images:", product.images);
            console.log("Image count:", product.images?.length);
        }
    }, [product]);

    const productLoading = useSelector(
        selectProductsLoading
    );

    const productError = useSelector(
        selectProductsError
    );

    const cartLoading = useSelector(
        selectCartLoading
    );

    const cartError = useSelector(
        selectCartError
    );
    const wishlistLoading = useSelector(
        selectWishlistLoading
    );

    const wishlistProducts = useSelector(
        selectWishlistProducts
    );

    const reviews = useSelector(
        selectReviews
    );

    const reviewsLoading = useSelector(
        selectReviewLoading
    );

    const reviewsError = useSelector(
        selectReviewError
    );
    const [showReviewForm, setShowReviewForm] =
        useState(false);

    const [editingReview, setEditingReview] =
        useState(null);

    const [selectedImage, setSelectedImage] = useState("");
    const [activeTab, setActiveTab] = useState("description");

    const [quantity, setQuantity] = useState(1);

    useEffect(() => {

        dispatch(fetchProductById(id));
        dispatch(getMyWishlistThunk());
        dispatch(getProductReviewsThunk(id));
    }, [dispatch, id]);
    useEffect(() => {
        setSelectedImage(product?.images?.[0] || "");
        setQuantity(1);
    }, [product?._id, product?.images]);

    const isInWishlist =
        product &&
        wishlistProducts.some(
            (wishlistProduct) =>
                wishlistProduct._id === product._id
        );

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
        if (
            currentUserId &&
            reviewUserId
        ) {
            return currentUserId === reviewUserId;
        }

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
    const handleAddToCart = async () => {
        if (!product || product.stock <= 0) {
            return;
        }

        const safeQuantity = Math.min(quantity, product.stock);

        const result = await dispatch(
            addToCartThunk({
                itemType: "product",
                product: product._id,
                quantity: safeQuantity,
            })
        );

        if (addToCartThunk.fulfilled.match(result)) {
            navigate("/cart");
        }
    };

    const handleWishlistToggle = () => {

        if (!product) {
            return;
        }

        if (isInWishlist) {

            dispatch(
                removeFromWishlistThunk(product._id)
            );

        } else {
            dispatch(
                addToWishlistThunk(product._id)
            );

        }
    };

    if (productLoading) {

        return (

            <main className="mx-auto max-w-7xl px-4 py-10">

                <p className="text-gray-600 dark:text-gray-400">
                    Loading product...
                </p>

            </main>

        );
    }

    if (productError) {

        return (

            <main className="mx-auto max-w-7xl px-4 py-10">

                <p className="text-red-600">
                    {productError}
                </p>

            </main>

        );
    }

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
        <main className="min-h-screen bg-[#F7F9FF] px-4 py-7 text-[#181C20] transition-colors dark:bg-gray-950 dark:text-gray-100 sm:px-6 lg:py-10">
            <div className="mx-auto max-w-[1240px]">

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

                <section className="grid grid-cols-1 items-start gap-7 lg:grid-cols-12 lg:gap-10">

                    <div className="lg:col-span-6">
                        <div className="relative flex min-h-[350px] items-center justify-center sm:min-h-[500px]">
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

                        <h1 className="font-serif text-2xl font-normal leading-tight tracking-tight text-[#181C20] dark:text-white sm:text-3xl lg:text-4xl">
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

                        {cartError && (
                            <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
                                {cartError}
                            </p>
                        )}

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
                                        ? `Add to Cart`
                                        : "Out of Stock"}
                            </button>

                            <button
                                type="button"
                                onClick={handleWishlistToggle}
                                aria-pressed={isInWishlist}
                                disabled={!isAuthenticated}
                                aria-label={
                                    isInWishlist
                                        ? "Remove kit from wishlist"
                                        : "Add kit to wishlist"
                                }
                                className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-full border border-[#C1C8C3] bg-white px-6 py-4 font-semibold text-[#436558] transition hover:bg-[#F1F4F9] disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-[#C5EBDA] dark:hover:bg-gray-800"
                            >
                                <span aria-hidden="true" className="text-xl">
                                    {isInWishlist ? "♥" : "♡"}
                                </span>
                                {isInWishlist
                                    ? "Saved to Wishlist"
                                    : "Add to Wishlist"}
                            </button>
                        </div>
                    </div>
                </section>
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
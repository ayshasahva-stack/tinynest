import Review from "./review.model.js";
import Product from "../products/product.model.js";
import ApiError from "../../utils/Apierror.js";
import sendSuccessResponse from "../../utils/ApiResponse.js";
import {
    validateReviewProduct,
    validateReview
} from "./review.validation.js";

// Add a review for a product
export const addReview = async (req, res, next) => {
    try {
        const { productId } = req.params;

        // Validate the product ID
        const productIdError = validateReviewProduct(productId);

        if (productIdError) {
            return next(new ApiError(400, productIdError));
        }

        // Validate rating and comment
        const validationError = validateReview(req.body);

        if (validationError) {
            return next(new ApiError(400, validationError));
        }

        // Make sure the product exists
        const product = await Product.findById(productId);

        if (!product) {
            return next(new ApiError(404, "Product not found"));
        }

        // Check whether this user has already reviewed this product
        const existingReview = await Review.findOne({
            user: req.user._id,
            product: productId
        });

        if (existingReview) {
            return next(
                new ApiError(
                    400,
                    "You have already reviewed this product"
                )
            );
        }

        // Create the review
        const review = await Review.create({
            user: req.user._id,
            product: productId,
            rating: req.body.rating,
            comment: req.body.comment || ""
        });

        // Populate user information for the response
        await review.populate("user", "email");

        return sendSuccessResponse(
            res,
            201,
            review,
            "Review added successfully"
        );
    } catch (error) {
        next(error);
    }
};
// Get all reviews for a specific product
export const getProductReviews = async (req, res, next) => {
    try {
        const { productId } = req.params;

        // Validate the product ID
        const productIdError = validateReviewProduct(productId);

        if (productIdError) {
            return next(new ApiError(400, productIdError));
        }

        // Make sure the product exists
        const product = await Product.findById(productId);

        if (!product) {
            return next(new ApiError(404, "Product not found"));
        }

        // Find all reviews for this product
        const reviews = await Review.find({
            product: productId
        })
            .populate("user", "email")
            .sort({ createdAt: -1 });

        return sendSuccessResponse(
            res,
            200,
            reviews,
            "Product reviews fetched successfully"
        );
    } catch (error) {
        next(error);
    }
};
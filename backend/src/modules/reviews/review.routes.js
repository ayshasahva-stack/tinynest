import express from "express";
import protect from "../../middleware/auth.middleware.js";
import {
    addReview,
    getProductReviews,
    updateMyReview,
} from "./review.controller.js";

const router = express.Router();

// Add a review for a product
router.post("/:productId", protect, addReview);
// Get all reviews for a product
router.get("/product/:productId", getProductReviews);
// Update the logged-in user's own review
router.patch("/:reviewId", protect, updateMyReview);

export default router;
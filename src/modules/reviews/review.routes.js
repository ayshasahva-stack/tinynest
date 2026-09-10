import express from "express";
import protect from "../../middleware/auth.middleware.js";
import authorizeAdmin from "../../middleware/admin.middleware.js";
import {
    addReview,
    getProductReviews,
    updateMyReview,
    deleteMyReview,
    getAllReviews,
    adminDeleteReview,
} from "./review.controller.js";

const router = express.Router();

// Add a review for a product
router.post("/:productId", protect, addReview);
// Get all reviews for a product
router.get("/product/:productId", getProductReviews);
// Admin: get all reviews
router.get("/admin", protect, authorizeAdmin, getAllReviews);
// Update the logged-in user's own review
router.patch("/:reviewId", protect, updateMyReview);
// Admin: delete any review
router.delete("/admin/:reviewId",protect,authorizeAdmin, adminDeleteReview);
// Delete the logged-in user's own review
router.delete("/:reviewId", protect, deleteMyReview);


export default router;
import express from "express";
import protect from "../../middleware/auth.middleware.js";
import { addReview } from "./review.controller.js";

const router = express.Router();

// Add a review for a product
router.post("/:productId", protect, addReview);

export default router;
import express from "express";
import protect from "../../middleware/auth.middleware.js";

import {
    addToWishlist,
    getMyWishlist,
    removeFromWishlist,
    clearWishlist
} from "./wishlist.controller.js";

const router = express.Router();

// Add a product to the logged-in user's wishlist
router.post("/:productId", protect, addToWishlist);

// Get the logged-in user's wishlist
router.get("/", protect, getMyWishlist);

// Remove a product from the wishlist
router.delete("/:productId", protect, removeFromWishlist);

// Remove all products from the wishlist
router.delete("/", protect, clearWishlist);

export default router;
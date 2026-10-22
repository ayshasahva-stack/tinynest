
import express from "express";
import protect from "../../middleware/auth.middleware.js";

import {
    addToWishlist,
    addKitToWishlist,
    getMyWishlist,
    removeFromWishlist,
    removeKitFromWishlist,
    clearWishlist,
} from "./wishlist.controller.js";

const router = express.Router();

// All wishlist routes require a logged-in user.
router.get("/", protect, getMyWishlist);

// Kit wishlist routes.
router.post("/kit/:kitId", protect, addKitToWishlist);
router.delete("/kit/:kitId", protect, removeKitFromWishlist);

// Existing product wishlist routes — preserved.
router.post("/:productId", protect, addToWishlist);
router.delete("/:productId", protect, removeFromWishlist);

// Clear products and kits.
router.delete("/", protect, clearWishlist);

export default router;

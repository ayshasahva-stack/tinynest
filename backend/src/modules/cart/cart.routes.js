import express from "express";
import protect from "../../middleware/auth.middleware.js";
import {
    addToCart,
    getMyCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
} from "./cart.controller.js";

const router = express.Router();

// Add a product to the logged-in user's cart
router.post("/", protect, addToCart);
// Get the logged-in user's cart
router.get("/", protect, getMyCart);
// Update the quantity of a product or kit
router.patch("/:itemType/:itemId", protect, updateCartQuantity);
// Remove a product or kit from the cart
router.delete("/:itemType/:itemId", protect, removeFromCart);
// Remove all products from the cart
router.delete("/", protect, clearCart);


export default router;
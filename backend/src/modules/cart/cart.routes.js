import express from "express";
import protect from "../../middleware/auth.middleware.js";
import { addToCart } from "./cart.controller.js";

const router = express.Router();

// Add a product to the logged-in user's cart
router.post("/", protect, addToCart);

export default router;
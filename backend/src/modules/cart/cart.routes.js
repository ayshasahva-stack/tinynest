import express from "express";
import protect from "../../middleware/auth.middleware.js";
import { addToCart,
    getMyCart,
} from "./cart.controller.js";

const router = express.Router();

// Add a product to the logged-in user's cart
router.post("/", protect, addToCart);
// Get the logged-in user's cart
router.get("/", protect, getMyCart);
export default router;
import express from "express";
import protect from "../../middleware/auth.middleware.js";
import { createOrder } from "./order.controller.js";

const router = express.Router();

// Create an order from the logged-in user's cart
router.post("/", protect, createOrder);

export default router;
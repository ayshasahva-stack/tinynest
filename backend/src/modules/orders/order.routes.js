import express from "express";
import protect from "../../middleware/auth.middleware.js";
import {
    createOrder,
    getMyOrders,
    getMyOrderById,
} from "./order.controller.js";

const router = express.Router();

// Create an order from the logged-in user's cart
router.post("/", protect, createOrder);
// Get all orders belonging to the logged-in user
router.get("/", protect, getMyOrders);
// Get one order belonging to the logged-in user
router.get("/:orderId", protect, getMyOrderById);

export default router;
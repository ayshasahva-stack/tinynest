
import express from "express";
import protect from "../../middleware/auth.middleware.js";
import authorizeAdmin from "../../middleware/admin.middleware.js";

import {
    createOrder,
    getMyOrders,
    getMyOrderById,
    cancelMyOrder,
    abandonPendingRazorpayOrder,
    getAllOrders,
    updateOrderStatus,
    confirmCodPayment, // New: confirm COD payment collection
} from "./order.controller.js";

const router = express.Router();

// Create an order from the logged-in user's cart
router.post("/", protect, createOrder);

// Get all orders belonging to the logged-in user
router.get("/", protect, getMyOrders);

// Get all customer orders - Admin only
router.get("/admin", protect, authorizeAdmin, getAllOrders);

// Update order status - Admin only
router.patch(
    "/:orderId/status",
    protect,
    authorizeAdmin,
    updateOrderStatus
);

// Confirm COD payment after delivery - Admin only
router.patch(
    "/:orderId/confirm-cod-payment",
    protect,
    authorizeAdmin,
    confirmCodPayment
);

// Get one order belonging to the logged-in user
router.get("/:orderId", protect, getMyOrderById);

// Safely abandon an unpaid Razorpay checkout and restore cart/inventory.
router.patch("/:orderId/abandon-payment", protect, abandonPendingRazorpayOrder);

// Cancel an order belonging to the logged-in user (existing cancellation/refund flow)
router.patch("/:orderId/cancel", protect, cancelMyOrder);

export default router;

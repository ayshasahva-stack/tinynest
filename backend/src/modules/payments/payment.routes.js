import express from "express";
import protect from "../../middleware/auth.middleware.js";
import authorizeAdmin from "../../middleware/admin.middleware.js";
import {
    createPayment,
    getMyPayment,
    getAllPayments,
    updatePaymentStatus,
    createRazorpayOrder,
} from "./payment.controller.js";

const router = express.Router();

// Create a Razorpay order for the logged-in user's order
router.post("/razorpay/:orderId", protect, createRazorpayOrder);
// Create payment for the logged-in user's order
router.post("/:orderId", protect, createPayment);
// Admin: get all payments
router.get("/admin", protect, authorizeAdmin, getAllPayments);
// Admin: update payment status
router.patch("/:paymentId/status", protect, authorizeAdmin, updatePaymentStatus);
// Get payment for the logged-in user's order
router.get("/:orderId", protect, getMyPayment);

export default router;
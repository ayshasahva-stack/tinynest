import express from "express";
import protect from "../../middleware/auth.middleware.js";
import authorizeAdmin from "../../middleware/admin.middleware.js";
import {
    createPayment,
    getMyPayment,
    getAllPayments,
    updatePaymentStatus,
    createRazorpayOrder,
    verifyRazorpayPayment,
    createRazorpayCheckoutSession,
    verifyRazorpayCheckoutSession,
} from "./payment.controller.js";

const router = express.Router();

// Create a payment attempt without creating a TinyNest order.
router.post("/razorpay/checkout-session", protect, createRazorpayCheckoutSession);
// Verify a captured checkout attempt and only then create a TinyNest order.
router.post("/razorpay/checkout-session/verify", protect, verifyRazorpayCheckoutSession);

// Legacy verification route retained for existing payment/order records.
// Verify the Razorpay payment signature
router.post("/razorpay/verify", protect, verifyRazorpayPayment);
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
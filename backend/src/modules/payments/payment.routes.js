import express from "express";
import protect from "../../middleware/auth.middleware.js";
import authorizeAdmin from "../../middleware/admin.middleware.js";
import {
    createPayment,
    getMyPayment,
    getAllPayments,
} from "./payment.controller.js";

const router = express.Router();

// Create payment for the logged-in user's order
router.post("/:orderId", protect, createPayment);
// Admin: get all payments
router.get("/admin", protect, authorizeAdmin, getAllPayments);
// Get payment for the logged-in user's order
router.get("/:orderId", protect, getMyPayment);

export default router;
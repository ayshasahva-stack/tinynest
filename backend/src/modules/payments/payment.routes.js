import express from "express";
import protect from "../../middleware/auth.middleware.js";
import { createPayment } from "./payment.controller.js";

const router = express.Router();

// Create payment for the logged-in user's order
router.post("/:orderId", protect, createPayment);

export default router;
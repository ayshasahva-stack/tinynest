import express from "express";
import protect from "../../middleware/auth.middleware.js";
import authorizeAdmin from "../../middleware/admin.middleware.js";
import { createCoupon } from "./coupon.controller.js";

const router = express.Router();

// Admin: create coupon
router.post("/", protect, authorizeAdmin, createCoupon);

export default router;
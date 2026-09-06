import express from "express";
import protect from "../../middleware/auth.middleware.js";
import authorizeAdmin from "../../middleware/admin.middleware.js";
import {
    createCoupon,
    getActiveCoupons,
    getAllCoupons,
    updateCoupon,
} from "./coupon.controller.js";

const router = express.Router();

// Admin: create coupon
router.post("/", protect, authorizeAdmin, createCoupon);
// Public: get currently active coupons
router.get("/", getActiveCoupons);
// Admin: get all coupons
router.get("/admin", protect, authorizeAdmin, getAllCoupons);
// Admin: update coupon
router.patch("/:couponId", protect, authorizeAdmin, updateCoupon);
export default router;
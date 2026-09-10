import express from "express";

import protect from "../../middleware/auth.middleware.js";
import authorizeAdmin from "../../middleware/admin.middleware.js";

import {
    getMyOrderTracking,
    addTrackingUpdate
} from "./orderTracking.controller.js";

const router = express.Router();

// Customer: get tracking history for their own order
router.get("/:orderId", protect, getMyOrderTracking);

// Admin: add a new tracking update
router.post(
    "/:orderId",
    protect,
    authorizeAdmin,
    addTrackingUpdate
);

export default router;
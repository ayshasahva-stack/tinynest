import express from "express";

import protect from "../../middleware/auth.middleware.js";
import authorizeAdmin from "../../middleware/admin.middleware.js";
import {
    requestRefund,
    getAllRefunds,
} from "./refund.controller.js";

const router = express.Router();

// Customer: request a refund
router.post( "/:orderId", protect, requestRefund);
// Admin: get all refund requests
router.get("/admin", protect, authorizeAdmin, getAllRefunds);

export default router;
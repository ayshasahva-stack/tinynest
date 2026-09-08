import express from "express";

import protect from "../../middleware/auth.middleware.js";
import authorizeAdmin from "../../middleware/admin.middleware.js";
import {
    requestRefund,
    getAllRefunds,
    updateRefundStatus,
    processRefund,
} from "./refund.controller.js";

const router = express.Router();

// Customer: request a refund
router.post( "/:orderId", protect, requestRefund);
// Admin: get all refund requests
router.get("/admin", protect, authorizeAdmin, getAllRefunds);
// Admin: approve or reject a refund request
router.patch("/:refundId/status",protect,authorizeAdmin,updateRefundStatus);
// Admin: move an approved refund into processing
router.patch("/:refundId/process",protect,authorizeAdmin,processRefund);

export default router;
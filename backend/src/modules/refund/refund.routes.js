import express from "express";

import protect from "../../middleware/auth.middleware.js";
import authorizeAdmin from "../../middleware/admin.middleware.js";
import {
    requestRefund,
    getAllRefunds,
    updateRefundStatus,
    processRefund,
    completeRefund,
    createCancellationRefund,
} from "./refund.controller.js";

const router = express.Router();

// Customer: request a refund
router.post("/:orderId", protect, requestRefund);
// Customer: create a refund for a cancelled paid online order
router.post("/:orderId/cancellation", protect, createCancellationRefund);
// Admin: get all refund requests
router.get("/admin", protect, authorizeAdmin, getAllRefunds);
// Admin: approve or reject a refund request
router.patch("/:refundId/status", protect, authorizeAdmin, updateRefundStatus);
// Admin: move an approved refund into processing
router.patch("/:refundId/process", protect, authorizeAdmin, processRefund);
// Admin: complete a refund that is being processed
router.patch("/:refundId/complete", protect, authorizeAdmin, completeRefund);

export default router;
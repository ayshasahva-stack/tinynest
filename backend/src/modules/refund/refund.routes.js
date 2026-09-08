import express from "express";

import protect from "../../middleware/auth.middleware.js";

import {
    requestRefund
} from "./refund.controller.js";

const router = express.Router();

// Customer: request a refund
router.post(
    "/:orderId",
    protect,
    requestRefund
);

export default router;
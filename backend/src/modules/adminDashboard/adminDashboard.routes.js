import express from "express";

import protect from "../../middleware/auth.middleware.js";
import authorizeAdmin from "../../middleware/admin.middleware.js";

import {
    getDashboardOverview,
    getRecentOrders,

} from "./adminDashboard.controller.js";

const router = express.Router();

// Admin: get dashboard overview statistics
router.get("/overview", protect, authorizeAdmin, getDashboardOverview);
// Admin: get the most recent orders
router.get("/recent-orders", protect, authorizeAdmin, getRecentOrders);

export default router;
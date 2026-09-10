import express from "express";

import protect from "../../middleware/auth.middleware.js";
import authorizeAdmin from "../../middleware/admin.middleware.js";

import {
    getDashboardOverview
} from "./adminDashboard.controller.js";

const router = express.Router();

// Admin: get dashboard overview statistics
router.get("/overview",protect,authorizeAdmin, getDashboardOverview);

export default router;
import express from "express";

import protect from "../../middleware/auth.middleware.js";
import authorizeAdmin from "../../middleware/admin.middleware.js";

import {
    getDashboardOverview,
    getRecentOrders,
    getSalesStatistics,
    getTopSellingProducts,
    getOrderStatistics,
    getUserStatistics,
    getRefundStatistics,
    getPaymentStatistics,
    getLowStockProducts,
    getRecentCustomers
} from "./adminDashboard.controller.js";

const router = express.Router();

// Admin: get dashboard overview statistics
router.get("/overview", protect, authorizeAdmin, getDashboardOverview);
// Admin: get the most recent orders
router.get("/recent-orders", protect, authorizeAdmin, getRecentOrders);
// Admin: get daily sales for the current month
router.get("/sales", protect, authorizeAdmin, getSalesStatistics);
// Admin: get top-selling products
router.get("/top-products", protect, authorizeAdmin, getTopSellingProducts);
// Admin: get order statistics by status
router.get("/order-statistics", protect, authorizeAdmin, getOrderStatistics);
// Admin: get user statistics
router.get("/user-statistics", protect, authorizeAdmin, getUserStatistics);
// Admin: get refund statistics by status
router.get("/refund-statistics", protect, authorizeAdmin, getRefundStatistics);
// Admin: get payment statistics by payment method
router.get("/payment-statistics", protect, authorizeAdmin, getPaymentStatistics);
// Admin: get products with low stock
router.get("/low-stock", protect, authorizeAdmin, getLowStockProducts);
// Admin: get the most recently registered customers
router.get("/recent-customers", protect, authorizeAdmin, getRecentCustomers);

export default router;
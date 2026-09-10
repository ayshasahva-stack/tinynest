import User from "../auth/auth.model.js";
import Product from "../products/product.model.js";
import Order from "../orders/order.model.js";
import Refund from "../refund/refund.model.js";

import ApiError from "../../utils/Apierror.js";
import sendSuccessResponse from "../../utils/ApiResponse.js";

// Admin: get dashboard overview statistics
export const getDashboardOverview = async (req, res, next) => {
    try {
        // Count all registered users
        const totalUsers = await User.countDocuments();
        // Count regular customers separately from admin accounts
        const totalCustomers = await User.countDocuments({
            role: "user"
        });

        // Count admin accounts
        const totalAdmins = await User.countDocuments({
            role: "admin"
        });

        // Count all products
        const totalProducts = await Product.countDocuments();

        // Count all orders
        const totalOrders = await Order.countDocuments();

        // Calculate revenue from confirmed, processing,
        // shipped, and delivered orders.
        // Cancelled orders are not included in revenue.
        const revenueResult = await Order.aggregate([
            {
                $match: {
                    status: {
                        $in: [
                            "confirmed",
                            "processing",
                            "shipped",
                            "delivered"
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: "$totalAmount"
                    }
                }
            }
        ]);

        // Get the calculated revenue.
        // If there are no matching orders, use 0.
        const totalRevenue =
            revenueResult.length > 0
                ? revenueResult[0].totalRevenue
                : 0;

        // Count orders by their current status
        const pendingOrders = await Order.countDocuments({
            status: "pending"
        });

        const deliveredOrders = await Order.countDocuments({
            status: "delivered"
        });

        const cancelledOrders = await Order.countDocuments({
            status: "cancelled"
        });

        // Count refunds by their current status
        const pendingRefunds = await Refund.countDocuments({
            status: "requested"
        });

        const completedRefunds = await Refund.countDocuments({
            status: "completed"
        });

        // Prepare the dashboard overview data
        const overview = {
            totalUsers,
            totalCustomers,
            totalAdmins,
            totalProducts,
            totalOrders,
            totalRevenue,
            pendingOrders,
            deliveredOrders,
            cancelledOrders,
            pendingRefunds,
            completedRefunds
        };

        // Send the dashboard statistics
        return sendSuccessResponse(
            res,
            200,
            overview,
            "Dashboard overview fetched successfully"
        );
    } catch (error) {
        next(error);
    }
};

// Admin: get the most recent orders
export const getRecentOrders = async (req, res, next) => {
    try {
        // Get the latest 5 orders
        const orders = await Order.find()
            // Include basic customer information
            .populate("user", "email phone")
            // Include product information
            .populate("items.product")
            // Show newest orders first
            .sort({ createdAt: -1 })
            // Limit the result to 5 orders
            .limit(5);

        // Send the recent orders
        return sendSuccessResponse(
            res,
            200,
            orders,
            "Recent orders fetched successfully"
        );
    } catch (error) {
        next(error);
    }
};

// Admin: get daily sales for the current month
export const getSalesStatistics = async (req, res, next) => {
    try {
        // Get the current date
        const now = new Date();

        // Start of the current month
        const startOfMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

        // Start of the next month
        const startOfNextMonth = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            1
        );

        // Find completed/active orders and group their revenue by day
        const sales = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startOfMonth,
                        $lt: startOfNextMonth
                    },
                    status: {
                        $in: [
                            "confirmed",
                            "processing",
                            "shipped",
                            "delivered"
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt"
                        }
                    },
                    totalSales: {
                        $sum: "$totalAmount"
                    },
                    orderCount: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]);

        // Send the daily sales statistics
        return sendSuccessResponse(
            res,
            200,
            sales,
            "Sales statistics fetched successfully"
        );
    } catch (error) {
        next(error);
    }
};
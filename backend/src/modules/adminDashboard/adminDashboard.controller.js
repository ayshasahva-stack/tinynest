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
import mongoose from "mongoose";
import OrderTracking from "./orderTracking.model.js";
import Order from "../orders/order.model.js";
import ApiError from "../../utils/Apierror.js";
import sendSuccessResponse from "../../utils/ApiResponse.js";

import {
    validateTrackingOrder,
    validateTracking
} from "./orderTracking.validation.js";

// Customer: Get tracking history for their own order
export const getMyOrderTracking = async (req, res, next) => {
    try {
        const { orderId } = req.params;

        // Validate the order ID
        const validationError = validateTrackingOrder(orderId);

        if (validationError) {
            return next(new ApiError(400, validationError));
        }

        // Make sure the order belongs to the logged-in user
        const order = await Order.findOne({
            _id: orderId,
            user: req.user._id
        });

        if (!order) {
            return next(new ApiError(404, "Order not found"));
        }

        // Get tracking history from oldest to newest
        const tracking = await OrderTracking.find({
            order: orderId
        }).sort({ createdAt: 1 });

        return sendSuccessResponse(
            res,
            200,
            tracking,
            "Order tracking fetched successfully"
        );
    } catch (error) {
        next(error);
    }
};

// Admin: Add a tracking update
export const addTrackingUpdate = async (req, res, next) => {
    try {
        const { orderId } = req.params;

        // Validate the order ID
        const orderValidationError = validateTrackingOrder(orderId);

        if (orderValidationError) {
            return next(new ApiError(400, orderValidationError));
        }

        // Validate tracking status and message
        const validationError = validateTracking(req.body);

        if (validationError) {
            return next(new ApiError(400, validationError));
        }

        // Find the order
        const order = await Order.findById(orderId);

        if (!order) {
            return next(new ApiError(404, "Order not found"));
        }

        // Prevent changing a cancelled order back to another status
        if (
            order.status === "cancelled" &&
            req.body.status !== "cancelled"
        ) {
            return next(
                new ApiError(
                    400,
                    "Cancelled order cannot be moved to another status"
                )
            );
        }

        // Create the tracking history record
        const tracking = await OrderTracking.create({
            order: orderId,
            status: req.body.status,
            message: req.body.message || ""
        });

        // Keep the main order status synchronized
        order.status = req.body.status;

        await order.save();

        return sendSuccessResponse(
            res,
            201,
            tracking,
            "Order tracking update added successfully"
        );
    } catch (error) {
        next(error);
    }
};
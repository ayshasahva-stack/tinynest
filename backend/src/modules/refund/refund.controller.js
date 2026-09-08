import mongoose from "mongoose";

import Refund from "./refund.model.js";
import Order from "../orders/order.model.js";
import Payment from "../payments/payment.model.js";

import ApiError from "../../utils/Apierror.js";
import sendSuccessResponse from "../../utils/ApiResponse.js";

import {
    validateRefundOrder,
    validateRefundRequest
} from "./refund.validation.js";

// Customer: request a refund for an eligible order
export const requestRefund = async (req, res, next) => {
    try {
        const { orderId } = req.params;

        // Validate the order ID
        const orderValidationError = validateRefundOrder(orderId);

        if (orderValidationError) {
            return next(new ApiError(400, orderValidationError));
        }

        // Validate the refund request data
        const validationError = validateRefundRequest(req.body);

        if (validationError) {
            return next(new ApiError(400, validationError));
        }

        // Find the customer's order
        const order = await Order.findOne({
            _id: orderId,
            user: req.user._id
        });

        if (!order) {
            return next(new ApiError(404, "Order not found"));
        }

        // Refunds are allowed only for delivered orders
        if (order.status !== "delivered") {
            return next(
                new ApiError(
                    400,
                    "Refund can only be requested for a delivered order"
                )
            );
        }

        // Find the payment associated with the order
        const payment = await Payment.findOne({
            order: order._id,
            user: req.user._id
        });

        if (!payment) {
            return next(new ApiError(404, "Payment not found"));
        }

        // A payment must have been completed before it can be refunded
        if (payment.status !== "paid") {
            return next(
                new ApiError(
                    400,
                    "Refund can only be requested for a paid order"
                )
            );
        }

        // Check whether a refund request already exists
        const existingRefund = await Refund.findOne({
            order: order._id
        });

        if (existingRefund) {
            return next(
                new ApiError(
                    400,
                    "Refund request already exists for this order"
                )
            );
        }

        // Create the refund request
        const refund = await Refund.create({
            order: order._id,
            user: req.user._id,
            refundType: "customer_request",
            payment: payment._id,
            reason: req.body.reason.trim(),
            amount: order.totalAmount,
            status: "requested"
        });

        // Include order and payment details in the response
        await refund.populate([
            {
                path: "order",
                select: "totalAmount status"
            },
            {
                path: "payment",
                select: "paymentMethod transactionId amount status"
            }
        ]);

        return sendSuccessResponse(
            res,
            201,
            refund,
            "Refund request created successfully"
        );
    } catch (error) {
        next(error);
    }
};

// Admin: get all refund requests
export const getAllRefunds = async (req, res, next) => {
    try {
        // Get all refund requests from the database
        const refunds = await Refund.find()

            // Include customer information
            .populate("user", "email phone")

            // Include order information
            .populate("order", "totalAmount status")

            // Include payment information
            .populate(
                "payment",
                "paymentMethod transactionId amount status paidAt"
            )

            // Show newest refund requests first
            .sort({ requestedAt: -1 });

        return sendSuccessResponse(
            res,
            200,
            refunds,
            "All refund requests fetched successfully"
        );
    } catch (error) {
        next(error);
    }
};
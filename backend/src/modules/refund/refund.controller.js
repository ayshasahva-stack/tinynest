import mongoose from "mongoose";

import Refund from "./refund.model.js";
import Order from "../orders/order.model.js";
import Payment from "../payments/payment.model.js";

import ApiError from "../../utils/Apierror.js";
import sendSuccessResponse from "../../utils/ApiResponse.js";

import {
    validateRefundOrder,
    validateRefundRequest,
    validateRefundDecision,
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

// Admin: approve or reject a refund request
export const updateRefundStatus = async (req, res, next) => {
    try {
        const { refundId } = req.params;

        // Check whether the refund ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(refundId)) {
            return next(
                new ApiError(400, "Refund ID must be a valid refund ID")
            );
        }

        // Validate the admin's decision
        const validationError = validateRefundDecision(req.body);

        if (validationError) {
            return next(new ApiError(400, validationError));
        }

        const { status, adminNote } = req.body;

        // Find the refund request
        const refund = await Refund.findById(refundId);

        if (!refund) {
            return next(new ApiError(404, "Refund request not found"));
        }

        // Only a requested refund can be approved or rejected
        if (refund.status !== "requested") {
            return next(
                new ApiError(
                    400,
                    "Only requested refunds can be approved or rejected"
                )
            );
        }

        // Update the refund status
        refund.status = status;

        // Save the admin's note if provided
        if (adminNote !== undefined) {
            refund.adminNote = adminNote.trim();
        }

        // Record when the admin processed the request
        refund.processedAt = new Date();

        await refund.save();

        // Include useful related information in the response
        await refund.populate([
            {
                path: "order",
                select: "totalAmount status"
            },
            {
                path: "payment",
                select: "paymentMethod transactionId amount status paidAt"
            },
            {
                path: "user",
                select: "email phone"
            }
        ]);

        return sendSuccessResponse(
            res,
            200,
            refund,
            `Refund request ${status} successfully`
        );
    } catch (error) {
        next(error);
    }
};

// Admin: move an approved refund into processing
export const processRefund = async (req, res, next) => {
    try {
        const { refundId } = req.params;

        // Check whether the refund ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(refundId)) {
            return next(
                new ApiError(400, "Refund ID must be a valid refund ID")
            );
        }

        // Find the refund request
        const refund = await Refund.findById(refundId);

        if (!refund) {
            return next(
                new ApiError(404, "Refund request not found")
            );
        }

        // Only approved refunds can be processed
        if (refund.status !== "approved") {
            return next(
                new ApiError(
                    400,
                    "Only approved refunds can be processed"
                )
            );
        }

        // Change the refund status to processing
        refund.status = "processing";

        await refund.save();

        // Include related order and payment information
        await refund.populate([
            {
                path: "order",
                select: "totalAmount status"
            },
            {
                path: "payment",
                select: "paymentMethod transactionId amount status paidAt"
            },
            {
                path: "user",
                select: "email phone"
            }
        ]);

        return sendSuccessResponse(
            res,
            200,
            refund,
            "Refund moved to processing successfully"
        );
    } catch (error) {
        next(error);
    }
};
// Admin: complete a refund that is being processed
export const completeRefund = async (req, res, next) => {
    try {
        const { refundId } = req.params;

        // Check whether the refund ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(refundId)) {
            return next(
                new ApiError(400, "Refund ID must be a valid refund ID")
            );
        }

        // Find the refund
        const refund = await Refund.findById(refundId);

        if (!refund) {
            return next(
                new ApiError(404, "Refund request not found")
            );
        }

        // Only refunds that are currently processing can be completed
        if (refund.status !== "processing") {
            return next(
                new ApiError(
                    400,
                    "Only processing refunds can be completed"
                )
            );
        }

        // Mark the refund as completed
        refund.status = "completed";

        // Record when the refund was completed
        refund.processedAt = new Date();

        await refund.save();

        // Include related information in the response
        await refund.populate([
            {
                path: "order",
                select: "totalAmount status"
            },
            {
                path: "payment",
                select: "paymentMethod transactionId amount status paidAt"
            },
            {
                path: "user",
                select: "email phone"
            }
        ]);

        return sendSuccessResponse(
            res,
            200,
            refund,
            "Refund completed successfully"
        );
    } catch (error) {
        next(error);
    }
};
// Create a refund record for a cancelled paid online order
// Create a refund record for a cancelled paid online order
export const createOrderCancellationRefund = async (
    order,
    payment,
    session
) => {
    // Check whether a refund already exists for this order
    const existingRefund = await Refund.findOne({
        order: order._id
    }).session(session);

    // Return the existing refund instead of creating a duplicate
    if (existingRefund) {
        return existingRefund;
    }

    // Create the refund record inside the transaction
    const refund = await Refund.create(
        [
            {
                order: order._id,
                user: order.user,
                refundType: "order_cancelled",
                payment: payment._id,
                reason: "Order cancelled after online payment",
                amount: order.totalAmount,
                status: "requested"
            }
        ],
        { session }
    );

    // Refund.create() with an array returns an array
    return refund[0];
};
// Create a refund automatically for a cancelled paid online order
export const createCancellationRefund = async (req, res, next) => {
    try {
        const { orderId } = req.params;

        // Validate the order ID
        const orderValidationError = validateRefundOrder(orderId);

        if (orderValidationError) {
            return next(new ApiError(400, orderValidationError));
        }

        // Find the customer's order
        const order = await Order.findOne({
            _id: orderId,
            user: req.user._id
        });

        if (!order) {
            return next(new ApiError(404, "Order not found"));
        }

        // The order must already be cancelled
        if (order.status !== "cancelled") {
            return next(
                new ApiError(
                    400,
                    "Refund can only be created for a cancelled order"
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

        // Only completed online payments can be refunded
        if (
            payment.paymentMethod !== "online" ||
            payment.status !== "paid"
        ) {
            return next(
                new ApiError(
                    400,
                    "Only paid online orders can receive an automatic cancellation refund"
                )
            );
        }

        // Prevent duplicate refund records
        const existingRefund = await Refund.findOne({
            order: order._id
        });

        if (existingRefund) {
            return next(
                new ApiError(
                    400,
                    "Refund already exists for this order"
                )
            );
        }

        // Create the cancellation refund
        const refund = await Refund.create({
            order: order._id,
            user: req.user._id,
            refundType: "order_cancelled",
            payment: payment._id,
            reason: "Order cancelled after online payment",
            amount: order.totalAmount,
            status: "requested"
        });

        // Include related order and payment information
        await refund.populate([
            {
                path: "order",
                select: "totalAmount status"
            },
            {
                path: "payment",
                select: "paymentMethod transactionId amount status paidAt"
            }
        ]);

        return sendSuccessResponse(
            res,
            201,
            refund,
            "Cancellation refund created successfully"
        );
    } catch (error) {
        next(error);
    }
};
import mongoose from "mongoose";
import Payment from "./payment.model.js";
import Order from "../orders/order.model.js";
import ApiError from "../../utils/Apierror.js";
import sendSuccessResponse from "../../utils/ApiResponse.js";
import {
    validatePaymentOrder,
    validatePayment,
    validatePaymentStatus
} from "./payment.validation.js";

// Create a payment record for the logged-in user's order
export const createPayment = async (req, res, next) => {
    try {
        const { orderId } = req.params;

        // Validate the order ID
        const orderIdError = validatePaymentOrder(orderId);

        if (orderIdError) {
            return next(new ApiError(400, orderIdError));
        }

        // Validate payment data
        const validationError = validatePayment(req.body);

        if (validationError) {
            return next(new ApiError(400, validationError));
        }

        // Find the order and make sure it belongs to the logged-in user
        const order = await Order.findOne({
            _id: orderId,
            user: req.user._id
        });

        if (!order) {
            return next(new ApiError(404, "Order not found"));
        }

        // Prevent duplicate payment records for the same order
        const existingPayment = await Payment.findOne({
            order: orderId
        });

        if (existingPayment) {
            return next(
                new ApiError(
                    400,
                    "Payment already exists for this order"
                )
            );
        }

        // Create payment using the trusted order amount
        const payment = await Payment.create({
            order: order._id,
            user: req.user._id,
            paymentMethod: req.body.paymentMethod,
            transactionId: req.body.transactionId || null,
            amount: order.totalAmount,
            status: req.body.paymentMethod === "cod"
                ? "pending"
                : "pending"
        });

        return sendSuccessResponse(
            res,
            201,
            payment,
            "Payment created successfully"
        );
    } catch (error) {
        next(error);
    }
};

// Get payment details for the logged-in user's order
export const getMyPayment = async (req, res, next) => {
    try {
        const { orderId } = req.params;

        // Validate the order ID
        const orderIdError = validatePaymentOrder(orderId);

        if (orderIdError) {
            return next(new ApiError(400, orderIdError));
        }

        // Find payment belonging to the logged-in user's order
        const payment = await Payment.findOne({
            order: orderId,
            user: req.user._id
        }).populate("order", "totalAmount status");

        if (!payment) {
            return next(new ApiError(404, "Payment not found"));
        }

        return sendSuccessResponse(
            res,
            200,
            payment,
            "Payment fetched successfully"
        );
    } catch (error) {
        next(error);
    }
};
// Admin: get all payments
export const getAllPayments = async (req, res, next) => {
    try {
        // Get all payments with basic order and user information
        const payments = await Payment.find()
            .populate("order", "totalAmount status")
            .populate("user", "email phone")
            .sort({ createdAt: -1 });

        return sendSuccessResponse(
            res,
            200,
            payments,
            "All payments fetched successfully"
        );
    } catch (error) {
        next(error);
    }
};
// Admin: update payment status
export const updatePaymentStatus = async (req, res, next) => {
    try {
        const { paymentId } = req.params;

        // Check whether the payment ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(paymentId)) {
            return next(
                new ApiError(400, "Payment ID must be a valid payment ID")
            );
        }

        // Validate the status sent by the admin
        const validationError = validatePaymentStatus(req.body);

        if (validationError) {
            return next(new ApiError(400, validationError));
        }

        // Find the payment
        const payment = await Payment.findById(paymentId);

        if (!payment) {
            return next(new ApiError(404, "Payment not found"));
        }

        // Update the payment status
        payment.status = req.body.status;

        // Set paidAt only when payment becomes paid
        if (req.body.status === "paid") {
            payment.paidAt = new Date();
        } else {
            // Remove paidAt if payment is no longer marked as paid
            payment.paidAt = null;
        }

        await payment.save();

        // Return the updated payment
        return sendSuccessResponse(
            res,
            200,
            payment,
            "Payment status updated successfully"
        );
    } catch (error) {
        next(error);
    }
};
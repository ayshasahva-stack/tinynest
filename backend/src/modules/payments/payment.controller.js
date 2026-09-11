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

        // If the order does not belong to this user or does not exist
        if (!order) {
            return next(new ApiError(404, "Order not found"));
        }

        // Prevent payment for a cancelled order
        if (order.status === "cancelled") {
            return next(
                new ApiError(
                    400,
                    "Cannot create payment for a cancelled order"
                )
            );
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

        // Always use the trusted amount from the database order
        // Never trust an amount sent by the client
        const payment = await Payment.create({
            order: order._id,
            user: req.user._id,
            paymentMethod: req.body.paymentMethod,
            transactionId: req.body.transactionId || null,
            amount: order.totalAmount,
            status: "pending"
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

// Admin: update payment status and synchronize the related order
// Admin: update payment status and synchronize the related order
export const updatePaymentStatus = async (req, res, next) => {
    // Start a MongoDB session for the transaction
    const session = await mongoose.startSession();

    try {
        const { paymentId } = req.params;

        // Check whether the payment ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(paymentId)) {
            return next(
                new ApiError(400, "Payment ID must be a valid payment ID")
            );
        }

        // Validate the new payment status
        const validationError = validatePaymentStatus(req.body);

        if (validationError) {
            return next(new ApiError(400, validationError));
        }

        // Get the requested new status
        const newStatus = req.body.status;

        // Start the transaction
        session.startTransaction();

        // Find the payment inside the transaction
        const payment = await Payment.findById(paymentId).session(session);

        if (!payment) {
            throw new ApiError(404, "Payment not found");
        }

        // Define which payment status changes are allowed
        const allowedTransitions = {
            pending: ["paid", "failed"],
            paid: ["refunded"],
            failed: [],
            refunded: []
        };

        // Check whether the requested status change is allowed
        if (!allowedTransitions[payment.status].includes(newStatus)) {
            throw new ApiError(
                400,
                `Cannot change payment status from ${payment.status} to ${newStatus}`
            );
        }

        // A refund is allowed only for successfully paid online payments
        if (
            newStatus === "refunded" &&
            (
                payment.paymentMethod !== "online" ||
                payment.status !== "paid"
            )
        ) {
            throw new ApiError(
                400,
                "Only paid online payments can be refunded"
            );
        }

        // Find the related order inside the same transaction
        const order = await Order.findById(payment.order).session(session);

        if (!order) {
            throw new ApiError(404, "Related order not found");
        }

        // Update the payment status
        payment.status = newStatus;

        // Set paidAt when payment is first marked as paid
        // Keep the original payment time after later status changes
        if (newStatus === "paid" && !payment.paidAt) {
            payment.paidAt = new Date();
        }

        // Save the payment inside the transaction
        await payment.save({ session });

        // Keep the order status synchronized with the payment
        if (newStatus === "paid") {
            order.status = "confirmed";
        } else if (newStatus === "refunded") {
            order.status = "cancelled";
        }

        // Save the order inside the same transaction
        await order.save({ session });

        // Commit both changes together
        await session.commitTransaction();

        // Return both updated records
        return sendSuccessResponse(
            res,
            200,
            {
                payment,
                order
            },
            "Payment and order status updated successfully"
        );
    } catch (error) {
        // Undo all changes if anything failed
        await session.abortTransaction();

        next(error);
    } finally {
        // Always close the MongoDB session
        session.endSession();
    }
};
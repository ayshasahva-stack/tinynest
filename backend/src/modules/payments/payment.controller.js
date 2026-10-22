import mongoose from "mongoose";
import Payment from "./payment.model.js";
import Order from "../orders/order.model.js";
import ApiError from "../../utils/Apierror.js";
import sendSuccessResponse from "../../utils/ApiResponse.js";
import { notifyAdmins } from "../notifications/notification.service.js";
import crypto from "crypto";
import {
    validatePaymentOrder,
    validatePayment,
    validatePaymentStatus,
    validateRazorpayPayment,
} from "./payment.validation.js";
import razorpay from "../../config/razorpay.js";
import CheckoutSession from "./checkoutSession.model.js";
import Cart from "../cart/cart.model.js";
import Product from "../products/product.model.js";
import Kit from "../kits/kit.model.js";
import Coupon from "../coupons/coupon.model.js";
import { getProductOfferPrice } from "../offers/offer.service.js";
import { validateShippingAddress } from "../orders/order.validation.js";
import { createOrder } from "../orders/order.controller.js";

// Create a Razorpay order for a TinyNest order
export const createRazorpayOrder = async (req, res, next) => {
    try {
        // Get the TinyNest order ID from the URL
        const { orderId } = req.params;

        // Make sure the order ID is valid
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return next(
                new ApiError(
                    400,
                    "Order ID must be a valid order ID"
                )
            );
        }

        // Find the order belonging to the logged-in user
        const order = await Order.findOne({
            _id: orderId,
            user: req.user._id
        });

        // Make sure the order exists
        if (!order) {
            return next(
                new ApiError(
                    404,
                    "Order not found"
                )
            );
        }

        // A cancelled order cannot be paid
        if (order.status === "cancelled") {
            return next(
                new ApiError(
                    400,
                    "Cancelled orders cannot be paid"
                )
            );
        }

        // Check whether this order already has a pending Razorpay payment
        const existingPayment = await Payment.findOne({
            order: order._id,
            user: req.user._id,
            paymentMethod: "online",
            status: "pending",
            razorpayOrderId: { $ne: null }
        });

        // Reuse the existing Razorpay order if one already exists
        if (existingPayment) {
            return sendSuccessResponse(
                res,
                200,
                {
                    razorpayOrderId: existingPayment.razorpayOrderId,
                    amount: Math.round(existingPayment.amount * 100),
                    currency: "INR",
                    tinyNestOrderId: order._id
                },
                "Existing Razorpay order reused successfully"
            );
        }

        // Convert the TinyNest amount from rupees
        // to paise because Razorpay expects the
        // amount in the smallest currency unit.
        const amountInPaise =
            Math.round(order.totalAmount * 100);

        // Create a new Razorpay order
        const razorpayOrder =
            await razorpay.orders.create({
                amount: amountInPaise,
                currency: "INR",

                // Receipt helps us identify the
                // TinyNest order in Razorpay.
                receipt: order._id.toString()
            });

        // Create a pending payment record in TinyNest
        await Payment.create({
            order: order._id,
            user: req.user._id,
            paymentMethod: "online",
            transactionId: null,
            razorpayOrderId: razorpayOrder.id,
            amount: order.totalAmount,
            status: "pending"
        });

        // Return the Razorpay order information
        return sendSuccessResponse(
            res,
            201,
            {
                razorpayOrderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                tinyNestOrderId: order._id
            },
            "Razorpay order created successfully"
        );
    } catch (error) {
        next(error);
    }
};
// Verify the Razorpay payment signature
// Verify Razorpay payment and complete the TinyNest order
export const verifyRazorpayPayment = async (req, res, next) => {
    let session;

    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        // Start a MongoDB session
        session = await mongoose.startSession();

        session.startTransaction();

        // Validate the Razorpay payment data
        const validationError =
            validateRazorpayPayment(req.body);

        if (validationError) {
            await session.abortTransaction();
            session.endSession();

            return next(
                new ApiError(400, validationError)
            );
        }

        // Create the data that Razorpay expects us to sign
        const body =
            razorpay_order_id +
            "|" +
            razorpay_payment_id;

        // Generate the expected signature using
        // our Razorpay secret key
        const expectedSignature =
            crypto
                .createHmac(
                    "sha256",
                    process.env.RAZORPAY_KEY_SECRET
                )
                .update(body)
                .digest("hex");

        // Compare our generated signature
        // with Razorpay's signature
        if (
            expectedSignature !==
            razorpay_signature
        ) {
            await session.abortTransaction();
            session.endSession();

            return next(
                new ApiError(
                    400,
                    "Invalid Razorpay payment signature"
                )
            );
        }

        // Find the pending TinyNest payment
        // linked to this Razorpay order
        const payment =
            await Payment.findOne({
                razorpayOrderId:
                    razorpay_order_id,
                user: req.user._id,
                status: "pending"
            }).session(session);

        if (!payment) {
            await session.abortTransaction();
            session.endSession();

            return next(
                new ApiError(
                    404,
                    "Pending Razorpay payment not found"
                )
            );
        }

        // Fetch the actual payment details
        // directly from Razorpay
        const razorpayPayment =
            await razorpay.payments.fetch(
                razorpay_payment_id
            );

        // Convert TinyNest amount from rupees
        // to paise for comparison with Razorpay
        const expectedAmount =
            Math.round(payment.amount * 100);

        // Make sure Razorpay charged
        // the amount expected by TinyNest
        if (
            razorpayPayment.amount !==
            expectedAmount
        ) {
            await session.abortTransaction();
            session.endSession();

            return next(
                new ApiError(
                    400,
                    "Payment amount mismatch"
                )
            );
        }

        // Make sure Razorpay reports the
        // payment as successfully captured
        if (
            razorpayPayment.status !==
            "captured"
        ) {
            await session.abortTransaction();
            session.endSession();

            return next(
                new ApiError(
                    400,
                    "Razorpay payment has not been captured"
                )
            );
        }

        // Find the TinyNest order linked
        // to this payment
        const order =
            await Order.findOne({
                _id: payment.order,
                user: req.user._id
            }).session(session);

        if (!order) {
            await session.abortTransaction();
            session.endSession();

            return next(
                new ApiError(
                    404,
                    "Order linked to payment not found"
                )
            );
        }

        // A cancelled order cannot be marked as paid
        if (order.status === "cancelled") {
            await session.abortTransaction();
            session.endSession();

            return next(
                new ApiError(
                    400,
                    "Cancelled orders cannot be marked as paid"
                )
            );
        }

        // Prevent a second payment from being
        // applied to an already confirmed order
        if (order.status === "confirmed") {
            await session.abortTransaction();
            session.endSession();

            return next(
                new ApiError(
                    400,
                    "Order has already been paid"
                )
            );
        }

        // Mark the TinyNest order as confirmed
        order.status = "confirmed";

        // Mark the TinyNest payment as paid
        payment.status = "paid";

        // Store Razorpay's payment ID
        // as our transaction ID
        payment.transactionId =
            razorpay_payment_id;

        // Store the payment confirmation time
        payment.paidAt = new Date();

        // Save the confirmed order
        // inside the transaction
        await order.save({ session });

        // Save the paid payment
        // inside the same transaction
        await payment.save({ session });

        // Commit both database changes together
        await session.commitTransaction();

        // End the MongoDB session
        session.endSession();

        return sendSuccessResponse(
            res,
            200,
            {
                verified: true,
                razorpayOrderId:
                    razorpay_order_id,
                razorpayPaymentId:
                    razorpay_payment_id
            },
            "Razorpay payment verified and order confirmed successfully"
        );

    } catch (error) {
        // Roll back any database changes
        // if an unexpected error occurs
        if (session) {
            await session.abortTransaction();
            session.endSession();
        }

        next(error);
    }
};
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

// Build a stable cart signature so the basket cannot silently change
// between opening Razorpay and confirming a captured payment.
const getCartFingerprint = (cart) =>
    JSON.stringify(
        (cart?.items || []).map((item) => ({
            itemType: item.itemType || "product",
            product: item.product?.toString?.() || null,
            kit: item.kit?.toString?.() || null,
            quantity: Number(item.quantity),
        }))
    );

// Recalculate the amount on the server. Never accept a price from the browser.
const calculateCheckoutTotal = async (userId, couponCode) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart || !cart.items.length) {
        throw new ApiError(400, "Your cart is empty");
    }

    let subtotal = 0;
    for (const item of cart.items) {
        const itemType = item.itemType || "product";
        if (itemType === "product") {
            const product = await Product.findById(item.product);
            if (!product) throw new ApiError(404, "A product in your cart no longer exists");
            if (product.stock < item.quantity) {
                throw new ApiError(400, `Not enough stock for ${product.title}`);
            }
            const pricing = await getProductOfferPrice(product);
            subtotal += pricing.offerPrice * item.quantity;
        } else if (itemType === "kit") {
            const kit = await Kit.findById(item.kit).populate("items.product");
            if (!kit || !kit.isActive) throw new ApiError(400, "A kit in your cart is no longer available");
            for (const kitItem of kit.items) {
                if (!kitItem.product || kitItem.product.stock < kitItem.quantity * item.quantity) {
                    throw new ApiError(400, `Not enough stock for ${kitItem.product?.title || kit.name}`);
                }
            }
            subtotal += (kit.price - (kit.price * (kit.discount || 0)) / 100) * item.quantity;
        } else {
            throw new ApiError(400, "Your cart contains an invalid item");
        }
    }

    let discount = 0;
    let normalizedCouponCode = null;
    if (couponCode) {
        if (typeof couponCode !== "string" || !couponCode.trim()) {
            throw new ApiError(400, "Coupon code is invalid");
        }
        normalizedCouponCode = couponCode.trim().toUpperCase();
        const coupon = await Coupon.findOne({ code: normalizedCouponCode });
        if (!coupon || !coupon.isActive) throw new ApiError(400, "Coupon is unavailable");
        const now = new Date();
        if (now < coupon.startDate || now > coupon.expiryDate) throw new ApiError(400, "Coupon is not currently active");
        if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
            throw new ApiError(400, "Coupon usage limit reached");
        }
        if (subtotal < coupon.minOrderAmount) {
            throw new ApiError(400, `Minimum order amount is ₹${coupon.minOrderAmount}`);
        }
        discount = coupon.discountType === "percentage"
            ? subtotal * coupon.discountValue / 100
            : Math.min(coupon.discountValue, subtotal);
        if (coupon.discountType === "percentage" && coupon.maxDiscount !== null) {
            discount = Math.min(discount, coupon.maxDiscount);
        }
        discount = Math.round(discount * 100) / 100;
    }

    const shippingFee = subtotal >= 1000 ? 0 : 50;
    const totalAmount = Math.round((subtotal - discount + shippingFee) * 100) / 100;
    return { cart, subtotal, discount, shippingFee, totalAmount, couponCode: normalizedCouponCode };
};

// Create a Razorpay checkout attempt WITHOUT creating an Order document.
// A closed popup leaves only this separate attempt record.
export const createRazorpayCheckoutSession = async (req, res, next) => {
    try {
        const addressError = validateShippingAddress(req.body.shippingAddress);
        if (addressError) return next(new ApiError(400, addressError));

        const pricing = await calculateCheckoutTotal(req.user._id, req.body.couponCode);
        const amountInPaise = Math.round(pricing.totalAmount * 100);

        const razorpayOrder = await razorpay.orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt: `tn-checkout-${Date.now()}`,
            notes: { userId: req.user._id.toString() },
        });

        const checkoutSession = await CheckoutSession.create({
            user: req.user._id,
            razorpayOrderId: razorpayOrder.id,
            amount: pricing.totalAmount,
            currency: "INR",
            shippingAddress: req.body.shippingAddress,
            couponCode: pricing.couponCode,
            cartFingerprint: getCartFingerprint(pricing.cart),
            status: "pending",
        });

        return sendSuccessResponse(res, 201, {
            checkoutSessionId: checkoutSession._id,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
        }, "Razorpay checkout session created");
    } catch (error) {
        next(error);
    }
};

// Verify captured payment first, then create the real TinyNest order.
// If the customer closes the popup, this endpoint is never called and no Order exists.
export const verifyRazorpayCheckoutSession = async (req, res, next) => {
    try {
        const validationError = validateRazorpayPayment(req.body);
        if (validationError) return next(new ApiError(400, validationError));

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const checkoutSession = await CheckoutSession.findOne({
            razorpayOrderId: razorpay_order_id,
            user: req.user._id,
        });

        if (!checkoutSession) return next(new ApiError(404, "Checkout session not found"));

        // Idempotent response for a retry after a successful verification.
        if (checkoutSession.status === "paid" && checkoutSession.order) {
            return sendSuccessResponse(res, 200, {
                verified: true,
                orderId: checkoutSession.order,
            }, "Payment was already verified");
        }

        if (checkoutSession.status !== "pending") {
            return next(new ApiError(409, "This checkout attempt is no longer pending"));
        }

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        // Use a timing-safe comparison for the signature.
        const received = Buffer.from(String(razorpay_signature));
        const expected = Buffer.from(expectedSignature);
        if (received.length !== expected.length || !crypto.timingSafeEqual(received, expected)) {
            return next(new ApiError(400, "Invalid Razorpay payment signature"));
        }

        // The payment state is checked directly with Razorpay, never trusted from the browser.
        const gatewayPayment = await razorpay.payments.fetch(razorpay_payment_id);
        if (gatewayPayment.order_id !== razorpay_order_id) {
            return next(new ApiError(400, "Payment does not belong to this checkout"));
        }
        if (gatewayPayment.amount !== Math.round(checkoutSession.amount * 100)) {
            return next(new ApiError(400, "Payment amount mismatch"));
        }
        if (gatewayPayment.status !== "captured") {
            return next(new ApiError(409, "Razorpay has not confirmed a captured payment yet"));
        }

        // Ensure the basket is still the basket that was priced for this payment attempt.
        const currentCart = await Cart.findOne({ user: req.user._id });
        if (getCartFingerprint(currentCart) !== checkoutSession.cartFingerprint) {
            checkoutSession.status = "review";
            checkoutSession.razorpayPaymentId = razorpay_payment_id;
            await checkoutSession.save();
            return next(new ApiError(
                409,
                "Payment was captured, but your cart changed during checkout. Please contact support; do not retry payment."
            ));
        }

        // Recalculate current server-side prices/coupon validity before placing the order.
        const pricing = await calculateCheckoutTotal(req.user._id, checkoutSession.couponCode);
        if (Math.round(pricing.totalAmount * 100) !== Math.round(checkoutSession.amount * 100)) {
            checkoutSession.status = "review";
            checkoutSession.razorpayPaymentId = razorpay_payment_id;
            await checkoutSession.save();
            return next(new ApiError(
                409,
                "Payment was captured, but the checkout total changed. Please contact support; do not retry payment."
            ));
        }

        // Reuse the project's established order transaction and inventory/coupon logic.
        // The small response adapter lets the existing Express handler return its created order
        // without duplicating its large business-logic implementation.
        let orderResponse = null;
        let orderError = null;
        const mockResponse = {
            status(code) { this.statusCode = code; return this; },
            json(body) { orderResponse = body; return this; },
        };

        await createOrder(
            {
                user: { _id: req.user._id },
                body: {
                    shippingAddress: checkoutSession.shippingAddress,
                    ...(checkoutSession.couponCode ? { couponCode: checkoutSession.couponCode } : {}),
                },
            },
            mockResponse,
            (error) => { orderError = error; }
        );

        if (orderError) {
            // The gateway captured money but order creation failed. Flag for manual reconciliation.
            checkoutSession.status = "review";
            checkoutSession.razorpayPaymentId = razorpay_payment_id;
            await checkoutSession.save();
            return next(new ApiError(
                409,
                "Razorpay captured the payment, but TinyNest could not place the order. Please contact support and do not pay again."
            ));
        }

        const order = orderResponse?.data;
        if (!order?._id) {
            checkoutSession.status = "review";
            checkoutSession.razorpayPaymentId = razorpay_payment_id;
            await checkoutSession.save();
            return next(new ApiError(500, "Payment was captured but order confirmation needs support review"));
        }

        // Link the verified payment and mark the order confirmed.
        const dbSession = await mongoose.startSession();
        try {
            dbSession.startTransaction();
            const orderDoc = await Order.findOne({ _id: order._id, user: req.user._id }).session(dbSession);
            if (!orderDoc) throw new ApiError(500, "Created order could not be found");

            orderDoc.status = "confirmed";
            await orderDoc.save({ session: dbSession });

            await Payment.create([{
                order: orderDoc._id,
                user: req.user._id,
                paymentMethod: "online",
                transactionId: razorpay_payment_id,
                razorpayOrderId: razorpay_order_id,
                amount: checkoutSession.amount,
                status: "paid",
                paidAt: new Date(),
            }], { session: dbSession });

            checkoutSession.status = "paid";
            checkoutSession.razorpayPaymentId = razorpay_payment_id;
            checkoutSession.order = orderDoc._id;
            await checkoutSession.save({ session: dbSession });

            await dbSession.commitTransaction();
        } catch (error) {
            await dbSession.abortTransaction();
            checkoutSession.status = "review";
            checkoutSession.razorpayPaymentId = razorpay_payment_id;
            await checkoutSession.save();
            throw error;
        } finally {
            dbSession.endSession();
        }

        return sendSuccessResponse(res, 200, {
            verified: true,
            orderId: order._id,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
        }, "Payment verified and order placed successfully");
    } catch (error) {
        next(error);
    }
};

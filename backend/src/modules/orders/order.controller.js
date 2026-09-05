import Order from "./order.model.js";
import Cart from "../cart/cart.model.js";
import Product from "../products/product.model.js";
import ApiError from "../../utils/Apierror.js";
import sendSuccessResponse from "../../utils/ApiResponse.js";
import { validateShippingAddress } from "./order.validation.js";

// Create an order using the logged-in user's cart
export const createOrder = async (req, res, next) => {
    try {
        // Get the shipping address sent by the client
        const { shippingAddress } = req.body;

        // Validate the shipping address
        const validationError = validateShippingAddress(shippingAddress);

        if (validationError) {
            return next(new ApiError(400, validationError));
        }

        // Find the cart belonging to the logged-in user
        const cart = await Cart.findOne({
            user: req.user._id
        });

        // Make sure the cart exists and contains products
        if (!cart || cart.items.length === 0) {
            return next(new ApiError(400, "Cart is empty"));
        }

        // Store the final order items
        const orderItems = [];

        // Start calculating the subtotal
        let subtotal = 0;

        // Process every item in the user's cart
        for (const cartItem of cart.items) {
            // Get the current product from the database
            const product = await Product.findById(cartItem.product);

            // Make sure the product still exists
            if (!product) {
                return next(
                    new ApiError(404, "One of the products no longer exists")
                );
            }

            // Make sure enough stock is available
            if (product.stock < cartItem.quantity) {
                return next(
                    new ApiError(
                        400,
                        `Not enough stock for ${product.title}`
                    )
                );
            }

            // Calculate this item's total
            const itemTotal = product.price * cartItem.quantity;

            // Add it to the subtotal
            subtotal += itemTotal;

            // Store a snapshot of the product information
            orderItems.push({
                product: product._id,
                title: product.title,
                price: product.price,
                quantity: cartItem.quantity,
                image: product.images[0]
            });
        }

        // Coupon functionality will be added later
        const discount = 0;

        // Orders of ₹1000 or more get free shipping
        const shippingFee = subtotal >= 1000 ? 0 : 50;

        // Calculate the final amount
        const totalAmount = subtotal - discount + shippingFee;

        // Create the order
        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            shippingAddress,
            subtotal,
            discount,
            shippingFee,
            totalAmount,
            coupon: null,
            status: "pending"
        });

        // Reduce stock after creating the order
        for (const cartItem of cart.items) {
            await Product.findByIdAndUpdate(
                cartItem.product,
                {
                    $inc: {
                        stock: -cartItem.quantity
                    }
                }
            );
        }

        // Clear the cart after successful order creation
        cart.items = [];
        await cart.save();

        // Populate product details in the response
        await order.populate("items.product");

        // Send the created order
        sendSuccessResponse(
            res,
            201,
            order,
            "Order created successfully"
        );
    } catch (error) {
        next(error);
    }
};
// Get all orders belonging to the logged-in user
export const getMyOrders = async (req, res, next) => {
    try {
        // Find only the orders created by the authenticated user
        const orders = await Order.find({
            user: req.user._id
        })
            // Include product details in each order item
            .populate("items.product")
            // Show newest orders first
            .sort({ createdAt: -1 });

        // Send the user's orders
        sendSuccessResponse(
            res,
            200,
            orders,
            "Orders fetched successfully"
        );
    } catch (error) {
        next(error);
    }
};

// Get one order belonging to the logged-in user
export const getMyOrderById = async (req, res, next) => {
    try {
        // Get the order ID from the URL
        const { orderId } = req.params;

        // Find the order and make sure it belongs to the logged-in user
        const order = await Order.findOne({
            _id: orderId,
            user: req.user._id
        }).populate("items.product");

        // If the order doesn't exist or belongs to another user
        if (!order) {
            return next(new ApiError(404, "Order not found"));
        }

        // Send the order details
        sendSuccessResponse(
            res,
            200,
            order,
            "Order fetched successfully"
        );
    } catch (error) {
        next(error);
    }
};
// Cancel an order belonging to the logged-in user
export const cancelMyOrder = async (req, res, next) => {
    try {
        // Get the order ID from the URL
        const { orderId } = req.params;

        // Find only the order belonging to the logged-in user
        const order = await Order.findOne({
            _id: orderId,
            user: req.user._id
        });

        // Make sure the order exists
        if (!order) {
            return next(new ApiError(404, "Order not found"));
        }

        // Only pending and confirmed orders can be cancelled
        if (
            order.status !== "pending" &&
            order.status !== "confirmed"
        ) {
            return next(
                new ApiError(
                    400,
                    "This order cannot be cancelled"
                )
            );
        }

        // Restore the ordered quantity back to product stock
        for (const item of order.items) {
            await Product.findByIdAndUpdate(
                item.product,
                {
                    $inc: {
                        stock: item.quantity
                    }
                }
            );
        }

        // Change the order status
        order.status = "cancelled";

        // Save the updated order
        await order.save();

        // Return the cancelled order
        sendSuccessResponse(
            res,
            200,
            order,
            "Order cancelled successfully"
        );
    } catch (error) {
        next(error);
    }
};

// Get all orders for the admin
export const getAllOrders = async (req, res, next) => {
    try {
        // Get all orders from the database
        const orders = await Order.find()
            // Include basic user information
            .populate("user", "email phone")
            // Include product information for each order item
            .populate("items.product")
            // Show newest orders first
            .sort({ createdAt: -1 });

        // Send all orders to the admin
        sendSuccessResponse(
            res,
            200,
            orders,
            "All orders fetched successfully"
        );
    } catch (error) {
        next(error);
    }
};
// Update the status of an order - Admin only
export const updateOrderStatus = async (req, res, next) => {
    try {
        // Get the order ID from the URL
        const { orderId } = req.params;

        // Get the new status from the request body
        const { status } = req.body;

        // Allowed order statuses
        const allowedStatuses = [
            "pending",
            "confirmed",
            "processing",
            "shipped",
            "delivered",
            "cancelled"
        ];

        // Make sure a status was provided
        if (!status) {
            return next(
                new ApiError(400, "Order status is required")
            );
        }

        // Make sure the status is valid
        if (!allowedStatuses.includes(status)) {
            return next(
                new ApiError(400, "Invalid order status")
            );
        }

        // Find the order
        const order = await Order.findById(orderId);

        if (!order) {
            return next(
                new ApiError(404, "Order not found")
            );
        }

        // A cancelled order cannot be changed again
        if (order.status === "cancelled") {
            return next(
                new ApiError(
                    400,
                    "Cancelled orders cannot be updated"
                )
            );
        }

        // Update the order status
        order.status = status;

        // Save the updated order
        await order.save();

        // Return the updated order
        sendSuccessResponse(
            res,
            200,
            order,
            "Order status updated successfully"
        );
    } catch (error) {
        next(error);
    }
};
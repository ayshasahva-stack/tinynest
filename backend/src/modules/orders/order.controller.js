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
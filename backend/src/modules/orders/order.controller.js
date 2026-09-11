import mongoose from "mongoose";
import Order from "./order.model.js";
import Cart from "../cart/cart.model.js";
import Payment from "../payments/payment.model.js";
import Product from "../products/product.model.js";
import Kit from "../kits/kit.model.js";
import ApiError from "../../utils/Apierror.js";
import sendSuccessResponse from "../../utils/ApiResponse.js";
import { createOrderCancellationRefund } from "../refund/refund.controller.js";
import { validateShippingAddress } from "./order.validation.js";

// Create an order using the logged-in user's cart
// Create an order using the logged-in user's cart
export const createOrder = async (req, res, next) => {
    // Start a MongoDB session for the order transaction
    const session = await mongoose.startSession();

    try {
        // Get the shipping address sent by the client
        const { shippingAddress } = req.body;

        // Validate the shipping address before starting database work
        const validationError =
            validateShippingAddress(shippingAddress);

        if (validationError) {
            return next(
                new ApiError(400, validationError)
            );
        }

        // Start the MongoDB transaction
        session.startTransaction();

        // Find the cart belonging to the logged-in user
        // inside the transaction.
        const cart = await Cart.findOne({
            user: req.user._id
        }).session(session);

        // Make sure the cart exists and contains items
        if (!cart || cart.items.length === 0) {
            throw new ApiError(400, "Cart is empty");
        }

        // Store the final order items
        const orderItems = [];

        // Start calculating the subtotal
        let subtotal = 0;

        // Store the total stock required for each product.
        // This handles products that appear directly
        // and also inside kits.
        const stockRequirements = new Map();

        // Store product documents so we don't repeatedly
        // query the same product.
        const productMap = new Map();

        // Process every item in the cart
        for (const cartItem of cart.items) {
            // Support old cart items that don't have itemType.
            // Old cart items are treated as products.
            const itemType =
                cartItem.itemType || "product";

            // ------------------------------------------------
            // PRODUCT CART ITEM
            // ------------------------------------------------
            if (itemType === "product") {
                // Make sure the product reference exists
                if (!cartItem.product) {
                    throw new ApiError(
                        400,
                        "Product reference is missing from cart"
                    );
                }

                // Get the product from our local map first
                let product = productMap.get(
                    cartItem.product.toString()
                );

                // If the product hasn't been loaded yet,
                // get it from MongoDB inside the transaction.
                if (!product) {
                    product = await Product.findById(
                        cartItem.product
                    ).session(session);

                    // Make sure the product still exists
                    if (!product) {
                        throw new ApiError(
                            404,
                            "One of the products no longer exists"
                        );
                    }

                    // Store the product for reuse
                    productMap.set(
                        product._id.toString(),
                        product
                    );
                }

                // Calculate the total stock required
                // for this product.
                const productId =
                    product._id.toString();

                stockRequirements.set(
                    productId,
                    (stockRequirements.get(productId) || 0) +
                    cartItem.quantity
                );

                // Calculate this item's total
                const itemTotal =
                    product.price * cartItem.quantity;

                // Add it to the subtotal
                subtotal += itemTotal;

                // Store a snapshot of product information
                // inside the order.
                orderItems.push({
                    itemType: "product",
                    product: product._id,
                    kit: null,
                    title: product.title,
                    price: product.price,
                    quantity: cartItem.quantity,
                    image: product.images[0]
                });

                continue;
            }

            // ------------------------------------------------
            // KIT CART ITEM
            // ------------------------------------------------
            if (itemType === "kit") {
                // Make sure the kit reference exists
                if (!cartItem.kit) {
                    throw new ApiError(
                        400,
                        "Kit reference is missing from cart"
                    );
                }

                // Get the kit and populate its products
                // inside the transaction.
                const kit = await Kit.findById(
                    cartItem.kit
                )
                    .populate("items.product")
                    .session(session);

                // Make sure the kit still exists
                if (!kit) {
                    throw new ApiError(
                        404,
                        "One of the kits no longer exists"
                    );
                }

                // Don't allow inactive kits to be ordered
                if (!kit.isActive) {
                    throw new ApiError(
                        400,
                        `${kit.name} is no longer available`
                    );
                }

                // Make sure every product inside the kit
                // still exists.
                for (const kitItem of kit.items) {
                    if (!kitItem.product) {
                        throw new ApiError(
                            404,
                            `A product inside ${kit.name} no longer exists`
                        );
                    }

                    const product = kitItem.product;

                    // Store the product for later stock handling
                    productMap.set(
                        product._id.toString(),
                        product
                    );

                    // Example:
                    // Kit contains 2 Rompers
                    // Customer buys 3 Kits
                    // Required stock = 2 × 3 = 6
                    const requiredQuantity =
                        kitItem.quantity *
                        cartItem.quantity;

                    const productId =
                        product._id.toString();

                    // Add this requirement to any existing
                    // requirement for the same product.
                    stockRequirements.set(
                        productId,
                        (stockRequirements.get(productId) || 0) +
                        requiredQuantity
                    );
                }

                // Calculate the kit total
                const itemTotal =
                    kit.price * cartItem.quantity;

                // Add it to the subtotal
                subtotal += itemTotal;

                // Store a snapshot of the kit information
                // inside the order.
                orderItems.push({
                    itemType: "kit",
                    product: null,
                    kit: kit._id,
                    title: kit.name,
                    price: kit.price,
                    quantity: cartItem.quantity,
                    image: kit.image
                });

                continue;
            }

            // Reject an unexpected cart item type
            throw new ApiError(
                400,
                "Cart contains an invalid item type"
            );
        }

        // ------------------------------------------------
        // CHECK ALL REQUIRED STOCK
        // ------------------------------------------------

        // Check the stock that was available when
        // the products were read.
        for (const [
            productId,
            requiredQuantity
        ] of stockRequirements) {
            const product =
                productMap.get(productId);

            // Make sure the product still exists
            if (!product) {
                throw new ApiError(
                    404,
                    "One of the required products no longer exists"
                );
            }

            // Make sure enough stock was available
            if (product.stock < requiredQuantity) {
                throw new ApiError(
                    400,
                    `Not enough stock for ${product.title}`
                );
            }
        }

        // Coupon functionality will be integrated separately.
        const discount = 0;

        // Orders of ₹1000 or more get free shipping
        const shippingFee =
            subtotal >= 1000 ? 0 : 50;

        // Calculate the final amount
        const totalAmount =
            subtotal - discount + shippingFee;

        // ------------------------------------------------
        // CREATE ORDER
        // ------------------------------------------------

        // Create the order inside the transaction.
        // Order.create expects an array when options such
        // as the MongoDB session are provided.
        const createdOrders = await Order.create(
            [
                {
                    user: req.user._id,
                    items: orderItems,
                    shippingAddress,
                    subtotal,
                    discount,
                    shippingFee,
                    totalAmount,
                    coupon: null,
                    status: "pending"
                }
            ],
            { session }
        );

        const order = createdOrders[0];

        // ------------------------------------------------
        // REDUCE PRODUCT STOCK
        // ------------------------------------------------

        // Reduce each product only once using the
        // aggregated stock requirement.
        for (const [
            productId,
            requiredQuantity
        ] of stockRequirements) {
            // Atomically reduce stock only when enough
            // stock is still available.
            const stockUpdate =
                await Product.updateOne(
                    {
                        _id: productId,
                        stock: {
                            $gte: requiredQuantity
                        }
                    },
                    {
                        $inc: {
                            stock: -requiredQuantity
                        }
                    },
                    { session }
                );

            // If no document was modified, stock changed
            // after our earlier check.
            if (stockUpdate.modifiedCount !== 1) {
                const product =
                    productMap.get(productId);

                throw new ApiError(
                    400,
                    `Not enough stock for ${product.title}`
                );
            }
        }

        // ------------------------------------------------
        // CLEAR CART
        // ------------------------------------------------

        // Clear the cart inside the same transaction.
        cart.items = [];

        await cart.save({ session });

        // ------------------------------------------------
        // COMMIT TRANSACTION
        // ------------------------------------------------

        // All order, stock and cart changes are now
        // permanently committed together.
        await session.commitTransaction();

        // Populate product and kit references after
        // the transaction has successfully committed.
        await order.populate([
            {
                path: "items.product"
            },
            {
                path: "items.kit"
            }
        ]);

        // Send the created order
        return sendSuccessResponse(
            res,
            201,
            order,
            "Order created successfully"
        );
    } catch (error) {
        // Roll back every database change made
        // during this transaction.
        await session.abortTransaction();

        next(error);
    } finally {
        // Close the MongoDB session.
        session.endSession();
    }
};
// Get all orders belonging to the logged-in user
// Get all orders belonging to the logged-in user
export const getMyOrders = async (req, res, next) => {
    try {
        // Find only the orders created by the authenticated user
        const orders = await Order.find({
            user: req.user._id
        })
            // Populate both product and kit details
            // Product items use items.product
            // Kit items use items.kit
            .populate([
                {
                    path: "items.product"
                },
                {
                    path: "items.kit"
                }
            ])
            // Show newest orders first
            .sort({ createdAt: -1 });

        // Send the user's orders
        return sendSuccessResponse(
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
// Get one order belonging to the logged-in user
export const getMyOrderById = async (req, res, next) => {
    try {
        const { orderId } = req.params;

        // Check whether the order ID is a valid MongoDB ObjectId
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
        })
            .populate("items.product")
            .populate("items.kit");

        // Make sure the order exists
        if (!order) {
            return next(new ApiError(404, "Order not found"));
        }

        return sendSuccessResponse(
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
    // Start a MongoDB session for the transaction
    const session = await mongoose.startSession();

    try {
        // Get the order ID from the URL
        const { orderId } = req.params;
        // Check whether the order ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return next(
                new ApiError(
                    400,
                    "Order ID must be a valid order ID"
                )
            );
        }

        // Start the transaction
        session.startTransaction();

        // Find only the order belonging to the logged-in user
        const order = await Order.findOne({
            _id: orderId,
            user: req.user._id
        }).session(session);

        // Make sure the order exists
        if (!order) {
            throw new ApiError(404, "Order not found");
        }

        // Only pending and confirmed orders can be cancelled
        if (
            order.status !== "pending" &&
            order.status !== "confirmed"
        ) {
            throw new ApiError(
                400,
                "This order cannot be cancelled"
            );
        }

        // Store the total quantity that needs to be
        // restored for each product.
        //
        // Example:
        // Direct product = 1
        // Kit contains product × 2
        // Total restoration = 3
        const stockRestorations = new Map();

        // Process every item in the order
        for (const item of order.items) {
            // ------------------------------------------------
            // PRODUCT ORDER ITEM
            // ------------------------------------------------
            if (item.itemType === "product") {
                // Make sure the product reference exists
                if (!item.product) {
                    throw new ApiError(
                        400,
                        "Product reference is missing from order"
                    );
                }

                const productId = item.product.toString();

                // Add the ordered quantity to the restoration
                // requirement.
                stockRestorations.set(
                    productId,
                    (stockRestorations.get(productId) || 0) +
                    item.quantity
                );

                continue;
            }

            // ------------------------------------------------
            // KIT ORDER ITEM
            // ------------------------------------------------
            if (item.itemType === "kit") {
                // Make sure the kit reference exists
                if (!item.kit) {
                    throw new ApiError(
                        400,
                        "Kit reference is missing from order"
                    );
                }

                // Get the original kit and its products
                const kit = await Kit.findById(
                    item.kit
                ).session(session);

                // The kit must still exist because we need
                // to know which products were inside it.
                if (!kit) {
                    throw new ApiError(
                        404,
                        "Kit not found while restoring stock"
                    );
                }

                // Calculate the product quantities that were
                // consumed by this kit order.
                for (const kitItem of kit.items) {
                    if (!kitItem.product) {
                        throw new ApiError(
                            404,
                            "Product not found inside kit while restoring stock"
                        );
                    }

                    // Example:
                    // Kit contains 2 Rompers
                    // Customer ordered 3 Kits
                    // Restore = 2 × 3 = 6 Rompers
                    const restoreQuantity =
                        kitItem.quantity * item.quantity;

                    const productId =
                        kitItem.product.toString();

                    // Add this quantity to any existing
                    // restoration requirement.
                    stockRestorations.set(
                        productId,
                        (stockRestorations.get(productId) || 0) +
                        restoreQuantity
                    );
                }

                continue;
            }

            // Reject unexpected order item types
            throw new ApiError(
                400,
                "Order contains an invalid item type"
            );
        }

        // ------------------------------------------------
        // RESTORE PRODUCT STOCK
        // ------------------------------------------------

        // Restore each product only once.
        for (const [
            productId,
            restoreQuantity
        ] of stockRestorations) {
            const product = await Product.findByIdAndUpdate(
                productId,
                {
                    $inc: {
                        stock: restoreQuantity
                    }
                },
                {
                    session,
                    new: true
                }
            );

            // Make sure the product still exists
            if (!product) {
                throw new ApiError(
                    404,
                    "Product not found while restoring stock"
                );
            }
        }

        // Change the order status to cancelled
        order.status = "cancelled";

        // Save the cancelled order inside the transaction
        await order.save({ session });

        // Find the payment associated with this order
        const payment = await Payment.findOne({
            order: order._id,
            user: req.user._id
        }).session(session);

        // Create an automatic refund only for paid online orders
        if (
            payment &&
            payment.paymentMethod === "online" &&
            payment.status === "paid"
        ) {
            await createOrderCancellationRefund(
                order,
                payment,
                session
            );
        }

        // Commit all database changes together
        await session.commitTransaction();

        // Return the cancelled order
        return sendSuccessResponse(
            res,
            200,
            order,
            "Order cancelled successfully"
        );
    } catch (error) {
        // Undo all database changes if anything failed
        await session.abortTransaction();

        next(error);
    } finally {
        // Always close the MongoDB session
        session.endSession();
    }
};
// Get all orders for the admin
// Get all orders - Admin only
export const getAllOrders = async (req, res, next) => {
    try {
        // Get all orders from the database
        const orders = await Order.find()
            // Include basic user information
            .populate("user", "email phone")

            // Populate both product and kit details
            .populate([
                {
                    path: "items.product"
                },
                {
                    path: "items.kit"
                }
            ])

            // Show newest orders first
            .sort({ createdAt: -1 });

        // Send all orders to the admin
        return sendSuccessResponse(
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
        // Define which status changes are allowed
        const allowedTransitions = {
            pending: ["confirmed", "cancelled"],
            confirmed: ["processing", "cancelled"],
            processing: ["shipped"],
            shipped: ["delivered"],
            delivered: [],
            cancelled: []
        };

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
        // Check whether the requested status change is allowed
        if (!allowedTransitions[order.status].includes(status)) {
            return next(
                new ApiError(
                    400,
                    `Cannot change order status from ${order.status} to ${status}`
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
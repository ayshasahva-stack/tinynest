import mongoose from "mongoose";
import Order from "./order.model.js";
import Cart from "../cart/cart.model.js";
import Payment from "../payments/payment.model.js";
import Product from "../products/product.model.js";
import Coupon from "../coupons/coupon.model.js";
import Kit from "../kits/kit.model.js";
import ApiError from "../../utils/Apierror.js";
import sendSuccessResponse from "../../utils/ApiResponse.js";
import { getProductOfferPrice } from "../offers/offer.service.js";
import { createOrderCancellationRefund } from "../refund/refund.controller.js";
import { validateShippingAddress } from "./order.validation.js";
import { getIo } from "../../realtime/io.js";


// Create an order using the logged-in user's cart
// Create an order using the logged-in user's cart
// Create a new order from the user's cart
export const createOrder = async (req, res, next) => {
    // Start a MongoDB session for the order transaction
    const session = await mongoose.startSession();

    try {
        // Get the shipping address and optional coupon code
        const { shippingAddress, couponCode } = req.body;

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

        // Store the calculated coupon discount
        let discount = 0;

        // Store the coupon document when a coupon is used
        let appliedCoupon = null;

        // Store the total stock required for each product.
        // This handles products that appear directly
        // and also inside kits.
        const stockRequirements = new Map();

        // Store product documents so we don't repeatedly
        // query the same product.
        const productMap = new Map();

        // ------------------------------------------------
        // PROCESS CART ITEMS
        // ------------------------------------------------

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

                // Get the product price after applying
                // any currently active offer.
                const offerPricing =
                    await getProductOfferPrice(product);

                // Use the offer price when calculating
                // the order item's total.
                const itemTotal =
                    offerPricing.offerPrice * cartItem.quantity;

                // Add the discounted item total to the subtotal.
                subtotal += itemTotal;

                // Store the actual selling price used
                // for this order.
                orderItems.push({
                    itemType: "product",
                    product: product._id,
                    kit: null,
                    title: product.title,
                    price: offerPricing.offerPrice,
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

                // Store a snapshot of every product inside the kit
                // at the time the order is created.
                const kitItems = kit.items.map((kitItem) => ({
                    product: kitItem.product._id,
                    title: kitItem.product.title,
                    price: kitItem.product.price,
                    quantity: kitItem.quantity,
                    image: kitItem.product.images[0]
                }));

                // Store a snapshot of the kit information
                // inside the order.
                orderItems.push({
                    itemType: "kit",
                    product: null,
                    kit: kit._id,
                    title: kit.name,
                    price: kit.price,
                    quantity: cartItem.quantity,
                    image: kit.image,

                    // Save the kit's products as they existed
                    // when the customer placed the order.
                    kitItems
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
        // APPLY COUPON
        // ------------------------------------------------

        // Apply a coupon only when the customer provided one
        if (couponCode) {
            // Make sure the coupon code is a string
            if (typeof couponCode !== "string") {
                throw new ApiError(
                    400,
                    "Coupon code must be a string"
                );
            }

            // Normalize the coupon code
            const normalizedCode =
                couponCode.trim().toUpperCase();

            // Make sure the coupon code isn't empty
            if (!normalizedCode) {
                throw new ApiError(
                    400,
                    "Coupon code is required"
                );
            }

            // Find the coupon inside the transaction
            const coupon = await Coupon.findOne({
                code: normalizedCode
            }).session(session);

            // Make sure the coupon exists
            if (!coupon) {
                throw new ApiError(
                    404,
                    "Coupon not found"
                );
            }

            const now = new Date();

            // Check whether the coupon is active
            if (!coupon.isActive) {
                throw new ApiError(
                    400,
                    "Coupon is inactive"
                );
            }

            // Check coupon start date
            if (now < coupon.startDate) {
                throw new ApiError(
                    400,
                    "Coupon is not active yet"
                );
            }

            // Check coupon expiry date
            if (now > coupon.expiryDate) {
                throw new ApiError(
                    400,
                    "Coupon has expired"
                );
            }

            // Check coupon usage limit
            if (
                coupon.usageLimit !== null &&
                coupon.usedCount >= coupon.usageLimit
            ) {
                throw new ApiError(
                    400,
                    "Coupon usage limit reached"
                );
            }

            // Check the real subtotal calculated
            // from the user's cart.
            if (subtotal < coupon.minOrderAmount) {
                throw new ApiError(
                    400,
                    `Minimum order amount is ${coupon.minOrderAmount}`
                );
            }

            // Calculate percentage discount
            if (coupon.discountType === "percentage") {
                discount =
                    (subtotal * coupon.discountValue) / 100;

                // Apply maximum discount when configured
                if (
                    coupon.maxDiscount !== null &&
                    discount > coupon.maxDiscount
                ) {
                    discount = coupon.maxDiscount;
                }
            } else {
                // Calculate fixed discount
                discount = coupon.discountValue;

                // Discount cannot exceed subtotal
                if (discount > subtotal) {
                    discount = subtotal;
                }
            }

            // Round discount to two decimal places
            discount =
                Math.round(discount * 100) / 100;

            // Keep the coupon document so we can:
            // 1. Store its ID in the order
            // 2. Increase its usedCount
            appliedCoupon = coupon;
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

        // ------------------------------------------------
        // CALCULATE SHIPPING AND TOTAL
        // ------------------------------------------------

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

                    // Store the coupon used for this order,
                    // or null when no coupon was used.
                    coupon: appliedCoupon
                        ? appliedCoupon._id
                        : null,

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
        // UPDATE COUPON USAGE
        // ------------------------------------------------

        // Increase coupon usage only when a coupon
        // was actually used for this order.
        if (appliedCoupon) {
            const couponUpdate =
                await Coupon.updateOne(
                    {
                        _id: appliedCoupon._id,

                        // Make sure the usage limit has not
                        // been reached while the transaction
                        // was running.
                        $or: [
                            {
                                usageLimit: null
                            },
                            {
                                $expr: {
                                    $lt: [
                                        "$usedCount",
                                        "$usageLimit"
                                    ]
                                }
                            }
                        ]
                    },
                    {
                        $inc: {
                            usedCount: 1
                        }
                    },
                    { session }
                );

            // If the coupon could not be updated,
            // stop the transaction.
            if (couponUpdate.modifiedCount !== 1) {
                throw new ApiError(
                    400,
                    "Coupon usage limit reached"
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

        // All order, stock, coupon and cart changes
        // are permanently committed together.
        await session.commitTransaction();

        // Populate product and kit references after
        // the transaction has successfully committed.
        await order.populate([
            {
                path: "items.product"
            },
            {
                path: "items.kit"
            },
            {
                path: "coupon"
            }
        ]);
        // Get the Socket.IO server instance
        const io = getIo();

        // Notify all connected admins about the new order
        io.to("admin").emit("order:new", {
            orderId: order._id,
            userId: order.user,
            totalAmount: order.totalAmount,
            status: order.status,
            itemCount: order.items.length
        });
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
                // Make sure the kit snapshot exists.
                // New orders should always have kitItems because
                // createOrder saves the kit contents at checkout.
                if (!item.kitItems || item.kitItems.length === 0) {
                    throw new ApiError(
                        400,
                        "Kit snapshot is missing from order"
                    );
                }

                // Use the products stored in the order snapshot
                // instead of reading the current Kit document.
                //
                // This is important because the kit may have been
                // edited after the customer placed the order.
                for (const kitItem of item.kitItems) {
                    // Make sure the snapshot contains a product
                    if (!kitItem.product) {
                        throw new ApiError(
                            404,
                            "Product reference is missing from kit snapshot"
                        );
                    }

                    // Calculate how many units of this product
                    // need to be restored.
                    //
                    // Example:
                    // Kit snapshot contains 2 Rompers
                    // Customer ordered 3 Kits
                    // Restore = 2 × 3 = 6 Rompers
                    const restoreQuantity =
                        kitItem.quantity * item.quantity;

                    const productId =
                        kitItem.product.toString();

                    // Add this quantity to any existing restoration
                    // requirement for the same product.
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
        // Get the Socket.IO server instance
        const io = getIo();

        // Notify the customer that their order status changed
        io.to(`user:${order.user}`).emit("order:statusUpdated", {
            orderId: order._id,
            status: order.status
        });

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
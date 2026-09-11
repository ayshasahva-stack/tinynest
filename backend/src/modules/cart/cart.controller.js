import mongoose from "mongoose";
import Cart from "./cart.model.js";
import Product from "../products/product.model.js";
import Kit from "../kits/kit.model.js";
import ApiError from "../../utils/Apierror.js";
import sendSuccessResponse from "../../utils/ApiResponse.js";
import {
    validateCartItem,
    validateCartQuantity,
} from "./cart.validation.js";

// Add a product to the user's cart
// Add a product or kit to the user's cart
export const addToCart = async (req, res, next) => {
    try {
        // Validate the item data first
        const error = validateCartItem(req.body);

        if (error) {
            return next(new ApiError(400, error));
        }

        // Get the item information from the request
        // Product is the default for backward compatibility
        const {
            itemType = "product",
            product,
            kit,
            quantity
        } = req.body;

        // Find the cart belonging to the logged-in user
        let cart = await Cart.findOne({
            user: req.user._id
        });

        // -------------------------------------------------
        // PRODUCT
        // -------------------------------------------------

        if (itemType === "product") {
            // Find the product
            const productDoc = await Product.findById(product);

            // Make sure the product exists
            if (!productDoc) {
                return next(
                    new ApiError(404, "Product not found")
                );
            }

            // Check whether the requested quantity is available
            if (productDoc.stock < quantity) {
                return next(
                    new ApiError(
                        400,
                        `Only ${productDoc.stock} items are available`
                    )
                );
            }

            // Create a cart if the user doesn't have one
            if (!cart) {
                cart = new Cart({
                    user: req.user._id,
                    items: [
                        {
                            itemType: "product",
                            product: productDoc._id,
                            kit: null,
                            quantity
                        }
                    ]
                });
            } else {
                // Check whether this product is already in the cart
                const existingItem = cart.items.find(
                    (item) =>
                        item.itemType === "product" &&
                        item.product &&
                        item.product.toString() ===
                        productDoc._id.toString()
                );

                if (existingItem) {
                    // Calculate the new total quantity
                    const newQuantity =
                        existingItem.quantity + quantity;

                    // Make sure the new quantity doesn't exceed stock
                    if (newQuantity > productDoc.stock) {
                        return next(
                            new ApiError(
                                400,
                                `Only ${productDoc.stock} items are available`
                            )
                        );
                    }

                    existingItem.quantity = newQuantity;
                } else {
                    // Add a new product to the cart
                    cart.items.push({
                        itemType: "product",
                        product: productDoc._id,
                        kit: null,
                        quantity
                    });
                }
            }
        }

        // -------------------------------------------------
        // KIT
        // -------------------------------------------------

        if (itemType === "kit") {
            // Find the kit
            const kitDoc = await Kit.findById(kit);

            // Make sure the kit exists
            if (!kitDoc) {
                return next(
                    new ApiError(404, "Kit not found")
                );
            }

            // Customers can only add active kits
            if (!kitDoc.isActive) {
                return next(
                    new ApiError(
                        400,
                        "This kit is currently unavailable"
                    )
                );
            }

            // Get all products used inside the kit
            const productIds = kitDoc.items.map(
                (item) => item.product
            );

            const products = await Product.find({
                _id: { $in: productIds }
            });

            // Make sure every kit product still exists
            if (products.length !== productIds.length) {
                return next(
                    new ApiError(
                        404,
                        "One or more products in the kit were not found"
                    )
                );
            }

            // Check stock for every product in the kit
            for (const kitItem of kitDoc.items) {
                const productDoc = products.find(
                    (product) =>
                        product._id.toString() ===
                        kitItem.product.toString()
                );

                // Calculate the required stock
                const requiredStock =
                    kitItem.quantity * quantity;

                // Make sure enough stock exists
                if (productDoc.stock < requiredStock) {
                    return next(
                        new ApiError(
                            400,
                            `Not enough stock for ${productDoc.title}`
                        )
                    );
                }
            }

            // Create a cart if the user doesn't have one
            if (!cart) {
                cart = new Cart({
                    user: req.user._id,
                    items: [
                        {
                            itemType: "kit",
                            product: null,
                            kit: kitDoc._id,
                            quantity
                        }
                    ]
                });
            } else {
                // Check whether this kit is already in the cart
                const existingItem = cart.items.find(
                    (item) =>
                        item.itemType === "kit" &&
                        item.kit &&
                        item.kit.toString() ===
                        kitDoc._id.toString()
                );

                if (existingItem) {
                    // Calculate the new total kit quantity
                    const newQuantity =
                        existingItem.quantity + quantity;

                    // Check stock again for the total quantity
                    for (const kitItem of kitDoc.items) {
                        const productDoc = products.find(
                            (product) =>
                                product._id.toString() ===
                                kitItem.product.toString()
                        );

                        const requiredStock =
                            kitItem.quantity * newQuantity;

                        if (productDoc.stock < requiredStock) {
                            return next(
                                new ApiError(
                                    400,
                                    `Not enough stock for ${productDoc.title}`
                                )
                            );
                        }
                    }

                    existingItem.quantity = newQuantity;
                } else {
                    // Add a new kit to the cart
                    cart.items.push({
                        itemType: "kit",
                        product: null,
                        kit: kitDoc._id,
                        quantity
                    });
                }
            }
        }

        // Save the cart
        await cart.save();

        // Populate both product and kit information
        await cart.populate([
            {
                path: "items.product"
            },
            {
                path: "items.kit"
            }
        ]);

        // Return the updated cart
        return sendSuccessResponse(
            res,
            200,
            cart,
            itemType === "kit"
                ? "Kit added to cart successfully"
                : "Product added to cart successfully"
        );
    } catch (error) {
        // Pass unexpected errors to the global error handler
        next(error);
    }
};
// Get the logged-in user's cart
// Get the logged-in user's cart
export const getMyCart = async (req, res, next) => {
    try {
        // Find the cart belonging to the logged-in user
        const cart = await Cart.findOne({
            user: req.user._id
        }).populate([
            // Populate product information
            {
                path: "items.product"
            },

            // Populate kit information
            {
                path: "items.kit"
            }
        ]);

        // Return an empty cart if the user has not added anything yet
        if (!cart) {
            return sendSuccessResponse(
                res,
                200,
                {
                    items: []
                },
                "Cart fetched successfully"
            );
        }

        // Return the user's cart
        return sendSuccessResponse(
            res,
            200,
            cart,
            "Cart fetched successfully"
        );
    } catch (error) {
        // Pass unexpected errors to the global error handler
        next(error);
    }
};
// Update the quantity of a product already in the cart
// Update the quantity of a product or kit in the cart
export const updateCartQuantity = async (req, res, next) => {
    try {
        // Get the item type and ID from the URL
        const { itemType, itemId } = req.params;

        // Make sure the item type is valid
        if (!["product", "kit"].includes(itemType)) {
            return next(
                new ApiError(
                    400,
                    "Item type must be either product or kit"
                )
            );
        }

        // Validate the item ID
        if (!mongoose.Types.ObjectId.isValid(itemId)) {
            return next(
                new ApiError(400, "Invalid item ID")
            );
        }

        // Validate the requested quantity
        const error = validateCartQuantity(req.body);

        if (error) {
            return next(new ApiError(400, error));
        }

        const { quantity } = req.body;

        // Find the logged-in user's cart
        const cart = await Cart.findOne({
            user: req.user._id
        });

        if (!cart) {
            return next(
                new ApiError(404, "Cart not found")
            );
        }

        // -------------------------------------------------
        // PRODUCT
        // -------------------------------------------------

        if (itemType === "product") {
            // Find the product
            const product = await Product.findById(itemId);

            if (!product) {
                return next(
                    new ApiError(404, "Product not found")
                );
            }

            // Check product stock
            if (quantity > product.stock) {
                return next(
                    new ApiError(
                        400,
                        `Only ${product.stock} items are available`
                    )
                );
            }

            // Find the product inside the cart
            const cartItem = cart.items.find(
                (item) =>
                    item.itemType === "product" &&
                    item.product &&
                    item.product.toString() === itemId
            );

            if (!cartItem) {
                return next(
                    new ApiError(
                        404,
                        "Product not found in cart"
                    )
                );
            }

            // Update the product quantity
            cartItem.quantity = quantity;
        }

        // -------------------------------------------------
        // KIT
        // -------------------------------------------------

        if (itemType === "kit") {
            // Find the kit
            const kit = await Kit.findById(itemId);

            if (!kit) {
                return next(
                    new ApiError(404, "Kit not found")
                );
            }

            // Customers can only update active kits
            if (!kit.isActive) {
                return next(
                    new ApiError(
                        400,
                        "This kit is currently unavailable"
                    )
                );
            }

            // Get all products inside the kit
            const productIds = kit.items.map(
                (item) => item.product
            );

            const products = await Product.find({
                _id: { $in: productIds }
            });

            // Make sure every kit product still exists
            if (products.length !== productIds.length) {
                return next(
                    new ApiError(
                        404,
                        "One or more products in the kit were not found"
                    )
                );
            }

            // Check stock for the requested number of kits
            for (const kitItem of kit.items) {
                const product = products.find(
                    (product) =>
                        product._id.toString() ===
                        kitItem.product.toString()
                );

                // Calculate how many units of this product are needed
                const requiredStock =
                    kitItem.quantity * quantity;

                // Make sure enough stock exists
                if (product.stock < requiredStock) {
                    return next(
                        new ApiError(
                            400,
                            `Not enough stock for ${product.title}`
                        )
                    );
                }
            }

            // Find the kit inside the cart
            const cartItem = cart.items.find(
                (item) =>
                    item.itemType === "kit" &&
                    item.kit &&
                    item.kit.toString() === itemId
            );

            if (!cartItem) {
                return next(
                    new ApiError(
                        404,
                        "Kit not found in cart"
                    )
                );
            }

            // Update the kit quantity
            cartItem.quantity = quantity;
        }

        // Save the updated cart
        await cart.save();

        // Populate both products and kits
        await cart.populate([
            {
                path: "items.product"
            },
            {
                path: "items.kit"
            }
        ]);

        // Return the updated cart
        return sendSuccessResponse(
            res,
            200,
            cart,
            "Cart quantity updated successfully"
        );
    } catch (error) {
        // Pass unexpected errors to the global error handler
        next(error);
    }
};
// Remove a product from the user's cart
export const removeFromCart = async (req, res, next) => {
    try {
        const { productId } = req.params;

        // Validate the product ID from the URL
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return next(new ApiError(400, "Invalid product ID"));
        }

        // Find the logged-in user's cart
        const cart = await Cart.findOne({
            user: req.user._id
        });

        if (!cart) {
            return next(new ApiError(404, "Cart not found"));
        }

        // Check whether the product exists in the cart
        const itemExists = cart.items.some(
            (item) =>
                item.product.toString() === productId
        );

        if (!itemExists) {
            return next(
                new ApiError(404, "Product not found in cart")
            );
        }

        // Remove the product from the cart
        cart.items = cart.items.filter(
            (item) =>
                item.product.toString() !== productId
        );

        // Save the updated cart
        await cart.save();

        // Populate product information for the response
        await cart.populate("items.product");

        sendSuccessResponse(
            res,
            200,
            cart,
            "Product removed from cart successfully"
        );
    } catch (error) {
        next(error);
    }
};
// Remove all products from the user's cart
export const clearCart = async (req, res, next) => {
    try {
        // Find the logged-in user's cart
        const cart = await Cart.findOne({
            user: req.user._id
        });

        // Return an empty cart if it doesn't exist
        if (!cart) {
            return sendSuccessResponse(
                res,
                200,
                {
                    items: []
                },
                "Cart cleared successfully"
            );
        }

        // Remove all items from the cart
        cart.items = [];

        // Save the updated cart
        await cart.save();

        // Return the empty cart
        sendSuccessResponse(
            res,
            200,
            cart,
            "Cart cleared successfully"
        );
    } catch (error) {
        next(error);
    }
};
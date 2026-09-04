import mongoose from "mongoose";
import Cart from "./cart.model.js";
import Product from "../products/product.model.js";
import ApiError from "../../utils/Apierror.js";
import sendSuccessResponse from "../../utils/ApiResponse.js";
import {
    validateCartItem,
    validateCartQuantity,
} from "./cart.validation.js";

// Add a product to the user's cart
export const addToCart = async (req, res, next) => {
    try {
        // Validate product ID and quantity
        const error = validateCartItem(req.body);

        if (error) {
            return next(new ApiError(400, error));
        }

        const { product, quantity } = req.body;

        // Find the product
        const productDoc = await Product.findById(product);

        if (!productDoc) {
            return next(new ApiError(404, "Product not found"));
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

        // Find the cart belonging to the logged-in user
        let cart = await Cart.findOne({
            user: req.user._id
        });

        // Create a cart if the user doesn't have one
        if (!cart) {
            cart = new Cart({
                user: req.user._id,
                items: [
                    {
                        product: productDoc._id,
                        quantity
                    }
                ]
            });
        } else {
            // Check whether the product is already in the cart
            const existingItem = cart.items.find(
                (item) =>
                    item.product.toString() === productDoc._id.toString()
            );

            if (existingItem) {
                // Calculate the new total quantity
                const newQuantity = existingItem.quantity + quantity;

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
                    product: productDoc._id,
                    quantity
                });
            }
        }

        // Save the cart
        await cart.save();

        // Return product information along with the cart
        await cart.populate("items.product");

        sendSuccessResponse(
            res,
            200,
            cart,
            "Product added to cart successfully"
        );
    } catch (error) {
        next(error);
    }
};

// Get the logged-in user's cart
export const getMyCart = async (req, res, next) => {
    try {
        // Find the cart belonging to the logged-in user
        const cart = await Cart.findOne({
            user: req.user._id
        }).populate("items.product");

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
        sendSuccessResponse(
            res,
            200,
            cart,
            "Cart fetched successfully"
        );
    } catch (error) {
        next(error);
    }
};
// Update the quantity of a product already in the cart
export const updateCartQuantity = async (req, res, next) => {
    try {
        const { productId } = req.params;

        // Validate the product ID from the URL
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return next(new ApiError(400, "Invalid product ID"));
        }

        // Validate the requested quantity
        const error = validateCartQuantity(req.body);

        if (error) {
            return next(new ApiError(400, error));
        }

        const { quantity } = req.body;

        // Find the product
        const product = await Product.findById(productId);

        if (!product) {
            return next(new ApiError(404, "Product not found"));
        }

        // Check that the requested quantity is available
        if (quantity > product.stock) {
            return next(
                new ApiError(
                    400,
                    `Only ${product.stock} items are available`
                )
            );
        }

        // Find the logged-in user's cart
        const cart = await Cart.findOne({
            user: req.user._id
        });

        if (!cart) {
            return next(new ApiError(404, "Cart not found"));
        }

        // Find the product inside the cart
        const cartItem = cart.items.find(
            (item) =>
                item.product.toString() === productId
        );

        if (!cartItem) {
            return next(
                new ApiError(404, "Product not found in cart")
            );
        }

        // Update the quantity
        cartItem.quantity = quantity;

        // Save the updated cart
        await cart.save();

        // Populate product information for the response
        await cart.populate("items.product");

        sendSuccessResponse(
            res,
            200,
            cart,
            "Cart quantity updated successfully"
        );
    } catch (error) {
        next(error);
    }
};
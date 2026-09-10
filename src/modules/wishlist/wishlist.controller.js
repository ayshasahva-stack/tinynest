import Wishlist from "./wishlist.model.js";
import Product from "../products/product.model.js";
import ApiError from "../../utils/Apierror.js";
import sendSuccessResponse from "../../utils/ApiResponse.js";
import { validateWishlistProduct } from "./wishlist.validation.js";

// Add a product to the logged-in user's wishlist
export const addToWishlist = async (req, res, next) => {
    try {
        const { productId } = req.params;

        // Validate the product ID
        const validationError = validateWishlistProduct(productId);

        if (validationError) {
            return next(new ApiError(400, validationError));
        }

        // Check that the product actually exists
        const product = await Product.findById(productId);

        if (!product) {
            return next(new ApiError(404, "Product not found"));
        }

        // Find the wishlist belonging to the logged-in user
        let wishlist = await Wishlist.findOne({
            user: req.user._id
        });

        // Create a wishlist if the user doesn't have one yet
        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: req.user._id,
                products: [productId]
            });
        } else {
            // Check whether the product is already in the wishlist
            const alreadyExists = wishlist.products.some(
                (id) => id.toString() === productId
            );

            if (alreadyExists) {
                return next(new ApiError(400, "Product already exists in wishlist"));
            }

            // Add the product to the wishlist
            wishlist.products.push(productId);

            await wishlist.save();
        }

        // Return complete product information
        await wishlist.populate("products");

        sendSuccessResponse(
            res,
            200,
            wishlist,
            "Product added to wishlist"
        );
    } catch (error) {
        next(error);
    }
};

// Get the logged-in user's wishlist
export const getMyWishlist = async (req, res, next) => {
    try {
        // Find the wishlist belonging to the logged-in user
        const wishlist = await Wishlist.findOne({
            user: req.user._id
        }).populate("products");

        // If the user doesn't have a wishlist yet, return an empty list
        if (!wishlist) {
            return sendSuccessResponse(
                res,
                200,
                { products: [] },
                "Wishlist fetched successfully"
            );
        }

        sendSuccessResponse(
            res,
            200,
            wishlist,
            "Wishlist fetched successfully"
        );
    } catch (error) {
        next(error);
    }
};

// Remove a product from the logged-in user's wishlist
export const removeFromWishlist = async (req, res, next) => {
    try {
        const { productId } = req.params;

        // Validate the product ID
        const validationError = validateWishlistProduct(productId);

        if (validationError) {
            return next(new ApiError(400, validationError));
        }

        // Find the user's wishlist
        const wishlist = await Wishlist.findOne({
            user: req.user._id
        });

        if (!wishlist) {
            return next(new ApiError(404, "Wishlist not found"));
        }

        // Check whether the product exists in the wishlist
        const productExists = wishlist.products.some(
            (id) => id.toString() === productId
        );

        if (!productExists) {
            return next(new ApiError(404, "Product not found in wishlist"));
        }

        // Remove the product
        wishlist.products = wishlist.products.filter(
            (id) => id.toString() !== productId
        );

        await wishlist.save();

        // Return the updated wishlist with product details
        await wishlist.populate("products");

        sendSuccessResponse(
            res,
            200,
            wishlist,
            "Product removed from wishlist"
        );
    } catch (error) {
        next(error);
    }
};

// Clear all products from the logged-in user's wishlist
export const clearWishlist = async (req, res, next) => {
    try {
        // Find the user's wishlist
        const wishlist = await Wishlist.findOne({
            user: req.user._id
        });

        // If no wishlist exists, return an empty list
        if (!wishlist) {
            return sendSuccessResponse(
                res,
                200,
                { products: [] },
                "Wishlist cleared successfully"
            );
        }

        // Remove all products
        wishlist.products = [];

        await wishlist.save();

        sendSuccessResponse(
            res,
            200,
            wishlist,
            "Wishlist cleared successfully"
        );
    } catch (error) {
        next(error);
    }
};
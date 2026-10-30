
import mongoose from "mongoose";

import Wishlist from "./wishlist.model.js";
import Product from "../products/product.model.js";
import Kit from "../kits/kit.model.js";

import ApiError from "../../utils/ApiError.js";
import sendSuccessResponse from "../../utils/ApiResponse.js";

// Populate both types whenever a wishlist is returned.
const populateWishlist = async (wishlist) => {
    await wishlist.populate(["products", "kits"]);
    return wishlist;
};

// Validate MongoDB IDs before querying.
const validateId = (id, label, next) => {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        next(new ApiError(400, `${label} must be a valid ID`));
        return false;
    }

    return true;
};

// Find the logged-in user's wishlist or create an empty one.
const findOrCreateWishlist = async (userId) => {
    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
        wishlist = await Wishlist.create({
            user: userId,
            products: [],
            kits: [],
        });
    }

    return wishlist;
};

// -------------------- PRODUCTS --------------------

// Add a product to the user's wishlist.
export const addToWishlist = async (req, res, next) => {
    try {
        const { productId } = req.params;

        if (!validateId(productId, "Product ID", next)) return;

        const product = await Product.findById(productId);

        if (!product) {
            return next(new ApiError(404, "Product not found"));
        }

        const wishlist = await findOrCreateWishlist(req.user._id);

        const alreadyExists = wishlist.products.some(
            (id) => id.toString() === productId
        );

        if (alreadyExists) {
            return next(
                new ApiError(400, "Product already exists in wishlist")
            );
        }

        wishlist.products.push(productId);
        await wishlist.save();
        await populateWishlist(wishlist);

        return sendSuccessResponse(
            res,
            200,
            wishlist,
            "Product added to wishlist"
        );
    } catch (error) {
        next(error);
    }
};

// -------------------- KITS --------------------

// Add a baby kit to the user's wishlist.
export const addKitToWishlist = async (req, res, next) => {
    try {
        const { kitId } = req.params;

        if (!validateId(kitId, "Kit ID", next)) return;

        // Only allow existing, active kits to be wishlisted.
        const kit = await Kit.findOne({
            _id: kitId,
            isActive: true,
        });

        if (!kit) {
            return next(new ApiError(404, "Kit not found or unavailable"));
        }

        const wishlist = await findOrCreateWishlist(req.user._id);

        const alreadyExists = wishlist.kits.some(
            (id) => id.toString() === kitId
        );

        if (alreadyExists) {
            return next(new ApiError(400, "Kit already exists in wishlist"));
        }

        wishlist.kits.push(kitId);
        await wishlist.save();
        await populateWishlist(wishlist);

        return sendSuccessResponse(
            res,
            200,
            wishlist,
            "Kit added to wishlist"
        );
    } catch (error) {
        next(error);
    }
};

// -------------------- GET WISHLIST --------------------

// Fetch the user's products and kits together.
export const getMyWishlist = async (req, res, next) => {
    try {
        const wishlist = await Wishlist.findOne({
            user: req.user._id,
        }).populate(["products", "kits"]);

        // Existing users may not have a wishlist document yet.
        if (!wishlist) {
            return sendSuccessResponse(
                res,
                200,
                { products: [], kits: [] },
                "Wishlist fetched successfully"
            );
        }

        return sendSuccessResponse(
            res,
            200,
            wishlist,
            "Wishlist fetched successfully"
        );
    } catch (error) {
        next(error);
    }
};

// -------------------- REMOVE ITEMS --------------------

// Remove a product from the wishlist.
export const removeFromWishlist = async (req, res, next) => {
    try {
        const { productId } = req.params;

        if (!validateId(productId, "Product ID", next)) return;

        const wishlist = await Wishlist.findOne({
            user: req.user._id,
        });

        if (!wishlist) {
            return next(new ApiError(404, "Wishlist not found"));
        }

        const exists = wishlist.products.some(
            (id) => id.toString() === productId
        );

        if (!exists) {
            return next(
                new ApiError(404, "Product not found in wishlist")
            );
        }

        wishlist.products = wishlist.products.filter(
            (id) => id.toString() !== productId
        );

        await wishlist.save();
        await populateWishlist(wishlist);

        return sendSuccessResponse(
            res,
            200,
            wishlist,
            "Product removed from wishlist"
        );
    } catch (error) {
        next(error);
    }
};

// Remove a kit from the wishlist.
export const removeKitFromWishlist = async (req, res, next) => {
    try {
        const { kitId } = req.params;

        if (!validateId(kitId, "Kit ID", next)) return;

        const wishlist = await Wishlist.findOne({
            user: req.user._id,
        });

        if (!wishlist) {
            return next(new ApiError(404, "Wishlist not found"));
        }

        const exists = wishlist.kits.some(
            (id) => id.toString() === kitId
        );

        if (!exists) {
            return next(new ApiError(404, "Kit not found in wishlist"));
        }

        wishlist.kits = wishlist.kits.filter(
            (id) => id.toString() !== kitId
        );

        await wishlist.save();
        await populateWishlist(wishlist);

        return sendSuccessResponse(
            res,
            200,
            wishlist,
            "Kit removed from wishlist"
        );
    } catch (error) {
        next(error);
    }
};

// Clear products and kits from the wishlist.
export const clearWishlist = async (req, res, next) => {
    try {
        const wishlist = await Wishlist.findOne({
            user: req.user._id,
        });

        if (!wishlist) {
            return sendSuccessResponse(
                res,
                200,
                { products: [], kits: [] },
                "Wishlist cleared successfully"
            );
        }

        wishlist.products = [];
        wishlist.kits = [];

        await wishlist.save();
        await populateWishlist(wishlist);

        return sendSuccessResponse(
            res,
            200,
            wishlist,
            "Wishlist cleared successfully"
        );
    } catch (error) {
        next(error);
    }
};

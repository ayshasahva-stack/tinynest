import mongoose from "mongoose";
import Offer from "./offer.model.js";
import Product from "../products/product.model.js";
import Category from "../categories/category.model.js";
import ApiError from "../../utils/Apierror.js";
import sendSuccessResponse from "../../utils/ApiResponse.js";

import {
    validateOffer,
    validateOfferUpdate,
} from "./offer.validation.js";

// Admin: create a new offer
export const createOffer = async (req, res, next) => {
    try {
        // Validate the offer data
        const validationError = validateOffer(req.body);

        if (validationError) {
            return next(new ApiError(400, validationError));
        }

        const {
            title,
            discountType,
            discountValue,
            product,
            category,
            startDate,
            expiryDate,
            isActive
        } = req.body;

        // Check whether the selected product exists
        if (product) {
            const productDoc = await Product.findById(product);

            if (!productDoc) {
                return next(new ApiError(404, "Product not found"));
            }
        }

        // Check whether the selected category exists
        if (category) {
            const categoryDoc = await Category.findById(category);

            if (!categoryDoc) {
                return next(new ApiError(404, "Category not found"));
            }
        }

        // Create the offer
        const offer = await Offer.create({
            title: title.trim(),
            discountType,
            discountValue,
            product: product || null,
            category: category || null,
            startDate,
            expiryDate,
            isActive: isActive ?? true
        });

        // Include product/category details in the response
        await offer.populate([
            {
                path: "product",
                select: "title price stock"
            },
            {
                path: "category",
                select: "name description"
            }
        ]);

        return sendSuccessResponse(
            res,
            201,
            offer,
            "Offer created successfully"
        );
    } catch (error) {
        next(error);
    }
};
// Public: get currently active offers
export const getActiveOffers = async (req, res, next) => {
    try {
        // Get the current date and time
        const now = new Date();

        // Find offers that are active and within their valid date range
        const offers = await Offer.find({
            isActive: true,
            startDate: { $lte: now },
            expiryDate: { $gte: now }
        })
            // Include basic product information
            .populate("product", "title price images")

            // Include basic category information
            .populate("category", "name image")

            // Show offers that expire soonest first
            .sort({ expiryDate: 1 });

        return sendSuccessResponse(
            res,
            200,
            offers,
            "Active offers fetched successfully"
        );
    } catch (error) {
        next(error);
    }
};
// Admin: get all offers
export const getAllOffers = async (req, res, next) => {
    try {
        // Get all offers from the database
        const offers = await Offer.find()

            // Include basic product information
            .populate("product", "title price images")

            // Include basic category information
            .populate("category", "name image")

            // Show newest offers first
            .sort({ createdAt: -1 });

        return sendSuccessResponse(
            res,
            200,
            offers,
            "All offers fetched successfully"
        );
    } catch (error) {
        next(error);
    }
};
// Admin: update an existing offer
export const updateOffer = async (req, res, next) => {
    try {
        const { offerId } = req.params;

        // Validate the offer ID
        if (!mongoose.Types.ObjectId.isValid(offerId)) {
            return next(
                new ApiError(400, "Offer ID must be a valid offer ID")
            );
        }

        // Validate the fields sent by the admin
        const validationError = validateOfferUpdate(req.body);

        if (validationError) {
            return next(new ApiError(400, validationError));
        }

        // Find the existing offer
        const offer = await Offer.findById(offerId);

        if (!offer) {
            return next(new ApiError(404, "Offer not found"));
        }

        // Update title
        if (req.body.title !== undefined) {
            offer.title = req.body.title.trim();
        }

        // Update discount type
        if (req.body.discountType !== undefined) {
            offer.discountType = req.body.discountType;
        }

        // Update discount value
        if (req.body.discountValue !== undefined) {
            offer.discountValue = req.body.discountValue;
        }

        // Make sure percentage discount does not exceed 100
        if (
            offer.discountType === "percentage" &&
            offer.discountValue > 100
        ) {
            return next(
                new ApiError(
                    400,
                    "Percentage discount cannot exceed 100"
                )
            );
        }

        // Update product target
        if (req.body.product !== undefined) {
            if (req.body.product === null) {
                offer.product = null;
            } else {
                // Check whether the product exists
                const product = await Product.findById(req.body.product);

                if (!product) {
                    return next(
                        new ApiError(404, "Product not found")
                    );
                }

                offer.product = req.body.product;

                // An offer cannot target both product and category
                offer.category = null;
            }
        }

        // Update category target
        if (req.body.category !== undefined) {
            if (req.body.category === null) {
                offer.category = null;
            } else {
                // Check whether the category exists
                const category = await Category.findById(req.body.category);

                if (!category) {
                    return next(
                        new ApiError(404, "Category not found")
                    );
                }

                offer.category = req.body.category;

                // An offer cannot target both category and product
                offer.product = null;
            }
        }

        // The final offer must have a target
        if (!offer.product && !offer.category) {
            return next(
                new ApiError(
                    400,
                    "Offer must target a product or category"
                )
            );
        }

        // Update start date
        if (req.body.startDate !== undefined) {
            offer.startDate = new Date(req.body.startDate);
        }

        // Update expiry date
        if (req.body.expiryDate !== undefined) {
            offer.expiryDate = new Date(req.body.expiryDate);
        }

        // Expiry must be after start date
        if (offer.expiryDate <= offer.startDate) {
            return next(
                new ApiError(
                    400,
                    "Expiry date must be after start date"
                )
            );
        }

        // Update active status
        if (req.body.isActive !== undefined) {
            offer.isActive = req.body.isActive;
        }

        // Save changes
        await offer.save();

        // Populate related information
        await offer.populate([
            {
                path: "product",
                select: "title price stock"
            },
            {
                path: "category",
                select: "name description"
            }
        ]);

        return sendSuccessResponse(
            res,
            200,
            offer,
            "Offer updated successfully"
        );
    } catch (error) {
        next(error);
    }
};
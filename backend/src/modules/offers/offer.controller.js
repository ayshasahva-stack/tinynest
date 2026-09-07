import Offer from "./offer.model.js";
import Product from "../products/product.model.js";
import Category from "../categories/category.model.js";
import ApiError from "../../utils/Apierror.js";
import sendSuccessResponse from "../../utils/ApiResponse.js";

import { validateOffer } from "./offer.validation.js";

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
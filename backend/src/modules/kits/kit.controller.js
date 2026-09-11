import mongoose from "mongoose";
import Kit from "./kit.model.js";
import Product from "../products/product.model.js";
import ApiError from "../../utils/Apierror.js";
import sendSuccessResponse from "../../utils/ApiResponse.js";
import { validateKit } from "./kit.validation.js";

// Admin: create a new kit
export const createKit = async (req, res, next) => {
    try {
        // Get the kit data from the request body
        const {
            name,
            description,
            image,
            items,
            price,
            discount,
            isActive
        } = req.body;

        // Validate the request data first
        const validationError = validateKit(req.body);

        if (validationError) {
            return next(
                new ApiError(400, validationError)
            );
        }

        // Check that all required fields are provided
        if (
            !name ||
            !description ||
            !image ||
            !items ||
            price === undefined
        ) {
            return next(
                new ApiError(
                    400,
                    "Name, description, image, items and price are required"
                )
            );
        }

        // Normalize the kit name
        // This makes duplicate checking case-insensitive
        const normalizedName = name.trim().toLowerCase();

        // Check whether a kit with the same name already exists
        const existingKit = await Kit.findOne({
            name: normalizedName
        });

        if (existingKit) {
            return next(
                new ApiError(
                    400,
                    "Kit with this name already exists"
                )
            );
        }

        // Store product IDs in a Set to detect duplicates
        const productIds = new Set();

        // Validate every product ID
        for (const item of items) {
            // Check whether the product ID is a valid MongoDB ObjectId
            if (!mongoose.Types.ObjectId.isValid(item.product)) {
                return next(
                    new ApiError(
                        400,
                        "Invalid product ID in kit items"
                    )
                );
            }

            // Check for duplicate products
            if (productIds.has(item.product.toString())) {
                return next(
                    new ApiError(
                        400,
                        "A product cannot be added to the kit more than once"
                    )
                );
            }

            // Add the product ID to the Set
            productIds.add(item.product.toString());
        }

        // Find all products included in the kit
        const products = await Product.find({
            _id: {
                $in: [...productIds]
            }
        });

        // Make sure every requested product exists
        if (products.length !== productIds.size) {
            return next(
                new ApiError(
                    404,
                    "One or more products in the kit were not found"
                )
            );
        }

        // Product model currently does not have an isActive field,
        // so we do not check product active status here.

        // Create the kit
        const kit = await Kit.create({
            // Save the normalized name
            name: normalizedName,

            // Save the remaining kit information
            description: description.trim(),
            image: image.trim(),
            items,
            price,

            // Use 0 when discount is not provided
            discount: discount ?? 0,

            // Make the kit active by default
            isActive: isActive ?? true
        });

        // Return the newly created kit
        return sendSuccessResponse(
            res,
            201,
            kit,
            "Kit created successfully"
        );
    } catch (error) {
        // Pass unexpected errors to the global error handler
        next(error);
    }
};
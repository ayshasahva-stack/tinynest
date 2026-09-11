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

        // Validate the request data
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

        // Make sure all products are active
        // Product model currently does not have an isActive field,
        // so this check will be added when product availability
        // is implemented separately.

        // Create the kit
        const kit = await Kit.create({
            name: name.trim(),
            description: description.trim(),
            image: image.trim(),
            items,
            price,
            discount: discount ?? 0,
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
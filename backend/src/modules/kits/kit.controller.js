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
// Get all active kits for customers
export const getKits = async (req, res, next) => {
    try {
        // Find only kits that are currently active
        const kits = await Kit.find({
            isActive: true
        })
            // Get the actual product information
            // instead of returning only product IDs
            .populate(
                "items.product",
                "title price images brand description"
            )
            // Show newest kits first
            .sort({ createdAt: -1 });

        // Send the active kits
        return sendSuccessResponse(
            res,
            200,
            kits,
            "Kits fetched successfully"
        );
    } catch (error) {
        // Pass unexpected errors to the global error handler
        next(error);
    }
};
// Get one active kit by ID
export const getKitById = async (req, res, next) => {
    try {
        // Get the kit ID from the URL
        const { kitId } = req.params;

        // Check whether the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(kitId)) {
            return next(
                new ApiError(400, "Invalid kit ID")
            );
        }

        // Find the kit only if it exists and is active
        const kit = await Kit.findOne({
            _id: kitId,
            isActive: true
        }).populate(
            "items.product",
            "title price images brand description"
        );

        // If no active kit was found
        if (!kit) {
            return next(
                new ApiError(404, "Kit not found")
            );
        }

        // Return the kit
        return sendSuccessResponse(
            res,
            200,
            kit,
            "Kit fetched successfully"
        );
    } catch (error) {
        // Pass unexpected errors to the global error handler
        next(error);
    }
};
// Admin: update an existing kit
export const updateKit = async (req, res, next) => {
    try {
        // Get the kit ID from the URL
        const { kitId } = req.params;

        // Check whether the kit ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(kitId)) {
            return next(
                new ApiError(400, "Invalid kit ID")
            );
        }

        // Validate the fields provided in the request
        const validationError = validateKit(req.body);

        if (validationError) {
            return next(
                new ApiError(400, validationError)
            );
        }

        // Find the existing kit
        const kit = await Kit.findById(kitId);

        // If the kit does not exist
        if (!kit) {
            return next(
                new ApiError(404, "Kit not found")
            );
        }

        // If the name is being updated
        if (req.body.name !== undefined) {
            // Normalize the new name
            const normalizedName = req.body.name.trim().toLowerCase();

            // Check whether another kit already has this name
            const existingKit = await Kit.findOne({
                name: normalizedName,
                _id: { $ne: kitId }
            });

            if (existingKit) {
                return next(
                    new ApiError(
                        400,
                        "Kit with this name already exists"
                    )
                );
            }

            // Update the kit name
            kit.name = normalizedName;
        }

        // Update description if provided
        if (req.body.description !== undefined) {
            kit.description = req.body.description.trim();
        }

        // Update image if provided
        if (req.body.image !== undefined) {
            kit.image = req.body.image.trim();
        }

        // Update price if provided
        if (req.body.price !== undefined) {
            kit.price = req.body.price;
        }

        // Update discount if provided
        if (req.body.discount !== undefined) {
            kit.discount = req.body.discount;
        }

        // Update active status if provided
        if (req.body.isActive !== undefined) {
            kit.isActive = req.body.isActive;
        }

        // If items are being updated
        if (req.body.items !== undefined) {
            // Store product IDs in a Set
            const productIds = new Set();

            // Validate every product ID
            for (const item of req.body.items) {
                // Check whether the product ID is valid
                if (!mongoose.Types.ObjectId.isValid(item.product)) {
                    return next(
                        new ApiError(
                            400,
                            "Invalid product ID in kit items"
                        )
                    );
                }

                // Prevent the same product from being added twice
                if (productIds.has(item.product.toString())) {
                    return next(
                        new ApiError(
                            400,
                            "A product cannot be added to the kit more than once"
                        )
                    );
                }

                // Store the product ID
                productIds.add(item.product.toString());
            }

            // Find all products
            const products = await Product.find({
                _id: {
                    $in: [...productIds]
                }
            });

            // Make sure every product exists
            if (products.length !== productIds.size) {
                return next(
                    new ApiError(
                        404,
                        "One or more products in the kit were not found"
                    )
                );
            }

            // Update the kit items
            kit.items = req.body.items;
        }

        // Save all changes to MongoDB
        const updatedKit = await kit.save();

        // Return the updated kit
        return sendSuccessResponse(
            res,
            200,
            updatedKit,
            "Kit updated successfully"
        );
    } catch (error) {
        // Pass unexpected errors to the global error handler
        next(error);
    }
};
// Admin: activate or deactivate a kit
export const updateKitStatus = async (req, res, next) => {
    try {
        // Get the kit ID from the URL
        const { kitId } = req.params;

        // Check whether the kit ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(kitId)) {
            return next(
                new ApiError(400, "Invalid kit ID")
            );
        }

        // Get the new active status from the request body
        const { isActive } = req.body;

        // Make sure isActive was provided
        if (isActive === undefined) {
            return next(
                new ApiError(
                    400,
                    "isActive is required"
                )
            );
        }

        // Make sure isActive is actually a boolean
        if (typeof isActive !== "boolean") {
            return next(
                new ApiError(
                    400,
                    "isActive must be a boolean"
                )
            );
        }

        // Find the kit
        const kit = await Kit.findById(kitId);

        // If the kit does not exist
        if (!kit) {
            return next(
                new ApiError(404, "Kit not found")
            );
        }

        // Update the active status
        kit.isActive = isActive;

        // Save the change
        const updatedKit = await kit.save();

        // Return the updated kit
        return sendSuccessResponse(
            res,
            200,
            updatedKit,
            isActive
                ? "Kit activated successfully"
                : "Kit deactivated successfully"
        );
    } catch (error) {
        // Pass unexpected errors to the global error handler
        next(error);
    }
};
import mongoose from "mongoose";
import Category from "./category.model.js";
import ApiError from "../../utils/Apierror.js";
import sendSuccessResponse from "../../utils/ApiResponse.js";
import {
    validateCategory,
    validateCategoryUpdate
} from "./category.validation.js";

// Create a new category
export const createCategory = async (req, res, next) => {
    try {
        // Validate the category data
        const error = validateCategory(req.body);

        if (error) {
            return next(new ApiError(400, error));
        }

        // Normalize the category name
        const normalizedName = req.body.name
            .trim()
            .toLowerCase();

        // Check whether the category already exists
        const existingCategory = await Category.findOne({
            name: normalizedName
        });

        if (existingCategory) {
            return next(
                new ApiError(409, "Category already exists")
            );
        }

        // Create the category
        const category = new Category({
            name: normalizedName,
            description: req.body.description?.trim() || "",
            image: req.body.image?.trim() || "",
            isActive: req.body.isActive ?? true
        });

        // Save the category to MongoDB
        await category.save();

        // Return the created category
        sendSuccessResponse(
            res,
            201,
            category,
            "Category created successfully"
        );

    } catch (error) {
        next(error);
    }
};

// Get all active categories
export const getCategories = async (req, res, next) => {
    try {
        // Find only categories that are active
        const categories = await Category.find({ isActive: true })
            .sort({ createdAt: -1 });

        // Send categories to the client
        sendSuccessResponse(
            res,
            200,
            categories,
            "Categories fetched successfully"
        );
    } catch (error) {
        // Pass unexpected errors to the centralized error handler
        next(error);
    }
};
// Get a single category by ID
export const getCategoryById = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check whether the provided ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new ApiError(400, "Invalid category ID"));
        }

        // Find the category by ID
        const category = await Category.findOne({
            _id: id,
            isActive: true
        });

        // Return an error if the category does not exist
        if (!category) {
            return next(new ApiError(404, "Category not found"));
        }

        // Send the category to the client
        sendSuccessResponse(
            res,
            200,
            category,
            "Category fetched successfully"
        );
    } catch (error) {
        // Pass unexpected errors to the centralized error handler
        next(error);
    }
};

// Update a category
export const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check whether the category ID is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new ApiError(400, "Invalid category ID"));
        }

        // Validate the fields provided for update
        const error = validateCategoryUpdate(req.body);

        if (error) {
            return next(new ApiError(400, error));
        }

        // Find the category
        const category = await Category.findById(id);

        if (!category) {
            return next(new ApiError(404, "Category not found"));
        }

        // If name is being updated, normalize it
        if (req.body.name !== undefined) {
            const normalizedName = req.body.name.trim().toLowerCase();

            // Check whether another category already uses this name
            const existingCategory = await Category.findOne({
                name: normalizedName,
                _id: { $ne: id }
            });

            if (existingCategory) {
                return next(new ApiError(409, "Category already exists"));
            }

            category.name = normalizedName;
        }

        // Update description if provided
        if (req.body.description !== undefined) {
            category.description = req.body.description.trim();
        }

        // Update image if provided
        if (req.body.image !== undefined) {
            category.image = req.body.image.trim();
        }

        // Update active status if provided
        if (req.body.isActive !== undefined) {
            category.isActive = req.body.isActive;
        }

        // Save the updated category
        await category.save();

        // Return the updated category
        sendSuccessResponse(
            res,
            200,
            category,
            "Category updated successfully"
        );
    } catch (error) {
        next(error);
    }
};
// Deactivate a category instead of permanently deleting it
export const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check whether the category ID is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new ApiError(400, "Invalid category ID"));
        }

        // Find the category
        const category = await Category.findById(id);

        if (!category) {
            return next(new ApiError(404, "Category not found"));
        }

        // Check if the category is already inactive
        if (!category.isActive) {
            return next(new ApiError(400, "Category is already inactive"));
        }

        // Soft delete the category
        category.isActive = false;

        await category.save();

        // Return the updated category
        sendSuccessResponse(
            res,
            200,
            category,
            "Category deactivated successfully"
        );
    } catch (error) {
        // Pass unexpected errors to the centralized error handler
        next(error);
    }
};
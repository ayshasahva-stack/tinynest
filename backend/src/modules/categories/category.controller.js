import mongoose from "mongoose";
import Category from "./category.model.js";
import ApiError from "../../utils/Apierror.js";
import sendSuccessResponse from "../../utils/ApiResponse.js";
import { validateCategory } from "./category.validation.js";

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
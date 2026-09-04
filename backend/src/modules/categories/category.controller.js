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
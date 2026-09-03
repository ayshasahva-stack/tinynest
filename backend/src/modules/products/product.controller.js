import mongoose from "mongoose";
import Product from "./product.model.js";
import ApiError from "../../utils/Apierror.js";
import sendSuccessResponse from "../../utils/ApiResponse.js";
import { validateProduct,
    validateProductUpdate,
 } from "./product.validation.js";

// Create a new product
export const createProduct = async (req, res, next) => {
    try {
        // Validate the product data from the request
        const error = validateProduct(req.body);

        if (error) {
            return next(new ApiError(400, error));
        }

        // Get the product fields from the request body
        const {
            title,
            description,
            price,
            discount,
            category,
            brand,
            ageGroup,
            images,
            stock,
            tags
        } = req.body;

        // Create a new product document
        const product = new Product({
            title: title.trim(),
            description: description.trim(),
            price,
            discount: discount ?? 0,
            category: category.trim(),
            brand: brand.trim(),
            ageGroup: ageGroup.trim(),
            images,
            stock,
            tags: tags ?? []
        });

        // Save the product to MongoDB
        await product.save();

        // Send the created product to the client
        sendSuccessResponse(
            res,
            201,
            product,
            "Product created successfully"
        );

    } catch (error) {
        // Pass unexpected errors to the centralized error handler
        next(error);
    }
};

// Get all products
export const getProducts = async (req, res, next) => {
    try {
        // Get query parameters from the URL
        const {
            page = 1,
            limit = 10,
            search = "",
            category
        } = req.query;

        // Convert pagination values from strings to numbers
        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        // Calculate how many products should be skipped
        const skip = (pageNumber - 1) * limitNumber;

        // Build the MongoDB filter
        const filter = {};

        // Search products by title
        if (search.trim()) {
            filter.title = {
                $regex: search.trim(),
                $options: "i"
            };
        }

        // Filter products by category
        if (category && category.trim()) {
            filter.category = category.trim();
        }

        // Get products and total count at the same time
        const [products, totalProducts] = await Promise.all([
            Product.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNumber),

            Product.countDocuments(filter)
        ]);

        // Calculate total pages
        const totalPages = Math.ceil(
            totalProducts / limitNumber
        );

        // Send the products and pagination information
        sendSuccessResponse(
            res,
            200,
            {
                products,
                pagination: {
                    currentPage: pageNumber,
                    limit: limitNumber,
                    totalProducts,
                    totalPages
                }
            },
            "Products fetched successfully"
        );

    } catch (error) {
        // Pass unexpected errors to the centralized error handler
        next(error);
    }
};

// Get a single product by its ID
export const getProductById = async (req, res, next) => {
    try {
        // Get the product ID from the URL
        const { id } = req.params;

        // Check whether the ID has a valid MongoDB format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(
                new ApiError(400, "Invalid product ID")
            );
        }

        // Find the product in MongoDB
        const product = await Product.findById(id);

        // Return an error if the product doesn't exist
        if (!product) {
            return next(
                new ApiError(404, "Product not found")
            );
        }

        // Return the requested product
        sendSuccessResponse(
            res,
            200,
            product,
            "Product fetched successfully"
        );

    } catch (error) {
        // Pass unexpected errors to the centralized error handler
        next(error);
    }
};

// Update an existing product
export const updateProduct = async (req, res, next) => {
    try {
        // Get the product ID from the URL
        const { id } = req.params;

        // Check whether the ID has a valid MongoDB format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(
                new ApiError(400, "Invalid product ID")
            );
        }

        // Validate the fields being updated
        const error = validateProductUpdate(req.body);

        if (error) {
            return next(new ApiError(400, error));
        }

        // Find the existing product
        const product = await Product.findById(id);

        if (!product) {
            return next(
                new ApiError(404, "Product not found")
            );
        }

        // List of fields that admins are allowed to update
        const allowedFields = [
            "title",
            "description",
            "price",
            "discount",
            "category",
            "brand",
            "ageGroup",
            "images",
            "stock",
            "tags"
        ];

        // Update only the allowed fields
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                product[field] = req.body[field];
            }
        });

        // Save the updated product
        await product.save();

        // Return the updated product
        sendSuccessResponse(
            res,
            200,
            product,
            "Product updated successfully"
        );

    } catch (error) {
        // Pass unexpected errors to the centralized error handler
        next(error);
    }
};
// Delete an existing product
export const deleteProduct = async (req, res, next) => {
    try {
        // Get the product ID from the URL
        const { id } = req.params;

        // Check whether the ID has a valid MongoDB format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(
                new ApiError(400, "Invalid product ID")
            );
        }

        // Find and delete the product
        const product = await Product.findByIdAndDelete(id);

        // Return an error if the product doesn't exist
        if (!product) {
            return next(
                new ApiError(404, "Product not found")
            );
        }

        // Send a successful response
        sendSuccessResponse(
            res,
            200,
            null,
            "Product deleted successfully"
        );

    } catch (error) {
        // Pass unexpected errors to the centralized error handler
        next(error);
    }
};
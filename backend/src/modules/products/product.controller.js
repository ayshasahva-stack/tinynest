import Product from "./product.model.js";
import ApiError from "../../utils/Apierror.js";
import sendSuccessResponse from "../../utils/ApiResponse.js";
import { validateProduct } from "./product.validation.js";

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
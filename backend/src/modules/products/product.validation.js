import mongoose from "mongoose";
// Validate product data before creating a product
export const validateProduct = (body) => {
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
    } = body;

    // Check required text fields
    if (!title || !title.trim()) {
        return "Product title is required";
    }

    if (!description || !description.trim()) {
        return "Product description is required";
    }

    // Check that a category ID was provided
    if (!category) {
        return "Product category is required";
    }

    // Check that the category ID has a valid MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(category)) {
        return "Product category must be a valid category ID";
    }

    if (!brand || !brand.trim()) {
        return "Product brand is required";
    }

    if (!ageGroup || !ageGroup.trim()) {
        return "Product age group is required";
    }

    // Validate price
    if (price === undefined || price === null || price === "") {
        return "Product price is required";
    }

    if (typeof price !== "number" || price < 0) {
        return "Product price must be a valid positive number";
    }

    // Validate discount
    if (discount !== undefined) {
        if (
            typeof discount !== "number" ||
            discount < 0 ||
            discount > 100
        ) {
            return "Discount must be between 0 and 100";
        }
    }

    // Validate images
    if (!Array.isArray(images) || images.length === 0) {
        return "At least one product image is required";
    }

    // Make sure every image is a string
    if (!images.every((image) => typeof image === "string" && image.trim())) {
        return "Product images must be valid URLs";
    }

    // Validate stock
    if (stock === undefined || stock === null || stock === "") {
        return "Product stock is required";
    }

    if (typeof stock !== "number" || stock < 0) {
        return "Product stock must be a valid non-negative number";
    }

    // Validate tags if provided
    if (tags !== undefined) {
        if (!Array.isArray(tags)) {
            return "Product tags must be an array";
        }

        if (!tags.every((tag) => typeof tag === "string")) {
            return "Product tags must contain only strings";
        }
    }

    // No validation errors
    return null;
};

// Validate product data when updating an existing product
export const validateProductUpdate = (body) => {
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
    } = body;

    // Validate title only if it was provided
    if (title !== undefined) {
        if (typeof title !== "string" || !title.trim()) {
            return "Product title must be a valid text";
        }
    }

    // Validate description only if it was provided
    if (description !== undefined) {
        if (
            typeof description !== "string" ||
            !description.trim()
        ) {
            return "Product description must be valid text";
        }
    }

    // Validate price only if it was provided
    if (price !== undefined) {
        if (typeof price !== "number" || price < 0) {
            return "Product price must be a valid non-negative number";
        }
    }

    // Validate discount only if it was provided
    if (discount !== undefined) {
        if (
            typeof discount !== "number" ||
            discount < 0 ||
            discount > 100
        ) {
            return "Discount must be between 0 and 100";
        }
    }

    // Validate category only if it was provided
    if (category !== undefined) {
        if (category !== undefined) {
            // Check that the category ID is valid
            if (!mongoose.Types.ObjectId.isValid(category)) {
                return "Product category must be a valid category ID";
            }
        }
    }

    // Validate brand only if it was provided
    if (brand !== undefined) {
        if (
            typeof brand !== "string" ||
            !brand.trim()
        ) {
            return "Product brand must be valid text";
        }
    }

    // Validate age group only if it was provided
    if (ageGroup !== undefined) {
        if (
            typeof ageGroup !== "string" ||
            !ageGroup.trim()
        ) {
            return "Product age group must be valid text";
        }
    }

    // Validate images only if they were provided
    if (images !== undefined) {
        if (!Array.isArray(images) || images.length === 0) {
            return "At least one product image is required";
        }

        if (
            !images.every(
                (image) =>
                    typeof image === "string" &&
                    image.trim()
            )
        ) {
            return "Product images must be valid URLs";
        }
    }

    // Validate stock only if it was provided
    if (stock !== undefined) {
        if (typeof stock !== "number" || stock < 0) {
            return "Product stock must be a valid non-negative number";
        }
    }

    // Validate tags only if they were provided
    if (tags !== undefined) {
        if (!Array.isArray(tags)) {
            return "Product tags must be an array";
        }

        if (!tags.every((tag) => typeof tag === "string")) {
            return "Product tags must contain only strings";
        }
    }

    // No validation errors
    return null;
};
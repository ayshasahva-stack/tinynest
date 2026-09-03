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

    if (!category || !category.trim()) {
        return "Product category is required";
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
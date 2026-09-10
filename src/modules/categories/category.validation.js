// Validate category data before creating a category
export const validateCategory = (body) => {
    const {
        name,
        description,
        image,
        isActive
    } = body;

    // Category name is required
    if (!name || !name.trim()) {
        return "Category name is required";
    }

    // Validate description if provided
    if (
        description !== undefined &&
        typeof description !== "string"
    ) {
        return "Category description must be text";
    }

    // Validate image if provided
    if (
        image !== undefined &&
        typeof image !== "string"
    ) {
        return "Category image must be text";
    }

    // Validate isActive if provided
    if (
        isActive !== undefined &&
        typeof isActive !== "boolean"
    ) {
        return "isActive must be a boolean";
    }

    // No validation errors
    return null;
};

// Validate category fields when updating a category
export const validateCategoryUpdate = (body) => {
    const { name, description, image, isActive } = body;

    // At least one field must be provided
    if (
        name === undefined &&
        description === undefined &&
        image === undefined &&
        isActive === undefined
    ) {
        return "At least one field is required for update";
    }

    // Validate name if it was provided
    if (name !== undefined) {
        if (typeof name !== "string" || !name.trim()) {
            return "Category name must be valid text";
        }
    }

    // Validate description if it was provided
    if (description !== undefined && typeof description !== "string") {
        return "Category description must be text";
    }

    // Validate image if it was provided
    if (image !== undefined && typeof image !== "string") {
        return "Category image must be text";
    }

    // Validate active status if it was provided
    if (isActive !== undefined && typeof isActive !== "boolean") {
        return "isActive must be a boolean";
    }

    return null;
};
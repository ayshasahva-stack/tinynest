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
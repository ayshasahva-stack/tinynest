// Validate data when creating or updating a kit
export const validateKit = (data) => {
    // Check kit name
    if (
        data.name !== undefined &&
        (
            typeof data.name !== "string" ||
            data.name.trim().length === 0
        )
    ) {
        return "Kit name is required";
    }

    // Check kit description
    if (
        data.description !== undefined &&
        (
            typeof data.description !== "string" ||
            data.description.trim().length === 0
        )
    ) {
        return "Kit description is required";
    }

    // Check kit image
    if (
        data.image !== undefined &&
        (
            typeof data.image !== "string" ||
            data.image.trim().length === 0
        )
    ) {
        return "Kit image is required";
    }

    // Check kit items
    if (data.items !== undefined) {
        // Items must be an array
        if (!Array.isArray(data.items)) {
            return "Kit items must be an array";
        }

        // A kit must contain at least one product
        if (data.items.length === 0) {
            return "Kit must contain at least one product";
        }

        // Validate every kit item
        for (const item of data.items) {
            // Product ID is required
            if (!item.product) {
                return "Each kit item must have a product";
            }

            // Quantity must be a positive number
            if (
                typeof item.quantity !== "number" ||
                item.quantity < 1
            ) {
                return "Each kit item quantity must be at least 1";
            }
        }
    }

    // Check kit price
    if (
        data.price !== undefined &&
        (
            typeof data.price !== "number" ||
            data.price < 0
        )
    ) {
        return "Kit price must be a non-negative number";
    }

    // Check kit discount
    if (
        data.discount !== undefined &&
        (
            typeof data.discount !== "number" ||
            data.discount < 0 ||
            data.discount > 100
        )
    ) {
        return "Kit discount must be between 0 and 100";
    }

    // Check active status
    if (
        data.isActive !== undefined &&
        typeof data.isActive !== "boolean"
    ) {
        return "isActive must be a boolean";
    }

    // No validation errors
    return null;
};
// Validate the data sent when creating or updating an address
export const validateAddress = (body) => {
    const {
        fullName,
        phone,
        addressLine,
        city,
        state,
        postalCode,
        country
    } = body;

    // Check required fields
    const requiredFields = {
        fullName,
        phone,
        addressLine,
        city,
        state,
        postalCode,
        country
    };

    // Make sure every required field has a value
    for (const [field, value] of Object.entries(requiredFields)) {
        if (
            value === undefined ||
            value === null ||
            String(value).trim() === ""
        ) {
            return `${field} is required`;
        }
    }

    // isDefault is optional, but if provided it must be boolean
    if (
        body.isDefault !== undefined &&
        typeof body.isDefault !== "boolean"
    ) {
        return "isDefault must be a boolean";
    }

    return null;
};
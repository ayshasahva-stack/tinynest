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
// Validate address data when updating an address
export const validateAddressUpdate = (body) => {
    // Make sure the request body contains something
    if (!body || Object.keys(body).length === 0) {
        return "At least one field is required to update the address";
    }

    // Fields that are allowed to be updated
    const allowedFields = [
        "fullName",
        "phone",
        "addressLine",
        "city",
        "state",
        "postalCode",
        "country",
        "isDefault"
    ];

    // Check for fields that are not allowed
    for (const field of Object.keys(body)) {
        if (!allowedFields.includes(field)) {
            return `${field} is not allowed`;
        }
    }

    // Check provided string fields
    const stringFields = [
        "fullName",
        "phone",
        "addressLine",
        "city",
        "state",
        "postalCode",
        "country"
    ];

    for (const field of stringFields) {
        if (
            body[field] !== undefined &&
            (
                body[field] === null ||
                String(body[field]).trim() === ""
            )
        ) {
            return `${field} cannot be empty`;
        }
    }

    // isDefault must be boolean if provided
    if (
        body.isDefault !== undefined &&
        typeof body.isDefault !== "boolean"
    ) {
        return "isDefault must be a boolean";
    }

    return null;
};
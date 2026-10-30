import * as yup from "yup";

export const addressSchema = yup.object({
    fullName: yup
        .string()
        .trim()
        .required("Full name is required")
        .min(3, "Name must be at least 3 characters"),

    phone: yup
        .string()
        .required("Phone number is required")
        .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),

    addressLine: yup
        .string()
        .trim()
        .required("Address is required")
        .min(5, "Please enter a complete address"),

    city: yup
        .string()
        .trim()
        .required("City is required"),

    state: yup
        .string()
        .trim()
        .required("State is required"),

    postalCode: yup
        .string()
        .required("Postal code is required")
        .matches(/^\d{6}$/, "Enter a valid 6-digit PIN code"),

    country: yup
        .string()
        .trim()
        .required("Country is required"),

    isDefault: yup.boolean(),
});
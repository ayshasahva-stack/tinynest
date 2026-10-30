import * as yup from "yup";

// Validation rules for TinyNest registration.
export const registerSchema = yup.object({
    // Email validation
    email: yup
        .string()
        .trim()
        .required("Email address is required")
        .email("Please enter a valid email address"),

    // Indian mobile number validation
    phone: yup
        .string()
        .required("Phone number is required")
        .matches(
            /^[6-9]\d{9}$/,
            "Enter a valid 10-digit mobile number"
        ),

    // Password validation
    password: yup
        .string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters"),

    // Confirm password validation
    confirmPassword: yup
        .string()
        .required("Please confirm your password")
        .oneOf(
            [yup.ref("password")],
            "Passwords do not match"
        ),
});
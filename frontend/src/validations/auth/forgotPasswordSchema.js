
import * as yup from "yup";

export const forgotPasswordSchema = yup.object({
    email: yup
        .string()
        .trim()
        .required("Email address is required")
        .email("Please enter a valid email address"),
});

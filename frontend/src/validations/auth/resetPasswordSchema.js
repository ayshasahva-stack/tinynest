import * as yup from "yup";

export const resetPasswordSchema = yup.object({
    newPassword: yup
        .string()
        .required("New password is required")
        .min(8, "Password must be at least 8 characters"),

    confirmPassword: yup
        .string()
        .required("Please confirm your password")
        .oneOf(
            [yup.ref("newPassword")],
            "Passwords do not match"
        ),
});
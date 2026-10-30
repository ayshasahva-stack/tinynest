import * as yup from "yup";

export const categorySchema = yup.object({
    // Category name is mandatory.
    name: yup.string()
        .trim()
        .required("Category name is required")
        .max(100, "Category name cannot exceed 100 characters"),

    // Image URL is optional, but must be valid when entered.
    image: yup.string()
        .trim()
        .transform((value) => value === "" ? undefined : value)
        .url("Please enter a valid image URL")
        .optional(),

    // Description is optional.
    description: yup.string()
        .trim()
        .optional(),

    // Category active status.
    isActive: yup.boolean(),
});
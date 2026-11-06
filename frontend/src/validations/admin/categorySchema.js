import * as yup from "yup";

export const categorySchema = yup.object({
    name: yup.string()
        .trim()
        .required("Category name is required")
        .max(100, "Category name cannot exceed 100 characters"),

    image: yup.string()
        .trim()
        .transform((value) => value === "" ? undefined : value)
        .url("Please enter a valid image URL")
        .optional(),

    description: yup.string()
        .trim()
        .optional(),

    isActive: yup.boolean(),
});
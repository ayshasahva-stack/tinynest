
import * as yup from "yup";

const numberRequired = (fieldName) =>
    yup
        .number()
        .transform((value, originalValue) =>
            originalValue === "" ? NaN : value
        )
        .typeError(`${fieldName} must be a valid number`)
        .required(`${fieldName} is required`);

export const productSchema = yup.object({
    title: yup
        .string()
        .trim()
        .required("Product title is required"),

    description: yup
        .string()
        .trim()
        .required("Product description is required"),

    category: yup
        .string()
        .required("Please select a category"),

    brand: yup
        .string()
        .trim()
        .required("Product brand is required"),

    ageGroup: yup
        .string()
        .required("Please select an age group"),

    price: numberRequired("Price")
        .min(0, "Price cannot be negative"),

    discount: yup.number()
    .transform((value, originalValue) =>
        originalValue === "" ? 0 : value
    )
    .typeError("Discount must be a valid number")
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100")
    .optional(),

    stock: numberRequired("Stock")
        .min(0, "Stock cannot be negative"),

    tags: yup.string().optional(),
});

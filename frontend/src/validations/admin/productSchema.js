
import * as yup from "yup";

// Convert empty numeric inputs into NaN so Yup
// displays the required message instead of treating them as zero.
const numberRequired = (fieldName) =>
    yup
        .number()
        .transform((value, originalValue) =>
            originalValue === "" ? NaN : value
        )
        .typeError(`${fieldName} must be a valid number`)
        .required(`${fieldName} is required`);

export const productSchema = yup.object({
    // Product name
    title: yup
        .string()
        .trim()
        .required("Product title is required"),

    // Product description
    description: yup
        .string()
        .trim()
        .required("Product description is required"),

    // Category must be selected
    category: yup
        .string()
        .required("Please select a category"),

    // Brand name
    brand: yup
        .string()
        .trim()
        .required("Product brand is required"),

    // Age group
    ageGroup: yup
        .string()
        .required("Please select an age group"),

    // Product price (backend allows zero)
    price: numberRequired("Price")
        .min(0, "Price cannot be negative"),

    // Discount is optional; initial form value is "0"
    discount: yup.number()
    .transform((value, originalValue) =>
        originalValue === "" ? 0 : value
    )
    .typeError("Discount must be a valid number")
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100")
    .optional(),

    // Available stock
    stock: numberRequired("Stock")
        .min(0, "Stock cannot be negative"),

    // Tags are entered as comma-separated text
    tags: yup.string().optional(),
});

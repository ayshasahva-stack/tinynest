
import * as yup from "yup";

const requiredNumber = (field) =>
    yup.number()
        .transform((value, originalValue) =>
            originalValue === "" ? NaN : value
        )
        .typeError(`${field} must be a valid number`)
        .required(`${field} is required`);

export const kitSchema = yup.object({
    name: yup.string()
        .trim()
        .required("Kit name is required"),

    description: yup.string()
        .trim()
        .required("Kit description is required"),

    image: yup.string()
        .trim()
        .required("Kit image URL is required")
        .url("Please enter a valid image URL"),

    price: requiredNumber("Price")
        .min(0, "Price cannot be negative"),

    discount: yup.number()
        .transform((value, originalValue) =>
            originalValue === "" ? 0 : value
        )
        .typeError("Discount must be a valid number")
        .min(0, "Discount cannot be negative")
        .max(100, "Discount cannot exceed 100"),

    // At least one product must be included.
    items: yup.array()
        .of(
            yup.object({
                product: yup.string()
                    .required("Please select a product"),

                quantity: yup.number()
                    .typeError("Quantity must be a number")
                    .integer("Quantity must be a whole number")
                    .min(1, "Quantity must be at least 1")
                    .required("Quantity is required"),
            })
        )
        .min(1, "Please add at least one product")
        .required("Please add products to the kit"),

    isActive: yup.boolean(),
});

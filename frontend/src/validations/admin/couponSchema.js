import * as yup from "yup";

// Reusable number validation.
const requiredNumber = (field) =>
    yup
        .number()
        .transform((value, originalValue) =>
            originalValue === "" ? NaN : value
        )
        .typeError(`${field} must be a valid number`)
        .required(`${field} is required`);

export const couponSchema = yup.object({
    code: yup
        .string()
        .trim()
        .required("Coupon code is required")
        .max(40, "Coupon code cannot exceed 40 characters"),

    discountType: yup
        .string()
        .oneOf(
            ["percentage", "fixed"],
            "Please select a valid discount type"
        )
        .required("Discount type is required"),

    discountValue: yup
        .number()
        .transform((value, originalValue) =>
            originalValue === "" ? NaN : value
        )
        .typeError("Discount value must be a valid number")
        .required("Discount value is required")
        .moreThan(0, "Discount value must be greater than zero")
        .when("discountType", {
            is: "percentage",
            then: (schema) =>
                schema.max(
                    100,
                    "Percentage discount cannot exceed 100%"
                ),
        }),

    minOrderAmount: requiredNumber("Minimum order amount")
        .min(0, "Minimum order amount cannot be negative"),

    maxDiscount: yup
        .number()
        .transform((value, originalValue) =>
            originalValue === "" ? null : value
        )
        .nullable()
        .typeError("Maximum discount must be a valid number")
        .min(0, "Maximum discount cannot be negative")
        .when("discountType", {
            is: "percentage",
            otherwise: (schema) => schema.nullable(),
        }),

    startDate: yup
        .date()
        .typeError("Start date is required")
        .required("Start date is required"),

    expiryDate: yup
        .date()
        .typeError("Expiry date is required")
        .required("Expiry date is required")
        .test(
            "after-start-date",
            "Expiry date must be after the start date",
            function (value) {
                const { startDate } = this.parent;

                if (!value || !startDate) return true;

                return new Date(value) > new Date(startDate);
            }
        ),

    usageLimit: yup
        .number()
        .transform((value, originalValue) =>
            originalValue === "" ? null : value
        )
        .nullable()
        .typeError("Usage limit must be a valid number")
        .integer("Usage limit must be a whole number")
        .min(1, "Usage limit must be greater than zero"),

    isActive: yup.boolean(),
});
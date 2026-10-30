
import * as yup from "yup";

// Validation rules for registration OTP verification.
export const verifyOtpSchema = yup.object({
    otp: yup
        .string()
        .required("Please enter the verification code")
        .matches(/^\d{6}$/, "Please enter a valid 6-digit OTP"),
});

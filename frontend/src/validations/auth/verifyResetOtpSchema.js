import * as yup from "yup";

export const verifyResetOtpSchema = yup.object({
  otp: yup
    .string()
    .required("Please enter the verification code")
    .matches(/^\d{6}$/, "Please enter a valid 6-digit OTP"),
});
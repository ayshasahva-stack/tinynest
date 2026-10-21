
import { useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Button from "../../components/Button";
import AuthLayout from "../../components/AuthLayout";

import { verifyResetOtpThunk } from "../../features/auth/authThunk";
import {
    selectAuthLoading,
    selectAuthError,
} from "../../features/auth/authSelectors";

function VerifyResetOtp() {
    // Store the six OTP digits as a string.
    const [otp, setOtp] = useState("");

    // Store client-side validation errors separately from API errors.
    const [validationError, setValidationError] = useState("");
    // Store OTP verification errors locally so they appear on the page.
    const [apiError, setApiError] = useState("");

    // Keep references to all six inputs for automatic focus management.
    const otpRefs = useRef([]);

    // Read the email passed from the Forgot Password page.
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email") || "";

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Read loading and error states from Redux.
    const loading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);

    // Handle typing into an OTP box.
    const handleOtpChange = (index, value) => {
        // Allow only digits and use the last digit if multiple are typed.
        const digit = value.replace(/\D/g, "").slice(-1);

        const updatedOtp = otp.split("");
        updatedOtp[index] = digit;

        // Keep the OTP at a maximum of six digits.
        setOtp(updatedOtp.join("").slice(0, 6));
        setValidationError("");

        // Move to the next box after entering a digit.
        if (digit && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    // Support backspace and arrow-key navigation.
    const handleOtpKeyDown = (event, index) => {
        if (
            event.key === "Backspace" &&
            !event.currentTarget.value &&
            index > 0
        ) {
            otpRefs.current[index - 1]?.focus();
        }

        if (event.key === "ArrowLeft" && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }

        if (event.key === "ArrowRight" && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    // Allow users to paste the complete OTP into any box.
    const handleOtpPaste = (event) => {
        event.preventDefault();

        const pastedOtp = event.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 6);

        if (!pastedOtp) return;

        setOtp(pastedOtp);
        setValidationError("");

        // Focus the next empty box, or the last box if all six are filled.
        const nextIndex = Math.min(pastedOtp.length, 5);
        otpRefs.current[nextIndex]?.focus();
    };

    // Validate the form and verify the reset OTP.

    const handleSubmit = async (event) => {
        event.preventDefault();

        setValidationError("");
        setApiError("");

        if (!email.trim()) {
            setValidationError(
                "Email address is missing. Please request a new reset OTP."
            );
            return;
        }

        if (!/^\d{6}$/.test(otp)) {
            setValidationError("Please enter all six OTP digits.");
            return;
        }

        try {
            await dispatch(
                verifyResetOtpThunk({ email, otp })
            ).unwrap();

            // Navigate only when OTP verification succeeds.
            navigate("/reset-password");
        } catch (error) {
            // unwrap() can throw the string supplied by rejectWithValue().
            const message =
                typeof error === "string"
                    ? error
                    : error?.message ||
                    "Invalid or expired OTP. Please try again.";

            setApiError(message);
        }
    };


    // Prefer local validation messages over API errors.
    const displayedError = validationError || apiError || error;

    return (
        <AuthLayout
            eyebrow="ACCOUNT RECOVERY"
            title="Verify your email"
            description="Enter the six-digit password reset code sent to your email address to continue securely."
            footer={
                <p>
                    Need a new code?{" "}
                    <Link
                        to={`/forgot-password`}
                        className="font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
                    >
                        Request another OTP
                    </Link>
                </p>
            }
        >
            {/* Show validation and API errors accessibly. */}
            {displayedError && (
                <p
                    role="alert"
                    className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                >
                    {typeof displayedError === "string"
                        ? displayedError
                        : "OTP verification failed. Please try again."}
                </p>
            )}

            {/* OTP entry form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label
                        htmlFor="otp-0"
                        className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                        Six-digit verification code
                    </label>

                    <div className="flex justify-between gap-2">
                        {Array.from({ length: 6 }, (_, index) => (
                            <input
                                key={index}
                                ref={(element) => {
                                    otpRefs.current[index] = element;
                                }}
                                id={`otp-${index}`}
                                type="text"
                                inputMode="numeric"
                                autoComplete={
                                    index === 0 ? "one-time-code" : "off"
                                }
                                aria-label={`OTP digit ${index + 1}`}
                                value={otp[index] || ""}
                                onChange={(event) => {
                                    handleOtpChange(index, event.target.value);
                                    setApiError("");
                                }}
                                onKeyDown={(event) =>
                                    handleOtpKeyDown(event, index)
                                }
                                onPaste={handleOtpPaste}
                                disabled={loading}
                                maxLength={1}
                                className="h-12 min-w-0 flex-1 rounded-xl border border-gray-300 bg-white text-center text-lg font-semibold text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:opacity-60 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-emerald-400 dark:focus:ring-emerald-900"
                            />
                        ))}
                    </div>

                    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                        Enter the code before it expires.
                    </p>
                </div>

                <Button
                    type="submit"
                    variant="auth"
                    fullWidth
                    disabled={loading}
                >
                    {loading ? "Verifying code..." : "Verify and continue"}
                </Button>
            </form>
        </AuthLayout>
    );
}

export default VerifyResetOtp;

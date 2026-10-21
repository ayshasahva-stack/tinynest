
import { useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Input from "../../components/Input";
import Button from "../../components/Button";
import AuthLayout from "../../components/AuthLayout";

import { verifyOtpThunk } from "../../features/auth/authThunk";
import {
    selectAuthLoading,
    selectAuthError,
} from "../../features/auth/authSelectors";

function VerifyOtp() {
    // Store the OTP entered by the user.
    const [otp, setOtp] = useState("");
    // Store references to the six OTP inputs so we can move focus.
const otpRefs = useRef([]);

    // Store client-side validation errors separately from API errors.
    const [validationError, setValidationError] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // The registration page passes the email through the URL.
    const email = searchParams.get("email") || "";

    // Read loading and error states from Redux.
    const loading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);

    // Verify the OTP and redirect after success.
    const handleSubmit = async (event) => {
        event.preventDefault();
        setValidationError("");

        // The email is required to identify the account being verified.
        if (!email.trim()) {
            setValidationError(
                "Your email is missing. Please register again or sign in."
            );
            return;
        }

        // Ensure the user enters exactly six digits.
        if (!/^\d{6}$/.test(otp)) {
            setValidationError("Please enter a valid 6-digit OTP.");
            return;
        }

        try {
            // Send the email and OTP to the backend.
            await dispatch(
                verifyOtpThunk({
                    email,
                    otp,
                })
            ).unwrap();

            // Navigate to Login after successful verification.
            navigate("/login", { replace: true });
        } catch {
            // The Redux error is displayed in the form below.
        }
    };
// Update the OTP digits and automatically move to the next box.
const handleOtpChange = (index, value) => {
    const digits = value.replace(/\D/g, "");
    const nextOtp = otp.split("");

    // Support pasting multiple digits into a box.
    if (digits.length > 1) {
        digits.slice(0, 6 - index).split("").forEach((digit, offset) => {
            nextOtp[index + offset] = digit;
        });

        const updatedOtp = nextOtp.join("").slice(0, 6);
        setOtp(updatedOtp);

        // Focus the next empty box, or the final box when complete.
        const nextIndex = Math.min(index + digits.length, 5);
        otpRefs.current[nextIndex]?.focus();
        setValidationError("");
        return;
    }

    // Store a single digit in its corresponding position.
    nextOtp[index] = digits;
    setOtp(nextOtp.join("").slice(0, 6));
    setValidationError("");

    // Move forward automatically after entering a digit.
    if (digits && index < 5) {
        otpRefs.current[index + 1]?.focus();
    }
};

// Move to the previous box when Backspace is pressed on an empty box.
const handleOtpKeyDown = (event, index) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
        otpRefs.current[index - 1]?.focus();
    }

    // Allow arrow keys to navigate between boxes.
    if (event.key === "ArrowLeft" && index > 0) {
        otpRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < 5) {
        otpRefs.current[index + 1]?.focus();
    }
};
    // Prefer validation errors when they exist.
    const displayedError = validationError || error;

    return (
        <AuthLayout
            eyebrow="ONE LITTLE STEP"
            title="Verify your email"
            description="Enter the 6-digit code we sent to your email to verify your TinyNest account."
            footer={
                <p className="text-sm text-[#707771] dark:text-[#B5BDB7]">
                    Already verified?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-[#5F816D] hover:underline dark:text-[#B4D0BB]"
                    >
                        Sign in
                    </Link>
                </p>
            }
        >
            {/* Display validation and backend errors to the user. */}
            {displayedError && (
                <p
                    role="alert"
                    className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                >
                    {typeof displayedError === "string"
                        ? displayedError
                        : "OTP verification failed. Please check the code and try again."}
                </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Show which email address is being verified. */}
                {email && (
                    <p className="text-sm text-[#707771] dark:text-[#B5BDB7]">
                        Verification code for{" "}
                        <span className="font-medium text-[#46564B] dark:text-[#D7E0D7]">
                            {email}
                        </span>
                    </p>
                )}


{/* Six individual boxes for the verification code. */}
<div>
    <label
        className="mb-3 block text-sm font-medium text-[#46564B] dark:text-[#D7E0D7]"
        id="otp-label"
    >
        6-digit verification code
    </label>

    <div
        className="flex gap-2 sm:gap-3"
        role="group"
        aria-labelledby="otp-label"
    >
        {Array.from({ length: 6 }, (_, index) => (
            <input
                key={index}
                ref={(element) => {
                    otpRefs.current[index] = element;
                }}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                aria-label={`OTP digit ${index + 1}`}
                maxLength={6}
                value={otp[index] || ""}
                onChange={(event) =>
                    handleOtpChange(index, event.target.value)
                }
                onKeyDown={(event) =>
                    handleOtpKeyDown(event, index)
                }
                onPaste={(event) => {
                    event.preventDefault();

                    const pastedDigits = event.clipboardData
                        .getData("text")
                        .replace(/\D/g, "")
                        .slice(0, 6);

                    if (pastedDigits) {
                        setOtp(pastedDigits);
                        setValidationError("");

                        const nextIndex = Math.min(
                            pastedDigits.length,
                            5
                        );

                        otpRefs.current[nextIndex]?.focus();
                    }
                }}
                className="h-12 min-w-0 flex-1 rounded-xl border border-[#E5E7E2] bg-[#FCFCFA] text-center text-xl font-semibold text-[#2B2F33] outline-none transition focus:border-[#7A9E8F] focus:ring-2 focus:ring-[#7A9E8F]/20 dark:border-[#414A43] dark:bg-[#252C27] dark:text-[#F3F4F1] dark:focus:border-[#A9C6B0] sm:h-14"
            />
        ))}
    </div>
</div>


                <Button
                    type="submit"
                    variant="auth"
                    fullWidth
                    disabled={loading || !email}
                >
                    {loading ? "Verifying..." : "Verify email"}
                </Button>
            </form>
        </AuthLayout>
    );
}

export default VerifyOtp;

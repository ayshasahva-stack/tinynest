
import { useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { verifyResetOtpSchema } from "../../validations/auth/verifyResetOtpSchema";
import { clearAuthError } from "../../features/auth/authSlice";
import Button from "../../components/Button";

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
    const {
        handleSubmit: handleFormSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(verifyResetOtpSchema),
        defaultValues: {
            otp: "",
        },
    });
    // Handle typing into an OTP box.
    const handleOtpChange = (index, value) => {
        // Allow only numbers and keep the last entered digit.
        const digit = value.replace(/\D/g, "").slice(-1);

        const updatedOtp = otp.split("");
        updatedOtp[index] = digit;

        const newOtp = updatedOtp.join("").slice(0, 6);

        // Update the existing OTP state.
        setOtp(newOtp);

        // Keep React Hook Form synchronized with the OTP boxes.
        setValue("otp", newOtp, {
            shouldValidate: true,
            shouldDirty: true,
        });

        // Clear previous API errors when the user edits the OTP.
        setApiError("");
        dispatch(clearAuthError());

        // Automatically focus the next box.
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

        // Extract only numbers from the pasted text.
        const pastedOtp = event.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 6);

        if (!pastedOtp) return;

        setOtp(pastedOtp);

        // Update React Hook Form after pasting.
        setValue("otp", pastedOtp, {
            shouldValidate: true,
            shouldDirty: true,
        });

        // Clear previous API errors.
        setApiError("");
        dispatch(clearAuthError());

        // Focus the next empty box.
        const nextIndex = Math.min(pastedOtp.length, 5);
        otpRefs.current[nextIndex]?.focus();
    };

    // Validate the form and verify the reset OTP.

    const handleVerifyResetOtp = async (data) => {
        setValidationError("");
        setApiError("");

        // Check whether the email exists in the URL.
        if (!email.trim()) {
            setValidationError(
                "Email address is missing. Please request a new reset OTP."
            );
            return;
        }

        try {
            // Send the validated OTP to the backend.
            await dispatch(
                verifyResetOtpThunk({
                    email,
                    otp: data.otp,
                })
            ).unwrap();

            // Navigate only after successful verification.
            navigate("/reset-password");
        } catch (error) {
            // Display the backend verification error.
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
        <main className="relative min-h-[calc(100dvh-80px)] overflow-hidden bg-[#f7f9ff] px-4 py-8 text-[#181c20] dark:bg-gray-950 sm:px-6 lg:px-8 lg:py-12">
            {/* Same decorative background shapes as Login.jsx */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#dce7e2]/70 blur-3xl dark:bg-emerald-950/30"
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-[#f0bba5]/20 blur-3xl dark:bg-amber-950/20"
            />

            {/* Same main authentication card */}
            <div className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-2xl border border-[#e0e3e8] bg-white shadow-[0_8px_40px_-12px_rgba(43,47,51,0.12)] dark:border-gray-800 dark:bg-gray-900 lg:grid-cols-[0.9fr_1.1fr]">

                {/* LEFT PANEL: Identical to Login.jsx */}
                <aside className="relative flex flex-col justify-between overflow-hidden bg-[#f1f4f9] p-6 dark:bg-gray-800 sm:p-8 lg:p-10">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full border-[24px] border-[#dce7e2]/70 dark:border-white/5"
                    />

                    <div className="relative z-10">
                        {/* TinyNest logo */}
                        <Link
                            to="/"
                            aria-label="TinyNest home"
                            className="inline-flex items-center gap-2 font-serif text-3xl tracking-tight text-[#436558] transition hover:opacity-80 dark:text-[#a9cfbe]"
                        >
                            TinyNest
                            <span className="text-[#7d5543]">.</span>
                        </Link>

                        {/* Brand badge */}
                        <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#dce7e2] px-3 py-2 text-xs font-semibold text-[#315447] dark:bg-emerald-950 dark:text-emerald-200">
                            <span aria-hidden="true">✿</span>
                            Thoughtfully chosen for little ones
                        </div>

                        {/* Same image and styling */}
                        <div className="group relative mt-5 h-52 overflow-hidden rounded-xl shadow-sm sm:h-64 lg:h-60">
                            <img
                                src="https://images.unsplash.com/photo-1510154221590-ff63e90a136f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
                                alt="A peaceful setting representing thoughtful care for little ones"
                                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-[#181c20]/50 via-transparent to-transparent" />

                            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2">
                                <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-[#181c20] backdrop-blur">
                                    Little beginnings
                                </span>

                                <span className="rounded-full bg-[#dce7e2]/95 px-3 py-1.5 text-xs font-semibold text-[#315447]">
                                    Made with love ♡
                                </span>
                            </div>
                        </div>

                        {/* Same brand message */}
                        <div className="mt-7">
                            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#436558] dark:text-[#a9cfbe]">
                                LITTLE THINGS, LOTS OF LOVE
                            </p>

                            <h1 className="max-w-md font-serif text-3xl font-normal leading-tight tracking-tight text-[#181c20] dark:text-white sm:text-4xl">
                                Let's get you back to your little world.
                            </h1>

                            <p className="mt-4 max-w-md text-sm leading-7 text-[#414845] dark:text-gray-300 sm:text-base">
                                A quick email verification will help you securely reset your password and return to the things you love.
                            </p>
                        </div>
                    </div>

                    {/* Same bottom reassurance section */}
                    <div className="relative z-10 mt-8 border-t border-[#c1c8c3]/70 pt-5 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-xl text-[#436558] shadow-sm dark:bg-gray-700 dark:text-[#a9cfbe]">
                                ♡
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-[#181c20] dark:text-white">
                                    Care in every little detail
                                </p>

                                <p className="mt-1 text-xs leading-5 text-[#626c68] dark:text-gray-400">
                                    A little care for every little one.
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* RIGHT PANEL: Verify Reset OTP form */}
                <section className="flex items-center justify-center bg-white p-6 dark:bg-gray-900 sm:p-8 lg:p-12">
                    <div className="w-full max-w-md">

                        {/* Original page content preserved */}
                        <div className="mb-7">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#7d5543]">
                                ACCOUNT RECOVERY
                            </p>

                            <h2 className="font-serif text-4xl font-normal tracking-tight text-[#181c20] dark:text-white sm:text-5xl">
                                Verify your email
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-[#626c68] dark:text-gray-400">
                                Enter the six-digit password reset code sent to your email address to continue securely.
                            </p>
                        </div>

                        {/* Original validation and API error handling */}
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

                        {/* Original OTP entry form and handlers preserved */}
                        <form
                            onSubmit={handleFormSubmit(handleVerifyResetOtp)}
                            className="space-y-6"
                        >
                            <div>
                                <label
                                    htmlFor="otp-0"
                                    className="mb-3 block text-sm font-medium text-[#181c20] dark:text-white"
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
                                                index === 0
                                                    ? "one-time-code"
                                                    : "off"
                                            }
                                            aria-label={`OTP digit ${index + 1}`}
                                            value={otp[index] || ""}
                                            onChange={(event) => {
                                                handleOtpChange(index, event.target.value);
                                            }}
                                            onKeyDown={(event) =>
                                                handleOtpKeyDown(event, index)
                                            }
                                            onPaste={handleOtpPaste}
                                            disabled={loading}
                                            maxLength={1}
                                            className="h-12 min-w-0 flex-1 rounded-xl border border-[#e0e3e8] bg-white text-center text-lg font-semibold text-[#181c20] outline-none transition focus:border-[#7a9e8f] focus:ring-2 focus:ring-[#dce7e2] disabled:opacity-60 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-[#a9cfbe] dark:focus:ring-emerald-900"
                                        />
                                    ))}
                                </div>
                                {/* Display Yup validation errors */}
                                {errors.otp && (
                                    <p className="mt-2 text-xs text-red-600" role="alert">
                                        {errors.otp.message}
                                    </p>
                                )}
                                <p className="mt-3 text-sm text-[#626c68] dark:text-gray-400">
                                    Enter the code before it expires.
                                </p>
                            </div>

                            {/* Original button text, loading state and condition */}
                            <div className="pt-1">
                                <Button
                                    type="submit"
                                    variant="auth"
                                    fullWidth
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Verifying code..."
                                        : "Verify and continue"}
                                </Button>
                            </div>
                        </form>

                        {/* Original footer content preserved */}
                        <div className="mt-6 border-t border-[#e0e3e8] pt-5 text-center dark:border-gray-700">
                            <p className="text-sm text-[#707771] dark:text-[#B5BDB7]">
                                Need a new code?{" "}
                                <Link
                                    to={`/forgot-password`}
                                    className="font-semibold text-[#436558] transition hover:text-[#315447] hover:underline dark:text-[#a9cfbe]"
                                >
                                    Request another OTP
                                </Link>
                            </p>
                        </div>

                        <p className="mt-6 text-center text-xs leading-5 text-[#717974] dark:text-gray-500">
                            <span aria-hidden="true">♡ </span>
                            Little things, lots of love.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );

}

export default VerifyResetOtp;
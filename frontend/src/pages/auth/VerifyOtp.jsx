
import { useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Button from "../../components/Button";

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
                           Just one little step to get started.
                        </h1>

                        <p className="mt-4 max-w-md text-sm leading-7 text-[#414845] dark:text-gray-300 sm:text-base">
                            Verify your email to create a safe little space for your baby's essentials, favourites, and special moments.
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

            {/* RIGHT PANEL: Same structure and styling as Login.jsx */}
            <section className="flex items-center justify-center bg-white p-6 dark:bg-gray-900 sm:p-8 lg:p-12">
                <div className="w-full max-w-md">


                    {/* OTP heading — same typography as Login */}
                    <div className="mb-7">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#7d5543]">
                            ONE LITTLE STEP
                        </p>

                        <h2 className="font-serif text-4xl font-normal tracking-tight text-[#181c20] dark:text-white sm:text-5xl">
                            Verify your email
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-[#626c68] dark:text-gray-400">
                            Enter the 6-digit code we sent to your email
                            to verify your TinyNest account.
                        </p>
                    </div>

                    {/* Existing error handling */}
                    {displayedError && (
                        <p
                            role="alert"
                            className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                        >
                            {typeof displayedError === "string"
                                ? displayedError
                                : "OTP verification failed. Please check the code and try again."}
                        </p>
                    )}

                    {/* Existing OTP form logic preserved */}
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Email being verified */}
                        {email && (
                            <p className="text-sm leading-6 text-[#626c68] dark:text-gray-400">
                                Verification code for{" "}
                                <span className="break-all font-medium text-[#436558] dark:text-[#a9cfbe]">
                                    {email}
                                </span>
                            </p>
                        )}

                        {/* Six OTP input boxes */}
                        <div>
                            <label
                                id="otp-label"
                                className="mb-3 block text-sm font-medium text-[#181c20] dark:text-white"
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
                                        autoComplete={
                                            index === 0
                                                ? "one-time-code"
                                                : "off"
                                        }
                                        aria-label={`OTP digit ${index + 1}`}
                                        maxLength={6}
                                        value={otp[index] || ""}
                                        onChange={(event) =>
                                            handleOtpChange(
                                                index,
                                                event.target.value
                                            )
                                        }
                                        onKeyDown={(event) =>
                                            handleOtpKeyDown(event, index)
                                        }
                                        onPaste={(event) => {
                                            event.preventDefault();

                                            const pastedDigits =
                                                event.clipboardData
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

                                                otpRefs.current[
                                                    nextIndex
                                                ]?.focus();
                                            }
                                        }}
                                        className="h-12 min-w-0 flex-1 rounded-xl border border-[#e0e3e8] bg-white text-center text-xl font-semibold text-[#181c20] outline-none transition focus:border-[#7a9e8f] focus:ring-2 focus:ring-[#7a9e8f]/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:h-14"
                                    />
                                ))}
                            </div>

                            <p className="mt-3 text-xs leading-5 text-[#626c68] dark:text-gray-400">
                                Enter the code exactly as it appears in
                                your verification email.
                            </p>
                        </div>

                        {/* Existing button component and conditions */}
                        <div className="pt-1">
                            <Button
                                type="submit"
                                variant="auth"
                                fullWidth
                                disabled={loading || !email}
                            >
                                {loading ? "Verifying..." : "Verify email →"}
                            </Button>
                        </div>
                    </form>

                    {/* Same footer styling as Login */}
                    <p className="mt-6 text-center text-xs leading-5 text-[#717974] dark:text-gray-500">
                        <span aria-hidden="true">♡ </span>
                        Little things, lots of love.
                    </p>

                    <div className="mt-6 border-t border-[#e0e3e8] pt-5 text-center dark:border-gray-700">
                        <p className="text-sm text-[#707771] dark:text-[#B5BDB7]">
                            Already verified?{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-[#436558] transition hover:text-[#315447] hover:underline dark:text-[#a9cfbe]"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    </main>
);

}

export default VerifyOtp;
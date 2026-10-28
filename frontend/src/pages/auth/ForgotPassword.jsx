import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Input from "../../components/Input";
import Button from "../../components/Button";
import { clearAuthError } from "../../features/auth/authSlice";
import { forgotPasswordThunk } from "../../features/auth/authThunk";
import {
    selectAuthLoading,
    selectAuthError,
} from "../../features/auth/authSelectors";

function ForgotPassword() {
    // Store the email entered by the user.
    const [email, setEmail] = useState("");

    // Store client-side validation errors separately.
    const [validationError, setValidationError] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    // Prevent errors from Login or another auth page from appearing here.
    useEffect(() => {
        dispatch(clearAuthError());
    }, [dispatch]);

    // Read the request status and backend error from Redux.
    const loading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);


    const handleSubmit = async (event) => {
        event.preventDefault();
        setValidationError("");

        const cleanedEmail = email.trim();

        if (!cleanedEmail) {
            setValidationError("Please enter your email address.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanedEmail)) {
            setValidationError("Please enter a valid email address.");
            return;
        }

        try {
            // unwrap() throws if the Redux thunk is rejected.
            await dispatch(forgotPasswordThunk(cleanedEmail)).unwrap();

            // Navigate only after a successful response.
            navigate(
                `/verify-reset-otp?email=${encodeURIComponent(cleanedEmail)}`
            );
        } catch (error) {
            // Stay on this page and let the Redux error selector display the error.
            console.error("Forgot password failed:", error);
        }
    };

    // Show validation errors first, otherwise show the API error.
    const displayedError = validationError || error;

   
return (
    <main className="relative min-h-[calc(100dvh-80px)] overflow-hidden bg-[#f7f9ff] px-4 py-8 text-[#181c20] dark:bg-gray-950 sm:px-6 lg:px-8 lg:py-12">
        {/* Decorative background shapes matching Login and Register. */}
        <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#dce7e2]/70 blur-3xl dark:bg-emerald-950/30"
        />

        <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-[#f0bba5]/20 blur-3xl dark:bg-amber-950/20"
        />

        {/* Main authentication card. */}
        <div className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-2xl border border-[#e0e3e8] bg-white shadow-[0_8px_40px_-12px_rgba(43,47,51,0.12)] dark:border-gray-800 dark:bg-gray-900 lg:grid-cols-[0.9fr_1.1fr]">

            {/* LEFT PANEL: Same TinyNest branding as Login and Register. */}
            <aside className="relative flex flex-col justify-between overflow-hidden bg-[#f1f4f9] p-6 dark:bg-gray-800 sm:p-8 lg:p-10">
                {/* Decorative circle. */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full border-[24px] border-[#dce7e2]/70 dark:border-white/5"
                />

                <div className="relative z-10">
                    {/* TinyNest logo. */}
                    <Link
                        to="/"
                        aria-label="TinyNest home"
                        className="inline-flex items-center gap-2 font-serif text-3xl tracking-tight text-[#436558] transition hover:opacity-80 dark:text-[#a9cfbe]"
                    >
                        TinyNest
                        <span className="text-[#7d5543]">.</span>
                    </Link>

                    {/* Brand badge. */}
                    <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#dce7e2] px-3 py-2 text-xs font-semibold text-[#315447] dark:bg-emerald-950 dark:text-emerald-200">
                        <span aria-hidden="true">✿</span>
                        Thoughtfully chosen for little ones
                    </div>

                    {/* Brand image. */}
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

                    {/* Recovery-page introduction. */}
                    <div className="mt-7">
                        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#436558] dark:text-[#a9cfbe]">
                            LITTLE THINGS, LOTS OF LOVE
                        </p>

                        <h1 className="max-w-md font-serif text-3xl font-normal leading-tight tracking-tight text-[#181c20] dark:text-white sm:text-4xl">
                            A little help getting back to you.
                        </h1>

                        <p className="mt-4 max-w-md text-sm leading-7 text-[#414845] dark:text-gray-300 sm:text-base">
                            Your TinyNest account is just a step away.
                            We'll help you securely reset your password
                            so you can get back to the things you love.
                        </p>
                    </div>
                </div>

                {/* Bottom reassurance section. */}
                <div className="relative z-10 mt-8 border-t border-[#c1c8c3]/70 pt-5 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-xl text-[#436558] shadow-sm dark:bg-gray-700 dark:text-[#a9cfbe]">
                            ♡
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-[#181c20] dark:text-white">
                                Your account, your peace of mind
                            </p>

                            <p className="mt-1 text-xs leading-5 text-[#626c68] dark:text-gray-400">
                                Secure recovery, with care at every step.
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* RIGHT PANEL: Forgot-password form. */}
            <section className="flex items-center justify-center bg-white p-6 dark:bg-gray-900 sm:p-8 lg:p-12">
                <div className="w-full max-w-md">

                    {/* Page heading. */}
                    <div className="mb-7">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#7d5543]">
                            ACCOUNT RECOVERY
                        </p>

                        <h2 className="font-serif text-4xl font-normal tracking-tight text-[#181c20] dark:text-white sm:text-5xl">
                            Forgot your password?
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-[#626c68] dark:text-gray-400">
                            It happens! Enter the email address linked
                            to your TinyNest account and we'll help you
                            reset your password.
                        </p>
                    </div>

                    {/* Preserve existing validation and backend errors. */}
                    {displayedError && (
                        <p
                            role="alert"
                            className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                        >
                            {typeof displayedError === "string"
                                ? displayedError
                                : "We couldn't request a password reset. Please try again."}
                        </p>
                    )}

                    {/* Existing form and input handlers are preserved. */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Registered email address"
                            type="email"
                            name="email"
                            value={email}
                            onChange={(event) => {
                                // Keep the existing state and error-clearing logic.
                                setEmail(event.target.value);
                                setValidationError("");
                                dispatch(clearAuthError());
                            }}
                            placeholder="you@example.com"
                            disabled={loading}
                        />

                        {/* Existing submit action and loading state. */}
                        <div className="pt-1">
                            <Button
                                type="submit"
                                variant="auth"
                                fullWidth
                                disabled={loading}
                            >
                                {loading
                                    ? "Sending reset OTP..."
                                    : "Send reset OTP →"}
                            </Button>
                        </div>
                    </form>

                    {/* Existing return-to-login navigation. */}
                    <div className="mt-6 border-t border-[#e0e3e8] pt-5 text-center dark:border-gray-700">
                        <p className="text-sm text-[#707771] dark:text-[#B5BDB7]">
                            Remember your password?{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-[#436558] transition hover:text-[#315447] hover:underline dark:text-[#a9cfbe]"
                            >
                                Sign in
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

export default ForgotPassword;
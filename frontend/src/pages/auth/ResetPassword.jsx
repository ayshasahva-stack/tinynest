import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { resetPasswordSchema } from "../../validations/auth/resetPasswordSchema";
import { clearAuthError } from "../../features/auth/authSlice";
import Input from "../../components/Input";
import Button from "../../components/Button";

import { resetPasswordThunk } from "../../features/auth/authThunk";
import {
    selectAuthLoading,
    selectAuthError,
} from "../../features/auth/authSelectors";

function ResetPassword() {
    const [validationError, setValidationError] = useState("");
    const [apiError, setApiError] = useState("");
    // Controls visibility of each password field independently.
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        handleSubmit: handleFormSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(resetPasswordSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Read the authentication request state from Redux.
    const loading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);

    // The reset token is created after successful reset OTP verification.
    const resetToken = useSelector((state) => state.auth.resetToken);

    // Validate the form and submit the new password.
    const handleResetPassword = async (data) => {
        setValidationError("");
        setApiError("");

        // A reset token is required to authorize this operation.
        if (!resetToken) {
            setValidationError(
                "Your password reset session has expired. Please request a new reset OTP."
            );
            return;
        }

        try {
            // Send the reset token and validated password to the backend.
            await dispatch(
                resetPasswordThunk({
                    resetToken,
                    newPassword: data.newPassword,
                })
            ).unwrap();

            // Navigate to login after successful password reset.
            navigate("/login", {
                replace: true,
                state: {
                    message:
                        "Password reset successfully. Please sign in with your new password.",
                },
            });
        } catch (error) {
            // Display the backend error.
            const message =
                typeof error === "string"
                    ? error
                    : error?.message ||
                    "We couldn't reset your password. Please try again.";

            setApiError(message);
        }
    };

    // Prefer local validation and submission errors.
    const displayedError = validationError || apiError || error;


    return (
        <main className="relative min-h-[calc(100dvh-80px)] overflow-hidden bg-[#f7f9ff] px-4 py-8 text-[#181c20] dark:bg-gray-950 sm:px-6 lg:px-8 lg:py-12">
            {/* Background decorations shared with the other authentication pages. */}
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

                {/* LEFT PANEL: Same TinyNest branding as Forgot Password. */}
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

                        {/* Reset-password introduction. */}
                        <div className="mt-7">
                            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#436558] dark:text-[#a9cfbe]">
                                LITTLE THINGS, LOTS OF LOVE
                            </p>

                            <h1 className="max-w-md font-serif text-3xl font-normal leading-tight tracking-tight text-[#181c20] dark:text-white sm:text-4xl">
                                Let's get you back in.
                            </h1>

                            <p className="mt-4 max-w-md text-sm leading-7 text-[#414845] dark:text-gray-300 sm:text-base">
                                Choose a new password to help keep your
                                TinyNest account secure and get back to
                                discovering essentials for your little one.
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

                {/* RIGHT PANEL: Reset-password form. */}
                <section className="flex items-center justify-center bg-white p-6 dark:bg-gray-900 sm:p-8 lg:p-12">
                    <div className="w-full max-w-md">

                        {/* Page heading. */}
                        <div className="mb-7">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#7d5543]">
                                ACCOUNT RECOVERY
                            </p>

                            <h2 className="font-serif text-4xl font-normal tracking-tight text-[#181c20] dark:text-white sm:text-5xl">
                                Create a new password
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-[#626c68] dark:text-gray-400">
                                Choose a strong password for your TinyNest
                                account. You'll use it the next time you sign in.
                            </p>
                        </div>

                        {/* Preserve the existing validation and server errors. */}
                        {displayedError && (
                            <p
                                role="alert"
                                className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                            >
                                {typeof displayedError === "string"
                                    ? displayedError
                                    : "We couldn't reset your password. Please try again."}
                            </p>
                        )}

                        {/* Existing form state and handlers remain unchanged. */}
                        <form
                            onSubmit={handleFormSubmit(handleResetPassword)}
                            className="space-y-5"
                        >
                            <Controller
                                name="newPassword"
                                control={control}
                                render={({ field }) => (
                                    <div className="relative">
                                        <Input
                                            label="New password"
                                            type={showNewPassword ? "text" : "password"}
                                            name={field.name}
                                            value={field.value}
                                            onChange={(event) => {
                                                field.onChange(event);

                                                // Clear previous backend errors while editing.
                                                setApiError("");
                                                dispatch(clearAuthError());
                                            }}
                                            onBlur={field.onBlur}
                                            placeholder="Enter your new password"
                                            disabled={loading}
                                            autoComplete="new-password"
                                        />

                                        {/* Show/Hide new password */}
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword((prev) => !prev)}
                                            disabled={loading}
                                            aria-label={showNewPassword ? "Hide password" : "Show password"}
                                            className="absolute right-4 top-[42px] text-gray-500 transition hover:text-[#436558] dark:text-gray-400 dark:hover:text-[#a9cfbe]"
                                        >
                                            {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                                        </button>
                                    </div>
                                )}
                            />

                            {/* Display Yup validation error */}
                            {errors.newPassword && (
                                <p className="mt-1 text-xs text-red-600" role="alert">
                                    {errors.newPassword.message}
                                </p>
                            )}

                            <Controller
                                name="confirmPassword"
                                control={control}
                                render={({ field }) => (
                                    <div className="relative">
                                        <Input
                                            label="Confirm new password"
                                            type={showConfirmPassword ? "text" : "password"}
                                            name={field.name}
                                            value={field.value}
                                            onChange={(event) => {
                                                field.onChange(event);

                                                // Clear previous backend errors while editing.
                                                setApiError("");
                                                dispatch(clearAuthError());
                                            }}
                                            onBlur={field.onBlur}
                                            placeholder="Re-enter your new password"
                                            disabled={loading}
                                            autoComplete="new-password"
                                        />

                                        {/* Show/Hide confirm password */}
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                                            disabled={loading}
                                            aria-label={
                                                showConfirmPassword
                                                    ? "Hide confirm password"
                                                    : "Show confirm password"
                                            }
                                            className="absolute right-4 top-[42px] text-gray-500 transition hover:text-[#436558] dark:text-gray-400 dark:hover:text-[#a9cfbe]"
                                        >
                                            {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                                        </button>
                                    </div>
                                )}
                            />

                            {/* Display Yup validation error */}
                            {errors.confirmPassword && (
                                <p className="mt-1 text-xs text-red-600" role="alert">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                            {/* Password guidance uses the shared muted text color. */}
                            <p className="text-xs leading-5 text-[#707771] dark:text-[#B5BDB7]">
                                Use at least 8 characters. Avoid using a password
                                you already use elsewhere.
                            </p>

                            {/* Existing button, loading state, and submit behavior. */}
                            <div className="pt-1">
                                <Button
                                    type="submit"
                                    variant="auth"
                                    fullWidth
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Resetting password..."
                                        : "Save new password →"}
                                </Button>
                            </div>
                        </form>

                        {/* Return-to-login link. */}
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
// Eye icon for showing the password.
function EyeIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M2 12s3.64-7 10-7 10 7 10 7-3.64 7-10 7-10-7-10-7z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

// Eye-off icon for hiding the password.
function EyeOffIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 3l18 18" />
            <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" />
            <path d="M9.88 5.09A10.8 10.8 0 0 1 12 4.87c5 0 9 5.13 10 7.13a13.2 13.2 0 0 1-3.17 4.11" />
            <path d="M6.61 6.61C3.92 8.05 2.45 10.2 2 12c1 2 5 7.13 10 7.13a10.8 10.8 0 0 0 4.11-.81" />
        </svg>
    );
}
export default ResetPassword;
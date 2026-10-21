
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Input from "../../components/Input";
import Button from "../../components/Button";
import AuthLayout from "../../components/AuthLayout";

import { resetPasswordThunk } from "../../features/auth/authThunk";
import {
    selectAuthLoading,
    selectAuthError,
} from "../../features/auth/authSelectors";

function ResetPassword() {
    // Store the new password and its confirmation.
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Keep client-side validation messages separate from API errors.
    const [validationError, setValidationError] = useState("");
    const [apiError, setApiError] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Read the authentication request state from Redux.
    const loading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);

    // The reset token is created after successful reset OTP verification.
    const resetToken = useSelector((state) => state.auth.resetToken);

    // Validate the form and submit the new password.
    const handleSubmit = async (event) => {
        event.preventDefault();

        setValidationError("");
        setApiError("");

        // A reset token is required to authorize this operation.
        if (!resetToken) {
            setValidationError(
                "Your password reset session has expired. Please request a new reset OTP."
            );
            return;
        }

        // Require both password fields.
        if (!newPassword || !confirmPassword) {
            setValidationError("Please fill in both password fields.");
            return;
        }

        // Keep the password confirmation consistent.
        if (newPassword !== confirmPassword) {
            setValidationError("Passwords do not match.");
            return;
        }

        // Enforce a minimum password length.
        if (newPassword.length < 8) {
            setValidationError(
                "Your password must contain at least 8 characters."
            );
            return;
        }

        try {
            // Send the reset token and new password to the backend.
            await dispatch(
                resetPasswordThunk({
                    resetToken,
                    newPassword,
                })
            ).unwrap();

            // Return to login after a successful password reset.
            navigate("/login", {
                replace: true,
                state: {
                    message: "Password reset successfully. Please sign in with your new password.",
                },
            });
        } catch (error) {
            // Show the rejected thunk message on the page.
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
        <AuthLayout
            eyebrow="ACCOUNT RECOVERY"
            title="Create a new password"
            description="Choose a strong password for your TinyNest account. You'll use it the next time you sign in."
            footer={
                <p>
                    Remember your password?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
                    >
                        Sign in
                    </Link>
                </p>
            }
        >
            {/* Display validation and server errors accessibly. */}
            {displayedError && (
                <p
                    role="alert"
                    className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                >
                    {typeof displayedError === "string"
                        ? displayedError
                        : "We couldn't reset your password. Please try again."}
                </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                    label="New password"
                    type="password"
                    name="newPassword"
                    value={newPassword}
                    onChange={(event) => {
                        setNewPassword(event.target.value);
                        setValidationError("");
                        setApiError("");
                    }}
                    placeholder="Enter your new password"
                    disabled={loading}
                />

                <Input
                    label="Confirm new password"
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(event) => {
                        setConfirmPassword(event.target.value);
                        setValidationError("");
                        setApiError("");
                    }}
                    placeholder="Re-enter your new password"
                    disabled={loading}
                />

                <p className="text-xs text-gray-500 dark:text-gray-400">
                    Use at least 8 characters. Avoid using a password you
                    already use elsewhere.
                </p>

                <Button
                    type="submit"
                    variant="auth"
                    fullWidth
                    disabled={loading}
                >
                    {loading ? "Resetting password..." : "Save new password"}
                </Button>
            </form>
        </AuthLayout>
    );
}

export default ResetPassword;

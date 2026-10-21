import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Input from "../../components/Input";
import Button from "../../components/Button";
import AuthLayout from "../../components/AuthLayout";
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
        <AuthLayout
            eyebrow="ACCOUNT RECOVERY"
            title="Forgot your password?"
            description="It happens! Enter the email address linked to your TinyNest account and we'll help you reset your password."
            footer={
                <p className="text-sm text-[#707771] dark:text-[#B5BDB7]">
                    Remember your password?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-[#5F816D] hover:underline dark:text-[#B4D0BB]"
                    >
                        Sign in
                    </Link>
                </p>
            }
        >
            {/* Display validation and backend errors accessibly. */}
            {displayedError && (
                <p
                    role="alert"
                    className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                >
                    {typeof displayedError === "string"
                        ? displayedError
                        : "We couldn't request a password reset. Please try again."}
                </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email address associated with the account. */}
                <Input
                    label="Registered email address"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(event) => {
                        // Update the email and clear old error messages while typing.
                        setEmail(event.target.value);
                        setValidationError("");
                        dispatch(clearAuthError());
                    }}
                    placeholder="you@example.com"
                    disabled={loading}
                />

                {/* Disable repeated requests while the API call is pending. */}
                <Button
                    type="submit"
                    variant="auth"
                    fullWidth
                    disabled={loading}
                >
                    {loading ? "Sending reset OTP..." : "Send reset OTP"}
                </Button>
            </form>
        </AuthLayout>
    );
}

export default ForgotPassword;

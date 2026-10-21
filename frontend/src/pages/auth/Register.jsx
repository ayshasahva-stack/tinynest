
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Input from "../../components/Input";
import Button from "../../components/Button";
import AuthLayout from "../../components/AuthLayout";

import { registerUserThunk } from "../../features/auth/authThunk";
import {
    selectAuthLoading,
    selectAuthError,
} from "../../features/auth/authSelectors";

function Register() {
    // Store the values entered in the registration form.
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Store client-side validation errors separately from API errors.
    const [validationError, setValidationError] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Read the current request status and API error from Redux.
    const loading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);

    // Validate the form, register the user, and navigate to OTP verification.
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Remove any previous client-side validation message.
        setValidationError("");

        // Trim whitespace from email and phone before submitting.
        const cleanedEmail = email.trim();
        const cleanedPhone = phone.trim();

        // Check required values before making an API request.
        if (!cleanedEmail || !cleanedPhone || !password || !confirmPassword) {
            setValidationError("Please fill in all fields.");
            return;
        }
// Ensure the password contains at least 8 characters.
if (password.length < 8) {
    setValidationError("Password must be at least 8 characters.");
    return;
}

// Check that both password fields match.
if (password !== confirmPassword) {
    setValidationError("Passwords do not match.");
    return;
}
        // Check that both password fields match.
        if (password !== confirmPassword) {
            setValidationError("Passwords do not match.");
            return;
        }

        try {
            // Send registration data to the backend through Redux.
            await dispatch(
                registerUserThunk({
                    email: cleanedEmail,
                    phone: cleanedPhone,
                    password,
                    confirmPassword,
                })
            ).unwrap();

            // Continue to OTP verification after successful registration.
            navigate(
                `/verify-otp?email=${encodeURIComponent(cleanedEmail)}`
            );
        } catch {
            // Redux stores the API error, which is displayed below.
            // No console-only error handling is needed here.
        }
    };

    // Prefer a local validation message when one exists.
    const displayedError = validationError || error;

    return (
        <AuthLayout
            eyebrow="YOUR LITTLE WORLD"
            title="Create your account"
            description="Join TinyNest for thoughtful essentials for your little one."
            footer={
                <p className="text-sm text-[#707771] dark:text-[#B5BDB7]">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-[#5F816D] hover:text-[#456354] hover:underline dark:text-[#B4D0BB]"
                    >
                        Sign in
                    </Link>
                </p>
            }
        >
            {/* Show validation and backend errors where users can see them. */}
            {displayedError && (
                <p
                    role="alert"
                    className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                >
                    {typeof displayedError === "string"
                        ? displayedError
                        : "Registration failed. Please check your details and try again."}
                </p>
            )}

        <form onSubmit={handleSubmit} className="space-y-3">
                {/* Email field */}
                <Input
                    label="Email address"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                />

                {/* Phone field */}
                <Input
                    label="Phone number"
                    type="tel"
                    name="phone"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="Enter your phone number"
                />

                {/* Password field */}
                <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Create a password"
                />

                {/* Confirm-password field */}
                <Input
                    label="Confirm password"
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Enter your password again"
                />

                {/* Disable repeated submissions while the request is pending. */}
                <div className="pt-1">
                    <Button
                        type="submit"
                        variant="auth"
                        fullWidth
                        disabled={loading}
                    >
                        {loading ? "Creating account..." : "Create account"}
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}

export default Register;

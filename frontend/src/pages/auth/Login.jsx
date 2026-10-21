import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Input from "../../components/Input";
import Button from "../../components/Button";
import AuthLayout from "../../components/AuthLayout";
import { clearAuthError } from "../../features/auth/authSlice";
import {
    selectAuthLoading,
    selectAuthError,
} from "../../features/auth/authSelectors";

import {
    loginUserThunk,
    getProfileThunk,
} from "../../features/auth/authThunk";

function Login() {
    // Store the email and password entered by the user.
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Access Redux and React Router functionality.
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    // Clear errors left behind by another authentication page.
    useEffect(() => {
        dispatch(clearAuthError());
    }, [dispatch]);

    // Read authentication status from Redux.
    const error = useSelector(selectAuthError);
    const loading = useSelector(selectAuthLoading);

    // Authenticate the user and fetch their profile.
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Log in using the existing Redux thunk.
            await dispatch(
                loginUserThunk({ email, password })
            ).unwrap();

            // Fetch the user's profile and role.
            await dispatch(
                getProfileThunk()
            ).unwrap();

            // Return to the requested page or go home.
            const destination =
                location.state?.from?.pathname || "/";

            navigate(destination, { replace: true });
        } catch (error) {
            // Redux retains the error for display on the page.
            console.error("Authentication failed:", error);
        }
    };

    return (
        <AuthLayout
            title="Welcome back"
            description="Sign in to your account and pick up where you left off."
            footer={
                <p className="text-sm text-[#707771] dark:text-[#B5BDB7]">
                    New to TinyNest?{" "}
                    <Link
                        to="/register"
                        className="font-semibold text-[#5F816D] hover:text-[#456354] hover:underline dark:text-[#B4D0BB]"
                    >
                        Create an account
                    </Link>
                </p>
            }
        >
            {/* Display the authentication error. */}
            {error && (
                <p
                    role="alert"
                    className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                >
                    {error}
                </p>
            )}

            {/* Login form */}
            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >
                <Input
                    label="Email address"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(event) => {
                        dispatch(clearAuthError());
                        setEmail(event.target.value);
                    }}
                    placeholder="you@example.com"
                    autoComplete="email"
                />

                <div className="space-y-2">
                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        value={password}
                        onChange={(event) => {
                            dispatch(clearAuthError());
                            setPassword(event.target.value);
                        }}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                    />

                    {/* Navigate to the password recovery page. */}
                    <div className="flex justify-end">
                        <Link
                            to="/forgot-password"
                            className="text-sm font-medium text-[#668875] hover:underline dark:text-[#B4D0BB]"
                        >
                            Forgot password?
                        </Link>
                    </div>
                </div>

                {/* Use the authentication button variant from the ZIP. */}
                <Button
                    type="submit"
                    variant="auth"
                    fullWidth
                    disabled={loading}
                >
                    {loading ? "Signing in..." : "Sign in"}
                </Button>
            </form>
        </AuthLayout>
    );
}

export default Login;

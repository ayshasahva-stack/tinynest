// Import React's useState hook
import { useState } from "react";

// Import reusable form components
import Input from "../../components/Input";
import Button from "../../components/Button";
// Import the authentication loading selector
import { selectAuthLoading } from "../../features/auth/authSelectors";

// Import Redux's dispatch hook
import { useDispatch,useSelector } from "react-redux";
// Import React Router's navigation hook
import { useNavigate,useLocation } from "react-router-dom";
// Import Redux's selector hook

// Import the authentication error selector
import { selectAuthError } from "../../features/auth/authSelectors";
// Import the login thunk
import { 
    loginUserThunk,
    getProfileThunk

 } from "../../features/auth/authThunk";

// Login page component
function Login() {
    // Store the email entered by the user
    const [email, setEmail] = useState("");

    // Store the password entered by the user
    const [password, setPassword] = useState("");
    // Get the function used to navigate between pages
    const navigate = useNavigate();
    // Get the Redux dispatch function
const location = useLocation();
    const dispatch = useDispatch();
    // Get the current authentication error from Redux
    const error = useSelector(selectAuthError);
    // Get the authentication loading state from Redux
    const loading = useSelector(selectAuthLoading);
    // Handle login form submission
   const handleSubmit = async (event) => {
    event.preventDefault();

    try {
        // Authenticate the user and save the access token.
        await dispatch(
            loginUserThunk({ email, password })
        ).unwrap();

        // Fetch the user's profile and role before navigating.
        await dispatch(getProfileThunk()).unwrap();

        // Return to the requested page, or go home by default.
        const destination = location.state?.from?.pathname || "/";

        navigate(destination, { replace: true });
    } catch (error) {
        // The existing Redux error state displays login/profile errors.
        console.error("Authentication failed:", error);
    }
};

    return (
        <main>
            <h1>Login</h1>
            {/* Show the login error when one exists */}
            {error && (
                <p className="mb-4 text-sm text-red-600">
                    {error}
                </p>
            )}
            <form onSubmit={handleSubmit}>
                <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter your email"
                />

                <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                />

                <Button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </Button>
            </form>
        </main>
    );
}

export default Login;
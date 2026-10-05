
// Import React's useState hook
import { useState } from "react";

// Import reusable form components
import Input from "../../components/Input";
import Button from "../../components/Button";
// Import Redux hooks
import { useDispatch, useSelector } from "react-redux";

// Import the forgot password thunk
import { forgotPasswordThunk } from "../../features/auth/authThunk";

// Import the authentication selectors
import {
    selectAuthLoading,
    selectAuthError,
} from "../../features/auth/authSelectors";

// Forgot Password page component
function ForgotPassword() {
    // Store the email entered by the user
    const [email, setEmail] = useState("");
    // Get the Redux dispatch function
const dispatch = useDispatch();

// Get the current authentication loading state
const loading = useSelector(selectAuthLoading);

// Get the current authentication error
const error = useSelector(selectAuthError);

    // Handle the forgot password form submission
    // Handle the forgot password form submission
const handleSubmit = async (event) => {
    // Prevent the browser from refreshing the page
    event.preventDefault();

    try {
        // Send the email to the backend
        const response = await dispatch(
            forgotPasswordThunk(email)
        ).unwrap();

        // Show the backend response for now
        console.log(response);
    } catch (error) {
        // Log the error for now
        console.error(error);
    }
};

    return (
        <main>
            <h1>Forgot Password</h1>
            {/* Show an error when the request fails */}
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
                    placeholder="Enter your registered email"
                />

                <Button type="submit" disabled={loading}>
    {loading ? "Sending OTP..." : "Send Reset OTP"}
</Button>
            </form>
        </main>
    );
}

export default ForgotPassword;
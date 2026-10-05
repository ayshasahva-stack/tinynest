// Import React's useState hook
// Import React's useState hook
import { useState } from "react";

// Import React Router's navigation hook
import { useNavigate } from "react-router-dom";

// Import Redux hooks
import { useDispatch, useSelector } from "react-redux";

// Import reusable form components
import Input from "../../components/Input";
import Button from "../../components/Button";

// Import reset password thunk
import { resetPasswordThunk } from "../../features/auth/authThunk";

// Import authentication selectors
import {
    selectAuthLoading,
    selectAuthError,
} from "../../features/auth/authSelectors";
// Reset Password page component
function ResetPassword() {
    // Store the new password
    const [newPassword, setNewPassword] = useState("");

    // Store the password confirmation
    const [confirmPassword, setConfirmPassword] = useState("");
    // Get Redux dispatch
    const dispatch = useDispatch();

    // Get navigation function
    const navigate = useNavigate();

    // Get authentication loading state
    const loading = useSelector(selectAuthLoading);

    // Get authentication error
    const error = useSelector(selectAuthError);

    // Get the temporary reset token from Redux
    const resetToken = useSelector((state) => state.auth.resetToken);

    // Handle the reset password form submission
    // Handle the reset password form submission
    const handleSubmit = async (event) => {
        // Prevent the browser from refreshing the page
        event.preventDefault();

        // Stop if the reset token is missing
        if (!resetToken) {
            console.error("Reset token is missing");
            return;
        }

        // Check that both passwords match
        if (newPassword !== confirmPassword) {
            console.error("Passwords do not match");
            return;
        }

        try {
            // Send the reset token and new password to the backend
            await dispatch(
                resetPasswordThunk({
                    resetToken,
                    newPassword,
                })
            ).unwrap();

            // Password reset succeeded, so return to login
            navigate("/login");
        } catch (error) {
            // Log the reset error for now
            console.error(error);
        }
    };
    return (
        <main>
            <h1>Reset Password</h1>
            {/* Show the reset error when one exists */}
            {error && (
                <p className="mb-4 text-sm text-red-600">
                    {error}
                </p>
            )}
            <form onSubmit={handleSubmit}>
                <Input
                    label="New Password"
                    type="password"
                    name="newPassword"
                    value={newPassword}
                    onChange={(event) =>
                        setNewPassword(event.target.value)
                    }
                    placeholder="Enter your new password"
                />

                <Input
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(event) =>
                        setConfirmPassword(event.target.value)
                    }
                    placeholder="Confirm your new password"
                />

                <Button type="submit" disabled={loading}>
                    {loading ? "Resetting Password..." : "Reset Password"}
                </Button>
            </form>
        </main>
    );
}

export default ResetPassword;
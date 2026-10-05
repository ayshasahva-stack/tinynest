// Import React's useState hook
// Import React's useState hook
import { useState } from "react";

// Import React Router hooks
import { useNavigate, useSearchParams } from "react-router-dom";

// Import Redux hooks
import { useDispatch, useSelector } from "react-redux";

// Import reusable form components
import Input from "../../components/Input";
import Button from "../../components/Button";

// Import the reset OTP thunk
import { verifyResetOtpThunk } from "../../features/auth/authThunk";

// Import authentication selectors
import {
    selectAuthLoading,
    selectAuthError,
} from "../../features/auth/authSelectors";

// Verify Reset OTP page component
function VerifyResetOtp() {
    // Store the OTP entered by the user
    const [otp, setOtp] = useState("")
    // Get the email from the URL
    const [searchParams] = useSearchParams();

    // Get the email value
    const email = searchParams.get("email") || "";

    // Get Redux dispatch
    const dispatch = useDispatch();

    // Get navigation function
    const navigate = useNavigate();

    // Get authentication loading state
    const loading = useSelector(selectAuthLoading);

    // Get authentication error
    const error = useSelector(selectAuthError);;

    // Handle the OTP form submission
    // Handle reset OTP form submission
    const handleSubmit = async (event) => {
        // Prevent the browser from refreshing the page
        event.preventDefault();

        try {
            // Send email and OTP to the backend
            await dispatch(
                verifyResetOtpThunk({
                    email,
                    otp,
                })
            ).unwrap();

            // Move to the password reset page
            navigate("/reset-password");
        } catch (error) {
            // Log the verification error for now
            console.error(error);
        }
    };

    return (
        <main>
            <h1>Verify Reset OTP</h1>
            {/* Show the verification error when one exists */}
            {error && (
                <p className="mb-4 text-sm text-red-600">
                    {error}
                </p>
            )}
            <form onSubmit={handleSubmit}>
                <Input
                    label="OTP"
                    type="text"
                    name="otp"
                    value={otp}
                    onChange={(event) => setOtp(event.target.value)}
                    placeholder="Enter your 6-digit OTP"
                />

                <Button type="submit">
                    Verify OTP
                </Button>
            </form>
        </main>
    );
}

export default VerifyResetOtp;
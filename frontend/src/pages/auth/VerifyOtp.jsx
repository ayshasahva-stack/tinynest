import { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
// Import Redux's dispatch hook
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
// Import React Router's navigation hook
import { useNavigate } from "react-router-dom";

// Import the OTP verification thunk
import { verifyOtpThunk } from "../../features/auth/authThunk";
// OTP verification page
function VerifyOtp() {
    // Store the OTP entered by the user
    const [otp, setOtp] = useState("");
    // Get the Redux dispatch function
    const dispatch = useDispatch();
    // Read the email from the URL
    const [searchParams] = useSearchParams();
    // Get the function used to navigate between pages
const navigate = useNavigate();

    // Get the email value from the URL
    const email = searchParams.get("email");
    // Handle OTP verification form submission
    // Handle OTP form submission
    // Handle OTP form submission
const handleSubmit = async (event) => {
    // Prevent the browser from refreshing the page
    event.preventDefault();

    try {
        // Send the email and OTP to the backend
        await dispatch(
            verifyOtpThunk({
                email,
                otp,
            })
        ).unwrap();

        // Navigate to the login page after successful verification
        navigate("/login");
    } catch (error) {
        // Log the verification error for now
        console.error(error);
    }
};
    return (
        <main>
            <form onSubmit={handleSubmit}>
                {/* OTP input */}
                <Input
                    label="OTP"
                    type="text"
                    name="otp"
                    value={otp}
                    onChange={(event) => setOtp(event.target.value)}
                    placeholder="Enter your 6-digit OTP"
                />

                {/* Verify OTP button */}
                <Button type="submit">
                    Verify OTP
                </Button>
            </form>
        </main>
    );
}

export default VerifyOtp;
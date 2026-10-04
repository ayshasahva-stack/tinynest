// Import React's useState hook
import { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button"
// Import Redux's dispatch hook
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// Import the registration thunk
import { registerUserThunk } from "../../features/auth/authThunk";
// Register page component
function Register() {
    // Store the email entered by the user
    const [email, setEmail] = useState("");
    // Store the phone number entered by the user
    const [phone, setPhone] = useState("");
    // Store the password entered by the user
    const [password, setPassword] = useState("");
    // Store the confirmation password entered by the user
const [confirmPassword, setConfirmPassword] = useState("");
    // Get the Redux dispatch function
const dispatch = useDispatch();
const navigate=useNavigate()
    // Handle registration form submission
    // Handle registration form submission
const handleSubmit = async (event) => {
    // Prevent the browser from refreshing the page
    event.preventDefault();

    try {
        // Send the registration data and wait for the backend response
        await dispatch(
            registerUserThunk({
                email,
                phone,
                password,
                confirmPassword,
            })
        ).unwrap();

        // Navigate to OTP verification after successful registration
        navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (error) {
        // Log the registration error for now
        console.error(error);
    }
};
    return (
        <main>
            <h1>Register</h1>

            <form onSubmit={handleSubmit}>
                {/* Email input */}
                <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter your email"
                />

                {/* Phone input */}
                <Input
                    label="Phone"
                    type="tel"
                    name="phone"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="Enter your phone number"
                />

                {/* Password input */}
                <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                />
{/* Confirm password input */}
<Input
    label="Confirm Password"
    type="password"
    name="confirmPassword"
    value={confirmPassword}
    onChange={(event) => setConfirmPassword(event.target.value)}
    placeholder="Confirm your password"
/>
                {/* Register button */}
                <Button type="submit">
                    Register
                </Button>
            </form>
        </main>
    );
}

export default Register;
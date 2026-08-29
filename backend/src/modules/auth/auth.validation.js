const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9]{10}$/;

export const validateRegistration = (body) => {
    const { email, password, confirmPassword, phone } = body;

    if (!email || !password || !confirmPassword || !phone) {
        return { error: "All fields are required" };
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();

    if (!EMAIL_REGEX.test(normalizedEmail)) {
        return { error: "Please enter a valid email" };
    }

    if (password.length < 8) {
        return { error: "Password must be at least 8 characters" };
    }

    if (password !== confirmPassword) {
        return { error: "Passwords do not match" };
    }

    if (!PHONE_REGEX.test(normalizedPhone)) {
        return { error: "Please enter a valid 10-digit phone number" };
    }

    return {
        error: null,
        data: {
            email: normalizedEmail,
            password,
            phone: normalizedPhone
        }
    };
};

// Validate the OTP verification request
export const validateVerifyOtp = (body) => {
    const { email, otp } = body;

    // Check that both email and OTP were provided
    if (!email || !otp) {
        return "Email and OTP are required";
    }

    // OTP must contain exactly 6 digits
    if (!/^[0-9]{6}$/.test(otp)) {
        return "OTP must be 6 digits";
    }

    // Return null when validation passes
    return null;
};
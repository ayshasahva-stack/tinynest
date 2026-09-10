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

// Validate the login request
export const validateLogin = (body) => {
    const { email, password } = body;

    // Check that both fields were provided
    if (!email || !password) {
        return "Email and password are required";
    }

    // Check whether the email has a valid format
    if (!EMAIL_REGEX.test(email.trim())) {
        return "Please enter a valid email";
    }

    // Return null when validation passes
    return null;
};

// Validate the resend OTP request
export const validateResendOtp = (body) => {
    const { email } = body;

    // Check whether email was provided
    if (!email) {
        return "Email is required";
    }

    // Check whether the email format is valid
    if (!EMAIL_REGEX.test(email.trim())) {
        return "Please enter a valid email";
    }

    // Return null when validation passes
    return null;
};

// Validate the forgot-password request
export const validateForgotPassword = (body) => {
    const { email } = body;

    // Make sure email was provided
    if (!email) {
        return "Email is required";
    }

    // Make sure email has a valid format
    if (!EMAIL_REGEX.test(email.trim())) {
        return "Please enter a valid email";
    }

    return null;
};

// Validate the reset OTP request
export const validateVerifyResetOtp = (body) => {
    const { email, otp } = body;

    // Make sure email and OTP were provided
    if (!email || !otp) {
        return "Email and OTP are required";
    }

    // Validate email format
    if (!EMAIL_REGEX.test(email.trim())) {
        return "Please enter a valid email";
    }

    // OTP must contain exactly 6 digits
    if (!/^\d{6}$/.test(otp)) {
        return "OTP must be 6 digits";
    }

    return null;
};
// Validate the reset-password request
export const validateResetPassword = (body) => {
    const { resetToken, newPassword } = body;

    // Make sure both values were provided
    if (!resetToken || !newPassword) {
        return "Reset token and new password are required";
    }

    // Make sure the new password meets our minimum requirement
    if (newPassword.length < 6) {
        return "Password must be at least 6 characters";
    }

    return null;
};
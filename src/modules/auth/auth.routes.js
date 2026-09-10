import express from "express";
import {
  register,
  verifyOtp,
  resendOtp,
  login,
  getProfile,
  forgotPassword,
  verifyResetOtp,
  resetPassword,

} from "./auth.controller.js";
import protect from "../../middleware/auth.middleware.js";

const router = express.Router();

// Register a new user
router.post("/register", register);

// Verify registration OTP
router.post("/verify-otp", verifyOtp);

// Resend verification OTP
router.post('/resend-otp',resendOtp)

// Login an existing user
router.post("/login",login)

// Get logged-in user's profile
router.get('/profile',protect,getProfile)

// Send a password-reset OTP
router.post("/forgot-password", forgotPassword);

// Verify password reset OTP
router.post("/verify-reset-otp", verifyResetOtp);

// Reset the user's password
router.post("/reset-password", resetPassword);

export default router;
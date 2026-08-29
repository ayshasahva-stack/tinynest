import express from "express";
import {
  register,
  verifyOtp,
  resendOtp,
  login,
  getProfile,

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



export default router;
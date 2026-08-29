import express from "express";
import {
  register,
  verifyOtp,
  login,
  getProfile
} from "./auth.controller.js";
import protect from "../../middleware/auth.middleware.js";

const router = express.Router();

// Register a new user
router.post("/register", register);

// for verify otp
router.post("/verify-otp", verifyOtp);

// for login
router.post("/login",login)

// to get profile

router.get('/profile',protect,getProfile)


export default router;
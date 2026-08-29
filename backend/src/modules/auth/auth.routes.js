import express from "express";
import {
  register,
  verifyOtp,
  login
} from "./auth.controller.js";

const router = express.Router();

// Register a new user
router.post("/register", register);

// for verify otp
router.post("/verify-otp", verifyOtp);

// for login
router.post("/login",login)


export default router;
import express from "express";
import { register,verifyOtp } from "./auth.controller.js";

const router = express.Router();

// Register a new user
router.post("/register", register);

router.post("/verify-otp", verifyOtp);


export default router;
import express from "express";
import { register } from "./auth.controller.js";

const router = express.Router();

// Register a new user
router.post("/register", register);

export default router;
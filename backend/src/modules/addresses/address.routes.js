import express from "express";
import protect from "../../middleware/auth.middleware.js";
import { createAddress } from "./address.controller.js";

const router = express.Router();

// Create an address for the logged-in user
router.post("/", protect, createAddress);

export default router;
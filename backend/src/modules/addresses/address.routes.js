import express from "express";
import protect from "../../middleware/auth.middleware.js";
import { createAddress,
    getMyAddresses,
 } from "./address.controller.js";

const router = express.Router();

// Create an address for the logged-in user
router.post("/", protect, createAddress);
// Get all addresses belonging to the logged-in user
router.get("/", protect, getMyAddresses);

export default router;
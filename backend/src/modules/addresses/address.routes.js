import express from "express";
import protect from "../../middleware/auth.middleware.js";
import { createAddress,
    getMyAddresses,
    getMyAddressById,
    updateAddress,
 } from "./address.controller.js";

const router = express.Router();

// Create an address for the logged-in user
router.post("/", protect, createAddress);
// Get all addresses belonging to the logged-in user
router.get("/", protect, getMyAddresses);
// Get one address belonging to the logged-in user
router.get("/:addressId", protect, getMyAddressById);
// Update one of the logged-in user's addresses
router.patch("/:addressId", protect, updateAddress);

export default router;
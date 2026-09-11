import express from "express";
import protect from "../../middleware/auth.middleware.js";
import authorizeAdmin from "../../middleware/admin.middleware.js";
import {
    createKit,
    getKits,
    getKitById,
    updateKit,
    updateKitStatus,
} from "./kit.controller.js";

const router = express.Router();

// Admin: create a new kit
router.post("/", protect, authorizeAdmin, createKit);
// Public: get all active kits
router.get("/", getKits);
// Public: get one active kit by ID
router.get("/:kitId", getKitById);
// Admin: update an existing kit
router.patch("/:kitId", protect, authorizeAdmin, updateKit);
// Admin: activate or deactivate a kit
router.patch("/:kitId/status", protect, authorizeAdmin, updateKitStatus);

export default router;
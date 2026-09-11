import express from "express";
import protect from "../../middleware/auth.middleware.js";
import authorizeAdmin from "../../middleware/admin.middleware.js";
import {
    createKit,
    getKits,
} from "./kit.controller.js";

const router = express.Router();

// Admin: create a new kit
router.post("/", protect, authorizeAdmin, createKit);
// Public: get all active kits
router.get("/", getKits);
export default router;
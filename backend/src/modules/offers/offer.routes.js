import express from "express";

import protect from "../../middleware/auth.middleware.js";
import authorizeAdmin from "../../middleware/admin.middleware.js";

import {
    createOffer,

} from "./offer.controller.js";

const router = express.Router();

// Admin: create a new offer
router.post("/", protect, authorizeAdmin, createOffer);

export default router;
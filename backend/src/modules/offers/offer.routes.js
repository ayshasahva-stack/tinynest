import express from "express";

import protect from "../../middleware/auth.middleware.js";
import authorizeAdmin from "../../middleware/admin.middleware.js";

import {
    createOffer,
    getActiveOffers,

} from "./offer.controller.js";

const router = express.Router();

// Admin: create a new offer
router.post("/", protect, authorizeAdmin, createOffer);
// Public: get currently active offers
router.get("/", getActiveOffers);

export default router;
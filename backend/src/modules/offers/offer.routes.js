import express from "express";

import protect from "../../middleware/auth.middleware.js";
import authorizeAdmin from "../../middleware/admin.middleware.js";

import {
    createOffer,
    getActiveOffers,
    getAllOffers,

} from "./offer.controller.js";

const router = express.Router();

// Admin: create a new offer
router.post("/", protect, authorizeAdmin, createOffer);
// Public: get currently active offers
router.get("/", getActiveOffers);
// Admin: get all offers
router.get( "/admin", protect, authorizeAdmin, getAllOffers);
export default router;
import express from "express";

import { createCategory } from "./category.controller.js";

import protect from "../../middleware/auth.middleware.js";
import authorizeAdmin from "../../middleware/admin.middleware.js";

const router = express.Router();

// Create category - admin only
router.post(
    "/",
    protect,
    authorizeAdmin,
    createCategory
);

export default router;
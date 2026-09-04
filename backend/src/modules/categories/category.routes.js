import express from "express";

import {
    createCategory,
    getCategories,
     getCategoryById,
} from "./category.controller.js";

import protect from "../../middleware/auth.middleware.js";
import authorizeAdmin from "../../middleware/admin.middleware.js";

const router = express.Router();

// Create category - admin only
router.post("/",  protect,  authorizeAdmin,  createCategory);
// Public route to get active category
router.get("/", getCategories);
// Public route to get one active category
router.get("/:id", getCategoryById);

export default router;
import express from "express";

import {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    getAllCategoriesForAdmin,
} from "./category.controller.js";

import protect from "../../middleware/auth.middleware.js";
import authorizeAdmin from "../../middleware/admin.middleware.js";

const router = express.Router();

// Create category - admin only
router.post("/", protect, authorizeAdmin, createCategory);
// Public route to get active category
router.get("/", getCategories);
// Admin route: active and inactive categories
router.get(
    "/admin/all",
    protect,
    authorizeAdmin,
    getAllCategoriesForAdmin
);
// Public route to get one active category
router.get("/:id", getCategoryById);
// Admin can update a category
router.put("/:id", protect, authorizeAdmin, updateCategory);
// Admin can deactivate a category
router.delete("/:id", protect, authorizeAdmin, deleteCategory);


export default router;
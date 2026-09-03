import express from "express";

import {
    createProduct,
    getProducts,
    getProductById,
} from "./product.controller.js";

import protect from "../../middleware/auth.middleware.js";
import authorizeAdmin from "../../middleware/admin.middleware.js";

const router = express.Router();

// Only authenticated admins can create products
router.post( "/", protect, authorizeAdmin, createProduct);

// Get all products
// This is a public route
router.get("/", getProducts);

// Get a single product - public
router.get("/:id", getProductById);

export default router;
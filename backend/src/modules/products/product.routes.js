import express from "express";

import {
    createProduct,
    getProducts,
} from "./product.controller.js";

import protect from "../../middleware/auth.middleware.js";
import authorizeAdmin from "../../middleware/admin.middleware.js";

const router = express.Router();

// Only authenticated admins can create products
router.post( "/", protect, authorizeAdmin, createProduct);

// Get all products
// This is a public route
router.get("/", getProducts);

export default router;
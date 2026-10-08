import express from "express";

import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} from "./product.controller.js";

import protect from "../../middleware/auth.middleware.js";
import authorizeAdmin from "../../middleware/admin.middleware.js";
// Handles product image uploads
import upload from "../../middleware/upload.middleware.js";

const router = express.Router();

// Only authenticated admins can create products
// Create product - admin only
// "images" is the field name that will contain the uploaded files.
// Maximum 5 product images are allowed.
router.post(
    "/",
    protect,
    authorizeAdmin,
    upload.array("images", 5),
    createProduct
);

// Get all products
// This is a public route
router.get("/", getProducts);

// Get a single product - public
router.get("/:id", getProductById);
// Update product - admin only
router.put("/:id",protect,authorizeAdmin,updateProduct);

// Delete product - admin only
router.delete( "/:id", protect, authorizeAdmin, deleteProduct);

export default router;
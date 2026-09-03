import express from "express";

import { createProduct } from "./product.controller.js";
import protect from "../../middleware/auth.middleware.js";
import authorizeAdmin from "../../middleware/admin.middleware.js";

const router = express.Router();

// Only authenticated admins can create products
router.post(
    "/",
    protect,
    authorizeAdmin,
    createProduct
);

export default router;
import express from "express";
import protect from "../../middleware/auth.middleware.js";
import authorizeAdmin from "../../middleware/admin.middleware.js";
import {
    getAllUsers,
    blockUser,
} from "./user.controller.js";

const router = express.Router();

// Admin: get all users
router.get("/", protect, authorizeAdmin, getAllUsers);
// Admin: block a customer
router.patch("/:userId/block",protect,authorizeAdmin,blockUser);

export default router;
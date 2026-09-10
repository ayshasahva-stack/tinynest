import express from "express";
import protect from "../../middleware/auth.middleware.js";
import authorizeAdmin from "../../middleware/admin.middleware.js";
import {
    getAllUsers,
    blockUser,
    unblockUser
} from "./user.controller.js";

const router = express.Router();

// Admin: get all users
router.get("/", protect, authorizeAdmin, getAllUsers);
// Admin: block a customer
router.patch("/:userId/block",protect,authorizeAdmin,blockUser);
// Admin: unblock a customer
router.patch("/:userId/unblock",protect,authorizeAdmin,unblockUser);

export default router;
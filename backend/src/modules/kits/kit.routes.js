import express from "express";
import protect from "../../middleware/auth.middleware.js";
import authorizeAdmin from "../../middleware/admin.middleware.js";
import { createKit } from "./kit.controller.js";

const router = express.Router();

// Admin: create a new kit
router.post("/",protect,authorizeAdmin,createKit);

export default router;

import express from "express";

import protect from "../../middleware/auth.middleware.js";

import {
    getMyNotifications,
    markNotificationAsRead,
    clearMyNotifications,
} from "./notification.controller.js";

const router = express.Router();

// Require authentication for all notification endpoints.
router.use(protect);

// GET /api/notifications
// Fetch notifications belonging to the logged-in user.
router.get("/", getMyNotifications);

// PATCH /api/notifications/:notificationId/read
// Mark one notification as read.
router.patch("/:notificationId/read", markNotificationAsRead);

// DELETE /api/notifications
// Clear all notifications belonging to the logged-in user.
router.delete("/", clearMyNotifications);

export default router;

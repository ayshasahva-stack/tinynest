
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import api from "../services/api";
import socket from "../realtime/Socket";

import {
    selectAuthUser,
    selectIsAuthenticated,
} from "../features/auth/authSelectors";

function NotificationBell({ badgeOnly = false }) {
    // Get the current authentication state and logged-in user.
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectAuthUser);

    // Store notifications and dropdown state.
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    // Detect navigation between the dropdown and full notifications page.
    const location = useLocation();
    // Choose the correct full notifications page for the current role.
    const notificationsPath =
        user?.role === "admin" ? "/admin/notifications" : "/notifications";

    // Count only unread notifications.
    const unreadCount = notifications.filter(
        (notification) => !notification.isRead
    ).length;

    // Listen for read/unread changes made on the full notifications page.
    useEffect(() => {
        const handleNotificationUpdated = (event) => {
            const updatedNotification = event.detail;

            if (!updatedNotification?._id) return;

            setNotifications((previous) =>
                previous.map((notification) =>
                    notification._id === updatedNotification._id
                        ? { ...notification, ...updatedNotification }
                        : notification
                )
            );
        };

        window.addEventListener(
            "tinynest:notification-updated",
            handleNotificationUpdated
        );

        return () => {
            window.removeEventListener(
                "tinynest:notification-updated",
                handleNotificationUpdated
            );
        };
    }, []);

    useEffect(() => {
        // Clear notification state when the user logs out.
        if (!isAuthenticated) {
            setNotifications([]);
            setIsOpen(false);
            setError("");
            return;
        }

        let isMounted = true;

        // Fetch notifications saved in MongoDB.
        const fetchNotifications = async () => {
            try {
                setIsLoading(true);
                setError("");

                const response = await api.get("/notifications");

                if (isMounted) {
                    setNotifications(response.data.data || []);
                }
            } catch (error) {
                console.error("Failed to fetch notifications:", error);

                if (isMounted) {
                    setError("Unable to load notifications.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        // Add a live notification without duplicating an existing item.
        const addNotification = (notification) => {
            setNotifications((previous) => {
                const alreadyExists = previous.some(
                    (item) => item._id === notification._id
                );

                if (alreadyExists) {
                    return previous;
                }

                return [notification, ...previous].slice(0, 50);
            });
        };

        // Admin event: a new order has been placed.
        const handleNewOrder = (order) => {
            addNotification({
                _id: `live-new-order-${order.orderId}`,
                type: "new-order",
                orderId: order.orderId,
                order: order.orderId,
                title: "New order received",
                message: `A new order worth ₹${order.totalAmount} has been placed.`,
                isRead: false,
                createdAt: new Date().toISOString(),
            });
        };

        // Customer event: an order's status has changed.
        const handleStatusUpdated = (order) => {
            addNotification({
                _id: `live-status-${order.orderId}-${order.status}`,
                type: "status-updated",
                orderId: order.orderId,
                order: order.orderId,
                title: "Order status updated",
                message: `Your order is now ${order.status}.`,
                isRead: false,
                createdAt: new Date().toISOString(),
            });
        };

        // Handle a saved notification sent by the backend.
        const handleNewNotification = (notification) => {
            // Ignore invalid notification data.
            if (!notification?._id) return;

            // Add the notification without creating duplicates.
            // Saved MongoDB IDs allow read/unread actions to work.
            addNotification(notification);
        };

        // Listen for existing order events.
        socket.on("order:new", handleNewOrder);
        socket.on("order:statusUpdated", handleStatusUpdated);

        // Listen for new saved notifications, such as registration
        // and order cancellation notifications.
        socket.on("notification:new", handleNewNotification);


        // Load the saved notifications.
        fetchNotifications();

        // Clean up listeners when this component unmounts.

        return () => {
            isMounted = false;

            // Remove all listeners registered by this effect.
            socket.off("order:new", handleNewOrder);
            socket.off("order:statusUpdated", handleStatusUpdated);
            socket.off("notification:new", handleNewNotification);
        };

    }, [isAuthenticated]);
    // Refresh saved notifications whenever the user navigates.
    // This syncs the badge and dropdown with changes made on the full page.
    useEffect(() => {
        if (!isAuthenticated) return;

        let isMounted = true;

        const refreshNotifications = async () => {
            try {
                const response = await api.get("/notifications");

                if (isMounted) {
                    setNotifications(response.data.data || []);
                }
            } catch (error) {
                console.error("Failed to refresh notifications:", error);
            }
        };

        refreshNotifications();

        return () => {
            isMounted = false;
        };
    }, [location.pathname, isAuthenticated]);
    // Save the new read/unread status through the backend.
    const handleToggleRead = async (notification) => {
        // Temporary live notifications do not have MongoDB IDs.
        if (String(notification._id).startsWith("live-")) {
            setError(
                "This live notification is not saved yet. Refresh and try again."
            );
            return;
        }

        const nextIsRead = !notification.isRead;

        try {
            setError("");

            const response = await api.patch(
                `/notifications/${notification._id}/read`,
                { isRead: nextIsRead }
            );

            const updatedNotification = response.data.data;

            // Update only the selected notification.
            setNotifications((previous) =>
                previous.map((item) =>
                    item._id === notification._id
                        ? { ...item, ...updatedNotification }
                        : item
                )
            );
        } catch (error) {
            console.error("Failed to update notification:", error);
            setError("Unable to update notification status.");
        }
    };

    // Format notification dates.
    const formatDate = (date) => {
        if (!date) return "Date unavailable";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Date unavailable";
        }

        return parsedDate.toLocaleString();
    };

    // Do not show notifications to signed-out visitors.
    if (!isAuthenticated) {
        return null;
    }

    // Render only the unread-count badge when used in the Navbar menu.
    // The normal bell and notification popup remain unchanged elsewhere.
    if (badgeOnly) {
        if (unreadCount === 0) {
            return null;
        }

        return (
            <span
                aria-label={`${unreadCount} unread notifications`}
                className="ml-auto flex h-6 min-w-6 items-center justify-center rounded-full bg-[#EED5D9] px-2 text-xs font-medium text-[#754750] dark:bg-[#5B3941] dark:text-[#F5DDE1]"
            >
                {unreadCount}
            </span>
        );
    }

    return (
        <div className="relative">
            {/* Bell button and unread badge */}
            <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                aria-label={`Notifications: ${unreadCount} unread`}
                aria-expanded={isOpen}
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#E8E0D5] bg-white text-lg hover:bg-[#F5E9E7] dark:border-stone-700 dark:bg-stone-900 dark:hover:bg-stone-800"
            >
                <span aria-hidden="true">🔔</span>

                {/* Hide the badge when there are no unread notifications. */}
                {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#D69BA5] px-1 text-xs font-bold text-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Notification dropdown */}
            {isOpen && (
                <div className="absolute right-0 z-[60] mt-3 w-80 max-w-[90vw] overflow-hidden rounded-2xl border border-[#E8E0D5] bg-[#FFFCF7] shadow-xl dark:border-stone-700 dark:bg-stone-900">
                    {/* Dropdown heading */}
                    <div className="flex items-center justify-between border-b border-[#E8E0D5] px-4 py-3 dark:border-stone-700">
                        <h2 className="font-semibold text-stone-800 dark:text-stone-100">
                            Notifications
                        </h2>
                    </div>

                    {/* Notification list */}
                    <div className="max-h-80 overflow-y-auto">
                        {isLoading ? (
                            <p className="px-4 py-8 text-center text-sm text-stone-500 dark:text-stone-400">
                                Loading notifications...
                            </p>
                        ) : error && notifications.length === 0 ? (
                            <p className="px-4 py-8 text-center text-sm text-red-600">
                                {error}
                            </p>
                        ) : notifications.length === 0 ? (
                            <p className="px-4 py-8 text-center text-sm text-stone-500 dark:text-stone-400">
                                No notifications yet.
                            </p>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    className={`border-b border-[#E8E0D5] px-4 py-3 last:border-b-0 dark:border-stone-700 ${notification.isRead
                                        ? "bg-white dark:bg-stone-900"
                                        : "bg-[#FFF8F5] dark:bg-stone-800/70"
                                        }`}
                                >
                                    {/* Open the selected notification on the full page. */}
                                    <Link
                                        to={`${notificationsPath}?notificationId=${notification._id}`}
                                        onClick={() => setIsOpen(false)}
                                        className="block rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#789477]"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="text-sm font-semibold text-stone-800 dark:text-stone-100">
                                                {notification.title}
                                            </p>

                                            <span
                                                className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${notification.isRead
                                                    ? "bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-300"
                                                    : "bg-[#F5E9E7] text-[#80545C] dark:bg-stone-700 dark:text-[#E8BFC7]"
                                                    }`}
                                            >
                                                {notification.isRead
                                                    ? "Read"
                                                    : "Unread"}
                                            </span>
                                        </div>

                                        <p className="mt-1 break-words text-sm text-stone-600 dark:text-stone-300">
                                            {notification.message}
                                        </p>

                                        <p className="mt-2 text-xs text-stone-400">
                                            {notification.orderId ||
                                                notification.order
                                                ? `Order: ${String(
                                                    notification.orderId ||
                                                    notification.order
                                                ).slice(-8)}`
                                                : "General notification"}
                                        </p>

                                        <p className="mt-2 text-xs text-stone-400">
                                            {formatDate(
                                                notification.createdAt
                                            )}
                                        </p>
                                    </Link>

                                    {/* Toggle the notification's read status. */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleToggleRead(notification)
                                        }
                                        className="mt-2 text-xs font-semibold text-[#506B52] hover:underline dark:text-[#DCE7D6]"
                                    >
                                        Mark as{" "}
                                        {notification.isRead
                                            ? "unread"
                                            : "read"}
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Display errors without hiding existing notifications. */}
                    {error && notifications.length > 0 && (
                        <p
                            role="alert"
                            className="px-4 py-2 text-xs text-red-600 dark:text-red-400"
                        >
                            {error}
                        </p>
                    )}

                    {/* Link to the complete notifications page. */}
                    {/* Show See All only when not already on the notifications page */}
                    {location.pathname !== "/notifications" &&
                        location.pathname !== "/admin/notifications" && (
                            <div className="border-t border-[#E8E0D5] p-3 text-center dark:border-stone-700">
                                <Link
                                    to={notificationsPath}
                                    onClick={() => setIsOpen(false)}
                                    className="text-sm font-semibold text-[#506B52] hover:underline dark:text-[#DCE7D6]"
                                >
                                    See All Notifications →
                                </Link>
                            </div>
                        )}
                </div>
            )}
        </div>
    );
}

export default NotificationBell;


import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

import api from "../../services/api";
import { selectAuthUser } from "../../features/auth/authSelectors";

function Notifications() {
    // Get the logged-in user's role.
    const user = useSelector(selectAuthUser);
    const isAdmin = user?.role === "admin";

    // Read the notification ID selected from the dropdown URL.
    const [searchParams] = useSearchParams();
    const selectedNotificationId = searchParams.get("notificationId");

    // Store notifications and page status.
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    // Fetch the latest saved notifications from MongoDB.
    useEffect(() => {
        let isMounted = true;

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
                    setError("Unable to load notifications. Please try again.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchNotifications();

        // Prevent state updates after leaving the page.
        return () => {
            isMounted = false;
        };
    }, []);

    // Mark a notification as read or unread.
    const handleToggleRead = async (notification) => {
        if (updatingId === notification._id) return;

        const nextIsRead = !notification.isRead;

        try {
            setUpdatingId(notification._id);
            setError("");

            // Send the requested status to the backend.
            const response = await api.patch(
                `/notifications/${notification._id}/read`,
                { isRead: nextIsRead }
            );

            const updatedNotification = response.data.data;

            // Update only the notification returned by the API.
            setNotifications((previous) =>
                previous.map((item) =>
                    item._id === notification._id
                        ? { ...item, ...updatedNotification }
                        : item
                )
            );
            // Tell the notification bell to update immediately.
window.dispatchEvent(
    new CustomEvent("tinynest:notification-updated", {
        detail: updatedNotification,
    })
);
        } catch (error) {
            console.error("Failed to update notification:", error);
            setError("Unable to update notification. Please try again.");
        } finally {
            setUpdatingId(null);
        }
    };

    // Clear all notifications for the logged-in user.
    const handleClearAll = async () => {
        if (notifications.length === 0) return;

        try {
            setError("");
            await api.delete("/notifications");
            setNotifications([]);
        } catch (error) {
            console.error("Failed to clear notifications:", error);
            setError("Unable to clear notifications. Please try again.");
        }
    };

    // Format the notification date and time.
    const formatDate = (date) => {
        if (!date) return "Date unavailable";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Date unavailable";
        }

        return parsedDate.toLocaleString();
    };

    // Calculate the unread count for this page.
    const unreadCount = notifications.filter(
        (notification) => !notification.isRead
    ).length;

    return (
        <section className="min-h-screen bg-[#FFFCF7] px-4 py-8 dark:bg-stone-950 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">

                {/* Page heading and navigation */}
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <Link
                            to={isAdmin ? "/admin" : "/"}
                            className="text-sm text-[#506B52] hover:underline dark:text-[#DCE7D6]"
                        >
                            ← {isAdmin ? "Admin Dashboard" : "Home"}
                        </Link>

                        <h1 className="mt-3 text-2xl font-bold text-stone-800 dark:text-stone-100 sm:text-3xl">
                            {isAdmin
                                ? "Admin Notifications"
                                : "My Notifications"}
                        </h1>

                        <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
                            {unreadCount} unread notification
                            {unreadCount === 1 ? "" : "s"}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleClearAll}
                        disabled={notifications.length === 0 || isLoading}
                        className="rounded-lg border border-[#E8E0D5] px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-[#F5E9E7] disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
                    >
                        Clear All
                    </button>
                </div>

                {/* Show errors without hiding existing notifications */}
                {error && (
                    <div
                        role="alert"
                        className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
                    >
                        {error}
                    </div>
                )}

                {/* Loading state */}
                {isLoading ? (
                    <div className="rounded-2xl border border-[#E8E0D5] p-10 text-center text-stone-500 dark:border-stone-700 dark:text-stone-400">
                        Loading notifications...
                    </div>
                ) : notifications.length === 0 ? (
                    /* Empty state */
                    <div className="rounded-2xl border border-[#E8E0D5] bg-white p-10 text-center dark:border-stone-700 dark:bg-stone-900">
                        <div className="mb-3 text-4xl" aria-hidden="true">
                            🔔
                        </div>

                        <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-100">
                            No notifications yet
                        </h2>

                        <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
                            New updates will appear here when they arrive.
                        </p>
                    </div>
                ) : (
                    /* Full notification list */
                    <div className="overflow-hidden rounded-2xl border border-[#E8E0D5] bg-white dark:border-stone-700 dark:bg-stone-900">
                        {notifications.map((notification) => {
                            const isSelected =
                                notification._id === selectedNotificationId;

                            return (
                                <article
                                    key={notification._id}
                                    id={`notification-${notification._id}`}
                                    className={`flex gap-4 border-b border-[#E8E0D5] p-5 last:border-b-0 dark:border-stone-700 ${
                                        isSelected
                                            ? "ring-2 ring-inset ring-[#789477]"
                                            : ""
                                    } ${
                                        notification.isRead
                                            ? "bg-white dark:bg-stone-900"
                                            : "bg-[#FFF8F5] dark:bg-stone-800/70"
                                    }`}
                                >
                                    {/* Notification icon */}
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F5E9E7] text-xl dark:bg-stone-800">
                                        🔔
                                    </div>

                                    {/* Notification content */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h2 className="font-semibold text-stone-800 dark:text-stone-100">
                                                {notification.title}
                                            </h2>

                                            <span
                                                className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                    notification.isRead
                                                        ? "bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-300"
                                                        : "bg-[#F5E9E7] text-[#80545C] dark:bg-stone-700 dark:text-[#E8BFC7]"
                                                }`}
                                            >
                                                {notification.isRead
                                                    ? "Read"
                                                    : "Unread"}
                                            </span>
                                        </div>

                                        <p className="mt-1 break-words text-sm leading-6 text-stone-600 dark:text-stone-300">
                                            {notification.message}
                                        </p>

                                        <p className="mt-2 text-xs text-stone-400">
                                            {formatDate(notification.createdAt)}
                                        </p>

                                        {(notification.orderId ||
                                            notification.order) && (
                                            <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                                                Order reference:{" "}
                                                {String(
                                                    notification.orderId ||
                                                        notification.order
                                                ).slice(-8)}
                                            </p>
                                        )}

                                        {/* Toggle read/unread status */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleToggleRead(notification)
                                            }
                                            disabled={
                                                updatingId === notification._id
                                            }
                                            className="mt-3 text-sm font-semibold text-[#506B52] hover:underline disabled:cursor-wait disabled:opacity-50 dark:text-[#DCE7D6]"
                                        >
                                            {updatingId === notification._id
                                                ? "Updating..."
                                                : `Mark as ${
                                                      notification.isRead
                                                          ? "unread"
                                                          : "read"
                                                  }`}
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}

export default Notifications;

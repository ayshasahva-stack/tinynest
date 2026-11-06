
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { Bell } from "lucide-react";
import api from "../services/api";
import socket from "../realtime/socket";

import {
    selectAuthUser,
    selectIsAuthenticated,
} from "../features/auth/authSelectors";

function NotificationBell({ badgeOnly = false }) {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectAuthUser);

    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        const handleOutsideClick = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [isOpen]);
    
    const location = useLocation();
    const notificationsPath =
        user?.role === "admin" ? "/admin/notifications" : "/notifications";

    const unreadCount = notifications.filter(
        (notification) => !notification.isRead
    ).length;
    const visibleNotifications = [...notifications]
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        )
        .slice(0, 5);
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
        if (!isAuthenticated) {
            setNotifications([]);
            setIsOpen(false);
            setError("");
            return;
        }

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
                    setError("Unable to load notifications.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

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

        const handleNewNotification = (notification) => {
            if (!notification?._id) return;

            addNotification(notification);
        };

        socket.on("order:new", handleNewOrder);
        socket.on("order:statusUpdated", handleStatusUpdated);

        socket.on("notification:new", handleNewNotification);


        fetchNotifications();


        return () => {
            isMounted = false;

            socket.off("order:new", handleNewOrder);
            socket.off("order:statusUpdated", handleStatusUpdated);
            socket.off("notification:new", handleNewNotification);
        };

    }, [isAuthenticated]);
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
    const handleToggleRead = async (notification) => {
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

    const formatDate = (date) => {
        if (!date) return "Date unavailable";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Date unavailable";
        }

        return parsedDate.toLocaleString();
    };

    if (!isAuthenticated) {
        return null;
    }

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
        <div ref={dropdownRef} className="relative w-full">
            <button
                type="button"
                onClick={() => setIsOpen((previous) => !previous)}
                aria-expanded={isOpen}
                aria-label="Open notifications"
                className="flex w-full box-border items-center gap-3 rounded-lg px-4 py-3 text-left text-[#52675c] transition-colors duration-200 hover:bg-[#dce7e2] hover:text-[#263d32] dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white">
                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center dark:border-gray-600">
                    <Bell className="h-5 w-5 text-[#8fb9a5]" />

                    <span className="absolute -right-1 -top-1 rounded-full bg-[#d995a2] px-1.5 py-0.5 text-xs font-semibold text-white">
                        {unreadCount}
                    </span>
                </span>
                <span className="font-medium text-[#436558] dark:text-[#b7d0c3]">
                    Notifications
                </span>


            </button>

            {isOpen && (

                <div className="absolute left-0 z-[100] mt-3 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#e0e7e3] bg-white text-stone-800 shadow-xl dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">

                    <div className="flex items-center justify-between border-b border-[#E8E0D5] px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
                        <h2 className="font-semibold text-stone-800 dark:text-gray-100">
                            Notifications
                        </h2>
                    </div>

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
                            visibleNotifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    className={`border-b border-[#E8E0D5] px-4 py-3 last:border-b-0 dark:border-gray-700 ${notification.isRead
                                        ? "bg-white dark:bg-gray-900"
                                        : "bg-[#FFF8F5] dark:bg-gray-800"
                                        }`}
                                >
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

                    {error && notifications.length > 0 && (
                        <p
                            role="alert"
                            className="px-4 py-2 text-xs text-red-600 dark:text-red-400"
                        >
                            {error}
                        </p>
                    )}

                    {location.pathname !== "/notifications" &&
                        location.pathname !== "/admin/notifications" && (
                            <div className="border-t border-[#E8E0D5] bg-white p-3 text-center dark:border-gray-700 dark:bg-gray-900">
                                <Link
                                    to={notificationsPath}
                                    onClick={() => setIsOpen(false)}
                                    className="text-sm font-semibold text-[#506B52] hover:underline dark:text-[#a9cfbe]"
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

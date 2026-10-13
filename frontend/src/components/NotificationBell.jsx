
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import api from "../services/api";
import socket from "../realtime/Socket";
import { selectIsAuthenticated } from "../features/auth/authSelectors";

function NotificationBell() {
    const isAuthenticated = useSelector(selectIsAuthenticated);

    // Store notifications fetched from MongoDB and dropdown visibility.
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        // Clear notification data when the user logs out.
        if (!isAuthenticated) {
            setNotifications([]);
            setIsOpen(false);
            setError("");
            return;
        }

        let isMounted = true;

        // Fetch saved notifications so they survive page refreshes.
        const fetchNotifications = async () => {
            try {
                setIsLoading(true);
                setError("");

                const response = await api.get("/notifications");

                // Your API response contains notifications in data.data.
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

        // Add a newly received real-time notification to the list.
        const addNotification = (notification) => {
            setNotifications((previous) => {
                // Avoid duplicates if the notification is already present.
                const alreadyExists = previous.some(
                    (item) =>
                        item.order === notification.order ||
                        (
                            item.orderId &&
                            item.orderId === notification.orderId &&
                            item.type === notification.type
                        )
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

        // Register listeners before fetching to avoid missing new events.
        socket.on("order:new", handleNewOrder);
        socket.on("order:statusUpdated", handleStatusUpdated);

        fetchNotifications();

        // Remove listeners when the component unmounts or the user logs out.
        return () => {
            isMounted = false;
            socket.off("order:new", handleNewOrder);
            socket.off("order:statusUpdated", handleStatusUpdated);
        };
    }, [isAuthenticated]);

    // Clear all notifications from both MongoDB and the current UI.
    const handleClearAll = async () => {
        try {
            await api.delete("/notifications");
            setNotifications([]);
            setError("");
        } catch (error) {
            console.error("Failed to clear notifications:", error);
            setError("Unable to clear notifications.");
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="relative">
            {/* Bell button with the notification count. */}
            <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                aria-label={`Notifications: ${notifications.length}`}
                aria-expanded={isOpen}
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#E8E0D5] bg-white text-lg hover:bg-[#F5E9E7] dark:border-stone-700 dark:bg-stone-900 dark:hover:bg-stone-800"
            >
                <span aria-hidden="true">🔔</span>

                {notifications.length > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#D69BA5] px-1 text-xs font-bold text-white">
                        {notifications.length}
                    </span>
                )}
            </button>

            {/* Dropdown containing saved and real-time notifications. */}
            {isOpen && (
                <div className="absolute right-0 z-[60] mt-3 w-80 max-w-[90vw] overflow-hidden rounded-2xl border border-[#E8E0D5] bg-[#FFFCF7] shadow-xl dark:border-stone-700 dark:bg-stone-900">
                    <div className="flex items-center justify-between border-b border-[#E8E0D5] px-4 py-3 dark:border-stone-700">
                        <h2 className="font-semibold text-stone-800 dark:text-stone-100">
                            Notifications
                        </h2>

                        <button
                            type="button"
                            onClick={handleClearAll}
                            disabled={notifications.length === 0}
                            className="text-xs font-medium text-[#506B52] hover:underline disabled:cursor-not-allowed disabled:opacity-50 dark:text-[#DCE7D6]"
                        >
                            Clear all
                        </button>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {isLoading ? (
                            <p className="px-4 py-8 text-center text-sm text-stone-500 dark:text-stone-400">
                                Loading notifications...
                            </p>
                        ) : error ? (
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
                                    className="border-b border-[#E8E0D5] px-4 py-3 last:border-b-0 dark:border-stone-700"
                                >
                                    <p className="text-sm font-semibold text-stone-800 dark:text-stone-100">
                                        {notification.title}
                                    </p>

                                    <p className="mt-1 break-words text-sm text-stone-600 dark:text-stone-300">
                                        {notification.message}
                                    </p>

                                    <p className="mt-2 text-xs text-stone-400">
                                        Order:{" "}
                                        {String(
                                            notification.orderId ||
                                            notification.order
                                        ).slice(-8)}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default NotificationBell;

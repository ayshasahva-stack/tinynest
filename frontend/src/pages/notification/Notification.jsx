
import { useEffect, useState } from "react";
import {
    Link,
    NavLink,
    useSearchParams,
} from "react-router-dom";
import { useSelector } from "react-redux";

import api from "../../services/api";
import { selectAuthUser } from "../../features/auth/authSelectors";

// Reusable account navigation icon.
function AccountIcon({ type }) {
    const common = {
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.8,
        strokeLinecap: "round",
        strokeLinejoin: "round",
    };

    const paths = {
        overview: (
            <>
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
            </>
        ),
        orders: (
            <>
                <path d="m12 3 9 5-9 5-9-5 9-5Z" />
                <path d="m3 12 9 5 9-5" />
                <path d="m3 16 9 5 9-5" />
            </>
        ),
        addresses: (
            <>
                <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
            </>
        ),
        wishlist: (
            <path d="M20.8 8.6c0 5.4-8.8 11-8.8 11S3.2 14 3.2 8.6A4.6 4.6 0 0 1 12 6.2a4.6 4.6 0 0 1 8.8 2.4Z" />
        ),
        coupons: (
            <>
                <path d="M3 8a2 2 0 0 0 0 4v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 1 0-4V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2Z" />
                <path d="m9 14 6-6" />
                <circle cx="9" cy="8" r=".7" />
                <circle cx="15" cy="14" r=".7" />
            </>
        ),
        notifications: (
            <>
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                <path d="M10 21h4" />
            </>
        ),
    };

    return (
        <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 shrink-0"
            aria-hidden="true"
            {...common}
        >
            {paths[type]}
        </svg>
    );
}

// Same customer sidebar used throughout the account pages.
function AccountSidebar({ user }) {
    const links = [
        { to: "/profile", label: "Overview", icon: "overview" },
        { to: "/orders", label: "My Orders", icon: "orders" },
        { to: "/addresses", label: "Saved Addresses", icon: "addresses" },
        { to: "/wishlist", label: "Saved Wishlist", icon: "wishlist" },
        { to: "/coupons", label: "My Coupons", icon: "coupons" },
        {
            to: "/notifications",
            label: "Notifications",
            icon: "notifications",
        },
    ];

    return (
        <aside className="space-y-5 lg:sticky lg:top-24">
            {/* Customer profile card */}
            <div className="flex items-center gap-3 rounded-2xl bg-white p-5 shadow-sm dark:bg-gray-900">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#dcece4] text-[#436558]">
                    <svg
                        viewBox="0 0 24 24"
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        aria-hidden="true"
                    >
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 21a8 8 0 0 1 16 0" />
                    </svg>
                </div>

                <div className="min-w-0">
                    <p className="text-xs text-[#717974] dark:text-gray-400">
                        Welcome back,
                    </p>
                    <p className="mt-1 truncate font-semibold text-[#181c20] dark:text-white">
                        {user?.fullName || "TinyNest Customer"}
                    </p>
                    <p className="mt-1 text-xs text-[#436558]">
                        Little things, lots of love
                    </p>
                </div>
            </div>

            {/* Account navigation */}
            <nav
                aria-label="Account navigation"
                className="rounded-2xl bg-white p-2.5 shadow-sm dark:bg-gray-900"
            >
                {links.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end
                        className={({ isActive }) =>
                            `mb-1 flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm transition last:mb-0 ${
                                isActive
                                    ? "bg-[#dce7e2] font-semibold text-[#436558] dark:bg-emerald-950 dark:text-emerald-300"
                                    : "text-[#414845] hover:bg-[#f1f4f9] dark:text-gray-200 dark:hover:bg-gray-800"
                            }`
                        }
                    >
                        <AccountIcon type={item.icon} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Concierge card */}
            <div className="rounded-2xl bg-[#f8eeec] p-5 dark:bg-[#382925]">
                <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#8a604c] dark:text-[#e0b8a7]">
                    TinyNest Concierge
                </p>

                <h3 className="mt-2 font-serif text-xl leading-7 text-[#30231e] dark:text-white">
                    Little things, lots of love.
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#76635b] dark:text-gray-300">
                    Stay up to date with your TinyNest journey.
                </p>

                <Link
                    to="/products"
                    className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#8a604c] shadow-sm hover:bg-[#fffaf8] dark:bg-gray-900 dark:text-[#e0b8a7]"
                >
                    Explore essentials
                </Link>
            </div>
        </aside>
    );
}

// Main notifications page.
function Notifications() {
    const user = useSelector(selectAuthUser);
    const isAdmin = user?.role === "admin";

    const [searchParams] = useSearchParams();
    const selectedNotificationId = searchParams.get("notificationId");

    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);
    const [isClearing, setIsClearing] = useState(false);

    // Load notifications from the existing backend API.
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
            } catch (err) {
                console.error("Failed to fetch notifications:", err);

                if (isMounted) {
                    setError(
                        "Unable to load notifications. Please try again."
                    );
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchNotifications();

        return () => {
            isMounted = false;
        };
    }, []);

    // Keep the notification bell synchronized after reading a notification.
    const notifyBell = (notification) => {
        window.dispatchEvent(
            new CustomEvent("tinynest:notification-updated", {
                detail: notification,
            })
        );
    };

    // Toggle read/unread using the existing backend endpoint.
    const handleToggleRead = async (notification) => {
        if (updatingId || isClearing) return;

        const nextIsRead = !notification.isRead;

        try {
            setUpdatingId(notification._id);
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

            // Update the bell without requiring a page refresh.
            notifyBell(updatedNotification);
        } catch (err) {
            console.error("Failed to update notification:", err);
            setError(
                "Unable to update notification. Please try again."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    // Delete all notifications using the existing API.
    const handleClearAll = async () => {
        if (notifications.length === 0 || isClearing || updatingId) {
            return;
        }

        try {
            setIsClearing(true);
            setError("");

            await api.delete("/notifications");
            setNotifications([]);

            // Refresh the bell's unread count.
            window.dispatchEvent(
                new CustomEvent("tinynest:notifications-cleared")
            );
        } catch (err) {
            console.error("Failed to clear notifications:", err);
            setError(
                "Unable to clear notifications. Please try again."
            );
        } finally {
            setIsClearing(false);
        }
    };

    // Format dates safely.
    const formatDate = (date) => {
        if (!date) return "Date unavailable";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Date unavailable";
        }

        return parsedDate.toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const unreadCount = notifications.filter(
        (notification) => !notification.isRead
    ).length;

    return (
        <main className="min-h-screen bg-[#f7f9ff] px-4 py-7 text-[#181c20] dark:bg-gray-950 dark:text-gray-100 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-[1400px]">
                {/* Page heading */}
                <header className="mb-7 rounded-2xl bg-gradient-to-r from-white via-[#f1f4f9] to-[#e5f4ed] p-6 dark:from-gray-900 dark:via-gray-900 dark:to-emerald-950/30 sm:p-8">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#436558] dark:text-emerald-300">
                        Your TinyNest updates
                    </p>

                    <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
                        <h1 className="font-serif text-4xl font-normal tracking-tight text-[#181c20] dark:text-white sm:text-5xl">
                            {isAdmin
                                ? "Admin Notifications"
                                : "Notifications"}
                        </h1>

                        <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-[#436558] dark:bg-gray-900 dark:text-emerald-300">
                            <span className="h-2 w-2 rounded-full bg-[#436558]" />
                            {unreadCount} unread
                        </span>
                    </div>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[#626c68] dark:text-gray-300">
                        {isAdmin
                            ? "Stay informed about important TinyNest updates."
                            : "Order updates and important messages, all in one place."}
                    </p>
                </header>

                {/* Customer sidebar is only shown for customer accounts. */}
                <div
                    className={`grid items-start gap-6 ${
                        isAdmin
                            ? "grid-cols-1"
                            : "lg:grid-cols-[290px_minmax(0,1fr)]"
                    }`}
                >
                    {!isAdmin && <AccountSidebar user={user} />}

                    <section className="min-w-0 rounded-2xl bg-white p-5 shadow-sm dark:bg-gray-900 sm:p-7 lg:p-8">
                        {/* Notification section heading and actions */}
                        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#edf0f5] pb-5 dark:border-gray-800">
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#436558] dark:text-emerald-300">
                                    Your activity
                                </p>

                                <h2 className="mt-2 font-serif text-2xl text-[#181c20] dark:text-white sm:text-3xl">
                                    Recent Updates
                                </h2>

                                <p className="mt-2 text-sm text-[#626c68] dark:text-gray-400">
                                    {notifications.length} total{" "}
                                    {notifications.length === 1
                                        ? "notification"
                                        : "notifications"}
                                </p>
                            </div>

                            {isAdmin && (
                                <Link
                                    to="/admin"
                                    className="text-sm font-semibold text-[#436558] hover:underline dark:text-emerald-300"
                                >
                                    ← Admin Dashboard
                                </Link>
                            )}

                            <button
                                type="button"
                                onClick={handleClearAll}
                                disabled={
                                    notifications.length === 0 ||
                                    isLoading ||
                                    isClearing ||
                                    Boolean(updatingId)
                                }
                                className="rounded-lg border border-[#dfe4e1] px-4 py-2.5 text-sm font-semibold text-[#436558] transition hover:bg-[#e5f4ed] disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-emerald-300 dark:hover:bg-emerald-950"
                            >
                                {isClearing ? "Clearing..." : "Clear All"}
                            </button>
                        </div>

                        {/* API error */}
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
                            <div className="flex min-h-64 flex-col items-center justify-center rounded-xl bg-[#f7f9ff] dark:bg-gray-800">
                                <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#dce7e2] border-t-[#436558]" />
                                <p className="mt-4 text-sm text-[#626c68] dark:text-gray-400">
                                    Loading your notifications...
                                </p>
                            </div>
                        ) : notifications.length === 0 ? (
                            /* Empty state */
                            <div className="flex min-h-72 flex-col items-center justify-center rounded-xl bg-[#f7f9ff] px-5 py-10 text-center dark:bg-gray-800">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#dce7e2] text-[#436558] dark:bg-emerald-950 dark:text-emerald-300">
                                    <AccountIcon type="notifications" />
                                </div>

                                <h3 className="mt-5 font-serif text-2xl text-[#181c20] dark:text-white">
                                    You're all caught up
                                </h3>

                                <p className="mt-2 max-w-sm text-sm leading-6 text-[#626c68] dark:text-gray-400">
                                    You don't have any notifications yet.
                                    New updates will appear here when they
                                    arrive.
                                </p>

                                {!isAdmin && (
                                    <Link
                                        to="/orders"
                                        className="mt-5 rounded-lg bg-[#436558] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#315447]"
                                    >
                                        View My Orders
                                    </Link>
                                )}
                            </div>
                        ) : (
                            /* Notification cards */
                            <div className="space-y-4">
                                {notifications.map((notification) => {
                                    const isSelected =
                                        notification._id ===
                                        selectedNotificationId;

                                    return (
                                        <article
                                            key={notification._id}
                                            id={`notification-${notification._id}`}
                                            className={`relative overflow-hidden rounded-xl border p-4 transition sm:p-5 ${
                                                isSelected
                                                    ? "border-[#436558] ring-2 ring-[#dce7e2] dark:ring-emerald-950"
                                                    : "border-[#edf0f5] dark:border-gray-800"
                                            } ${
                                                notification.isRead
                                                    ? "bg-white dark:bg-gray-900"
                                                    : "bg-[#f3f8f5] dark:bg-emerald-950/20"
                                            }`}
                                        >
                                            {/* Unread indicator */}
                                            {!notification.isRead && (
                                                <span className="absolute bottom-0 left-0 top-0 w-1 bg-[#436558]" />
                                            )}

                                            <div className="flex items-start gap-3 sm:gap-4">
                                                {/* Notification icon */}
                                                <div
                                                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                                                        notification.isRead
                                                            ? "bg-[#f1f4f9] text-[#626c68] dark:bg-gray-800 dark:text-gray-300"
                                                            : "bg-[#dce7e2] text-[#436558] dark:bg-emerald-950 dark:text-emerald-300"
                                                    }`}
                                                >
                                                    <AccountIcon type="notifications" />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-start justify-between gap-2">
                                                        <h3 className="break-words font-semibold text-[#181c20] dark:text-white">
                                                            {notification.title}
                                                        </h3>

                                                        <span
                                                            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                                                                notification.isRead
                                                                    ? "bg-[#f1f4f9] text-[#626c68] dark:bg-gray-800 dark:text-gray-300"
                                                                    : "bg-[#dce7e2] text-[#315e4d] dark:bg-emerald-950 dark:text-emerald-300"
                                                            }`}
                                                        >
                                                            {notification.isRead
                                                                ? "Read"
                                                                : "Unread"}
                                                        </span>
                                                    </div>

                                                    <p className="mt-2 break-words text-sm leading-6 text-[#626c68] dark:text-gray-300">
                                                        {notification.message}
                                                    </p>

                                                    <p className="mt-3 text-xs text-[#717974] dark:text-gray-400">
                                                        {formatDate(
                                                            notification.createdAt
                                                        )}
                                                    </p>

                                                    {(notification.orderId ||
                                                        notification.order) && (
                                                        <p className="mt-1 text-xs text-[#717974] dark:text-gray-400">
                                                            Order reference:{" "}
                                                            {String(
                                                                notification.orderId ||
                                                                    notification.order
                                                            ).slice(-8)}
                                                        </p>
                                                    )}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleToggleRead(
                                                                notification
                                                            )
                                                        }
                                                        disabled={
                                                            Boolean(updatingId) ||
                                                            isClearing
                                                        }
                                                        className="mt-3 text-sm font-semibold text-[#436558] transition hover:underline disabled:cursor-wait disabled:opacity-50 dark:text-emerald-300"
                                                    >
                                                        {updatingId ===
                                                        notification._id
                                                            ? "Updating..."
                                                            : `Mark as ${
                                                                  notification.isRead
                                                                      ? "unread"
                                                                      : "read"
                                                              }`}
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
}

export default Notifications;

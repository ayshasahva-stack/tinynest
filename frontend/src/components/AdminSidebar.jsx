
import { Link, NavLink } from "react-router-dom";

// Existing notification component.
import NotificationBell from "./NotificationBell";

// Sidebar used by all admin pages.
function AdminSidebar() {
    // Reusable styling keeps all navigation links consistent.
    const navLinkClass = ({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
            isActive
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
        }`;

    return (
        <aside
            className="
                fixed left-0 top-0 z-40
                flex h-screen w-64 flex-col
                border-r border-gray-200
                bg-white p-5
                dark:border-gray-700 dark:bg-gray-800
            "
        >
            {/* Admin logo and panel title */}
            <div className="mb-6">
                <h2
                    className="
                        text-2xl font-bold
                        text-gray-900 dark:text-white
                    "
                >
                    TinyNest
                </h2>

                <p
                    className="
                        text-sm text-gray-500
                        dark:text-gray-400
                    "
                >
                    Admin Panel
                </p>
            </div>

            {/* Admin notifications remain in the sidebar. */}
            <div
                className="
                    mb-6 flex items-center justify-between
                    rounded-lg border border-gray-200
                    p-3 dark:border-gray-700
                "
            >
                <span
                    className="
                        text-sm font-medium
                        text-gray-700 dark:text-gray-200
                    "
                >
                    Notifications
                </span>

                <NotificationBell />
            </div>

            {/* Admin navigation links */}
            <nav className="flex-1 space-y-2 overflow-y-auto">
                {/* Dashboard */}
                <NavLink
                    to="/admin"
                    end
                    className={navLinkClass}
                >
                    <span aria-hidden="true">📊</span>
                    <span>Dashboard</span>
                </NavLink>

                {/* Products */}
                <NavLink
                    to="/admin/products"
                    className={navLinkClass}
                >
                    <span aria-hidden="true">📦</span>
                    <span>Products</span>
                </NavLink>

                {/* Orders */}
                <NavLink
                    to="/admin/orders"
                    className={navLinkClass}
                >
                    <span aria-hidden="true">🛒</span>
                    <span>Orders</span>
                </NavLink>

                {/* Baby kits */}
                <NavLink
                    to="/admin/kits"
                    className={navLinkClass}
                >
                    <span aria-hidden="true">🧸</span>
                    <span>Kits</span>
                </NavLink>

                {/* Coupons */}
                <NavLink
                    to="/admin/coupons"
                    className={navLinkClass}
                >
                    <span aria-hidden="true">🎟️</span>
                    <span>Coupons</span>
                </NavLink>

                {/* Users */}
                <NavLink
                    to="/admin/users"
                    className={navLinkClass}
                >
                    <span aria-hidden="true">👥</span>
                    <span>Users</span>
                </NavLink>

                {/* Reviews and ratings */}
                <NavLink
                    to="/admin/reviews"
                    className={navLinkClass}
                >
                    <span aria-hidden="true">⭐</span>
                    <span>Reviews &amp; Ratings</span>
                </NavLink>

                {/* Shared admin profile management page */}
                <NavLink
                    to="/admin/profile"
                    className={navLinkClass}
                >
                    <span aria-hidden="true">👤</span>
                    <span>My Profile</span>
                </NavLink>
            </nav>
        </aside>
    );
}

export default AdminSidebar;

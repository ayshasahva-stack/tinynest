
// Link is used for navigation between admin pages.
import { Link, NavLink } from "react-router-dom";

// Existing notification component.
import NotificationBell from "./NotificationBell";

// Sidebar used by all admin pages.
function AdminSidebar() {
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
            {/* Admin logo/title */}
            <div className="mb-6">
                <h2 className="
                    text-2xl font-bold
                    text-gray-900 dark:text-white
                ">
                    TinyNest
                </h2>

                <p className="
                    text-sm text-gray-500
                    dark:text-gray-400
                ">
                    Admin Panel
                </p>
            </div>

            {/* Admin notifications */}
            <div className="
                mb-6 flex items-center justify-between
                rounded-lg border border-gray-200
                p-3 dark:border-gray-700
            ">
                <span className="
                    text-sm font-medium
                    text-gray-700 dark:text-gray-200
                ">
                    Notifications
                </span>

                {/* Bell opens the notification list */}
                <NotificationBell />
            </div>

            {/* Admin navigation */}
            <nav className="flex-1 space-y-2 overflow-y-auto">

                <Link
                    to="/admin"
                    className="
                        block rounded-lg px-4 py-3
                        text-gray-700 transition
                        hover:bg-gray-100
                        dark:text-gray-200 dark:hover:bg-gray-700
                    "
                >
                    Dashboard
                </Link>

                <Link
                    to="/admin/products"
                    className="
                        block rounded-lg px-4 py-3
                        text-gray-700 transition
                        hover:bg-gray-100
                        dark:text-gray-200 dark:hover:bg-gray-700
                    "
                >
                    Products
                </Link>

                <Link
                    to="/admin/orders"
                    className="
                        block rounded-lg px-4 py-3
                        text-gray-700 transition
                        hover:bg-gray-100
                        dark:text-gray-200 dark:hover:bg-gray-700
                    "
                >
                    Orders
                </Link>

                <Link
                    to="/admin/kits"
                    className="
                        block rounded-lg px-4 py-3
                        text-gray-700 transition
                        hover:bg-gray-100
                        dark:text-gray-200 dark:hover:bg-gray-700
                    "
                >
                    Kits
                </Link>

                <NavLink
                    to="/admin/coupons"
                    className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                            isActive
                                ? "bg-blue-600 text-white"
                                : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                        }`
                    }
                >
                    <span>🎟️</span>
                    <span>Coupons</span>
                </NavLink>

                <NavLink
                    to="/admin/users"
                    className={({ isActive }) =>
                        `block rounded-lg px-4 py-3 transition ${
                            isActive
                                ? "bg-blue-600 text-white"
                                : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                        }`
                    }
                >
                    Users
                </NavLink>

                <NavLink
                    to="/admin/reviews"
                    className={({ isActive }) =>
                        `block rounded-lg px-4 py-3 transition ${
                            isActive
                                ? "bg-blue-600 text-white"
                                : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                        }`
                    }
                >
                    Reviews & Ratings
                </NavLink>
            </nav>
        </aside>
    );
}

export default AdminSidebar;
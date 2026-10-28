
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
    LayoutDashboard,
    Package,
    Tags,
    ShoppingBag,
    Gift,
    TicketPercent,
    Wallet,
    UsersRound,
    Star,
    LogOut,
} from "lucide-react";

import { logout } from "../features/auth/authSlice";
import NotificationBell from "./NotificationBell";

// Shared sidebar for all admin pages.
function AdminSidebar() {
    // Preserve the existing routes and active-link behavior.
    const navLinkClass = ({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-200 ${
            isActive
                ? "bg-[#7a9e8f] font-medium text-[#203d32]"
                : "text-[#414845] hover:bg-[#e3e9e6]"
        }`;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Clear the Redux authentication state and return to login.
    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
    };

    return (
        <aside
            className="
                fixed inset-y-0 left-0 z-40
                flex h-screen w-64 flex-col
                overflow-visible
                bg-[#f1f4f9] px-2 py-4
            "
        >
            {/* TinyNest brand */}
            <div className="mb-5 flex items-center justify-between px-2">
                <Link to="/admin" className="flex items-center gap-2">
                    <span>
                        <span className="block font-serif text-xl leading-6 text-[#436558]">
                            TinyNest
                        </span>

                        <span className="block text-[10px] uppercase tracking-wider text-[#626c68]">
                            Admin Core
                        </span>
                    </span>
                </Link>
            </div>

            {/* Notifications */}
            <div
                className="
                    relative z-50 mb-4
                    flex shrink-0 items-center justify-between
                    overflow-visible
                    rounded-lg border border-[#e0e3e8]
                    bg-white px-3 py-3
                "
            >
                <span className="text-sm font-medium text-[#414845]">
                    Notifications
                </span>

                {/* Keep the existing notification behavior. */}
                <div className="relative z-[60] shrink-0">
                    <NotificationBell />
                </div>
            </div>

            {/* Navigation: existing routes preserved */}
            <nav className="relative z-0 flex-1 space-y-1 overflow-y-auto">
                <NavLink to="/admin" end className={navLinkClass}>
                    <LayoutDashboard
                        size={18}
                        strokeWidth={1.7}
                        aria-hidden="true"
                    />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink to="/admin/products" className={navLinkClass}>
                    <Package
                        size={18}
                        strokeWidth={1.7}
                        aria-hidden="true"
                    />
                    <span>Products</span>
                </NavLink>

                <NavLink to="/admin/categories" className={navLinkClass}>
                    <Tags
                        size={18}
                        strokeWidth={1.7}
                        aria-hidden="true"
                    />
                    <span>Categories</span>
                </NavLink>

                <NavLink to="/admin/orders" className={navLinkClass}>
                    <ShoppingBag
                        size={18}
                        strokeWidth={1.7}
                        aria-hidden="true"
                    />
                    <span>Orders</span>
                </NavLink>

                <NavLink to="/admin/kits" className={navLinkClass}>
                    <Gift
                        size={18}
                        strokeWidth={1.7}
                        aria-hidden="true"
                    />
                    <span>Kits</span>
                </NavLink>

                <NavLink to="/admin/coupons" className={navLinkClass}>
                    <TicketPercent
                        size={18}
                        strokeWidth={1.7}
                        aria-hidden="true"
                    />
                    <span>Coupons</span>
                </NavLink>

                <NavLink to="/admin/refunds" className={navLinkClass}>
                    <Wallet
                        size={18}
                        strokeWidth={1.7}
                        aria-hidden="true"
                    />
                    <span>Refunds</span>
                </NavLink>

                <NavLink to="/admin/users" className={navLinkClass}>
                    <UsersRound
                        size={18}
                        strokeWidth={1.7}
                        aria-hidden="true"
                    />
                    <span>Users</span>
                </NavLink>

                <NavLink to="/admin/reviews" className={navLinkClass}>
                    <Star
                        size={18}
                        strokeWidth={1.7}
                        aria-hidden="true"
                    />
                    <span>Reviews &amp; Ratings</span>
                </NavLink>

                {/* Logout button stays at the bottom of the sidebar. */}
                <div className="mt-3 border-t border-[#dce7e2] pt-3">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-800"
                    >
                        <LogOut
                            size={18}
                            strokeWidth={1.7}
                            aria-hidden="true"
                        />
                        Logout
                    </button>
                </div>
            </nav>
        </aside>
    );
}

export default AdminSidebar;


import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { useTheme } from "../app/ThemeContext";

import {
    selectIsAuthenticated,
    selectAuthUser,
} from "../features/auth/authSelectors";
import { logout } from "../features/auth/authSlice";
import { clearCart } from "../features/cart/cartSlice";

import { selectCartItemCount } from "../features/cart/cartSelectors";
import { selectWishlistCount } from "../features/wishlist/wishlistSelectors";

import { getMyWishlistThunk } from "../features/wishlist/wishlistThunk";
import { getMyCartThunk } from "../features/cart/cartThunk";

import NotificationBell from "./NotificationBell";

function Navbar() {
    // Control the mobile menu and desktop account dropdown.
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

    const { theme, toggleTheme } = useTheme();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Read existing authentication and shopping information from Redux.
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectAuthUser);
    const cartItemCount = useSelector(selectCartItemCount);
    const wishlistCount = useSelector(selectWishlistCount);

    // Load the customer's cart and wishlist after authentication.
    useEffect(() => {
        if (isAuthenticated) {
            dispatch(getMyWishlistThunk());
            dispatch(getMyCartThunk());
        }
    }, [dispatch, isAuthenticated]);

    // Close both menus when the user changes pages.
    useEffect(() => {
        setIsMenuOpen(false);
        setIsAccountMenuOpen(false);
    }, [location.pathname]);

    // Keep the existing logout functionality.
    const handleLogout = () => {
        dispatch(logout());
        setIsMenuOpen(false);
        dispatch(clearCart());
        setIsAccountMenuOpen(false);
        navigate("/login");
    };

    // Desktop navigation link styling.
    const linkClass = ({ isActive }) =>
        `rounded-full px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${isActive
            ? "bg-[#DCE8E1] text-[#2B4D41] dark:bg-[#344638] dark:text-[#E2EBDD]"
            : "text-[#414845] hover:bg-[#EBEEF3] hover:text-[#436558] dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
        }`;

    // Mobile links occupy the full width to prevent horizontal wrapping.
    const mobileLinkClass = ({ isActive }) =>
        `block w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors ${isActive
            ? "bg-[#DCE8E1] text-[#2B4D41] dark:bg-[#344638] dark:text-[#E2EBDD]"
            : "text-[#414845] hover:bg-[#EBEEF3] dark:text-gray-300 dark:hover:bg-gray-800"
        }`;

    // Shared styling for account menu links.
    const accountLinkClass =
        "flex w-full items-center gap-3 px-5 py-3 text-sm text-[#414845] transition-colors hover:bg-[#EBEEF3] hover:text-[#436558] dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white";

    // Display a friendly account name.
    const accountName =
        user?.fullName ||
        user?.email?.split("@")[0] ||
        "My Account";

    // Reuse the theme toggle in the desktop and mobile account menus.
    const renderThemeToggle = () => (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"
                } mode`}
            aria-pressed={theme === "dark"}
            className="flex w-full items-center justify-between px-5 py-3 text-sm text-[#414845] transition-colors hover:bg-[#EBEEF3] dark:text-gray-300 dark:hover:bg-gray-800"
        >
            <span className="flex items-center gap-3">
                <span aria-hidden="true">
                    {theme === "light" ? "🌙" : "☀️"}
                </span>
                Theme
            </span>

            <span className="text-xs text-gray-500 dark:text-gray-400">
                {theme === "light" ? "Light mode" : "Dark mode"}
            </span>
        </button>
    );

    // Keep existing customer account routes and notification badge.
    const renderAccountLinks = () => (
        <>
            <Link to="/profile" className={accountLinkClass}>
                <span aria-hidden="true">👤</span>
                My Profile
            </Link>

            <Link to="/orders" className={accountLinkClass}>
                <span aria-hidden="true">📦</span>
                My Orders
            </Link>

            <Link to="/addresses" className={accountLinkClass}>
                <span aria-hidden="true">📍</span>
                Saved Addresses
            </Link>

            <Link to="/wishlist" className={accountLinkClass}>
                <span aria-hidden="true">♡</span>
                Wishlist

                {wishlistCount > 0 && (
                    <span className="ml-auto rounded-full bg-[#DCE8E1] px-2 py-0.5 text-xs font-semibold text-[#2B4D41] dark:bg-[#344638] dark:text-[#E2EBDD]">
                        {wishlistCount}
                    </span>
                )}
            </Link>

            <Link to="/coupons" className={accountLinkClass}>
                <span aria-hidden="true">🎟️</span>
                My Coupons
            </Link>

            <Link to="/notifications" className={accountLinkClass}>
                <span aria-hidden="true">🔔</span>
                <span>Notifications</span>
                <NotificationBell badgeOnly />
            </Link>

            <Link to="/refunds" className={accountLinkClass}>
                <span aria-hidden="true">↩</span>
                My Refunds
            </Link>
        </>
    );

    return (
        <header className="sticky top-0 z-50 border-b border-[#E0E4E8] bg-[#F7F9FF]/95 shadow-[0_2px_12px_rgba(35,50,45,0.04)] backdrop-blur-xl transition-colors duration-300 dark:border-gray-800 dark:bg-gray-950/95">

            <nav
                className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10"
                aria-label="Main navigation"
            >
                {/* Main navbar row. */}
                <div className="flex min-h-[76px] items-center justify-between gap-3 sm:gap-5">

                    {/* Brand logo. */}
                    <Link
                        to="/"
                        aria-label="TinyNest home"
                        className="shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#668875]"
                    >
                        <span className="block font-serif text-2xl font-medium tracking-tight text-[#252A28] dark:text-white sm:text-3xl">
                            TinyNest
                            <span className="text-[#668875] dark:text-[#B5D0AC]">
                                .
                            </span>
                        </span>

                        <span className="hidden text-[9px] font-medium uppercase tracking-[0.18em] text-[#68716D] dark:text-gray-400 sm:block">
                            Little things, lots of love
                        </span>
                    </Link>

                    {/* Desktop shopping links. */}
                    <div className="hidden items-center gap-1 lg:flex">
                        <NavLink to="/" end className={linkClass}>
                            Home
                        </NavLink>

                        <NavLink to="/products" className={linkClass}>
                            Shop
                        </NavLink>

                        <NavLink to="/kits" className={linkClass}>
                            Baby Kits
                        </NavLink>



                        <NavLink to="/cart" className={linkClass}>
                            Cart

                            {cartItemCount > 0 && (
                                <span className="ml-2 rounded-full bg-[#436558] px-2 py-0.5 text-xs font-semibold text-white dark:bg-[#B5D0AC] dark:text-gray-900">
                                    {cartItemCount}
                                </span>
                            )}
                        </NavLink>
                    </div>

                    {/* Desktop account actions. */}
                    <div className="hidden items-center gap-2 md:flex">
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsAccountMenuOpen((open) => !open)
                                    }
                                    aria-expanded={isAccountMenuOpen}
                                    aria-haspopup="true"
                                    className="flex max-w-56 items-center gap-2 rounded-full px-3 py-2.5 text-sm font-semibold text-[#414845] transition-colors hover:bg-[#EBEEF3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#668875] dark:text-gray-200 dark:hover:bg-gray-800"
                                >
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#DCE8E1] text-lg text-[#2B4D41] dark:bg-[#344638] dark:text-[#E2EBDD]">
                                        👤
                                    </span>

                                    <span className="max-w-32 truncate">
                                        {accountName}
                                    </span>

                                    <span aria-hidden="true">
                                        {isAccountMenuOpen ? "⌃" : "⌄"}
                                    </span>
                                </button>

                                {/* Desktop account dropdown. */}
                                <div
                                    className={`absolute right-0 top-full z-50 mt-3 w-72 overflow-hidden rounded-2xl border border-[#E0E4E8] bg-white py-2 shadow-xl dark:border-gray-700 dark:bg-gray-900 ${isAccountMenuOpen ? "block" : "hidden"
                                        }`}
                                >
                                    <div className="border-b border-[#E0E4E8] px-5 py-3 dark:border-gray-700">
                                        <p className="font-semibold text-[#252A28] dark:text-white">
                                            Your Account
                                        </p>

                                        <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
                                            {user?.email || "Manage your account"}
                                        </p>
                                    </div>

                                    {renderAccountLinks()}

                                    <div className="border-t border-[#E0E4E8] pt-1 dark:border-gray-700">
                                        {renderThemeToggle()}

                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-800"
                                        >
                                            <span aria-hidden="true">↪</span>
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <NavLink
                                    to="/login"
                                    className="rounded-full px-4 py-2 text-sm font-medium text-[#414845] transition-colors hover:text-[#436558] dark:text-gray-300 dark:hover:text-white"
                                >
                                    Login
                                </NavLink>

                                <NavLink
                                    to="/register"
                                    className="rounded-full bg-[#436558] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#345347] dark:bg-[#B5D0AC] dark:text-gray-900 dark:hover:bg-[#C5EBDA]"
                                >
                                    Sign up
                                </NavLink>
                            </>
                        )}
                    </div>

                    {/* Mobile menu toggle. */}
                    <div className="flex items-center gap-2 md:hidden">
                        <button
                            type="button"
                            onClick={() => setIsMenuOpen((open) => !open)}
                            aria-expanded={isMenuOpen}
                            aria-controls="mobile-navigation"
                            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DCE8E1] text-xl text-[#2B4D41] transition-colors hover:bg-[#C5D9CE] dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                        >
                            {isMenuOpen ? "×" : "☰"}
                        </button>
                    </div>
                </div>

                {/* Mobile dropdown: overlays the page and scrolls independently. */}
                {isMenuOpen && (
                    <div
                        id="mobile-navigation"
                        className="absolute left-0 right-0 top-[76px] z-50 max-h-[calc(100dvh-108px)] space-y-2 overflow-y-auto overscroll-contain rounded-b-2xl border-t border-[#E0E4E8] bg-[#F7F9FF] px-4 py-4 shadow-xl dark:border-gray-800 dark:bg-gray-950 md:hidden"
                    >
                        {/* Each main navigation link uses its own row. */}
                        <NavLink
                            to="/"
                            end
                            className={mobileLinkClass}
                        >
                            Home
                        </NavLink>

                        <NavLink
                            to="/products"
                            className={mobileLinkClass}
                        >
                            Shop
                        </NavLink>

                        <NavLink
                            to="/kits"
                            className={mobileLinkClass}
                        >
                            Baby Kits
                        </NavLink>



                        <NavLink
                            to="/cart"
                            className={mobileLinkClass}
                        >
                            <span className="flex items-center justify-between">
                                Cart
                                {cartItemCount > 0 && (
                                    <span className="rounded-full bg-[#436558] px-2 py-0.5 text-xs font-semibold text-white dark:bg-[#B5D0AC] dark:text-gray-900">
                                        {cartItemCount}
                                    </span>
                                )}
                            </span>
                        </NavLink>

                        {isAuthenticated ? (
                            <div className="mt-3 border-t border-[#E0E4E8] pt-3 dark:border-gray-800">
                                {/* Account details. */}
                                <div className="px-4 py-3">
                                    <p className="font-semibold text-[#252A28] dark:text-white">
                                        Your Account
                                    </p>

                                    <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
                                        {user?.email}
                                    </p>
                                </div>

                                {renderAccountLinks()}

                                <div className="mt-2 border-t border-[#E0E4E8] pt-1 dark:border-gray-800">
                                    {renderThemeToggle()}

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-800"
                                    >
                                        <span aria-hidden="true">↪</span>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-3 flex gap-3 border-t border-[#E0E4E8] pt-4 dark:border-gray-800">
                                <Link
                                    to="/login"
                                    className="flex-1 rounded-full border border-[#D5DDE0] px-4 py-3 text-center text-sm font-medium text-[#414845] transition-colors hover:bg-[#EBEEF3] dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    className="flex-1 rounded-full bg-[#436558] px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#345347] dark:bg-[#B5D0AC] dark:text-gray-900"
                                >
                                    Sign up
                                </Link>

                                {renderThemeToggle()}
                            </div>
                        )}
                    </div>
                )}
            </nav>
        </header>
    );
}

export default Navbar;


import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { useTheme } from "../app/ThemeContext";
import {
    selectIsAuthenticated,
    selectAuthUser,
} from "../features/auth/authSelectors";
import { logout } from "../features/auth/authSlice";

import { selectCartItemCount } from "../features/cart/cartSelectors";
import { selectWishlistCount } from "../features/wishlist/wishlistSelectors";
import { getMyWishlistThunk } from "../features/wishlist/wishlistThunk";
import { getMyCartThunk } from "../features/cart/cartThunk";

import NotificationBell from "./NotificationBell";

function Navbar() {
    // Controls the mobile navigation and account dropdown.
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

    const { theme, toggleTheme } = useTheme();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Read existing authentication and shopping state from Redux.
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectAuthUser);
    const cartItemCount = useSelector(selectCartItemCount);
    const wishlistCount = useSelector(selectWishlistCount);

    // Fetch cart and wishlist data for signed-in customers.
    useEffect(() => {
        if (isAuthenticated) {
            dispatch(getMyWishlistThunk());
            dispatch(getMyCartThunk());
        }
    }, [dispatch, isAuthenticated]);

    // Close menus after navigating to another page.
    useEffect(() => {
        setIsMenuOpen(false);
        setIsAccountMenuOpen(false);
    }, [location.pathname]);

    // Use the existing Redux logout action.
    const handleLogout = () => {
        dispatch(logout());
        setIsMenuOpen(false);
        setIsAccountMenuOpen(false);
        navigate("/login");
    };

    // Shared styling for active navigation links.
    const linkClass = ({ isActive }) =>
        `rounded-full px-4 py-2 text-sm font-medium transition-colors ${isActive
            ? "bg-[#E1E9DC] text-[#3F5B43] dark:bg-[#344638] dark:text-[#E2EBDD]"
            : "text-stone-700 hover:bg-[#F5E9E7] hover:text-[#80545C] dark:text-stone-200 dark:hover:bg-stone-800 dark:hover:text-[#E8BFC7]"
        }`;

    // Shared styling for account dropdown links.
    const accountLinkClass =
        "flex w-full items-center gap-3 px-5 py-3 text-sm text-stone-700 transition hover:bg-[#E1E9DC] hover:text-[#405B43] dark:text-stone-200 dark:hover:bg-stone-800";

    // Display the customer's name when available.
    const accountName =
        user?.fullName ||
        user?.email?.split("@")[0] ||
        "My Account";

    // Theme toggle reused in the desktop and mobile account menus.
    const renderThemeToggle = () => (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"
                } mode`}
            aria-pressed={theme === "dark"}
            className="flex w-full items-center justify-between px-5 py-3 text-sm text-stone-700 transition hover:bg-[#E1E9DC] dark:text-stone-200 dark:hover:bg-stone-800"
        >
            <span className="flex items-center gap-3">
                <span aria-hidden="true">
                    {theme === "light" ? "🌙" : "☀️"}
                </span>
                Theme
            </span>

            <span className="text-xs text-stone-500 dark:text-stone-400">
                {theme === "light" ? "Light mode" : "Dark mode"}
            </span>
        </button>
    );

    // Account links shared by desktop and mobile menus.
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
                    <span className="ml-auto rounded-full bg-[#EED5D9] px-2 py-0.5 text-xs text-[#754750] dark:bg-[#5B3941] dark:text-[#F5DDE1]">
                        {wishlistCount}
                    </span>
                )}
            </Link>

            {/* Customer coupons page */}
            <Link to="/coupons" className={accountLinkClass}>
                <span aria-hidden="true">🎟️</span>
                <span>My Coupons</span>
            </Link>


            <Link
                to="/notifications"
                className={accountLinkClass}
            >
                <span aria-hidden="true">🔔</span>

                <span>Notifications</span>

                {/* Show the unread count like the Wishlist badge. */}
                <NotificationBell badgeOnly />
            </Link>

            <Link to="/refunds" className={accountLinkClass}>
                <span aria-hidden="true">↩</span>
                My Refunds
            </Link>
        </>
    );

    return (
        <header className="sticky top-0 z-50 border-b border-[#E8E0D5] bg-[#FFFCF7]/95 shadow-sm backdrop-blur-md dark:border-stone-700 dark:bg-stone-950/95">
            <nav
                className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
                aria-label="Main navigation"
            >
                <div className="flex min-h-[76px] items-center justify-between gap-4">
                    {/* Brand and homepage link. */}
                    <Link
                        to="/"
                        aria-label="TinyNest home"
                        className="shrink-0 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#789477]"
                    >
                        <span className="block text-2xl font-bold tracking-tight text-[#405B43] dark:text-[#D9E6D4]">
                            TinyNest<span className="text-[#D69BA5]">.</span>
                        </span>

                        <span className="hidden text-[10px] font-medium uppercase tracking-[0.19em] text-stone-500 sm:block dark:text-stone-400">
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
                                <span className="ml-2 rounded-full bg-[#DCE7D6] px-2 py-0.5 text-xs text-[#405B43] dark:bg-[#344638] dark:text-[#E2EBDD]">
                                    {cartItemCount}
                                </span>
                            )}
                        </NavLink>
                    </div>

                    {/* Desktop account actions: no standalone bell or theme button. */}
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
                                    className="flex max-w-56 items-center gap-2 rounded-full px-3 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-[#F5E9E7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#789477] dark:text-stone-200 dark:hover:bg-stone-800"
                                >
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E1E9DC] text-lg text-[#405B43] dark:bg-[#344638] dark:text-[#E2EBDD]">
                                        👤
                                    </span>

                                    <span className="max-w-32 truncate">
                                        {accountName}
                                    </span>

                                    <span aria-hidden="true">
                                        {isAccountMenuOpen ? "⌃" : "⌄"}
                                    </span>
                                </button>

                                {/* Keep the dropdown mounted so notifications load in advance. */}
                                <div
                                    className={`absolute right-0 top-full z-50 mt-3 w-72 overflow-hidden rounded-2xl border border-[#E8E0D5] bg-[#FFFCF7] py-2 shadow-xl dark:border-stone-700 dark:bg-stone-900 ${isAccountMenuOpen ? "block" : "hidden"
                                        }`}
                                >
                                    {/* Account heading. */}
                                    <div className="border-b border-[#E8E0D5] px-5 py-3 dark:border-stone-700">
                                        <p className="font-semibold text-stone-900 dark:text-white">
                                            Your Account
                                        </p>

                                        <p className="mt-1 truncate text-xs text-stone-500 dark:text-stone-400">
                                            {user?.email || "Manage your account"}
                                        </p>
                                    </div>

                                    {renderAccountLinks()}


                                    <div className="border-t border-[#E8E0D5] pt-1 dark:border-stone-700">
                                        {renderThemeToggle()}

                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-stone-800"
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
                                    className="rounded-full px-4 py-2 text-sm font-medium text-stone-700 transition hover:text-[#405B43] dark:text-stone-200 dark:hover:text-white"
                                >
                                    Login
                                </NavLink>

                                <NavLink
                                    to="/register"
                                    className="rounded-full bg-[#506B52] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3F5941] dark:bg-[#DCE7D6] dark:text-stone-900 dark:hover:bg-white"
                                >
                                    Sign up
                                </NavLink>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button only; no separate bell or theme button. */}
                    <div className="flex items-center gap-2 md:hidden">
                        <button
                            type="button"
                            onClick={() => setIsMenuOpen((open) => !open)}
                            aria-expanded={isMenuOpen}
                            aria-controls="mobile-navigation"
                            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E1E9DC] text-xl text-[#405B43] dark:bg-stone-800 dark:text-white"
                        >
                            {isMenuOpen ? "×" : "☰"}
                        </button>
                    </div>
                </div>

                {/* Responsive mobile navigation. */}
                {isMenuOpen && (
                    <div
                        id="mobile-navigation"
                        className="space-y-2 border-t border-[#E8E0D5] py-4 dark:border-stone-700 md:hidden"
                    >
                        <NavLink to="/" end className={linkClass}>
                            Home
                        </NavLink>

                        <NavLink to="/products" className={linkClass}>
                            Shop
                        </NavLink>

                        <NavLink to="/kits" className={linkClass}>
                            Baby Kits
                        </NavLink>

                        <NavLink to="/wishlist" className={linkClass}>
                            Wishlist
                            {wishlistCount > 0 && ` (${wishlistCount})`}
                        </NavLink>

                        <NavLink to="/cart" className={linkClass}>
                            Cart
                            {cartItemCount > 0 && ` (${cartItemCount})`}
                        </NavLink>

                        {isAuthenticated ? (
                            <div className="border-t border-[#E8E0D5] pt-3 dark:border-stone-700">
                                <div className="px-4 py-2">
                                    <p className="font-semibold text-stone-900 dark:text-white">
                                        Your Account
                                    </p>
                                    <p className="mt-1 truncate text-xs text-stone-500 dark:text-stone-400">
                                        {user?.email}
                                    </p>
                                </div>

                                {/* Notification control lives in the account section. */}
                                <div className="flex items-center justify-between px-5 py-2">
                                    <span className="text-sm text-stone-700 dark:text-stone-200">
                                        Notification alerts
                                    </span>
                                    <NotificationBell />
                                </div>

                                {renderAccountLinks()}

                                <div className="mt-2 border-t border-[#E8E0D5] pt-1 dark:border-stone-700">
                                    {renderThemeToggle()}

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm text-red-600 dark:text-red-400"
                                    >
                                        <span aria-hidden="true">↪</span>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-3 border-t border-[#E8E0D5] pt-3 dark:border-stone-700">
                                <Link
                                    to="/login"
                                    className="rounded-full border border-[#D9D0C5] px-5 py-2.5 text-sm font-medium dark:border-stone-600"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    className="rounded-full bg-[#506B52] px-5 py-2.5 text-sm font-semibold text-white dark:bg-[#DCE7D6] dark:text-stone-900"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </nav>
        </header>
    );
}

export default Navbar;

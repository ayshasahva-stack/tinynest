
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { useTheme } from "../app/ThemeContext";
import { selectIsAuthenticated } from "../features/auth/authSelectors";
import { logout } from "../features/auth/authSlice";
import { selectCartItemCount } from "../features/cart/cartSelectors";
import { selectWishlistCount } from "../features/wishlist/wishlistSelectors";
import { getMyWishlistThunk } from "../features/wishlist/wishlistThunk";
import { getMyCartThunk } from "../features/cart/cartThunk";

import NotificationBell from "./NotificationBell";

function Navbar() {
    // Track whether the mobile navigation is expanded.
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { theme, toggleTheme } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Read existing authentication and shopping data from Redux.
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const cartItemCount = useSelector(selectCartItemCount);
    const wishlistCount = useSelector(selectWishlistCount);

    // Keep the cart and wishlist in sync for signed-in customers.
    useEffect(() => {
        if (isAuthenticated) {
            dispatch(getMyWishlistThunk());
            dispatch(getMyCartThunk());
        }
    }, [dispatch, isAuthenticated]);

    // Close the mobile menu when the user navigates to another page.
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        dispatch(logout());
        setIsMenuOpen(false);
        navigate("/login");
    };

    // Shared styling keeps desktop and mobile links consistent.
    const linkClass = ({ isActive }) =>
        `rounded-full px-4 py-2 text-sm font-medium transition-colors ${isActive
            ? "bg-[#E1E9DC] text-[#3F5B43] dark:bg-[#344638] dark:text-[#E2EBDD]"
            : "text-stone-700 hover:bg-[#F5E9E7] hover:text-[#80545C] dark:text-stone-200 dark:hover:bg-stone-800 dark:hover:text-[#E8BFC7]"
        }`;

    return (
        <header className="sticky top-0 z-50 border-b border-[#E8E0D5] bg-[#FFFCF7]/95 shadow-sm backdrop-blur-md dark:border-stone-700 dark:bg-stone-950/95">
            <nav
                className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
                aria-label="Main navigation"
            >
                <div className="flex min-h-[76px] items-center justify-between gap-4">
                    {/* Brand: return to the homepage. */}
                    <Link
                        to="/"
                        className="shrink-0 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#789477]"
                        aria-label="TinyNest home"
                    >
                        <span className="block text-2xl font-bold tracking-tight text-[#405B43] dark:text-[#D9E6D4]">
                            TinyNest<span className="text-[#D69BA5]">.</span>
                        </span>
                        <span className="hidden text-[10px] font-medium uppercase tracking-[0.19em] text-stone-500 sm:block dark:text-stone-400">
                            Little things, lots of love
                        </span>
                    </Link>

                    {/* Desktop navigation links. */}
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
                        <NavLink to="/wishlist" className={linkClass}>
                            Wishlist
                            {wishlistCount > 0 && (
                                <span className="ml-2 rounded-full bg-[#EED5D9] px-2 py-0.5 text-xs text-[#754750] dark:bg-[#5B3941] dark:text-[#F5DDE1]">
                                    {wishlistCount}
                                </span>
                            )}
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

                    {/* Desktop theme and account actions. */}
                    <div className="hidden items-center gap-2 md:flex">
                        {/* Show notifications for signed-in users. */}
                        <NotificationBell />
                        <button
                            type="button"
                            onClick={toggleTheme}
                            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                            aria-pressed={theme === "dark"}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8E0D5] bg-white text-lg transition hover:bg-[#F5E9E7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#789477] dark:border-stone-700 dark:bg-stone-900 dark:hover:bg-stone-800"
                        >
                            {theme === "light" ? "☾" : "☀"}
                        </button>

                        {isAuthenticated ? (
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="rounded-full bg-[#506B52] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3F5941] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#789477] dark:bg-[#DCE7D6] dark:text-stone-900 dark:hover:bg-white"
                            >
                                Logout
                            </button>
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

                    {/* Mobile theme toggle and menu button. */}
                    <div className="flex items-center gap-2 md:hidden">
                        <button
                            type="button"
                            onClick={toggleTheme}
                            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8E0D5] text-lg dark:border-stone-700"
                        >
                            {theme === "light" ? "☾" : "☀"}
                        </button>

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

                {/* Mobile navigation uses the same routes and Redux counts. */}
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
                            Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                        </NavLink>
                        <NavLink to="/cart" className={linkClass}>
                            Cart {cartItemCount > 0 && `(${cartItemCount})`}
                        </NavLink>

                        <div className="flex flex-wrap gap-3 border-t border-[#E8E0D5] pt-3 dark:border-stone-700">
                            <NotificationBell />

                            {isAuthenticated ? (
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="rounded-full bg-[#506B52] px-5 py-2.5 text-sm font-semibold text-white dark:bg-[#DCE7D6] dark:text-stone-900"
                                >
                                    Logout
                                </button>
                            ) : (
                                <>
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
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}

export default Navbar;

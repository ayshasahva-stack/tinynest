// Import React hooks
import { useEffect, useState } from "react";

// Import React Router navigation components
import { Link, useNavigate } from "react-router-dom";

// Import theme context
import { useTheme } from "../app/ThemeContext";

// Import Redux hooks
import { useDispatch, useSelector } from "react-redux";

// Import authentication selector
import { selectIsAuthenticated } from "../features/auth/authSelectors";

// Import authentication logout action
import { logout } from "../features/auth/authSlice";

// Import cart selector
import { selectCartItemCount } from "../features/cart/cartSelectors";

// Import wishlist selector
import { selectWishlistCount } from "../features/wishlist/wishlistSelectors";

// Import wishlist thunk
import { getMyWishlistThunk } from "../features/wishlist/wishlistThunk";
import { getMyCartThunk } from "../features/cart/cartThunk";

// Navbar component for customer-facing pages
function Navbar() {
    // Store whether the mobile menu is open
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Get current theme and theme toggle function
    const { theme, toggleTheme } = useTheme();

    // Get Redux dispatch function
    const dispatch = useDispatch();

    // Get navigation function
    const navigate = useNavigate();

    // Get authentication status
    const isAuthenticated = useSelector(selectIsAuthenticated);

    // Get number of different products in the cart
    const cartItemCount = useSelector(selectCartItemCount);

    // Get number of products in the wishlist
    const wishlistCount = useSelector(selectWishlistCount);

    // Fetch wishlist when an authenticated user loads the Navbar
  useEffect(() => {
    if (isAuthenticated) {
        // Fetch the user's wishlist
        dispatch(getMyWishlistThunk());

        // Fetch the user's cart
        dispatch(getMyCartThunk());
    }
}, [dispatch, isAuthenticated]);

    // Handle user logout
    const handleLogout = () => {
        // Clear authentication data
        dispatch(logout());

        // Redirect user to login page
        navigate("/login");
    };

    // Toggle mobile menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="border-b bg-white dark:bg-gray-900">

            {/* Main navbar container */}
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">

                {/* TinyNest brand */}
                <Link
                    to="/"
                    className="text-2xl font-bold text-gray-900 dark:text-white"
                >
                    TinyNest
                </Link>

                {/* Desktop navigation */}
                <div className="hidden items-center gap-6 md:flex">

                    {/* Home */}
                    <Link
                        to="/"
                        className="text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white"
                    >
                        Home
                    </Link>

                    {/* Products */}
                    <Link
                        to="/products"
                        className="text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white"
                    >
                        Products
                    </Link>

                    {/* Wishlist */}
                    <Link
                        to="/wishlist"
                        className="text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white"
                    >
                        Wishlist
                        {wishlistCount > 0 && (
                            <span className="ml-1 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                                {wishlistCount}
                            </span>
                        )}
                    </Link>

                    {/* Cart */}
                    <Link
                        to="/cart"
                        className="text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white"
                    >
                        Cart
                        {cartItemCount > 0 && (
                            <span className="ml-1">
                                ({cartItemCount})
                            </span>
                        )}
                    </Link>
                     <Link
                        to="/kits"
                        className="text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white"
                    >
                        Kits
                    </Link>

                    {/* Theme toggle */}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="rounded-md border border-gray-300 px-3 py-1 text-gray-800 dark:border-gray-600 dark:text-white"
                        aria-label="Toggle theme"
                    >
                        {theme === "light" ? "🌙" : "☀️"}
                    </button>

                    {/* Authentication actions */}
                    {isAuthenticated ? (
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-md border border-gray-300 px-3 py-1 text-gray-800 dark:border-gray-600 dark:text-white"
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            {/* Login */}
                            <Link
                                to="/login"
                                className="text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white"
                            >
                                Login
                            </Link>

                            {/* Register */}
                            <Link
                                to="/register"
                                className="text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile menu button */}
                <button
                    type="button"
                    onClick={toggleMenu}
                    className="text-2xl md:hidden text-gray-900 dark:text-white"
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? "✕" : "☰"}
                </button>
            </div>

            {/* Mobile navigation menu */}
            {isMenuOpen && (
                <div className="border-t px-4 py-4 dark:border-gray-700 md:hidden">

                    {/* Mobile Home */}
                    <Link
                        to="/"
                        className="block py-2 text-gray-800 dark:text-gray-200"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Home
                    </Link>

                    {/* Mobile Products */}
                    <Link
                        to="/products"
                        className="block py-2 text-gray-800 dark:text-gray-200"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Products
                    </Link>

                    {/* Mobile Wishlist */}
                    <Link
                        to="/wishlist"
                        className="block py-2 text-gray-800 dark:text-gray-200"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Wishlist

                        {wishlistCount > 0 && (
                            <span className="ml-1 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                                {wishlistCount}
                            </span>
                        )}
                    </Link>

                    {/* Mobile Cart */}
                    <Link
                        to="/cart"
                        className="block py-2 text-gray-800 dark:text-gray-200"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Cart

                        {cartItemCount > 0 && (
                            <span className="ml-1">
                                ({cartItemCount})
                            </span>
                        )}
                    </Link>
                   <Link
                        to="/kits"
                        className="block py-2 text-gray-800 dark:text-gray-200"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Kits
                    </Link>


                    {/* Mobile theme toggle */}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="mt-2 rounded-md border px-3 py-1 dark:border-gray-600 dark:text-white"
                        aria-label="Toggle theme"
                    >
                        {theme === "light"
                            ? "🌙 Dark Mode"
                            : "☀️ Light Mode"}
                    </button>

                    {/* Mobile authentication actions */}
                    {isAuthenticated ? (
                        <button
                            type="button"
                            onClick={() => {
                                // Close mobile menu
                                setIsMenuOpen(false);

                                // Logout user
                                handleLogout();
                            }}
                            className="mt-3 block rounded-md border px-3 py-1 dark:border-gray-600 dark:text-white"
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            {/* Mobile Login */}
                            <Link
                                to="/login"
                                className="mt-3 block py-2 text-gray-800 dark:text-gray-200"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Login
                            </Link>

                            {/* Mobile Register */}
                            <Link
                                to="/register"
                                className="block py-2 text-gray-800 dark:text-gray-200"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}

export default Navbar;
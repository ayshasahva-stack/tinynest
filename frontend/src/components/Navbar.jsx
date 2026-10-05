// Import useState to manage the mobile menu state
import { useState } from "react";

// Import React Router's Link for navigation
import { Link } from "react-router-dom";
import { useTheme } from "../app/ThemeContext";
// Import Redux's dispatch hook
import { useDispatch, useSelector } from "react-redux";
// Import the authentication selector
import { selectIsAuthenticated } from "../features/auth/authSelectors";

// Import the logout action
import { logout } from "../features/auth/authSlice";

// Import React Router's navigation hook
import { useNavigate } from "react-router-dom";

// Navbar component for customer-facing pages
function Navbar() {

    // Store whether the mobile menu is open
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // Get the current theme and theme toggle function
    const { theme, toggleTheme } = useTheme();

    // Get the Redux dispatch function
    const dispatch = useDispatch();

    // Get the navigation function
    const navigate = useNavigate();
    // Get the current authentication status
    const isAuthenticated = useSelector(selectIsAuthenticated);
    // Handle user logout
    const handleLogout = () => {
        // Clear authentication data from Redux and localStorage
        dispatch(logout());

        // Redirect the user to the login page
        navigate("/login");
    };
    // Toggle the mobile menu
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

                    {/* Home link */}
                    <Link
                        to="/"
                        className="text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white"
                    >
                        Home
                    </Link>

                    {/* Products link */}
                    <Link
                        to="/products"
                        className="text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white"
                    >
                        Products
                    </Link>

                    {/* Cart link */}
                    <Link
                        to="/cart"
                        className="text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white"
                    >
                        Cart
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
                            <Link
                                to="/login"
                                className="text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white"
                            >
                                Login
                            </Link>

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
                    className="text-2xl md:hidden"
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? "✕" : "☰"}
                </button>
            </div>

            {/* Mobile navigation menu */}
            {isMenuOpen && (
                <div className="border-t px-4 py-4 md:hidden">

                    {/* Mobile Home link */}
                    <Link
                        to="/"
                        className="block py-2"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Home
                    </Link>

                    {/* Mobile Products link */}
                    <Link
                        to="/products"
                        className="block py-2"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Products
                    </Link>

                    {/* Mobile Cart link */}
                    <Link
                        to="/cart"
                        className="block py-2"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Cart
                    </Link>

                    {/* Mobile theme toggle */}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="mt-2 rounded-md border px-3 py-1"
                        aria-label="Toggle theme"
                    >
                        {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
                    </button>

                    {/* Mobile authentication actions */}
                    {isAuthenticated ? (
                        <button
                            type="button"
                            onClick={() => {
                                // Close the mobile menu
                                setIsMenuOpen(false);

                                // Log the user out
                                handleLogout();
                            }}
                            className="mt-3 block rounded-md border px-3 py-1"
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            {/* Mobile Login link */}
                            <Link
                                to="/login"
                                className="mt-3 block py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Login
                            </Link>

                            {/* Mobile Register link */}
                            <Link
                                to="/register"
                                className="block py-2"
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
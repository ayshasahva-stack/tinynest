// Import useState to manage the mobile menu state
import { useState } from "react";

// Import React Router's Link for navigation
import { Link } from "react-router-dom";

// Navbar component for customer-facing pages
function Navbar() {

    // Store whether the mobile menu is open
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Toggle the mobile menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="border-b bg-white">

            {/* Main navbar container */}
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">

                {/* TinyNest brand */}
                <Link
                    to="/"
                    className="text-2xl font-bold"
                >
                    TinyNest
                </Link>

                {/* Desktop navigation */}
                <div className="hidden items-center gap-6 md:flex">

                    {/* Home link */}
                    <Link
                        to="/"
                        className="hover:text-gray-600"
                    >
                        Home
                    </Link>

                    {/* Products link */}
                    <Link
                        to="/products"
                        className="hover:text-gray-600"
                    >
                        Products
                    </Link>

                    {/* Cart link */}
                    <Link
                        to="/cart"
                        className="hover:text-gray-600"
                    >
                        Cart
                    </Link>

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

                </div>
            )}

        </nav>
    );
}

export default Navbar;
// Import React Router's Link for navigation
import { Link } from "react-router-dom";

// Navbar component for customer-facing pages
function Navbar() {
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
                    className="text-2xl md:hidden"
                    aria-label="Open menu"
                >
                    ☰
                </button>

            </div>

        </nav>
    );
}

export default Navbar;
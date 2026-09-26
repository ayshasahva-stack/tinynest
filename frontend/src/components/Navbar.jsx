// Import Link for navigation without a full page reload
import { Link } from "react-router-dom";

// Navbar component for customer-facing pages
function Navbar() {
    return (
        <nav className="border-b bg-white">

            {/* Main navbar container */}
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">

                {/* TinyNest brand */}
                <h2 className="text-2xl font-bold">
                    TinyNest
                </h2>

                {/* Navigation links */}
                <div className="flex items-center gap-6">

                    {/* Home navigation link */}
                    <Link to="/">
                        Home
                    </Link>

                    {/* Products navigation link */}
                    <Link to="/products">
                        Products
                    </Link>

                    {/* Cart navigation link */}
                    <Link to="/cart">
                        Cart
                    </Link>

                </div>

            </div>

        </nav>
    );
}

export default Navbar;
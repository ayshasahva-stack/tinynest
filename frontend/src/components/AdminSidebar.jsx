// Link is used for navigation between admin pages
import { Link } from "react-router-dom";

// Sidebar used by all admin pages
function AdminSidebar() {
    return (
        <aside
            className="
                fixed
                left-0
                top-0
                z-40
                h-screen
                w-64
                border-r
                border-gray-200
                bg-white
                p-5
                dark:border-gray-700
                dark:bg-gray-800
            "
        >

            {/* Admin logo/title */}
            <div className="mb-8">
                <h2 className="
                    text-2xl
                    font-bold
                    text-gray-900
                    dark:text-white
                ">
                    TinyNest
                </h2>

                <p className="
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                ">
                    Admin Panel
                </p>
            </div>

            {/* Admin navigation */}
            <nav className="space-y-2">

                {/* Dashboard */}
                <Link
                    to="/admin"
                    className="
                        block
                        rounded-lg
                        px-4
                        py-3
                        text-gray-700
                        transition
                        hover:bg-gray-100
                        dark:text-gray-200
                        dark:hover:bg-gray-700
                    "
                >
                    Dashboard
                </Link>

                {/* Products */}
                <Link
                    to="/admin/products"
                    className="
                        block
                        rounded-lg
                        px-4
                        py-3
                        text-gray-700
                        transition
                        hover:bg-gray-100
                        dark:text-gray-200
                        dark:hover:bg-gray-700
                    "
                >
                    Products
                </Link>

            </nav>

        </aside>
    );
}

export default AdminSidebar;
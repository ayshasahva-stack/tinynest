// Import Outlet to display the current nested page
import { Outlet } from "react-router-dom";

// UserLayout provides the common structure for customer pages
function UserLayout() {
    return (
        <div>

            {/* Navbar will be added here later */}
            <header>
                <h2>TinyNest Navbar</h2>
            </header>

            {/* The current route's page will appear here */}
            <main>
                <Outlet />
            </main>

            {/* Footer will be added here later */}
            <footer>
                <p>TinyNest Footer</p>
            </footer>

        </div>
    );
}

export default UserLayout;
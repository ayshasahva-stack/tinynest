// Import Outlet to display the current admin page
import { Outlet } from "react-router-dom";

// AdminLayout provides the common structure for admin pages
function AdminLayout() {
    return (
        <div>

            {/* Admin sidebar will be added here later */}
            <aside>
                <h2>TinyNest Admin</h2>
            </aside>

            {/* Current admin page appears here */}
            <main>
                <Outlet />
            </main>

        </div>
    );
}

export default AdminLayout;
// Import Outlet to display the current nested admin page
import { Outlet } from "react-router-dom";

// Admin sidebar component
import AdminSidebar from "../components/AdminSidebar";

// AdminLayout provides the common structure for admin pages
function AdminLayout() {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">

            {/* Admin navigation sidebar */}
            <AdminSidebar />

            {/* Current admin page */}
            <main className="ml-64">
                <Outlet />
            </main>

        </div>
    );
}

export default AdminLayout;
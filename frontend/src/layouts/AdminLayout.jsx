import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

function AdminLayout() {
    return (
        <div className="min-h-screen bg-[#f7f9ff] text-[#181c20]">
            {/* Shared navigation for all admin pages */}
            <AdminSidebar />

            {/* Keep the page content beside the fixed sidebar */}
            <main className="min-h-screen min-w-0 ml-64">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;
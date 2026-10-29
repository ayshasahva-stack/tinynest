
import { Outlet } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";

function AdminLayout() {
    // Controls the sidebar drawer on mobile screens.
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#f7f9ff] text-[#181c20] dark:bg-gray-950 dark:text-gray-100">

            {/* Mobile header: visible only below the desktop breakpoint */}
            <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-[#e0e7e3] bg-[#f1f4f9] px-4 dark:border-gray-800 dark:bg-gray-950 lg:hidden">
                <button
                    type="button"
                    onClick={() => setIsSidebarOpen(true)}
                    aria-label="Open admin menu"
                    aria-expanded={isSidebarOpen}
                    className="rounded-lg p-2 hover:bg-white dark:hover:bg-gray-800"
                >
                    {/* Hamburger icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    >
                        <path d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                <span className="font-serif text-xl font-semibold text-[#436558] dark:text-[#a9cfbe]">
                    TinyNest
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    Admin
                </span>
            </header>

            {/* Dark overlay behind the sidebar on mobile */}
            {isSidebarOpen && (
                <button
                    type="button"
                    aria-label="Close admin menu"
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                />
            )}

            {/* Sidebar: drawer on mobile, fixed navigation on desktop */}
            <AdminSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main content: reserve sidebar space only on desktop */}
            <main className="min-h-[calc(100vh-4rem)] min-w-0 w-full lg:ml-64 lg:w-[calc(100%-16rem)]">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;

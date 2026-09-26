// Import Outlet to display the current nested page
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// UserLayout provides the common structure for customer pages
function UserLayout() {
    return (
        <div>

            {/* Navbar will be added here later */}
            <Navbar />

            {/* The current route's page will appear here */}
            <main>
                <Outlet />
            </main>

            {/* Footer will be added here later */}
            <Footer />

        </div>
    );
}

export default UserLayout;
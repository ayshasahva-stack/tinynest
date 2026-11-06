import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function UserLayout() {
    return (
        <div>

            <Navbar />
            <main>
                <Outlet />
            </main>
            <Footer />

        </div>
    );
}

export default UserLayout;
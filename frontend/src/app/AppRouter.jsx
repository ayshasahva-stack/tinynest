// Import the components required for routing
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import the pages
import Home from "../pages/home/Home";
import Products from "../pages/Product";
import Register from "../pages/auth/Register";
import VerifyOtp from "../pages/auth/VerifyOtp";
import Admin from "../layouts/Admin";

// Import the user layout
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";
// Main router component
function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>

                {/* All customer pages use the UserLayout */}
                <Route element={<UserLayout />}>


                    {/* Home page */}
                    <Route path="/" element={<Home />} />

                    {/* Products page */}
                    <Route path="/products" element={<Products />} />
                    {/* Registration page */}
                    <Route path="/register" element={<Register />} />
                    {/* OTP verification page */}
                    <Route path="/verify-otp" element={<VerifyOtp />} />
                </Route>
                {/* Admin routes */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Admin />} />
                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;
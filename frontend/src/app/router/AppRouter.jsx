// Import the components required for routing
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import the pages
import Home from "../../pages/home/Home";
import Products from "../../pages/products/Product";
import Register from "../../pages/auth/Register";
import VerifyOtp from "../../pages/auth/VerifyOtp";
import Login from "../../pages/auth/Login";
import ForgotPassword from "../../pages/auth/ForgotPassword";
// Import the password reset OTP page
import VerifyResetOtp from "../../pages/auth/verifyResetOtp";
// Import the Reset Password page
import ResetPassword from "../../pages/auth/ResetPassword";
import Admin from "../../layouts/Admin";

// Import the user layout
import UserLayout from "../../layouts/UserLayout";
import AdminLayout from "../../layouts/AdminLayout";
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
                    {/* Login page */}
                    <Route path="/login" element={<Login />} />
                    {/* Forgot Password page */}
                    <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                    />
                    {/* Password reset OTP page */}
                    <Route
                        path="/verify-reset-otp"
                        element={<VerifyResetOtp />}
                    />
                    {/* Reset Password page */}
                    <Route
                        path="/reset-password"
                        element={<ResetPassword />}
                    />
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
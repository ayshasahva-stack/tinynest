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
import ProductDetails from "../../pages/productDetails/ProductDetails";
// Import the Cart page
import Cart from "../../pages/cart/Cart";
import Wishlist from "../../pages/wishlist/Wishlist";
import Checkout from "../../pages/checkout/Checkout";
import Order from "../../pages/orders/Order";
import OrderDetails from "../../pages/orders/OrderDetails";
import Addresses from "../../pages/addresses/Addresses";
import Kits from "../../pages/kits/Kits";
import KitDetails from "../../pages/kitDetails/KitDetails";
// Import the Reset Password page
import ResetPassword from "../../pages/auth/ResetPassword";


import AdminDashboard from "../../pages/admin/AdminDashboard";
import AdminProducts from "../../pages/admin/AdminProducts";
import AdminAddProduct from "../../pages/admin/AdminAddProduct";
import AdminEditProduct from "../../pages/admin/AddminEditProduct";

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
                    <Route
                        path="/products/:id"
                        element={<ProductDetails />}
                    />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/orders" element={<Order />} />
                    <Route
                        path="/orders/:orderId"
                        element={<OrderDetails />}

                    />
                    <Route path="/addresses" element={<Addresses />} />
                    <Route path="/kits" element={<Kits />} />

                    <Route
                        path="/kits/:kitId"
                        element={<KitDetails />}
                    />
                </Route>

                {/* Admin routes */}
                <Route path="/admin" element={<AdminLayout />}>

                    {/* Admin dashboard */}
                    <Route index element={<AdminDashboard />} />

                    {/* Admin product management */}
                    <Route
                        path="products"
                        element={<AdminProducts />}
                    />
                    <Route
                        path="products/new"
                        element={<AdminAddProduct />}
                    />
                    <Route
                        path="products/edit/:id"
                        element={<AdminEditProduct />}
                    />

                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;
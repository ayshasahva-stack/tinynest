import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import UserLayout from "../../layouts/UserLayout";
import AdminLayout from "../../layouts/AdminLayout";

import SocketManager from "../../realtime/SocketManager";

import ScrollToTop from "../../components/ScrollToTop";

import Home from "../../pages/home/Home";
import Products from "../../pages/products/Product";
import Register from "../../pages/auth/Register";
import VerifyOtp from "../../pages/auth/VerifyOtp";
import Login from "../../pages/auth/Login";
import ForgotPassword from "../../pages/auth/ForgotPassword";
import VerifyResetOtp from "../../pages/auth/verifyResetOtp";
import ProductDetails from "../../pages/productDetails/ProductDetails";
import Cart from "../../pages/cart/Cart";
import Wishlist from "../../pages/wishlist/Wishlist";
import Checkout from "../../pages/checkout/Checkout";
import Order from "../../pages/orders/Order";
import OrderDetails from "../../pages/orders/OrderDetails";
import Addresses from "../../pages/addresses/Addresses";
import Kits from "../../pages/kits/Kits";
import KitDetails from "../../pages/kitDetails/KitDetails";
import ResetPassword from "../../pages/auth/ResetPassword";
import MyRefunds from "../../pages/refund/MyRefunds";
import Coupons from "../../pages/coupons/Coupons";
import Notifications from "../../pages/notification/Notification";
import Profile from "../../pages/profile/Profile";


import AdminDashboard from "../../pages/admin/AdminDashboard";
import AdminProducts from "../../pages/admin/AdminProducts";
import AdminAddProduct from "../../pages/admin/AdminAddProduct";
import AdminEditProduct from "../../pages/admin/AdminEditProduct";
import AdminCategories from "../../pages/admin/AdminCategories";
import AdminOrders from "../../pages/admin/AdminOrders";
import AdminKits from "../../pages/admin/AdminKits";
import AdminCoupons from "../../pages/admin/AdminCoupons";
import AdminUsers from "../../pages/admin/AdminUsers";
import AdminReviews from "../../pages/admin/AdminReviews";
import AdminRefunds from "../../pages/admin/AdminRefunds";


function AppRouter() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <SocketManager />

            <Routes>

                <Route element={<UserLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/verify-otp" element={<VerifyOtp />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/products/:id" element={<ProductDetails />} />
                    <Route path="/kits" element={<Kits />} />
                    <Route path="/kits/:kitId" element={<KitDetails />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/orders" element={<Order />} />
                        <Route path="/orders/:orderId" element={<OrderDetails />} />
                        <Route path="/addresses" element={<Addresses />} />
                        <Route path="/notifications" element={<Notifications />} />
                        <Route path="/refunds" element={<MyRefunds />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/coupons" element={<Coupons />} />
                    </Route>
                </Route>


                <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]} />} >
                    <Route element={<AdminLayout />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="products" element={<AdminProducts />} />
                        <Route path="products/new" element={<AdminAddProduct />} />
                        <Route path="products/edit/:id" element={<AdminEditProduct />} />
                        <Route path="categories" element={<AdminCategories />} />
                        <Route path="orders" element={<AdminOrders />} />
                        <Route path="kits" element={<AdminKits />} />
                        <Route path="coupons" element={<AdminCoupons />} />
                        <Route path="users" element={<AdminUsers />} />
                        <Route path="reviews" element={<AdminReviews />} />
                        <Route path="notifications" element={<Notifications />} />
                        <Route path="refunds" element={<AdminRefunds />} />
                        <Route path="profile" element={<Profile />} />
                    </Route>
                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;
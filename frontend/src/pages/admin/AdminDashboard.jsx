import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    getDashboardOverviewThunk,
    getRecentOrdersThunk,
    getRecentCustomersThunk,
    getLowStockProductsThunk,
} from "../../features/admin/adminThunk";

import {
    selectAdminOverview,
    selectAdminLoading,
    selectAdminError,
    selectRecentOrders,
    selectRecentOrdersLoading,
    selectRecentCustomers,
    selectRecentCustomersLoading,
    selectLowStockProducts,
    selectLowStockLoading,
} from "../../features/admin/adminSelectors";

function AdminDashboard() {
    // Redux dispatch allows us to send actions/thunks.
    const dispatch = useDispatch();

    // Main dashboard statistics.
    const overview = useSelector(selectAdminOverview);
    const overviewLoading = useSelector(selectAdminLoading);
    const overviewError = useSelector(selectAdminError);

    // Recent orders.
    const recentOrders = useSelector(selectRecentOrders);
    const recentOrdersLoading = useSelector(
        selectRecentOrdersLoading
    );

    // Recent customers.
    const recentCustomers = useSelector(
        selectRecentCustomers
    );
    const recentCustomersLoading = useSelector(
        selectRecentCustomersLoading
    );

    // Low-stock products.
    const lowStockProducts = useSelector(
        selectLowStockProducts
    );
    const lowStockLoading = useSelector(
        selectLowStockLoading
    );

    // Fetch all dashboard data when the page loads.
    useEffect(() => {
        dispatch(getDashboardOverviewThunk());
        dispatch(getRecentOrdersThunk());
        dispatch(getRecentCustomersThunk());
        dispatch(getLowStockProductsThunk());
    }, [dispatch]);

    // Show loading message while the main overview is loading.
    if (overviewLoading) {
        return (
            <div className="p-6">
                <p className="text-gray-600 dark:text-gray-300">
                    Loading dashboard...
                </p>
            </div>
        );
    }

    // Show error if the main overview request failed.
    if (overviewError) {
        return (
            <div className="p-6">
                <p className="text-red-500">
                    {overviewError}
                </p>
            </div>
        );
    }

    // Wait until overview data is available.
    if (!overview) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6 dark:bg-gray-900">

            {/* -------------------------------- */}
            {/* Dashboard Header */}
            {/* -------------------------------- */}

            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Admin Dashboard
                </h1>

                <p className="mt-1 text-gray-600 dark:text-gray-400">
                    Overview of your TinyNest store
                </p>
            </div>

            {/* -------------------------------- */}
            {/* Main Statistics */}
            {/* -------------------------------- */}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

                {/* Total Users */}
                <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total Users
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                        {overview.totalUsers}
                    </h2>
                </div>

                {/* Total Products */}
                <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total Products
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                        {overview.totalProducts}
                    </h2>
                </div>

                {/* Total Orders */}
                <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total Orders
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                        {overview.totalOrders}
                    </h2>
                </div>

                {/* Total Revenue */}
                <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total Revenue
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                        ₹{overview.totalRevenue}
                    </h2>
                </div>

            </div>

            {/* -------------------------------- */}
            {/* Order & Refund Statistics */}
            {/* -------------------------------- */}

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

                {/* Pending Orders */}
                <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Pending Orders
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                        {overview.pendingOrders}
                    </h2>
                </div>

                {/* Delivered Orders */}
                <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Delivered Orders
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                        {overview.deliveredOrders}
                    </h2>
                </div>

                {/* Cancelled Orders */}
                <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Cancelled Orders
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                        {overview.cancelledOrders}
                    </h2>
                </div>

                {/* Pending Refunds */}
                <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Pending Refunds
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                        {overview.pendingRefunds}
                    </h2>
                </div>

            </div>

            {/* -------------------------------- */}
            {/* Recent Activity */}
            {/* -------------------------------- */}

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">

                {/* -------------------------------- */}
                {/* Recent Orders */}
                {/* -------------------------------- */}

                <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">

                    <div className="mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Recent Orders
                        </h2>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Latest orders placed by customers
                        </p>
                    </div>

                    {recentOrdersLoading ? (
                        <p className="text-gray-500 dark:text-gray-400">
                            Loading orders...
                        </p>
                    ) : recentOrders.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400">
                            No recent orders found.
                        </p>
                    ) : (
                        <div className="space-y-4">

                            {recentOrders.map((order) => (
                                <div
                                    key={order._id}
                                    className="flex items-center justify-between border-b border-gray-200 pb-4 last:border-b-0 last:pb-0 dark:border-gray-700"
                                >

                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            #{order._id.slice(-6)}
                                        </p>

                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {order.user?.email ||
                                                "Unknown customer"}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            ₹{order.totalAmount}
                                        </p>

                                        <p className="text-sm capitalize text-gray-500 dark:text-gray-400">
                                            {order.status}
                                        </p>
                                    </div>

                                </div>
                            ))}

                        </div>
                    )}

                </section>

                {/* -------------------------------- */}
                {/* Recent Customers */}
                {/* -------------------------------- */}

                <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">

                    <div className="mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Recent Customers
                        </h2>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Recently registered customers
                        </p>
                    </div>

                    {recentCustomersLoading ? (
                        <p className="text-gray-500 dark:text-gray-400">
                            Loading customers...
                        </p>
                    ) : recentCustomers.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400">
                            No customers found.
                        </p>
                    ) : (
                        <div className="space-y-4">

                            {recentCustomers.map((customer) => (
                                <div
                                    key={customer._id}
                                    className="flex items-center justify-between border-b border-gray-200 pb-4 last:border-b-0 last:pb-0 dark:border-gray-700"
                                >

                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {customer.email}
                                        </p>

                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {customer.phone ||
                                                "No phone number"}
                                        </p>
                                    </div>

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                                            customer.isVerified
                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                        }`}
                                    >
                                        {customer.isVerified
                                            ? "Verified"
                                            : "Not verified"}
                                    </span>

                                </div>
                            ))}

                        </div>
                    )}

                </section>

            </div>

            {/* -------------------------------- */}
            {/* Low Stock Products */}
            {/* -------------------------------- */}

            <section className="mt-6 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">

                <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Low Stock Products
                    </h2>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Products that need stock attention
                    </p>
                </div>

                {lowStockLoading ? (
                    <p className="text-gray-500 dark:text-gray-400">
                        Loading products...
                    </p>
                ) : lowStockProducts.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">
                        No low-stock products.
                    </p>
                ) : (
                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[600px] text-left">

                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="pb-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                        Product
                                    </th>

                                    <th className="pb-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                        Price
                                    </th>

                                    <th className="pb-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                        Stock
                                    </th>

                                    <th className="pb-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                {lowStockProducts.map((product) => (
                                    <tr
                                        key={product._id}
                                        className="border-b border-gray-100 last:border-b-0 dark:border-gray-700"
                                    >

                                        <td className="py-4 font-medium text-gray-900 dark:text-white">
                                            {product.title}
                                        </td>

                                        <td className="py-4 text-gray-600 dark:text-gray-300">
                                            ₹{product.price}
                                        </td>

                                        <td className="py-4 font-semibold text-red-600">
                                            {product.stock}
                                        </td>

                                        <td className="py-4">
                                            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                                Low Stock
                                            </span>
                                        </td>

                                    </tr>
                                ))}

                            </tbody>

                        </table>

                    </div>
                )}

            </section>

        </div>
    );
}

export default AdminDashboard;
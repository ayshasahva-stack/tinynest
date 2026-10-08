import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    getDashboardOverviewThunk,
} from "../../features/admin/adminThunk";

import {
    selectAdminOverview,
    selectAdminLoading,
    selectAdminError,
} from "../../features/admin/adminSelectors";

function AdminDashboard() {
    // Redux dispatch allows us to send actions.
    const dispatch = useDispatch();

    // Get dashboard data from Redux.
    const overview = useSelector(selectAdminOverview);

    // Get loading and error states.
    const loading = useSelector(selectAdminLoading);
    const error = useSelector(selectAdminError);

    // Fetch dashboard data when the page loads.
    useEffect(() => {
        dispatch(getDashboardOverviewThunk());
    }, [dispatch]);

    // Show loading message while API request is running.
    if (loading) {
        return (
            <div className="p-6">
                <p>Loading dashboard...</p>
            </div>
        );
    }

    // Show error if the API request failed.
    if (error) {
        return (
            <div className="p-6">
                <p className="text-red-500">
                    {error}
                </p>
            </div>
        );
    }

    // Wait until dashboard data is available.
    if (!overview) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6 dark:bg-gray-900">

            {/* Dashboard heading */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Admin Dashboard
                </h1>

                <p className="mt-1 text-gray-600 dark:text-gray-400">
                    Overview of your TinyNest store
                </p>
            </div>

            {/* Statistics cards */}
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

            {/* Order and refund statistics */}
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

        </div>
    );
}

export default AdminDashboard;
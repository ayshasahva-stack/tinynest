import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

import {
    getDashboardOverviewThunk,
    getRecentOrdersThunk,
    getRecentCustomersThunk,
    getLowStockProductsThunk,
    getSalesStatisticsThunk,
    getMonthlySalesThunk,
    getOrderStatisticsThunk,
    getPaymentStatisticsThunk,
    getTopSellingProductsThunk,
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

    selectSales,
    selectSalesLoading,

    selectMonthlySales,
    selectMonthlySalesLoading,

    selectOrderStatistics,
    selectOrderStatisticsLoading,

    selectPaymentStatistics,
    selectPaymentStatisticsLoading,

    selectTopSellingProducts,
    selectTopProductsLoading,
} from "../../features/admin/adminSelectors";

function AdminDashboard() {
    // Redux dispatch allows us to send actions/thunks.
    const dispatch = useDispatch();

    // -----------------------------------------
    // Dashboard overview
    // -----------------------------------------

    const overview = useSelector(selectAdminOverview);

    const overviewLoading = useSelector(
        selectAdminLoading
    );

    const overviewError = useSelector(
        selectAdminError
    );

    // -----------------------------------------
    // Recent activity
    // -----------------------------------------

    const recentOrders = useSelector(
        selectRecentOrders
    );

    const recentOrdersLoading = useSelector(
        selectRecentOrdersLoading
    );

    const recentCustomers = useSelector(
        selectRecentCustomers
    );

    const recentCustomersLoading = useSelector(
        selectRecentCustomersLoading
    );

    const lowStockProducts = useSelector(
        selectLowStockProducts
    );

    const lowStockLoading = useSelector(
        selectLowStockLoading
    );

    // -----------------------------------------
    // Sales analytics
    // -----------------------------------------

    const sales = useSelector(selectSales);

    const salesLoading = useSelector(
        selectSalesLoading
    );

    const monthlySales = useSelector(
        selectMonthlySales
    );

    const monthlySalesLoading = useSelector(
        selectMonthlySalesLoading
    );

    const orderStatistics = useSelector(
        selectOrderStatistics
    );

    const orderStatisticsLoading = useSelector(
        selectOrderStatisticsLoading
    );

    const paymentStatistics = useSelector(
        selectPaymentStatistics
    );

    const paymentStatisticsLoading = useSelector(
        selectPaymentStatisticsLoading
    );

    const topSellingProducts = useSelector(
        selectTopSellingProducts
    );

    const topProductsLoading = useSelector(
        selectTopProductsLoading
    );

    // -----------------------------------------
    // Fetch all admin dashboard data
    // -----------------------------------------

    useEffect(() => {
        // Dashboard overview.
        dispatch(getDashboardOverviewThunk());

        // Recent activity.
        dispatch(getRecentOrdersThunk());
        dispatch(getRecentCustomersThunk());
        dispatch(getLowStockProductsThunk());

        // Sales analytics.
        dispatch(getSalesStatisticsThunk());
        dispatch(getMonthlySalesThunk());

        // Order and payment analytics.
        dispatch(getOrderStatisticsThunk());
        dispatch(getPaymentStatisticsThunk());

        // Top-selling products.
        dispatch(getTopSellingProductsThunk());
    }, [dispatch]);

    // -----------------------------------------
    // Main dashboard loading
    // -----------------------------------------

    if (overviewLoading) {
        return (
            <div className="p-6">
                <p className="text-gray-600 dark:text-gray-300">
                    Loading dashboard...
                </p>
            </div>
        );
    }

    // -----------------------------------------
    // Main dashboard error
    // -----------------------------------------

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

    // -----------------------------------------
    // Prepare monthly sales chart data
    // -----------------------------------------

    const monthlySalesChartData = monthlySales.map(
        (item) => ({
            month: `Month ${item._id.month}`,
            sales: item.totalSales,
            orders: item.orderCount,
        })
    );

    // -----------------------------------------
    // Prepare daily sales chart data
    // -----------------------------------------

    const dailySalesChartData = sales.map(
        (item) => ({
            date: item._id,
            sales: item.totalSales,
            orders: item.orderCount,
        })
    );

    // -----------------------------------------
    // Prepare order statistics chart data
    // -----------------------------------------

    const orderChartData = orderStatistics.map(
        (item) => ({
            name: item._id,
            value: item.count,
        })
    );

    // -----------------------------------------
    // Prepare payment statistics chart data
    // -----------------------------------------

    const paymentChartData = paymentStatistics.map(
        (item) => ({
            name: item._id,
            value: item.totalAmount,
            payments: item.paymentCount,
        })
    );

    // -----------------------------------------
    // Prepare top-selling products chart data
    // -----------------------------------------

    const topProductsChartData =
        topSellingProducts.map((product) => ({
            name: product.title,
            sold: product.totalSold,
        }));

    return (
        <div className="min-h-screen bg-gray-100 p-6 dark:bg-gray-900">

            {/* ===================================== */}
            {/* Dashboard Header */}
            {/* ===================================== */}

            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Admin Dashboard
                </h1>

                <p className="mt-1 text-gray-600 dark:text-gray-400">
                    Overview of your TinyNest store
                </p>
            </div>

            {/* ===================================== */}
            {/* Main Statistics */}
            {/* ===================================== */}

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

            {/* ===================================== */}
            {/* Order & Refund Statistics */}
            {/* ===================================== */}

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

            {/* ===================================== */}
            {/* Recent Activity */}
            {/* ===================================== */}

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">

                {/* Recent Orders */}
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

                {/* Recent Customers */}
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

            {/* ===================================== */}
            {/* Low Stock Products */}
            {/* ===================================== */}

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

            {/* ===================================== */}
            {/* SALES ANALYTICS */}
            {/* ===================================== */}

            <div className="mt-8">

                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Sales Analytics
                    </h2>

                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                        Understand sales, orders and product performance
                    </p>
                </div>

                {/* ================================= */}
                {/* Monthly Sales */}
                {/* ================================= */}

                <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">

                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Monthly Sales
                        </h3>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Sales performance for the current year
                        </p>
                    </div>

                    {monthlySalesLoading ? (
                        <p className="text-gray-500 dark:text-gray-400">
                            Loading monthly sales...
                        </p>
                    ) : monthlySalesChartData.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400">
                            No monthly sales data available.
                        </p>
                    ) : (
                        <div className="h-[350px] w-full">

                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <LineChart
                                    data={monthlySalesChartData}
                                    margin={{
                                        top: 10,
                                        right: 20,
                                        left: 10,
                                        bottom: 10,
                                    }}
                                >

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                    />

                                    <XAxis
                                        dataKey="month"
                                    />

                                    <YAxis />

                                    <Tooltip
                                        formatter={(value) =>
                                            `₹${value}`
                                        }
                                    />

                                    <Legend />

                                    <Line
                                        type="monotone"
                                        dataKey="sales"
                                        name="Sales"
                                        stroke="#2563eb"
                                        strokeWidth={3}
                                        activeDot={{
                                            r: 6,
                                        }}
                                    />

                                </LineChart>
                            </ResponsiveContainer>

                        </div>
                    )}

                </section>

                {/* ================================= */}
                {/* Daily Sales + Order Statistics */}
                {/* ================================= */}

                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

                    {/* Daily Sales */}
                    <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">

                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Daily Sales
                            </h3>

                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Sales for the current month
                            </p>
                        </div>

                        {salesLoading ? (
                            <p className="text-gray-500 dark:text-gray-400">
                                Loading daily sales...
                            </p>
                        ) : dailySalesChartData.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400">
                                No daily sales data available.
                            </p>
                        ) : (
                            <div className="h-[320px]">

                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                >
                                    <BarChart
                                        data={dailySalesChartData}
                                    >

                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                        />

                                        <XAxis
                                            dataKey="date"
                                        />

                                        <YAxis />

                                        <Tooltip
                                            formatter={(value) =>
                                                `₹${value}`
                                            }
                                        />

                                        <Bar
                                            dataKey="sales"
                                            name="Sales"
                                            fill="#16a34a"
                                        />

                                    </BarChart>
                                </ResponsiveContainer>

                            </div>
                        )}

                    </section>

                    {/* Order Statistics */}
                    <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">

                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Order Statistics
                            </h3>

                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Orders grouped by status
                            </p>
                        </div>

                        {orderStatisticsLoading ? (
                            <p className="text-gray-500 dark:text-gray-400">
                                Loading order statistics...
                            </p>
                        ) : orderChartData.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400">
                                No order statistics available.
                            </p>
                        ) : (
                            <div className="h-[320px]">

                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                >
                                    <PieChart>

                                        <Pie
                                            data={orderChartData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            label
                                        >
                                            {orderChartData.map(
                                                (_, index) => (
                                                    <Cell
                                                        key={`order-${index}`}
                                                        fill={[
                                                            "#f59e0b",
                                                            "#3b82f6",
                                                            "#8b5cf6",
                                                            "#22c55e",
                                                            "#ef4444",
                                                        ][
                                                            index %
                                                                5
                                                        ]}
                                                    />
                                                )
                                            )}
                                        </Pie>

                                        <Tooltip />

                                        <Legend />

                                    </PieChart>
                                </ResponsiveContainer>

                            </div>
                        )}

                    </section>

                </div>

                {/* ================================= */}
                {/* Payment Statistics + Top Products */}
                {/* ================================= */}

                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

                    {/* Payment Statistics */}
                    <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">

                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Payment Methods
                            </h3>

                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Successful payments by method
                            </p>
                        </div>

                        {paymentStatisticsLoading ? (
                            <p className="text-gray-500 dark:text-gray-400">
                                Loading payment statistics...
                            </p>
                        ) : paymentChartData.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400">
                                No payment data available.
                            </p>
                        ) : (
                            <div className="h-[320px]">

                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                >
                                    <PieChart>

                                        <Pie
                                            data={paymentChartData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            label
                                        >
                                            {paymentChartData.map(
                                                (_, index) => (
                                                    <Cell
                                                        key={`payment-${index}`}
                                                        fill={[
                                                            "#2563eb",
                                                            "#16a34a",
                                                            "#f59e0b",
                                                            "#9333ea",
                                                        ][
                                                            index %
                                                                4
                                                        ]}
                                                    />
                                                )
                                            )}
                                        </Pie>

                                        <Tooltip
                                            formatter={(value) =>
                                                `₹${value}`
                                            }
                                        />

                                        <Legend />

                                    </PieChart>
                                </ResponsiveContainer>

                            </div>
                        )}

                    </section>

                    {/* Top Selling Products */}
                    <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">

                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Top Selling Products
                            </h3>

                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Best-performing products
                            </p>
                        </div>

                        {topProductsLoading ? (
                            <p className="text-gray-500 dark:text-gray-400">
                                Loading top products...
                            </p>
                        ) : topProductsChartData.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400">
                                No product sales data available.
                            </p>
                        ) : (
                            <div className="h-[320px]">

                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                >
                                    <BarChart
                                        data={topProductsChartData}
                                        layout="vertical"
                                        margin={{
                                            left: 20,
                                            right: 20,
                                        }}
                                    >

                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                        />

                                        <XAxis
                                            type="number"
                                        />

                                        <YAxis
                                            type="category"
                                            dataKey="name"
                                            width={120}
                                        />

                                        <Tooltip />

                                        <Bar
                                            dataKey="sold"
                                            name="Units Sold"
                                            fill="#9333ea"
                                        />

                                    </BarChart>
                                </ResponsiveContainer>

                            </div>
                        )}

                    </section>

                </div>

            </div>

        </div>
    );
}

export default AdminDashboard;
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Area,
    ComposedChart,
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
    // AdminLayout continues to handle the sidebar and page structure.
    <div className="min-h-screen bg-[#f7f9ff] px-4 pb-8 pt-5 font-sans text-[#181c20] dark:bg-gray-950 sm:px-6 lg:px-8">

        {/* =====================================================
            1. PAGE HEADER — matches the ZIP's Store Overview
        ====================================================== */}
        <header className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
                <div className="mb-2 flex items-center gap-2 text-xs text-[#626c68] dark:text-gray-400">
                    <span>Admin</span>
                    <span className="text-gray-400">›</span>
                    <span className="font-semibold text-[#436558] dark:text-[#a9cfbe]">
                        Dashboard
                    </span>
                </div>

                <h1 className="font-serif text-3xl tracking-tight text-[#181c20] dark:text-white sm:text-4xl">
                    Store Overview
                </h1>

                <p className="mt-1 text-sm text-[#626c68] dark:text-gray-400">
                    TinyNest store performance at a glance
                </p>
            </div>

            {/* Styled like the reference's quick-action toolbar.
                No new actions or business logic are introduced. */}
            <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#436558] shadow-sm dark:bg-gray-900 dark:text-[#a9cfbe]">
                    <span aria-hidden="true">▦</span>
                    Store Analytics
                </span>

                <span className="inline-flex items-center gap-2 rounded-lg bg-[#436558] px-3.5 py-2 text-xs font-semibold text-white shadow-sm">
                    <span aria-hidden="true">●</span>
                    Live Store Data
                </span>
            </div>
        </header>

        {/* =====================================================
            2. FOUR KEY METRIC CARDS
            Uses the real overview values already in Redux.
        ====================================================== */}
        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {/* Total Revenue */}
            <article className="group relative overflow-hidden rounded-xl border border-transparent bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
                <div className="pointer-events-none absolute -right-5 -top-5 h-24 w-24 rounded-full bg-[#c5ebda]/50 blur-2xl transition-transform group-hover:scale-125" />

                <div className="relative mb-4 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#626c68] dark:text-gray-400">
                        Total Revenue
                    </p>
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f1f4f9] text-lg text-[#436558] dark:bg-gray-800 dark:text-[#a9cfbe]">
                        ₹
                    </span>
                </div>

                <p className="relative font-serif text-3xl tracking-tight text-[#181c20] dark:text-white">
                    {`₹${Number(overview.totalRevenue || 0).toLocaleString("en-IN")}`}
                </p>

                <p className="relative mt-2 text-xs text-[#626c68] dark:text-gray-400">
                    Revenue recorded by TinyNest
                </p>
            </article>

            {/* Total Orders */}
            <article className="group relative overflow-hidden rounded-xl border border-transparent bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
                <div className="pointer-events-none absolute -right-5 -top-5 h-24 w-24 rounded-full bg-[#f0bba5]/30 blur-2xl transition-transform group-hover:scale-125" />

                <div className="mb-4 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#626c68] dark:text-gray-400">
                        Total Orders
                    </p>
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f1f4f9] text-lg text-[#436558] dark:bg-gray-800 dark:text-[#a9cfbe]">
                        ♧
                    </span>
                </div>

                <p className="font-serif text-3xl tracking-tight text-[#181c20] dark:text-white">
                    {Number(overview.totalOrders || 0).toLocaleString("en-IN")}
                </p>

                <p className="mt-2 text-xs text-[#626c68] dark:text-gray-400">
                    <span className="mr-1 inline-block h-2 w-2 rounded-full bg-[#d99b7d]" />
                    {overview.pendingOrders || 0} pending orders
                </p>
            </article>

            {/* Total Products */}
            <article className="group relative overflow-hidden rounded-xl border border-transparent bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
                <div className="pointer-events-none absolute -right-5 -top-5 h-24 w-24 rounded-full bg-[#c5ebda]/50 blur-2xl transition-transform group-hover:scale-125" />

                <div className="mb-4 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#626c68] dark:text-gray-400">
                        Total Products
                    </p>
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f1f4f9] text-lg text-[#436558] dark:bg-gray-800 dark:text-[#a9cfbe]">
                        ◈
                    </span>
                </div>

                <p className="font-serif text-3xl tracking-tight text-[#181c20] dark:text-white">
                    {Number(overview.totalProducts || 0).toLocaleString("en-IN")}
                </p>

                <p className="mt-2 text-xs text-[#626c68] dark:text-gray-400">
                    Products in your catalogue
                </p>
            </article>

            {/* Total Users */}
            <article className="group relative overflow-hidden rounded-xl border border-transparent bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
                <div className="pointer-events-none absolute -right-5 -top-5 h-24 w-24 rounded-full bg-[#f0bba5]/30 blur-2xl transition-transform group-hover:scale-125" />

                <div className="mb-4 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#626c68] dark:text-gray-400">
                        Total Customers
                    </p>
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f1f4f9] text-lg text-[#436558] dark:bg-gray-800 dark:text-[#a9cfbe]">
                        ♙
                    </span>
                </div>

                <p className="font-serif text-3xl tracking-tight text-[#181c20] dark:text-white">
                    {Number(overview.totalUsers || 0).toLocaleString("en-IN")}
                </p>

                <p className="mt-2 text-xs text-[#626c68] dark:text-gray-400">
                    Registered TinyNest users
                </p>
            </article>
        </section>

        {/* =====================================================
            3. MAIN ANALYTICS — large chart + donut chart
            Mirrors the ZIP's 8-column / 4-column arrangement.
        ====================================================== */}
        <section className="mb-6 grid grid-cols-1 gap-5 xl:grid-cols-12">

            {/* Sales & Order Volume */}
            <article className="min-w-0 rounded-xl border border-[#e0e3e8] bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 xl:col-span-8 sm:p-6">
                <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div>
                        <h2 className="font-serif text-2xl text-[#181c20] dark:text-white">
                            Sales &amp; Order Volume
                        </h2>
                        <p className="mt-1 text-sm text-[#626c68] dark:text-gray-400">
                            Monthly revenue and order performance
                        </p>
                    </div>

                    <span className="self-start rounded-lg bg-[#f1f4f9] px-3 py-2 text-xs font-semibold text-[#436558] dark:bg-gray-800 dark:text-[#a9cfbe]">
                        Monthly Overview
                    </span>
                </div>

                {monthlySalesLoading ? (
                    <p className="py-16 text-center text-sm text-[#626c68] dark:text-gray-400">
                        Loading monthly sales...
                    </p>
                ) : monthlySalesChartData.length === 0 ? (
                    <div className="flex min-h-[300px] items-center justify-center rounded-lg bg-[#f7f9ff] px-4 text-center text-sm text-[#626c68] dark:bg-gray-800 dark:text-gray-400">
                        No monthly sales data available.
                    </div>
                ) : (
                    <div className="h-[300px] w-full sm:h-[340px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart
                                data={monthlySalesChartData}
                                margin={{ top: 12, right: 8, left: 0, bottom: 4 }}
                            >
                                <CartesianGrid
                                    stroke="#e5e8ed"
                                    strokeDasharray="3 5"
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="month"
                                    tick={{ fill: "#626c68", fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickMargin={10}
                                />

                                <YAxis
                                    yAxisId="sales"
                                    tick={{ fill: "#626c68", fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(value) =>
                                        value >= 1000
                                            ? `₹${(value / 1000).toLocaleString("en-IN")}k`
                                            : `₹${value}`
                                    }
                                />

                                <YAxis
                                    yAxisId="orders"
                                    orientation="right"
                                    hide
                                />

                                <Tooltip
                                    formatter={(value, name) =>
                                        name === "Sales"
                                            ? [
                                                  `₹${Number(value).toLocaleString("en-IN")}`,
                                                  name,
                                              ]
                                            : [value, name]
                                    }
                                    contentStyle={{
                                        borderRadius: "10px",
                                        border: "1px solid #e0e3e8",
                                        boxShadow: "0 6px 20px rgba(43,47,51,0.08)",
                                        fontSize: "12px",
                                    }}
                                />

                                <Legend
                                    wrapperStyle={{
                                        fontSize: "12px",
                                        paddingTop: "12px",
                                    }}
                                />

                                {/* Sage area represents actual sales. */}
                                <Area
                                    yAxisId="sales"
                                    type="monotone"
                                    dataKey="sales"
                                    name="Sales"
                                    stroke="#436558"
                                    strokeWidth={2.5}
                                    fill="#c5ebda"
                                    fillOpacity={0.65}
                                    activeDot={{ r: 5, fill: "#436558" }}
                                />

                                {/* Peach line represents existing order counts. */}
                                <Line
                                    yAxisId="orders"
                                    type="monotone"
                                    dataKey="orders"
                                    name="Orders"
                                    stroke="#d99b7d"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 4 }}
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </article>

            {/* Order Status Donut — uses real order statistics,
                not invented product-category data. */}
            <article className="min-w-0 rounded-xl border border-[#e0e3e8] bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 xl:col-span-4 sm:p-6">
                <div className="mb-3">
                    <h2 className="font-serif text-2xl text-[#181c20] dark:text-white">
                        Order Statistics
                    </h2>
                    <p className="mt-1 text-sm text-[#626c68] dark:text-gray-400">
                        Distribution by order status
                    </p>
                </div>

                {orderStatisticsLoading ? (
                    <p className="py-16 text-center text-sm text-[#626c68] dark:text-gray-400">
                        Loading order statistics...
                    </p>
                ) : orderChartData.length === 0 ? (
                    <div className="flex min-h-[260px] items-center justify-center text-center text-sm text-[#626c68] dark:text-gray-400">
                        No order statistics available.
                    </div>
                ) : (
                    <>
                        <div className="relative h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={orderChartData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={65}
                                        outerRadius={91}
                                        paddingAngle={3}
                                        stroke="none"
                                    >
                                        {orderChartData.map((_, index) => (
                                            <Cell
                                                key={`order-status-${index}`}
                                                fill={[
                                                    "#436558",
                                                    "#7a9e8f",
                                                    "#f0bba5",
                                                    "#beaa77",
                                                    "#c5ebda",
                                                ][index % 5]}
                                            />
                                        ))}
                                    </Pie>

                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: "10px",
                                            border: "1px solid #e0e3e8",
                                            fontSize: "12px",
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>

                            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                <span className="font-serif text-3xl text-[#181c20] dark:text-white">
                                    {Number(overview.totalOrders || 0).toLocaleString("en-IN")}
                                </span>
                                <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#626c68] dark:text-gray-400">
                                    Total Orders
                                </span>
                            </div>
                        </div>

                        <div className="mt-2 space-y-3">
                            {orderChartData.map((item, index) => (
                                <div
                                    key={`order-legend-${item.name}`}
                                    className="flex items-center justify-between gap-3"
                                >
                                    <div className="flex min-w-0 items-center gap-2">
                                        <span
                                            className="h-2.5 w-2.5 shrink-0 rounded-full"
                                            style={{
                                                backgroundColor: [
                                                    "#436558",
                                                    "#7a9e8f",
                                                    "#f0bba5",
                                                    "#beaa77",
                                                    "#c5ebda",
                                                ][index % 5],
                                            }}
                                        />
                                        <span className="truncate text-sm capitalize text-[#626c68] dark:text-gray-300">
                                            {String(item.name).replace(/_/g, " ")}
                                        </span>
                                    </div>
                                    <span className="shrink-0 text-sm font-semibold text-[#181c20] dark:text-white">
                                        {Number(item.value).toLocaleString("en-IN")}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </article>
        </section>

        {/* =====================================================
            4. RECENT ORDERS — full-width reference-style table
        ====================================================== */}
        <section className="mb-6 overflow-hidden rounded-xl border border-[#e0e3e8] bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center sm:p-6">
                <div>
                    <h2 className="font-serif text-2xl text-[#181c20] dark:text-white">
                        Recent TinyNest Orders
                    </h2>
                    <p className="mt-1 text-sm text-[#626c68] dark:text-gray-400">
                        Latest orders placed by your customers
                    </p>
                </div>

                <span className="self-start rounded-lg bg-[#f1f4f9] px-3 py-2 text-xs font-semibold text-[#436558] dark:bg-gray-800 dark:text-[#a9cfbe]">
                    {recentOrders.length} recent records
                </span>
            </div>

            {recentOrdersLoading ? (
                <p className="px-5 py-12 text-center text-sm text-[#626c68] dark:text-gray-400">
                    Loading orders...
                </p>
            ) : recentOrders.length === 0 ? (
                <p className="mx-5 mb-5 rounded-lg bg-[#f1f4f9] px-4 py-10 text-center text-sm text-[#626c68] dark:bg-gray-800 dark:text-gray-400">
                    No recent orders found.
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[650px] text-left">
                        <thead>
                            <tr className="bg-[#f1f4f9] text-[10px] font-bold uppercase tracking-[0.12em] text-[#626c68] dark:bg-gray-800 dark:text-gray-300">
                                <th className="px-5 py-3.5">Order ID</th>
                                <th className="px-5 py-3.5">Customer</th>
                                <th className="px-5 py-3.5">Total</th>
                                <th className="px-5 py-3.5">Order Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {recentOrders.map((order) => {
                                const status = String(order.status || "unknown");
                                const normalizedStatus = status.toLowerCase();

                                const statusClasses =
                                    normalizedStatus.includes("deliver")
                                        ? "bg-[#c5ebda] text-[#2b4d41] dark:bg-emerald-900/30 dark:text-emerald-300"
                                        : normalizedStatus.includes("cancel")
                                          ? "bg-[#ffdad6] text-[#93000a] dark:bg-red-900/30 dark:text-red-300"
                                          : normalizedStatus.includes("pending")
                                            ? "bg-[#ffdbcd] text-[#7a5240] dark:bg-amber-900/30 dark:text-amber-300"
                                            : "bg-[#e5e8ed] text-[#414845] dark:bg-gray-800 dark:text-gray-300";

                                return (
                                    <tr
                                        key={order._id}
                                        className="border-b border-[#e5e8ed] transition-colors last:border-b-0 hover:bg-[#f7f9ff] dark:border-gray-800 dark:hover:bg-gray-800/60"
                                    >
                                        <td className="px-5 py-4">
                                            <span className="font-semibold text-[#436558] dark:text-[#a9cfbe]">
                                                #{String(order._id).slice(-6).toUpperCase()}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <p className="max-w-[260px] truncate text-sm font-semibold text-[#181c20] dark:text-white">
                                                {order.user?.email || "Unknown customer"}
                                            </p>
                                            <p className="mt-1 text-xs text-[#626c68] dark:text-gray-400">
                                                TinyNest customer
                                            </p>
                                        </td>

                                        <td className="px-5 py-4 text-sm font-semibold text-[#181c20] dark:text-white">
                                            ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold capitalize ${statusClasses}`}>
                                                {status.replace(/_/g, " ")}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </section>

        {/* =====================================================
            5. BOTTOM PANELS — low inventory + customer activity
            Mirrors the ZIP's split bottom section.
        ====================================================== */}
        <section className="mb-7 grid grid-cols-1 gap-5 xl:grid-cols-12">

            {/* Low Inventory Alerts */}
            <article className="min-w-0 rounded-xl border border-[#e0e3e8] bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 xl:col-span-7 sm:p-6">
                <div className="mb-1 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#d96b5f]" />
                        <h2 className="font-serif text-2xl text-[#181c20] dark:text-white">
                            Low Inventory Alerts
                        </h2>
                    </div>
                    <span className="rounded-full bg-[#ffdad6] px-2.5 py-1 text-[10px] font-bold text-[#93000a] dark:bg-red-900/30 dark:text-red-300">
                        {lowStockProducts.length} items
                    </span>
                </div>

                <p className="mb-5 text-sm text-[#626c68] dark:text-gray-400">
                    Products that need stock attention
                </p>

                {lowStockLoading ? (
                    <p className="py-10 text-center text-sm text-[#626c68] dark:text-gray-400">
                        Loading inventory...
                    </p>
                ) : lowStockProducts.length === 0 ? (
                    <div className="rounded-lg bg-[#f1f4f9] px-4 py-8 text-center dark:bg-gray-800">
                        <p className="text-sm font-semibold text-[#436558] dark:text-[#a9cfbe]">
                            Inventory looks good
                        </p>
                        <p className="mt-1 text-xs text-[#626c68] dark:text-gray-400">
                            No low-stock products were returned.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2.5">
                        {lowStockProducts.map((product) => (
                            <div
                                key={product._id}
                                className="flex items-center justify-between gap-3 rounded-lg bg-[#f7f9ff] p-3 transition-colors hover:bg-[#f1f4f9] dark:bg-gray-800 dark:hover:bg-gray-800/70"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#dce7e2] text-lg text-[#436558] dark:bg-gray-700 dark:text-[#a9cfbe]">
                                        ◈
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-[#181c20] dark:text-white">
                                            {product.title}
                                        </p>
                                        <p className="mt-1 text-xs text-[#d05c50]">
                                            {Number(product.stock || 0)} units remaining
                                        </p>
                                    </div>
                                </div>

                                <div className="shrink-0 text-right">
                                    <p className="text-sm font-semibold text-[#181c20] dark:text-white">
                                        ₹{Number(product.price || 0).toLocaleString("en-IN")}
                                    </p>
                                    <span className="mt-1 inline-block rounded-full bg-[#ffdad6] px-2 py-0.5 text-[10px] font-semibold text-[#93000a] dark:bg-red-900/30 dark:text-red-300">
                                        Low Stock
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </article>

            {/* Recent Customers — uses the existing customer data.
                This is not a fake reviews/ratings panel. */}
            <article className="min-w-0 rounded-xl border border-[#e0e3e8] bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 xl:col-span-5 sm:p-6">
                <div className="mb-1 flex items-center justify-between gap-3">
                    <h2 className="font-serif text-2xl text-[#181c20] dark:text-white">
                        Recent Customers
                    </h2>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dce7e2] text-lg text-[#436558] dark:bg-gray-800 dark:text-[#a9cfbe]">
                        ♙
                    </span>
                </div>

                <p className="mb-5 text-sm text-[#626c68] dark:text-gray-400">
                    Recently registered TinyNest customers
                </p>

                {recentCustomersLoading ? (
                    <p className="py-10 text-center text-sm text-[#626c68] dark:text-gray-400">
                        Loading customers...
                    </p>
                ) : recentCustomers.length === 0 ? (
                    <div className="rounded-lg bg-[#f1f4f9] px-4 py-8 text-center text-sm text-[#626c68] dark:bg-gray-800 dark:text-gray-400">
                        No customers found.
                    </div>
                ) : (
                    <div className="space-y-1">
                        {recentCustomers.map((customer) => (
                            <div
                                key={customer._id}
                                className="flex items-center justify-between gap-3 border-b border-[#e5e8ed] py-3.5 last:border-b-0 dark:border-gray-800"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#c5ebda] text-sm font-bold text-[#2b4d41] dark:bg-gray-700 dark:text-[#a9cfbe]">
                                        {String(customer.email || "U")
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-[#181c20] dark:text-white">
                                            {customer.email}
                                        </p>
                                        <p className="mt-1 truncate text-xs text-[#626c68] dark:text-gray-400">
                                            {customer.phone || "No phone number"}
                                        </p>
                                    </div>
                                </div>

                                <span
                                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                                        customer.isVerified
                                            ? "bg-[#c5ebda] text-[#2b4d41] dark:bg-emerald-900/30 dark:text-emerald-300"
                                            : "bg-[#ffdbcd] text-[#7a5240] dark:bg-amber-900/30 dark:text-amber-300"
                                    }`}
                                >
                                    {customer.isVerified ? "Verified" : "Unverified"}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </article>
        </section>

        {/* =====================================================
            6. ADDITIONAL EXISTING ANALYTICS
            Kept so the current dashboard data is not removed.
        ====================================================== */}
        <div className="mb-5">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#436558] dark:text-[#a9cfbe]">
                More insights
            </p>
            <h2 className="font-serif text-3xl text-[#181c20] dark:text-white">
                Store Performance
            </h2>
            <p className="mt-1 text-sm text-[#626c68] dark:text-gray-400">
                Daily sales, payment totals and best-selling products
            </p>
        </div>

        <section className="mb-6 grid grid-cols-1 gap-5 xl:grid-cols-2">

            {/* Daily Sales */}
            <article className="min-w-0 rounded-xl border border-[#e0e3e8] bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
                <div className="mb-5">
                    <h3 className="font-serif text-2xl text-[#181c20] dark:text-white">
                        Daily Sales
                    </h3>
                    <p className="mt-1 text-sm text-[#626c68] dark:text-gray-400">
                        Sales from the existing daily statistics
                    </p>
                </div>

                {salesLoading ? (
                    <p className="py-12 text-center text-sm text-[#626c68] dark:text-gray-400">
                        Loading daily sales...
                    </p>
                ) : dailySalesChartData.length === 0 ? (
                    <p className="py-12 text-center text-sm text-[#626c68] dark:text-gray-400">
                        No daily sales data available.
                    </p>
                ) : (
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={dailySalesChartData}
                                margin={{ top: 8, right: 8, left: 0, bottom: 4 }}
                            >
                                <CartesianGrid
                                    stroke="#e5e8ed"
                                    strokeDasharray="3 5"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fill: "#626c68", fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fill: "#626c68", fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(value) =>
                                        value >= 1000 ? `₹${value / 1000}k` : `₹${value}`
                                    }
                                />
                                <Tooltip
                                    formatter={(value) =>
                                        `₹${Number(value).toLocaleString("en-IN")}`
                                    }
                                    contentStyle={{
                                        borderRadius: "10px",
                                        border: "1px solid #e0e3e8",
                                        fontSize: "12px",
                                    }}
                                />
                                <Bar
                                    dataKey="sales"
                                    name="Sales"
                                    fill="#7a9e8f"
                                    radius={[5, 5, 0, 0]}
                                    maxBarSize={34}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </article>

            {/* Payment Methods */}
            <article className="min-w-0 rounded-xl border border-[#e0e3e8] bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
                <div className="mb-5">
                    <h3 className="font-serif text-2xl text-[#181c20] dark:text-white">
                        Payment Statistics
                    </h3>
                    <p className="mt-1 text-sm text-[#626c68] dark:text-gray-400">
                        Payment totals by method
                    </p>
                </div>

                {paymentStatisticsLoading ? (
                    <p className="py-12 text-center text-sm text-[#626c68] dark:text-gray-400">
                        Loading payment statistics...
                    </p>
                ) : paymentChartData.length === 0 ? (
                    <p className="py-12 text-center text-sm text-[#626c68] dark:text-gray-400">
                        No payment data available.
                    </p>
                ) : (
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={paymentChartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={95}
                                    paddingAngle={3}
                                    stroke="none"
                                >
                                    {paymentChartData.map((_, index) => (
                                        <Cell
                                            key={`payment-${index}`}
                                            fill={[
                                                "#436558",
                                                "#7a9e8f",
                                                "#f0bba5",
                                                "#beaa77",
                                            ][index % 4]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) =>
                                        `₹${Number(value).toLocaleString("en-IN")}`
                                    }
                                    contentStyle={{
                                        borderRadius: "10px",
                                        border: "1px solid #e0e3e8",
                                        fontSize: "12px",
                                    }}
                                />
                                <Legend wrapperStyle={{ fontSize: "12px" }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </article>
        </section>

        {/* Top Selling Products */}
        <section className="rounded-xl border border-[#e0e3e8] bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
            <div className="mb-5">
                <h3 className="font-serif text-2xl text-[#181c20] dark:text-white">
                    Top Selling Products
                </h3>
                <p className="mt-1 text-sm text-[#626c68] dark:text-gray-400">
                    Best-performing products by units sold
                </p>
            </div>

            {topProductsLoading ? (
                <p className="py-12 text-center text-sm text-[#626c68] dark:text-gray-400">
                    Loading top products...
                </p>
            ) : topProductsChartData.length === 0 ? (
                <p className="py-12 text-center text-sm text-[#626c68] dark:text-gray-400">
                    No product sales data available.
                </p>
            ) : (
                <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={topProductsChartData}
                            layout="vertical"
                            margin={{ top: 4, right: 18, left: 12, bottom: 4 }}
                        >
                            <CartesianGrid
                                stroke="#e5e8ed"
                                strokeDasharray="3 5"
                                horizontal={false}
                            />
                            <XAxis
                                type="number"
                                tick={{ fill: "#626c68", fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                type="category"
                                dataKey="name"
                                width={130}
                                tick={{ fill: "#626c68", fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: "10px",
                                    border: "1px solid #e0e3e8",
                                    fontSize: "12px",
                                }}
                            />
                            <Bar
                                dataKey="sold"
                                name="Units Sold"
                                fill="#7a9e8f"
                                radius={[0, 5, 5, 0]}
                                maxBarSize={28}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </section>
    </div>
);

}

export default AdminDashboard;
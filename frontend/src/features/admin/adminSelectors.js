// Main dashboard statistics.
export const selectAdminOverview = (state) =>
    state.admin.overview;

// Main dashboard loading state.
export const selectAdminLoading = (state) =>
    state.admin.loading;

// Main dashboard error.
export const selectAdminError = (state) =>
    state.admin.error;

// Recent orders.
export const selectRecentOrders = (state) =>
    state.admin.recentOrders;

export const selectRecentOrdersLoading = (state) =>
    state.admin.recentOrdersLoading;

export const selectRecentOrdersError = (state) =>
    state.admin.recentOrdersError;

// Recent customers.
export const selectRecentCustomers = (state) =>
    state.admin.recentCustomers;

export const selectRecentCustomersLoading = (state) =>
    state.admin.recentCustomersLoading;

export const selectRecentCustomersError = (state) =>
    state.admin.recentCustomersError;

// Low-stock products.
export const selectLowStockProducts = (state) =>
    state.admin.lowStockProducts;

export const selectLowStockLoading = (state) =>
    state.admin.lowStockLoading;

export const selectLowStockError = (state) =>
    state.admin.lowStockError;

// Daily sales.
export const selectSales = (state) =>
    state.admin.sales;

export const selectSalesLoading = (state) =>
    state.admin.salesLoading;

// Monthly sales.
export const selectMonthlySales = (state) =>
    state.admin.monthlySales;

export const selectMonthlySalesLoading = (state) =>
    state.admin.monthlySalesLoading;

// Order statistics.
export const selectOrderStatistics = (state) =>
    state.admin.orderStatistics;

export const selectOrderStatisticsLoading = (state) =>
    state.admin.orderStatisticsLoading;

// Payment statistics.
export const selectPaymentStatistics = (state) =>
    state.admin.paymentStatistics;

export const selectPaymentStatisticsLoading = (state) =>
    state.admin.paymentStatisticsLoading;

// Top-selling products.
export const selectTopSellingProducts = (state) =>
    state.admin.topSellingProducts;

export const selectTopProductsLoading = (state) =>
    state.admin.topProductsLoading;
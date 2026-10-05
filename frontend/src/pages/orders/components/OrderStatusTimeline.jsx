// Order statuses used by the backend
const ORDER_STATUSES = [
    "pending",
    "confirmed",
    "shipped",
    "delivered",
];

// Display-friendly labels
const STATUS_LABELS = {
    pending: "Order Placed",
    confirmed: "Confirmed",
    shipped: "Shipped",
    delivered: "Delivered",
};

// Order status timeline component
function OrderStatusTimeline({ status }) {
    // Check whether the order was cancelled
    const isCancelled = status === "cancelled";

    // Find the current status position
    const currentStatusIndex =
        ORDER_STATUSES.indexOf(status);

    return (
        <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">

            {/* Section heading */}
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Order Status
            </h2>

            {/* Cancelled order */}
            {isCancelled ? (
                <div className="mt-6 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                    <p className="font-semibold text-red-700 dark:text-red-400">
                        Order Cancelled
                    </p>

                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        This order has been cancelled.
                    </p>
                </div>
            ) : (
                <div className="mt-6">

                    {/* Status timeline */}
                    {ORDER_STATUSES.map(
                        (orderStatus, index) => {
                            // Check whether this status is completed
                            const isCompleted =
                                currentStatusIndex >= index;

                            // Check whether this is the current status
                            const isCurrent =
                                currentStatusIndex === index;

                            return (
                                <div
                                    key={orderStatus}
                                    className="flex"
                                >

                                    {/* Timeline indicator */}
                                    <div className="flex flex-col items-center">

                                        {/* Circle */}
                                        <div
                                            className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold ${
                                                isCompleted
                                                    ? "border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900"
                                                    : "border-gray-300 text-gray-400 dark:border-gray-600"
                                            }`}
                                        >
                                            {isCompleted
                                                ? "✓"
                                                : index + 1}
                                        </div>

                                        {/* Connecting line */}
                                        {index <
                                            ORDER_STATUSES.length -
                                                1 && (
                                            <div
                                                className={`h-10 w-0.5 ${
                                                    currentStatusIndex >
                                                    index
                                                        ? "bg-gray-900 dark:bg-white"
                                                        : "bg-gray-300 dark:bg-gray-600"
                                                }`}
                                            />
                                        )}
                                    </div>

                                    {/* Status information */}
                                    <div className="ml-4 pb-6">
                                        <p
                                            className={`font-medium ${
                                                isCompleted
                                                    ? "text-gray-900 dark:text-white"
                                                    : "text-gray-500 dark:text-gray-400"
                                            }`}
                                        >
                                            {
                                                STATUS_LABELS[
                                                    orderStatus
                                                ]
                                            }
                                        </p>

                                        {isCurrent && (
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                Current status
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        }
                    )}
                </div>
            )}
        </section>
    );
}

export default OrderStatusTimeline;
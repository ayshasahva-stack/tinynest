
const ORDER_STATUSES = [
    { value: "pending", label: "Order Placed" },
    { value: "confirmed", label: "Confirmed" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
];

function OrderStatusTimeline({ status }) {
    const isCancelled = status === "cancelled";
    const currentIndex = ORDER_STATUSES.findIndex(
        (item) => item.value === status
    );

    // A cancelled order needs a separate message, not a completed timeline.
    if (isCancelled) {
        return (
            <section className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-900 sm:p-6">
                <div className="flex items-start gap-3 rounded-lg bg-[#ffdad6] p-4 text-[#93000a] dark:bg-red-950 dark:text-red-200">
                    <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/70 font-bold"
                        aria-hidden="true"
                    >
                        !
                    </span>

                    <div>
                        <h2 className="font-semibold">
                            Order Cancelled
                        </h2>
                        <p className="mt-1 text-sm">
                            This order has been cancelled. Please refer to the payment details for the latest payment status.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="rounded-xl bg-white p-5 shadow-[0_2px_10px_rgba(24,28,32,0.035)] dark:bg-gray-900 sm:p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#436558]">
                        Order progress
                    </p>

                    <h2 className="mt-1 font-serif text-2xl font-normal text-[#181c20] dark:text-white">
                        Track your order
                    </h2>
                </div>

                <span className="rounded-full bg-[#e5f4ed] px-3 py-1.5 text-xs font-semibold text-[#315e4d] dark:bg-emerald-950 dark:text-emerald-200">
                    {currentIndex >= 0
                        ? ORDER_STATUSES[currentIndex].label
                        : "Status updating"}
                </span>
            </div>

            {/* Horizontal on larger screens, vertically stacked on small screens. */}
            <div className="relative">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-5 sm:gap-2">
                    {ORDER_STATUSES.map((item, index) => {
                        const isCompleted =
                            currentIndex >= 0 && index < currentIndex;
                        const isCurrent = index === currentIndex;
                        const isReached =
                            currentIndex >= 0 && index <= currentIndex;

                        return (
                            <div
                                key={item.value}
                                className="relative flex items-center gap-3 sm:flex-col sm:items-center sm:text-center"
                            >
                                {/* Progress track behind the indicators on desktop. */}
                                {index < ORDER_STATUSES.length - 1 && (
                                    <div className="absolute left-4 top-9 h-[calc(100%+1rem)] w-0.5 bg-[#e0e3e8] sm:left-[calc(50%+18px)] sm:top-[18px] sm:h-0.5 sm:w-[calc(100%-36px)]">
                                        <div
                                            className={`h-full w-full origin-top bg-[#436558] transition-colors sm:origin-left ${
                                                isCompleted
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            }`}
                                        />
                                    </div>
                                )}

                                {/* Step indicator. */}
                                <div
                                    className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors ${
                                        isReached
                                            ? "border-[#436558] bg-[#436558] text-white"
                                            : "border-[#c1c8c3] bg-white text-[#717974] dark:border-gray-600 dark:bg-gray-900"
                                    } ${
                                        isCurrent
                                            ? "ring-4 ring-[#c5ebda]"
                                            : ""
                                    }`}
                                    aria-current={isCurrent ? "step" : undefined}
                                >
                                    {isCompleted ? "✓" : index + 1}
                                </div>

                                {/* Step label. */}
                                <div className="relative z-10 min-w-0 pb-1 sm:mt-3 sm:pb-0">
                                    <p
                                        className={`text-sm sm:text-xs ${
                                            isCurrent
                                                ? "font-bold text-[#436558] dark:text-emerald-300"
                                                : isCompleted
                                                    ? "font-semibold text-[#414845] dark:text-gray-200"
                                                    : "font-medium text-[#717974] dark:text-gray-500"
                                        }`}
                                    >
                                        {item.label}
                                    </p>

                                    {isCurrent && (
                                        <p className="mt-1 text-xs text-[#626c68] dark:text-gray-400">
                                            Current status
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default OrderStatusTimeline;

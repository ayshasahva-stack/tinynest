function EmptyState({
    title = "No items found",
    message = "There is nothing to display right now.",
}) {
    return (
        <div className="flex min-h-40 flex-col items-center justify-center px-4 text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
            </h3>

            <p className="mt-2 max-w-md text-sm text-gray-600 dark:text-gray-400">
                {message}
            </p>
        </div>
    );
}

export default EmptyState;
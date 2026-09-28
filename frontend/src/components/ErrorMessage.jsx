// Reusable error message component
function ErrorMessage({
    title = "Something went wrong",
    message = "Unable to load the requested data.",
}) {
    return (
        <div className="flex min-h-40 flex-col items-center justify-center px-4 text-center">
            {/* Error title */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
            </h3>

            {/* Error description */}
            <p className="mt-2 max-w-md text-sm text-gray-600 dark:text-gray-400">
                {message}
            </p>
        </div>
    );
}

export default ErrorMessage;
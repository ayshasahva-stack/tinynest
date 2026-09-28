// Reusable loading component
function Loading() {
    return (
        <div className="flex min-h-40 items-center justify-center">
            {/* Loading message */}
            <p className="text-gray-600 dark:text-gray-400">
                Loading...
            </p>
        </div>
    );
}

export default Loading;
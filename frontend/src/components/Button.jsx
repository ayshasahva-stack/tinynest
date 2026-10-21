
 // Reusable button component used across TinyNest.
function Button({
    children,
    type = "button",
    onClick,
    disabled = false,
    variant = "default", // "auth" applies authentication-specific styling.
    fullWidth = false,   // Makes the button fill its parent's width when true.
}) {
    // Preserve the existing button appearance by default.
    const defaultClasses =
        "rounded-lg bg-gray-900 px-5 py-3 font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200";

    // Soft sage-green styling for authentication forms.
    const authClasses =
        "rounded-xl bg-[#6F8F7B] px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-[#5C7967] focus:outline-none focus:ring-2 focus:ring-[#7A9E8F]/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#8EAD98] dark:text-[#18231B] dark:hover:bg-[#A1BBA8] dark:focus:ring-offset-[#202622]";

    // Use the requested style variant.
    const buttonClasses =
        variant === "auth" ? authClasses : defaultClasses;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${buttonClasses} ${
                fullWidth ? "w-full" : ""
            }`}
        >
            {children}
        </button>
    );
}

export default Button;

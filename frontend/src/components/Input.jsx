
 // Reusable input component used across TinyNest.
function Input({
    label,
    type = "text",
    name,
    value,
    onChange,
    placeholder = "",
    disabled = false,
    variant = "default", // "auth" applies the new authentication design.
}) {
    // Keep the existing appearance by default.
    const defaultClasses =
        "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-white dark:focus:ring-gray-700";

    // Softer styling for Login, Register, and other authentication forms.
    const authClasses =
        "w-full rounded-xl border border-[#E5E7E2] bg-[#FCFCFA] px-4 py-3 text-sm text-[#2B2F33] outline-none transition placeholder:text-[#A0A59F] focus:border-[#7A9E8F] focus:ring-2 focus:ring-[#7A9E8F]/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#414A43] dark:bg-[#252C27] dark:text-[#F3F4F1] dark:placeholder:text-[#89938B] dark:focus:border-[#A9C6B0] dark:focus:ring-[#A9C6B0]/20";

    // Select the correct style based on the variant prop.
    const inputClasses =
        variant === "auth" ? authClasses : defaultClasses;

    return (
        <div className="w-full">
            {/* Show a label only when one is provided. */}
            {label && (
                <label
                    htmlFor={name}
                    className={`mb-2 block text-sm font-medium ${
                        variant === "auth"
                            ? "text-[#46564B] dark:text-[#D7E0D7]"
                            : "text-gray-700 dark:text-gray-300"
                    }`}
                >
                    {label}
                </label>
            )}

            {/* Controlled input: value and onChange come from the parent. */}
            <input
                id={name}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={inputClasses}
            />
        </div>
    );
}

export default Input;

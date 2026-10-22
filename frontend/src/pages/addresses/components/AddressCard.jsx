
import Button from "../../../components/Button";

// Displays one saved delivery address in the redesigned account page.
function AddressCard({
    address,
    onEdit,
    onDelete,
    onSetDefault,
}) {
    return (
        <article className="flex h-full flex-col rounded-xl border border-[#edf0f5] bg-white p-5 shadow-[0_2px_8px_rgba(24,28,32,0.025)] transition-shadow hover:shadow-[0_6px_18px_rgba(24,28,32,0.06)] dark:border-gray-800 dark:bg-gray-900">

            {/* Address type and default status. */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                    {address.isDefault ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#c5ebda] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#2b4d41] dark:bg-emerald-950 dark:text-emerald-200">
                            <span aria-hidden="true">✓</span>
                            Default Delivery
                        </span>
                    ) : (
                        <span className="rounded-full bg-[#f1f4f9] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#626c68] dark:bg-gray-800 dark:text-gray-300">
                            Saved Address
                        </span>
                    )}
                </div>

                {address.isDefault && (
                    <span
                        title="Default delivery address"
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e5f4ed] text-[#436558] dark:bg-emerald-950 dark:text-emerald-200"
                    >
                        ✓
                    </span>
                )}
            </div>

            {/* Recipient details. */}
            <div>
                <h2 className="break-words font-serif text-xl leading-7 text-[#181c20] dark:text-white">
                    {address.fullName}
                </h2>

                <p className="mt-2 flex items-start gap-2 text-sm text-[#626c68] dark:text-gray-400">
                    <span aria-hidden="true" className="font-semibold text-[#436558]">
                        ☎
                    </span>
                    <span>{address.phone}</span>
                </p>
            </div>

            {/* Full address. */}
            <div className="mt-4 flex-1">
                <p className="break-words text-sm leading-6 text-[#414845] dark:text-gray-300">
                    {address.addressLine}
                </p>

                <p className="mt-1 break-words text-sm leading-6 text-[#414845] dark:text-gray-300">
                    {address.city}, {address.state} — {address.postalCode}
                </p>

                <p className="mt-1 text-xs text-[#717974] dark:text-gray-400">
                    {address.country}
                </p>
            </div>

            {/* Address status and actions. */}
            
{/* Bottom action row: status on the left, actions on the right. */}
<div className="mt-5 flex items-center justify-between gap-3 border-t border-[#edf0f5] pt-4 dark:border-gray-800">

    {/* Default status or Set as Default action. */}
    {address.isDefault ? (
        <div className="flex min-w-0 items-center gap-2 text-sm text-[#436558] dark:text-emerald-300">
            {/* Check icon for the active default address. */}
            <svg
                className="h-4 w-4 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <path d="m5 12 4 4L19 6" />
            </svg>

            <span>Active Primary Billing</span>
        </div>
    ) : (
        <button
            type="button"
            onClick={() => onSetDefault(address._id)}
            className="flex min-w-0 items-center gap-2 text-sm text-[#436558] transition hover:text-[#315447] dark:text-emerald-300"
            aria-label="Set this address as default"
        >
            {/* Empty circular selector, matching the reference. */}
            <svg
                className="h-[18px] w-[18px] shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
            >
                <circle cx="12" cy="12" r="9" />
            </svg>

            <span className="whitespace-nowrap">Set as Default</span>
        </button>
    )}

    {/* Edit and delete icon buttons. */}
    <div className="flex shrink-0 items-center gap-4">

        {/* Edit address. */}
        <button
            type="button"
            onClick={() => onEdit(address)}
            className="rounded-md p-1.5 text-[#414845] transition hover:bg-[#f1f4f9] hover:text-[#436558] focus:outline-none focus:ring-2 focus:ring-[#436558] dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label="Edit address"
            title="Edit address"
        >
            <svg
                className="h-[19px] w-[19px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
            </svg>
        </button>

        {/* Delete address. */}
        <button
            type="button"
            onClick={() => onDelete(address._id)}
            className="rounded-md p-1.5 text-[#a4aaa7] transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 dark:hover:bg-red-950"
            aria-label="Delete address"
            title="Delete address"
        >
            <svg
                className="h-[19px] w-[19px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <path d="M3 6h18" />
                <path d="M8 6V4h8v2" />
                <path d="m19 6-1 14H6L5 6" />
                <path d="M10 10v6M14 10v6" />
            </svg>
        </button>
    </div>
</div>

        </article>
    );
}

export default AddressCard;

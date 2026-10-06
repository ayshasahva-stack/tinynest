import Button from "../../../components/Button";

// Displays one saved address
function AddressCard({
    address,
    onEdit,
    onDelete,
    onSetDefault,
}) {
    return (
        <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-800">

            {/* Address header */}
            <div className="mb-3 flex items-start justify-between gap-3">

                <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                        {address.fullName}
                    </h3>

                    {address.isDefault && (
                        <span className="mt-1 inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            Default Address
                        </span>
                    )}
                </div>

            </div>

            {/* Address details */}
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">

                <p>{address.addressLine}</p>

                <p>
                    {address.city}, {address.state}
                </p>

                <p>
                    {address.postalCode}, {address.country}
                </p>

                <p>
                    Phone: {address.phone}
                </p>

            </div>

            {/* Actions */}
            <div className="mt-5 flex flex-wrap gap-2">

                <Button
                    type="button"
                    onClick={() => onEdit(address)}
                >
                    Edit
                </Button>

                <Button
                    type="button"
                    onClick={() => onDelete(address._id)}
                >
                    Delete
                </Button>

                {!address.isDefault && (
                    <Button
                        type="button"
                        onClick={() => onSetDefault(address._id)}
                    >
                        Set as Default
                    </Button>
                )}

            </div>

        </div>
    );
}

export default AddressCard;
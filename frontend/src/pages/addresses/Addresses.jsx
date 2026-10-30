
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { addressSchema } from "../../validations/address/addressSchema";

import Input from "../../components/Input";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import ErrorMessage from "../../components/ErrorMessage";
import AccountSidebar from "../../components/AccounSidebar";

import AddressCard from "./components/AddressCard";


import {
    getMyAddressesThunk,
    createAddressThunk,
    updateAddressThunk,
    deleteAddressThunk,
    setDefaultAddressThunk,
} from "../../features/addresses/addressThunk";

import {
    selectAddresses,
    selectAddressLoading,
    selectAddressError,
} from "../../features/addresses/addressSelectors";

// Initial values for a new address.
const initialForm = {
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    isDefault: false,
};

// Inline SVG icons used by the address page.
function InlineIcon({ name, className = "h-5 w-5" }) {
    const common = {
        className,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.7,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": true,
    };

    const paths = {
        address: (
            <>
                <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
                <circle cx="12" cy="10" r="2.2" />
            </>
        ),
        search: (
            <>
                <circle cx="10.8" cy="10.8" r="6.8" />
                <path d="m16 16 4.2 4.2" />
            </>
        ),
        plus: (
            <>
                <path d="M12 5v14M5 12h14" />
            </>
        ),
    };

    return <svg {...common}>{paths[name] ?? paths.address}</svg>;
}

function Addresses() {
    const dispatch = useDispatch();

    // Read saved addresses and request state from Redux.
    const addresses = useSelector(selectAddresses) ?? [];
    const loading = useSelector(selectAddressLoading);
    const error = useSelector(selectAddressError);
    const user = useSelector((state) => state.auth.user);

    // Read the authenticated user for the shared account sidebar.

    // Local state for the address form and search field.
    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [formError, setFormError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const {
        control,
        register,
        handleSubmit: handleFormSubmit,
        reset,
        formState: { errors: validationErrors },
    } = useForm({
        resolver: yupResolver(addressSchema),
        mode: "onChange",
        defaultValues: initialForm,
    });
    // Fetch the user's saved addresses when the page opens.
    useEffect(() => {
        dispatch(getMyAddressesThunk());
    }, [dispatch]);

    // Filter addresses by the customer's actual saved information.
    const filteredAddresses = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        if (!query) return addresses;

        return addresses.filter((address) => {
            const searchableText = [
                address.fullName,
                address.phone,
                address.addressLine,
                address.city,
                address.state,
                address.postalCode,
                address.country,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchableText.includes(query);
        });
    }, [addresses, searchTerm]);

    // Handle input changes, including the default-address checkbox.


    // Open a clean form for adding a new address.
  const handleAddNew = () => {
    setEditingAddress(null);
    reset(initialForm);
    setFormError("");
    setShowForm(true);
};

    // Fill the form with the selected address for editing.
    const handleEdit = (address) => {
        setEditingAddress(address);

        // Fill the form with the selected saved address.
        reset({
            fullName: address.fullName || "",
            phone: address.phone || "",
            addressLine: address.addressLine || "",
            city: address.city || "",
            state: address.state || "",
            postalCode: address.postalCode || "",
            country: address.country || "India",
            isDefault: Boolean(address.isDefault),
        });

        setFormError("");
        setShowForm(true);
    };

    // Close the form and reset its local state.
    const handleCancel = () => {
        setShowForm(false);
        setEditingAddress(null);

        // Clear all form values and validation errors.
        reset(initialForm);

        setFormError("");
    };


    // Create a new address or update the selected address.
    const handleAddressSubmit = async (data) => {
        setFormError("");

        try {
            // Use validated form data for both create and update.
            if (editingAddress) {
                // Update the existing saved address.
                await dispatch(
                    updateAddressThunk({
                        addressId: editingAddress._id,
                        addressData: data,
                    })
                ).unwrap();
            } else {
                // Create a new saved address.
                await dispatch(
                    createAddressThunk(data)
                ).unwrap();
            }

            // Close and reset the form after successful saving.
            handleCancel();

            // Refresh the saved address list.
            await dispatch(getMyAddressesThunk()).unwrap();

        } catch (err) {
            // Display backend errors separately from Yup errors.
            setFormError(
                typeof err === "string"
                    ? err
                    : "We couldn't save this address. Please try again."
            );
        }
    };

    // Delete an address only after customer confirmation.
    const handleDelete = async (addressId) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this address?"
            )
        ) {
            return;
        }

        try {
            await dispatch(
                deleteAddressThunk(addressId)
            ).unwrap();

            await dispatch(
                getMyAddressesThunk()
            ).unwrap();
        } catch (err) {
            console.error("Delete address failed:", err);
        }
    };

    // Set the selected address as the default delivery address.
    const handleSetDefault = async (addressId) => {
        try {
            await dispatch(
                setDefaultAddressThunk(addressId)
            ).unwrap();

            await dispatch(
                getMyAddressesThunk()
            ).unwrap();
        } catch (err) {
            console.error("Set default address failed:", err);
        }
    };

    return (
        <main className="min-h-screen bg-[#f7f9ff] px-4 pb-12 pt-6 font-sans text-[#181c20] dark:bg-gray-950 dark:text-gray-100 sm:px-6 lg:px-8 lg:pt-8">
            {/* Match the Profile page's fixed-width sidebar layout. */}
            <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-8 lg:grid-cols-[290px_minmax(0,1fr)]">

                {/* Shared sidebar used by Profile, Orders and Addresses. */}
                <AccountSidebar user={user} />

                {/* Main saved-address content. */}
                <section className="min-w-0 space-y-5">
                    {/* Page heading and Add Address button. */}
                    <header className="flex flex-col justify-between gap-4 rounded-xl bg-white p-5 shadow-[0_1px_3px_rgba(24,28,32,0.035)] dark:bg-gray-900 sm:p-6 md:flex-row md:items-center">
                        <div>
                            <span className="mb-2 inline-flex rounded-full bg-[#e5f4ed] px-2.5 py-1 text-[10px] font-semibold text-[#315e4d] dark:bg-emerald-950 dark:text-emerald-200">
                                Your delivery details
                            </span>

                            <h1 className="font-serif text-3xl font-normal tracking-tight text-[#181c20] dark:text-white sm:text-4xl">
                                Saved Addresses
                            </h1>

                            <p className="mt-2 max-w-xl text-sm leading-6 text-[#626c68] dark:text-gray-400">
                                Manage your delivery locations for a faster checkout.
                            </p>
                        </div>

                        {!showForm && (
                            <button
                                type="button"
                                onClick={handleAddNew}
                                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#436558] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#315447]"
                            >
                                <InlineIcon
                                    name="plus"
                                    className="h-4 w-4"
                                />
                                Add New Address
                            </button>
                        )}
                    </header>

                    {/* Show errors returned by the address API. */}
                    {error && <ErrorMessage message={error} />}

                    {/* Search the customer's saved addresses. */}
                    {!showForm && addresses.length > 0 && (
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2">
                                <span className="rounded-full bg-[#436558] px-4 py-2 text-xs font-semibold text-white">
                                    All Addresses ({addresses.length})
                                </span>

                                <span className="text-xs text-[#626c68] dark:text-gray-400">
                                    {
                                        addresses.filter(
                                            (address) => address.isDefault
                                        ).length
                                    }{" "}
                                    default
                                </span>
                            </div>

                            <label className="relative flex w-full items-center sm:max-w-xs">
                                <InlineIcon
                                    name="search"
                                    className="absolute left-3.5 h-5 w-5 text-[#717974]"
                                />

                                <input
                                    type="search"
                                    value={searchTerm}
                                    onChange={(event) =>
                                        setSearchTerm(event.target.value)
                                    }
                                    placeholder="Search name, city or pincode..."
                                    className="h-11 w-full rounded-lg border-0 bg-white pl-11 pr-4 text-sm text-[#181c20] shadow-sm outline-none placeholder:text-[#717974] focus:ring-1 focus:ring-[#436558] dark:bg-gray-900 dark:text-white"
                                />
                            </label>
                        </div>
                    )}

                    {/* Add/edit form uses the existing address fields and thunks. */}
                    {showForm && (
                        <section className="rounded-xl border border-[#edf0f5] bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
                            <div className="mb-6">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#436558]">
                                    Delivery information
                                </span>

                                <h2 className="mt-1 font-serif text-2xl text-[#181c20] dark:text-white">
                                    {editingAddress
                                        ? "Edit Address"
                                        : "Add Delivery Address"}
                                </h2>

                                <p className="mt-2 text-sm text-[#626c68] dark:text-gray-400">
                                    Enter the details where you want your TinyNest orders delivered.
                                </p>
                            </div>

                            {formError && (
                                <div className="mb-4">
                                    <ErrorMessage message={formError} />
                                </div>
                            )}

                            <form
                                onSubmit={handleFormSubmit(handleAddressSubmit)}
                                className="space-y-4"
                            >
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Controller
                                        name="fullName"
                                        control={control}
                                        render={({ field }) => (
                                            <div>
                                                <Input
                                                    label="Full Name"
                                                    name={field.name}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    onBlur={field.onBlur}
                                                    placeholder="Enter full name"
                                                />
                                                {validationErrors.fullName && (
                                                    <p className="mt-1 text-xs text-red-600">
                                                        {validationErrors.fullName.message}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    />

                                    <Controller
                                        name="phone"
                                        control={control}
                                        render={({ field }) => (
                                            <div>
                                                <Input
                                                    label="Phone"
                                                    name={field.name}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    onBlur={field.onBlur}
                                                    placeholder="Enter phone number"
                                                />
                                                {validationErrors.phone && (
                                                    <p className="mt-1 text-xs text-red-600">
                                                        {validationErrors.phone.message}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    />
                                </div>

                                <Controller
                                    name="addressLine"
                                    control={control}
                                    render={({ field }) => (
                                        <div>
                                            <Input
                                                label="Address"
                                                name={field.name}
                                                value={field.value}
                                                onChange={field.onChange}
                                                onBlur={field.onBlur}
                                                placeholder="House, street, area or landmark"
                                            />
                                            {validationErrors.addressLine && (
                                                <p className="mt-1 text-xs text-red-600">
                                                    {validationErrors.addressLine.message}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                />

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Controller
                                        name="city"
                                        control={control}
                                        render={({ field }) => (
                                            <div>
                                                <Input
                                                    label="City"
                                                    name={field.name}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    onBlur={field.onBlur}
                                                    placeholder="Enter city"
                                                />
                                                {validationErrors.city && (
                                                    <p className="mt-1 text-xs text-red-600">
                                                        {validationErrors.city.message}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    />

                                    <Controller
                                        name="state"
                                        control={control}
                                        render={({ field }) => (
                                            <div>
                                                <Input
                                                    label="State"
                                                    name={field.name}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    onBlur={field.onBlur}
                                                    placeholder="Enter state"
                                                />
                                                {validationErrors.state && (
                                                    <p className="mt-1 text-xs text-red-600">
                                                        {validationErrors.state.message}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    />
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Controller
                                        name="postalCode"
                                        control={control}
                                        render={({ field }) => (
                                            <div>
                                                <Input
                                                    label="Postal Code"
                                                    name={field.name}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    onBlur={field.onBlur}
                                                    placeholder="Enter postal code"
                                                />
                                                {validationErrors.postalCode && (
                                                    <p className="mt-1 text-xs text-red-600">
                                                        {validationErrors.postalCode.message}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    />

                                    <Controller
                                        name="country"
                                        control={control}
                                        render={({ field }) => (
                                            <div>
                                                <Input
                                                    label="Country"
                                                    name={field.name}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    onBlur={field.onBlur}
                                                    placeholder="Enter country"
                                                />
                                                {validationErrors.country && (
                                                    <p className="mt-1 text-xs text-red-600">
                                                        {validationErrors.country.message}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    />
                                </div>

                                <label className="flex cursor-pointer items-center gap-3 rounded-lg bg-[#f1f4f9] p-4 text-sm text-[#414845] dark:bg-gray-800 dark:text-gray-200">
                                    <input
                                        type="checkbox"
                                        {...register("isDefault")}
                                        className="h-4 w-4 accent-[#436558]"
                                    />

                                    <span>
                                        <span className="block font-semibold">
                                            Set as default address
                                        </span>

                                        <span className="mt-1 block text-xs text-[#626c68] dark:text-gray-400">
                                            Use this address by default during checkout.
                                        </span>
                                    </span>
                                </label>

                                <div className="flex flex-wrap gap-3 border-t border-[#edf0f5] pt-5 dark:border-gray-800">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="rounded-lg bg-[#436558] px-6 py-3 font-semibold text-white transition hover:bg-[#315447] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {loading
                                            ? "Saving..."
                                            : editingAddress
                                                ? "Update Address"
                                                : "Save Address"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        disabled={loading}
                                        className="rounded-lg border border-[#436558] bg-white px-6 py-3 font-semibold text-[#436558] transition hover:bg-[#e5f4ed] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-900 dark:text-emerald-300"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </section>
                    )}

                    {/* Loading state. */}
                    {loading && !showForm && (
                        <div className="rounded-xl bg-white p-8 dark:bg-gray-900">
                            <Loading />
                        </div>
                    )}

                    {/* Empty state when no addresses have been saved. */}
                    {!loading &&
                        addresses.length === 0 &&
                        !showForm && (
                            <section className="rounded-xl bg-white px-5 py-12 text-center shadow-sm dark:bg-gray-900">
                                <EmptyState
                                    title="No saved addresses"
                                    message="Add your delivery address to make checkout faster."
                                />

                                <button
                                    type="button"
                                    onClick={handleAddNew}
                                    className="mt-4 rounded-full bg-[#436558] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#315447]"
                                >
                                    Add Your First Address
                                </button>
                            </section>
                        )}

                    {/* Empty state when the search returns no matches. */}
                    {!loading &&
                        addresses.length > 0 &&
                        filteredAddresses.length === 0 &&
                        !showForm && (
                            <section className="rounded-xl bg-white p-8 text-center shadow-sm dark:bg-gray-900">
                                <p className="font-serif text-xl text-[#181c20] dark:text-white">
                                    No matching addresses
                                </p>

                                <p className="mt-2 text-sm text-[#626c68] dark:text-gray-400">
                                    Try another name, city, street or postal code.
                                </p>
                            </section>
                        )}

                    {/* Saved address cards. */}
                    {!loading &&
                        filteredAddresses.length > 0 &&
                        !showForm && (
                            <div className="grid items-stretch gap-4 xl:grid-cols-2">
                                {filteredAddresses.map((address) => (
                                    <AddressCard
                                        key={address._id}
                                        address={address}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onSetDefault={handleSetDefault}
                                    />
                                ))}

                                {/* Add-address card; this is not a saved address. */}
                                <button
                                    type="button"
                                    onClick={handleAddNew}
                                    className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-[#c1c8c3] bg-[#f1f4f9]/70 p-6 text-center transition hover:border-[#436558] hover:bg-[#e5f4ed]/60 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
                                >
                                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#436558] shadow-sm dark:bg-gray-800">
                                        <InlineIcon
                                            name="plus"
                                            className="h-6 w-6"
                                        />
                                    </span>

                                    <span className="mt-4 font-serif text-xl text-[#181c20] dark:text-white">
                                        Add Delivery Address
                                    </span>

                                    <span className="mt-2 text-sm text-[#626c68] dark:text-gray-400">
                                        Add another location for convenient delivery.
                                    </span>

                                    <span className="mt-4 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#436558] shadow-sm dark:bg-gray-800 dark:text-emerald-200">
                                        + Add Address →
                                    </span>
                                </button>
                            </div>
                        )}

                    {/* Delivery reassurance panel. */}
                    {!showForm && (
                        <section className="flex flex-col gap-4 rounded-xl bg-gradient-to-r from-[#e5f4ed] via-[#f1f4f9] to-[#f8eeec] p-5 dark:from-emerald-950/50 dark:via-gray-900 dark:to-[#382925] sm:flex-row sm:items-center">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#436558] text-white">
                                <InlineIcon
                                    name="address"
                                    className="h-6 w-6"
                                />
                            </div>

                            <div>
                                <h2 className="font-serif text-xl text-[#181c20] dark:text-white">
                                    Safe, convenient deliveries
                                </h2>

                                <p className="mt-1 text-sm leading-6 text-[#626c68] dark:text-gray-300">
                                    Keep your address and contact information accurate to help your TinyNest essentials reach you smoothly.
                                </p>
                            </div>
                        </section>
                    )}
                </section>
            </div>
        </main>
    );
}

export default Addresses;

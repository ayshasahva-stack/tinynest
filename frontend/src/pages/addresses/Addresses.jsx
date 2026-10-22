
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";

import Input from "../../components/Input";
import Button from "../../components/Button";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import ErrorMessage from "../../components/ErrorMessage";
import AddressCard from "./components/AddressCard";

import { selectAuthUser } from "../../features/auth/authSelectors";

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

// Keep icons consistent with the redesigned My Orders sidebar.
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
        overview: (
            <>
                <rect x="3.5" y="3.5" width="6" height="6" />
                <rect x="14.5" y="3.5" width="6" height="6" />
                <rect x="3.5" y="14.5" width="6" height="6" />
                <rect x="14.5" y="14.5" width="6" height="6" />
            </>
        ),
        orders: (
            <>
                <path d="m4 7 8-4 8 4-8 4-8-4Z" />
                <path d="M4 7v10l8 4 8-4V7M12 11v10" />
            </>
        ),
        address: (
            <>
                <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
                <circle cx="12" cy="10" r="2.2" />
            </>
        ),
        heart: (
            <path d="M20.8 8.8c0 5.1-8.8 10.3-8.8 10.3S3.2 13.9 3.2 8.8A4.7 4.7 0 0 1 12 6.1a4.7 4.7 0 0 1 8.8 2.7Z" />
        ),
        kits: (
            <>
                <rect x="3.5" y="7" width="17" height="13" rx="2" />
                <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3.5 12h17" />
            </>
        ),
        settings: (
            <>
                <circle cx="12" cy="12" r="3" />
                <path d="m19.4 15 .1.1a1.7 1.7 0 0 1-2.4 2.4l-.1-.1a1.7 1.7 0 0 0-2.9 1.2v.2a1.7 1.7 0 0 1-3.4 0v-.2a1.7 1.7 0 0 0-2.9-1.2l-.1.1a1.7 1.7 0 0 1-2.4-2.4l.1-.1a1.7 1.7 0 0 0-1.2-2.9H4a1.7 1.7 0 0 1 0-3.4h.2a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a1.7 1.7 0 0 1 2.4-2.4l.1.1a1.7 1.7 0 0 0 2.9-1.2V2a1.7 1.7 0 0 1 3.4 0v.2a1.7 1.7 0 0 0 2.9 1.2l.1-.1a1.7 1.7 0 0 1 2.4 2.4l-.1.1a1.7 1.7 0 0 0 1.2 2.9h.2a1.7 1.7 0 0 1 0 3.4h-.2a1.7 1.7 0 0 0-1.2 2.9Z" transform="translate(0 1) scale(.94)" />
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

    return <svg {...common}>{paths[name] ?? paths.overview}</svg>;
}

// Format the customer name from the authenticated user.
function getCustomerName(user) {
    return (
        user?.fullName ||
        user?.name ||
        user?.email?.split("@")[0] ||
        "TinyNest Customer"
    );
}

function getInitials(name = "TinyNest Customer") {
    return (
        name
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase())
            .join("") || "TN"
    );
}

function Addresses() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Read existing address state from Redux.
    const addresses = useSelector(selectAddresses) ?? [];
    const loading = useSelector(selectAddressLoading);
    const error = useSelector(selectAddressError);
    const user = useSelector(selectAuthUser);

    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [formData, setFormData] = useState(initialForm);
    const [formError, setFormError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch the user's saved addresses when the page opens.
    useEffect(() => {
        dispatch(getMyAddressesThunk());
    }, [dispatch]);

    const customerName = getCustomerName(user);
    const initials = getInitials(customerName);

    // Search only the user's real saved address information.
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

    // Handle all form input changes, including the checkbox.
    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Open a clean form for adding a new address.
    const handleAddNew = () => {
        setEditingAddress(null);
        setFormData(initialForm);
        setFormError("");
        setShowForm(true);
    };

    // Fill the form with the selected address for editing.
    const handleEdit = (address) => {
        setEditingAddress(address);

        setFormData({
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
        setFormData(initialForm);
        setFormError("");
    };

    // Validate required fields before making an API request.
    const validateForm = () => {
        const requiredFields = [
            ["fullName", "Full name"],
            ["phone", "Phone"],
            ["addressLine", "Address"],
            ["city", "City"],
            ["state", "State"],
            ["postalCode", "Postal code"],
            ["country", "Country"],
        ];

        for (const [field, label] of requiredFields) {
            if (!String(formData[field] ?? "").trim()) {
                return `${label} is required.`;
            }
        }

        return "";
    };

    // Create a new address or update the selected address.
    const handleSubmit = async (event) => {
        event.preventDefault();

        const validationError = validateForm();

        if (validationError) {
            setFormError(validationError);
            return;
        }

        setFormError("");

        try {
            if (editingAddress) {
                await dispatch(
                    updateAddressThunk({
                        addressId: editingAddress._id,
                        addressData: formData,
                    })
                ).unwrap();
            } else {
                await dispatch(createAddressThunk(formData)).unwrap();
            }

            handleCancel();

            // Reload the saved addresses after a successful change.
            await dispatch(getMyAddressesThunk()).unwrap();
        } catch (err) {
            setFormError(
                typeof err === "string"
                    ? err
                    : "We couldn't save this address. Please try again."
            );
        }
    };

    // Delete an address only after customer confirmation.
    const handleDelete = async (addressId) => {
        if (!window.confirm("Are you sure you want to delete this address?")) {
            return;
        }

        try {
            await dispatch(deleteAddressThunk(addressId)).unwrap();
            await dispatch(getMyAddressesThunk()).unwrap();
        } catch (err) {
            console.error("Delete address failed:", err);
        }
    };

    // Set the selected address as the default delivery address.
    const handleSetDefault = async (addressId) => {
        try {
            await dispatch(setDefaultAddressThunk(addressId)).unwrap();
            await dispatch(getMyAddressesThunk()).unwrap();
        } catch (err) {
            console.error("Set default address failed:", err);
        }
    };

    return (
        <main className="min-h-screen bg-[#f7f9ff] px-4 pb-12 pt-6 font-sans text-[#181c20] dark:bg-gray-950 dark:text-gray-100 sm:px-6 lg:px-8 lg:pt-8">
            <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-7">

                {/* Sticky account sidebar: keep this consistent with My Orders. */}
                <aside className="flex flex-col gap-4 self-start lg:sticky lg:top-36 lg:col-span-4 xl:col-span-4">
                    <section className="flex items-center gap-4 rounded-xl border border-[#edf0f5] bg-white p-4 shadow-[0_1px_3px_rgba(24,28,32,0.035)] dark:border-gray-800 dark:bg-gray-900 sm:p-5">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#dfeae5] text-sm font-semibold text-[#436558]">
                            {initials}
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[#181c20] dark:text-white">
                                {customerName}
                            </p>
                            <p className="mt-1 text-sm text-[#626c68] dark:text-gray-400">
                                TinyNest Customer
                            </p>
                        </div>
                    </section>

                    <nav
                        aria-label="Account navigation"
                        className="rounded-xl border border-[#edf0f5] bg-white p-2 shadow-[0_1px_3px_rgba(24,28,32,0.035)] dark:border-gray-800 dark:bg-gray-900 sm:p-2.5"
                    >
                        <NavLink
                            to="/profile"
                            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-[#414845] transition hover:bg-[#f1f4f9] dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            <InlineIcon name="overview" />
                            Overview
                        </NavLink>

                        <NavLink
                            to="/orders"
                            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-[#414845] transition hover:bg-[#f1f4f9] dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            <InlineIcon name="orders" />
                            My Orders
                        </NavLink>

                        <NavLink
                            to="/addresses"
                            className={({ isActive }) =>
                                `flex items-center justify-between gap-3 rounded-lg px-3 py-3 text-sm transition ${
                                    isActive
                                        ? "bg-[#dfe8e3] font-semibold text-[#436558] dark:bg-emerald-950/60 dark:text-emerald-200"
                                        : "font-medium text-[#414845] hover:bg-[#f1f4f9] dark:text-gray-300 dark:hover:bg-gray-800"
                                }`
                            }
                        >
                            <span className="flex items-center gap-3">
                                <InlineIcon name="address" />
                                Saved Addresses
                            </span>
                            <span className="rounded-full bg-[#436558] px-2.5 py-1 text-[10px] font-bold text-white">
                                {addresses.length}
                            </span>
                        </NavLink>

                        <NavLink
                            to="/wishlist"
                            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-[#414845] transition hover:bg-[#f1f4f9] dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            <InlineIcon name="heart" />
                            Saved Wishlist
                        </NavLink>

                        <NavLink
                            to="/kits"
                            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-[#414845] transition hover:bg-[#f1f4f9] dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            <InlineIcon name="kits" />
                            Baby Kits
                        </NavLink>

                        <NavLink
                            to="/profile"
                            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-[#414845] transition hover:bg-[#f1f4f9] dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            <InlineIcon name="settings" />
                            Account Settings
                        </NavLink>
                    </nav>

                    <section className="rounded-xl bg-[#f8eeec] p-4 text-[#181c20] dark:bg-[#382925] dark:text-gray-100 sm:p-5">
                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8b604c] dark:text-[#e0b8a7]">
                            TinyNest Concierge
                        </p>
                        <h2 className="mt-2 font-serif text-xl leading-7">
                            Need help with your delivery?
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-[#626c68] dark:text-gray-300">
                            Keep your delivery details up to date for a smoother checkout.
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate("/profile")}
                            className="mt-3 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#7d5543] shadow-sm transition hover:bg-[#fffaf8] dark:bg-gray-800 dark:text-[#e0b8a7]"
                        >
                            Manage account
                        </button>
                    </section>
                </aside>

                {/* Main address content. */}
                <section className="min-w-0 space-y-5 lg:col-span-8 xl:col-span-8">
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
                                <InlineIcon name="plus" className="h-4 w-4" />
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
                                    {addresses.filter((address) => address.isDefault).length} default
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
                                    onChange={(event) => setSearchTerm(event.target.value)}
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
                                    {editingAddress ? "Edit Address" : "Add Delivery Address"}
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

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Input
                                        label="Full Name"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Enter full name"
                                    />
                                    <Input
                                        label="Phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Enter phone number"
                                    />
                                </div>

                                <Input
                                    label="Address"
                                    name="addressLine"
                                    value={formData.addressLine}
                                    onChange={handleChange}
                                    placeholder="House, street, area or landmark"
                                />

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Input
                                        label="City"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="Enter city"
                                    />
                                    <Input
                                        label="State"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        placeholder="Enter state"
                                    />
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Input
                                        label="Postal Code"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleChange}
                                        placeholder="Enter postal code"
                                    />
                                    <Input
                                        label="Country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        placeholder="Enter country"
                                    />
                                </div>

                                <label className="flex cursor-pointer items-center gap-3 rounded-lg bg-[#f1f4f9] p-4 text-sm text-[#414845] dark:bg-gray-800 dark:text-gray-200">
                                    <input
                                        type="checkbox"
                                        name="isDefault"
                                        checked={formData.isDefault}
                                        onChange={handleChange}
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

                    {/* Empty state. */}
                    {!loading && addresses.length === 0 && !showForm && (
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

                    {/* Search no-results state. */}
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
                    {!loading && filteredAddresses.length > 0 && !showForm && (
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

                            {/* A visual add-address card, not a fake saved address. */}
                            <button
                                type="button"
                                onClick={handleAddNew}
                                className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-[#c1c8c3] bg-[#f1f4f9]/70 p-6 text-center transition hover:border-[#436558] hover:bg-[#e5f4ed]/60 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
                            >
                                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#436558] shadow-sm dark:bg-gray-800">
                                    <InlineIcon name="plus" className="h-6 w-6" />
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

                    {/* Small reassurance panel styled after the reference. */}
                    {!showForm && (
                        <section className="flex flex-col gap-4 rounded-xl bg-gradient-to-r from-[#e5f4ed] via-[#f1f4f9] to-[#f8eeec] p-5 dark:from-emerald-950/50 dark:via-gray-900 dark:to-[#382925] sm:flex-row sm:items-center">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#436558] text-white">
                                <InlineIcon name="address" className="h-6 w-6" />
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

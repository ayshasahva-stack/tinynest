import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Input from "../../components/Input";
import Button from "../../components/Button";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import ErrorMessage from "../../components/ErrorMessage";

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

function Addresses() {
    const dispatch = useDispatch();

    const addresses = useSelector(selectAddresses);
    const loading = useSelector(selectAddressLoading);
    const error = useSelector(selectAddressError);

    // Controls whether the address form is visible
    const [showForm, setShowForm] = useState(false);

    // Stores the address currently being edited
    const [editingAddress, setEditingAddress] = useState(null);

    // Stores form values
    const [formData, setFormData] = useState(initialForm);

    // Stores frontend validation error
    const [formError, setFormError] = useState("");

    // Fetch addresses when the page loads
    useEffect(() => {
        dispatch(getMyAddressesThunk());
    }, [dispatch]);

    // Handle input changes
    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Open form for creating a new address
    const handleAddNew = () => {
        setEditingAddress(null);
        setFormData(initialForm);
        setFormError("");
        setShowForm(true);
    };

    // Open form for editing an existing address
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
            isDefault: address.isDefault || false,
        });

        setFormError("");
        setShowForm(true);
    };

    // Close the form
    const handleCancel = () => {
        setShowForm(false);
        setEditingAddress(null);
        setFormData(initialForm);
        setFormError("");
    };

    // Validate required fields before sending to backend
    const validateForm = () => {
        const requiredFields = [
            "fullName",
            "phone",
            "addressLine",
            "city",
            "state",
            "postalCode",
            "country",
        ];

        for (const field of requiredFields) {
            if (!formData[field].trim()) {
                return `${field} is required`;
            }
        }

        return "";
    };

    // Create or update address
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
                // Update existing address
                await dispatch(
                    updateAddressThunk({
                        addressId: editingAddress._id,
                        addressData: formData,
                    })
                ).unwrap();
            } else {
                // Create new address
                await dispatch(
                    createAddressThunk(formData)
                ).unwrap();
            }

            // Close form after successful operation
            handleCancel();

            // Fetch fresh data from backend
            dispatch(getMyAddressesThunk());

        } catch (error) {
            // Redux already stores the backend error.
            // The page will display it below.
            console.error("Address operation failed:", error);
        }
    };

    // Delete an address
    const handleDelete = async (addressId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this address?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await dispatch(
                deleteAddressThunk(addressId)
            ).unwrap();

            // Refresh addresses after deletion
            dispatch(getMyAddressesThunk());

        } catch (error) {
            console.error("Delete address failed:", error);
        }
    };

    // Make an address the default address
    const handleSetDefault = async (addressId) => {
        try {
            await dispatch(
                setDefaultAddressThunk(addressId)
            ).unwrap();

            // Refresh so backend ordering is reflected
            dispatch(getMyAddressesThunk());

        } catch (error) {
            console.error(
                "Set default address failed:",
                error
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-900">

            <div className="mx-auto max-w-5xl">

                {/* Page heading */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            My Addresses
                        </h1>

                        <p className="mt-1 text-gray-600 dark:text-gray-400">
                            Manage your saved delivery addresses.
                        </p>
                    </div>

                    {!showForm && (
                        <Button
                            type="button"
                            onClick={handleAddNew}
                        >
                            Add New Address
                        </Button>
                    )}

                </div>

                {/* Backend error */}
                {error && (
                    <div className="mb-6">
                        <ErrorMessage message={error} />
                    </div>
                )}

                {/* Address form */}
                {showForm && (
                    <div className="mb-8 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">

                        <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
                            {editingAddress
                                ? "Edit Address"
                                : "Add New Address"}
                        </h2>

                        {formError && (
                            <div className="mb-4">
                                <ErrorMessage message={formError} />
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >

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
                                placeholder="House / Street / Area"
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

                            {/* Default address checkbox */}
                            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300">

                                <input
                                    type="checkbox"
                                    name="isDefault"
                                    checked={formData.isDefault}
                                    onChange={handleChange}
                                    className="h-4 w-4"
                                />

                                Set as default address

                            </label>

                            {/* Form buttons */}
                            <div className="flex gap-3 pt-2">

                                <Button
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Saving..."
                                        : editingAddress
                                            ? "Update Address"
                                            : "Save Address"}
                                </Button>

                                <Button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>

                            </div>

                        </form>

                    </div>
                )}

                {/* Loading state */}
                {loading && !showForm && (
                    <Loading />
                )}

                {/* Empty state */}
                {!loading && addresses.length === 0 && !showForm && (
                    <EmptyState
                        title="No saved addresses"
                        message="Add an address to make checkout faster."
                    />
                )}

                {/* Saved addresses */}
                {!loading && addresses.length > 0 && (
                    <div className="grid gap-5 md:grid-cols-2">

                        {addresses.map((address) => (
                            <AddressCard
                                key={address._id}
                                address={address}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onSetDefault={handleSetDefault}
                            />
                        ))}

                    </div>
                )}

            </div>

        </div>
    );
}

export default Addresses;
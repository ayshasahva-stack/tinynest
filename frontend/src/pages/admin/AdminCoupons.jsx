
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    fetchAdminCouponsThunk,
    createCouponThunk,
    updateCouponThunk,
    deactivateCouponThunk,
} from "../../features/coupons/couponThunk";

import {
    selectCoupons,
    selectCouponsLoading,
    selectCouponsError,
    selectCouponSaving,
    selectCouponSaveError,
    selectCouponSaveSuccess,
} from "../../features/coupons/couponSelectors";

import {
    clearCouponFeedback,
} from "../../features/coupons/couponSlice";

// Empty form used when creating a new coupon.
const emptyForm = {
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "0",
    maxDiscount: "",
    startDate: "",
    expiryDate: "",
    usageLimit: "",
    isActive: true,
};

// Convert an ISO date into the format required by datetime-local.
const toDateTimeLocal = (date) => {
    if (!date) return "";

    const parsed = new Date(date);

    // Adjust for the browser's local timezone.
    const localDate = new Date(
        parsed.getTime() - parsed.getTimezoneOffset() * 60000
    );

    return localDate.toISOString().slice(0, 16);
};

function AdminCoupons() {
    const dispatch = useDispatch();

    // Read coupon data and request states from Redux.
    const coupons = useSelector(selectCoupons);
    const loading = useSelector(selectCouponsLoading);
    const error = useSelector(selectCouponsError);
    const saving = useSelector(selectCouponSaving);
    const saveError = useSelector(selectCouponSaveError);
    const saveSuccess = useSelector(selectCouponSaveSuccess);

    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [formData, setFormData] = useState(emptyForm);
    const [formError, setFormError] = useState("");

    // Load all coupons when the page opens.
    useEffect(() => {
        dispatch(fetchAdminCouponsThunk());
    }, [dispatch]);

    // Filter coupons by code or discount type.
    const filteredCoupons = useMemo(() => {
        const query = search.trim().toLowerCase();

        return coupons.filter((coupon) =>
            coupon.code?.toLowerCase().includes(query) ||
            coupon.discountType?.toLowerCase().includes(query)
        );
    }, [coupons, search]);

    // Update one form field.
    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Open a clean form for creating a coupon.
    const handleCreate = () => {
        dispatch(clearCouponFeedback());
        setEditingCoupon(null);
        setFormError("");
        setFormData({ ...emptyForm });
        setShowForm(true);
    };

    // Populate the form with the selected coupon.
    const handleEdit = (coupon) => {
        dispatch(clearCouponFeedback());
        setEditingCoupon(coupon);
        setFormError("");

        setFormData({
            code: coupon.code ?? "",
            discountType: coupon.discountType ?? "percentage",
            discountValue: String(coupon.discountValue ?? ""),
            minOrderAmount: String(coupon.minOrderAmount ?? 0),
            maxDiscount:
                coupon.maxDiscount == null
                    ? ""
                    : String(coupon.maxDiscount),
            startDate: toDateTimeLocal(coupon.startDate),
            expiryDate: toDateTimeLocal(coupon.expiryDate),
            usageLimit:
                coupon.usageLimit == null
                    ? ""
                    : String(coupon.usageLimit),
            isActive: Boolean(coupon.isActive),
        });

        setShowForm(true);
    };

    // Close the form and clear old messages.
    const handleCloseForm = () => {
        setShowForm(false);
        setEditingCoupon(null);
        setFormError("");
        dispatch(clearCouponFeedback());
    };

    // Validate fields and submit create/update request.
    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormError("");

        const discountValue = Number(formData.discountValue);
        const minOrderAmount = Number(formData.minOrderAmount);
        const maxDiscount =
            formData.maxDiscount === ""
                ? null
                : Number(formData.maxDiscount);
        const usageLimit =
            formData.usageLimit === ""
                ? null
                : Number(formData.usageLimit);

        // Basic client-side checks; the backend remains authoritative.
        if (!formData.code.trim()) {
            setFormError("Enter a coupon code.");
            return;
        }

        if (!Number.isFinite(discountValue) || discountValue <= 0) {
            setFormError("Discount value must be greater than zero.");
            return;
        }

        if (
            formData.discountType === "percentage" &&
            discountValue > 100
        ) {
            setFormError("Percentage discount cannot exceed 100.");
            return;
        }

        if (
            !formData.startDate ||
            !formData.expiryDate ||
            new Date(formData.expiryDate) <= new Date(formData.startDate)
        ) {
            setFormError("Expiry date must be after the start date.");
            return;
        }

        if (
            !Number.isFinite(minOrderAmount) ||
            minOrderAmount < 0
        ) {
            setFormError("Minimum order amount cannot be negative.");
            return;
        }

        if (
            maxDiscount !== null &&
            (!Number.isFinite(maxDiscount) || maxDiscount < 0)
        ) {
            setFormError("Maximum discount cannot be negative.");
            return;
        }

        if (
            usageLimit !== null &&
            (!Number.isInteger(usageLimit) || usageLimit < 1)
        ) {
            setFormError("Usage limit must be a whole number greater than zero.");
            return;
        }

        // Prepare values with correct types for Mongoose.
        const couponData = {
            code: formData.code.trim().toUpperCase(),
            discountType: formData.discountType,
            discountValue,
            minOrderAmount,
            maxDiscount,
            startDate: new Date(formData.startDate).toISOString(),
            expiryDate: new Date(formData.expiryDate).toISOString(),
            usageLimit,
            isActive: formData.isActive,
        };

        let result;

        if (editingCoupon) {
            result = await dispatch(
                updateCouponThunk({
                    couponId: editingCoupon._id,
                    couponData,
                })
            );
        } else {
            result = await dispatch(createCouponThunk(couponData));
        }

        // Close and refresh only when the API operation succeeds.
        const succeeded = editingCoupon
            ? updateCouponThunk.fulfilled.match(result)
            : createCouponThunk.fulfilled.match(result);

        if (succeeded) {
            setShowForm(false);
            setEditingCoupon(null);
            dispatch(fetchAdminCouponsThunk());
        }
    };

    // Activate/deactivate using the existing update endpoint.
    const handleToggleStatus = async (coupon) => {
        if (
            coupon.isActive &&
            !window.confirm(`Deactivate coupon "${coupon.code}"?`)
        ) {
            return;
        }

        if (coupon.isActive) {
            const result = await dispatch(
                deactivateCouponThunk(coupon._id)
            );

            if (deactivateCouponThunk.fulfilled.match(result)) {
                dispatch(fetchAdminCouponsThunk());
            }
        } else {
            const result = await dispatch(
                updateCouponThunk({
                    couponId: coupon._id,
                    couponData: { isActive: true },
                })
            );

            if (updateCouponThunk.fulfilled.match(result)) {
                dispatch(fetchAdminCouponsThunk());
            }
        }
    };

    // Determine whether a coupon is currently within its date range.
    const getDateStatus = (coupon) => {
        const now = Date.now();

        if (new Date(coupon.startDate).getTime() > now) {
            return "Scheduled";
        }

        if (new Date(coupon.expiryDate).getTime() < now) {
            return "Expired";
        }

        if (
            coupon.usageLimit != null &&
            coupon.usedCount >= coupon.usageLimit
        ) {
            return "Limit reached";
        }

        return coupon.isActive ? "Active" : "Inactive";
    };

    const inputClass =
        "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 " +
        "text-gray-900 outline-none focus:border-blue-500 " +
        "dark:border-gray-600 dark:bg-gray-700 dark:text-white";

    return (
        <div className="min-h-screen p-4 text-gray-900 dark:text-white sm:p-6 lg:p-8">
            {/* Page heading and create button */}
            <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold sm:text-3xl">
                        Coupon Management
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Create and manage TinyNest discount coupons.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleCreate}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
                >
                    + Create Coupon
                </button>
            </div>

            {/* API feedback */}
            {error && (
                <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-red-700 dark:bg-red-950 dark:text-red-300">
                    {error}
                </p>
            )}

            {saveError && (
                <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-red-700 dark:bg-red-950 dark:text-red-300">
                    {saveError}
                </p>
            )}

            {saveSuccess && (
                <p role="status" className="mb-4 rounded-lg bg-green-50 p-3 text-green-700 dark:bg-green-950 dark:text-green-300">
                    {saveSuccess}
                </p>
            )}

            {/* Search */}
            <div className="mb-6 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
                <label htmlFor="couponSearch" className="mb-2 block text-sm font-medium">
                    Search coupons
                </label>
                <input
                    id="couponSearch"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by code or discount type..."
                    className={inputClass}
                />
            </div>

            {/* Coupon list */}
            <div className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-gray-800">
                {loading ? (
                    <p className="p-8 text-center">Loading coupons...</p>
                ) : filteredCoupons.length === 0 ? (
                    <p className="p-8 text-center text-gray-500 dark:text-gray-400">
                        No coupons found.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] text-left text-sm">
                            <thead className="bg-gray-50 text-gray-600 dark:bg-gray-700 dark:text-gray-200">
                                <tr>
                                    <th className="p-4">Code</th>
                                    <th className="p-4">Discount</th>
                                    <th className="p-4">Minimum order</th>
                                    <th className="p-4">Usage</th>
                                    <th className="p-4">Expiry</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCoupons.map((coupon) => {
                                    const status = getDateStatus(coupon);

                                    return (
                                        <tr
                                            key={coupon._id}
                                            className="border-t border-gray-100 dark:border-gray-700"
                                        >
                                            <td className="p-4 font-semibold">
                                                {coupon.code}
                                            </td>
                                            <td className="p-4">
                                                {coupon.discountType === "percentage"
                                                    ? `${coupon.discountValue}%`
                                                    : `₹${coupon.discountValue}`}
                                                {coupon.discountType === "percentage" &&
                                                    coupon.maxDiscount != null && (
                                                        <span className="block text-xs text-gray-500">
                                                            Max ₹{coupon.maxDiscount}
                                                        </span>
                                                    )}
                                            </td>
                                            <td className="p-4">
                                                ₹{coupon.minOrderAmount}
                                            </td>
                                            <td className="p-4">
                                                {coupon.usedCount} / {coupon.usageLimit ?? "Unlimited"}
                                            </td>
                                            <td className="p-4">
                                                {new Date(coupon.expiryDate).toLocaleDateString()}
                                            </td>
                                            <td className="p-4">
                                                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                                    status === "Active"
                                                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                                                        : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                                                }`}>
                                                    {status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEdit(coupon)}
                                                        className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleStatus(coupon)}
                                                        className="font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300"
                                                    >
                                                        {coupon.isActive ? "Deactivate" : "Activate"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create/edit form modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:items-center">
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="couponFormTitle"
                        className="my-4 w-full max-w-2xl rounded-xl bg-white p-5 shadow-xl dark:bg-gray-800 sm:p-7"
                    >
                        <div className="mb-6 flex items-center justify-between gap-3">
                            <h2 id="couponFormTitle" className="text-xl font-bold">
                                {editingCoupon ? "Edit Coupon" : "Create Coupon"}
                            </h2>
                            <button
                                type="button"
                                onClick={handleCloseForm}
                                aria-label="Close coupon form"
                                className="rounded-lg px-3 py-1 text-xl hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                ×
                            </button>
                        </div>

                        {formError && (
                            <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
                                {formError}
                            </p>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="block text-sm font-medium">
                                    Coupon code
                                    <input
                                        name="code"
                                        value={formData.code}
                                        onChange={handleChange}
                                        maxLength={40}
                                        required
                                        className={`${inputClass} mt-1`}
                                        placeholder="e.g. BABY20"
                                    />
                                </label>

                                <label className="block text-sm font-medium">
                                    Discount type
                                    <select
                                        name="discountType"
                                        value={formData.discountType}
                                        onChange={handleChange}
                                        className={`${inputClass} mt-1`}
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed amount (₹)</option>
                                    </select>
                                </label>

                                <label className="block text-sm font-medium">
                                    Discount value
                                    <input
                                        name="discountValue"
                                        type="number"
                                        min="0.01"
                                        max={formData.discountType === "percentage" ? 100 : undefined}
                                        step="0.01"
                                        value={formData.discountValue}
                                        onChange={handleChange}
                                        required
                                        className={`${inputClass} mt-1`}
                                    />
                                </label>

                                <label className="block text-sm font-medium">
                                    Minimum order amount (₹)
                                    <input
                                        name="minOrderAmount"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formData.minOrderAmount}
                                        onChange={handleChange}
                                        required
                                        className={`${inputClass} mt-1`}
                                    />
                                </label>

                                {formData.discountType === "percentage" && (
                                    <label className="block text-sm font-medium">
                                        Maximum discount (₹, optional)
                                        <input
                                            name="maxDiscount"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={formData.maxDiscount}
                                            onChange={handleChange}
                                            className={`${inputClass} mt-1`}
                                            placeholder="No maximum"
                                        />
                                    </label>
                                )}

                                <label className="block text-sm font-medium">
                                    Usage limit (optional)
                                    <input
                                        name="usageLimit"
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={formData.usageLimit}
                                        onChange={handleChange}
                                        className={`${inputClass} mt-1`}
                                        placeholder="Unlimited uses"
                                    />
                                </label>

                                <label className="block text-sm font-medium">
                                    Start date and time
                                    <input
                                        name="startDate"
                                        type="datetime-local"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        required
                                        className={`${inputClass} mt-1`}
                                    />
                                </label>

                                <label className="block text-sm font-medium">
                                    Expiry date and time
                                    <input
                                        name="expiryDate"
                                        type="datetime-local"
                                        value={formData.expiryDate}
                                        onChange={handleChange}
                                        required
                                        className={`${inputClass} mt-1`}
                                    />
                                </label>
                            </div>

                            <label className="flex items-center gap-3 text-sm font-medium">
                                <input
                                    name="isActive"
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    className="h-4 w-4 accent-blue-600"
                                />
                                Coupon is active
                            </label>

                            <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 dark:border-gray-700 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={handleCloseForm}
                                    className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingCoupon
                                            ? "Save Changes"
                                            : "Create Coupon"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminCoupons;

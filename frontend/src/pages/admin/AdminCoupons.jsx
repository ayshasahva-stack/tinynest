import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";

import { couponSchema } from "../../validations/admin/couponSchema";

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

import { clearCouponFeedback } from "../../features/coupons/couponSlice";

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

    // React Hook Form manages validation errors.
    // Form values continue to be managed using useState.
    const {
        setError,
        clearErrors,
        formState: { errors },
    } = useForm({
        defaultValues: emptyForm,
    });

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

        // Clear the previous validation error when editing a field.
        clearErrors(name);

        setFormData((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Open a clean form for creating a coupon.
    const handleCreate = () => {
        dispatch(clearCouponFeedback());

        clearErrors();
        setEditingCoupon(null);
        setFormError("");
        setFormData({ ...emptyForm });
        setShowForm(true);
    };

    // Populate the form with the selected coupon.
    const handleEdit = (coupon) => {
        dispatch(clearCouponFeedback());

        clearErrors();
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

        clearErrors();
        dispatch(clearCouponFeedback());
    };

    // Validate fields and submit create/update request.
    const handleSubmit = async (event) => {
        event.preventDefault();

        setFormError("");
        clearErrors();

        // Validate the complete form using Yup.
        try {
            await couponSchema.validate(formData, {
                abortEarly: false,
            });
        } catch (validationError) {
            // Display all validation errors below their fields.
            validationError.inner.forEach((error) => {
                if (error.path) {
                    setError(error.path, {
                        type: "manual",
                        message: error.message,
                    });
                }
            });

            return;
        }

        // Convert form values into the types expected by the API.
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
            clearErrors();

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

    // Reusable styling for input fields.
    const inputClass =
        "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 " +
        "text-gray-900 outline-none focus:border-blue-500 " +
        "dark:border-gray-600 dark:bg-gray-700 dark:text-white";

    return (
        <div className="min-h-screen bg-[#f7f9ff] p-4 text-[#263d32] dark:bg-slate-950 dark:text-white sm:p-6 lg:p-8">

            {/* Page heading and create button */}
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="font-serif text-3xl font-semibold text-[#263d32] dark:text-white">
                        Coupon Management
                    </h1>

                    <p className="mt-1 text-sm text-[#77847d] dark:text-gray-400">
                        Create and manage TinyNest discount coupons.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleCreate}
                    className="
                        rounded-lg bg-[#436558]
                        px-5 py-2.5 font-medium text-white
                        transition hover:bg-[#354f44]
                        focus:outline-none focus:ring-2
                        focus:ring-[#a8c2b5]
                    "
                >
                    + Create Coupon
                </button>
            </div>

            {/* API feedback */}
            {error && (
                <p
                    role="alert"
                    className="
                        mb-4 rounded-xl border border-red-200
                        bg-red-50 p-3 text-red-700
                        dark:border-red-900 dark:bg-red-950/30
                        dark:text-red-300
                    "
                >
                    {error}
                </p>
            )}

            {saveError && (
                <p
                    role="alert"
                    className="
                        mb-4 rounded-xl border border-red-200
                        bg-red-50 p-3 text-red-700
                        dark:border-red-900 dark:bg-red-950/30
                        dark:text-red-300
                    "
                >
                    {saveError}
                </p>
            )}

            {saveSuccess && (
                <p
                    role="status"
                    className="
                        mb-4 rounded-xl border border-[#cbdcd3]
                        bg-[#edf4f0] p-3 text-[#436558]
                        dark:border-emerald-900
                        dark:bg-emerald-950/30
                        dark:text-emerald-300
                    "
                >
                    {saveSuccess}
                </p>
            )}

            {/* Search */}
            <div className="
                mb-6 rounded-2xl
                border border-[#e0e7e3]
                bg-white p-5 shadow-sm
                dark:border-gray-700 dark:bg-gray-800
            ">
                <label
                    htmlFor="couponSearch"
                    className="mb-2 block text-sm font-semibold text-[#46574e] dark:text-gray-200"
                >
                    Search coupons
                </label>

                <input
                    id="couponSearch"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by code or discount type..."
                    className="
                        w-full rounded-lg
                        border border-[#d6e0da]
                        bg-white px-4 py-2.5
                        text-[#263d32] outline-none
                        placeholder:text-[#9aa69f]
                        transition
                        focus:border-[#7a9e8f]
                        focus:ring-2 focus:ring-[#dce7e2]
                        dark:border-gray-600
                        dark:bg-gray-700 dark:text-white
                    "
                />
            </div>

            {/* Coupon list */}
            <div className="
                overflow-hidden rounded-2xl
                border border-[#e0e7e3]
                bg-white shadow-sm
                dark:border-gray-700 dark:bg-gray-800
            ">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="
                            h-10 w-10 animate-spin
                            rounded-full border-4
                            border-[#dce7e2]
                            border-t-[#436558]
                        " />

                        <p className="mt-4 text-sm text-[#77847d] dark:text-gray-400">
                            Loading coupons...
                        </p>
                    </div>
                ) : filteredCoupons.length === 0 ? (
                    <p className="p-8 text-center text-[#77847d] dark:text-gray-400">
                        No coupons found.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] text-left text-sm">

                            {/* Table header */}
                            <thead className="
                                border-b border-[#e0e7e3]
                                bg-[#f1f4f9]
                                text-[#46574e]
                                dark:border-gray-700
                                dark:bg-gray-700
                                dark:text-gray-200
                            ">
                                <tr>
                                    <th className="p-4 font-semibold">Code</th>
                                    <th className="p-4 font-semibold">Discount</th>
                                    <th className="p-4 font-semibold">Minimum order</th>
                                    <th className="p-4 font-semibold">Usage</th>
                                    <th className="p-4 font-semibold">Expiry</th>
                                    <th className="p-4 font-semibold">Status</th>
                                    <th className="p-4 font-semibold">Actions</th>
                                </tr>
                            </thead>

                            {/* Table body */}
                            <tbody className="divide-y divide-[#edf1ee] dark:divide-gray-700">
                                {filteredCoupons.map((coupon) => {
                                    const status = getDateStatus(coupon);

                                    return (
                                        <tr
                                            key={coupon._id}
                                            className="
                                                transition-colors
                                                hover:bg-[#f7f9f8]
                                                dark:hover:bg-gray-700/50
                                            "
                                        >
                                            {/* Coupon code */}
                                            <td className="p-4 font-semibold text-[#263d32] dark:text-white">
                                                {coupon.code}
                                            </td>

                                            {/* Discount details */}
                                            <td className="p-4 text-[#46574e] dark:text-gray-300">
                                                {coupon.discountType === "percentage"
                                                    ? `${coupon.discountValue}%`
                                                    : `₹${coupon.discountValue}`}

                                                {coupon.discountType === "percentage" &&
                                                    coupon.maxDiscount != null && (
                                                        <span className="mt-1 block text-xs text-[#77847d] dark:text-gray-400">
                                                            Max ₹{coupon.maxDiscount}
                                                        </span>
                                                    )}
                                            </td>

                                            {/* Minimum order */}
                                            <td className="whitespace-nowrap p-4 text-[#46574e] dark:text-gray-300">
                                                ₹{coupon.minOrderAmount}
                                            </td>

                                            {/* Usage */}
                                            <td className="whitespace-nowrap p-4 text-[#46574e] dark:text-gray-300">
                                                {coupon.usedCount} / {coupon.usageLimit ?? "Unlimited"}
                                            </td>

                                            {/* Expiry */}
                                            <td className="whitespace-nowrap p-4 text-[#46574e] dark:text-gray-300">
                                                {new Date(coupon.expiryDate).toLocaleDateString()}
                                            </td>

                                            {/* Status */}
                                            <td className="p-4">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                        status === "Active"
                                                            ? "bg-[#edf4f0] text-[#436558] dark:bg-emerald-950/40 dark:text-emerald-300"
                                                            : "bg-[#f1f4f9] text-[#77847d] dark:bg-gray-700 dark:text-gray-300"
                                                    }`}
                                                >
                                                    {status}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEdit(coupon)}
                                                        className="
                                                            rounded-lg border
                                                            border-[#cbdcd3]
                                                            px-3 py-1.5
                                                            font-medium
                                                            text-[#436558]
                                                            transition
                                                            hover:bg-[#edf4f0]
                                                            dark:border-[#536e61]
                                                            dark:text-[#b7d0c3]
                                                            dark:hover:bg-gray-700
                                                        "
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleStatus(coupon)}
                                                        className="
                                                            rounded-lg border
                                                            border-[#d6e0da]
                                                            px-3 py-1.5
                                                            font-medium
                                                            text-[#65756c]
                                                            transition
                                                            hover:bg-[#f1f4f9]
                                                            dark:border-gray-600
                                                            dark:text-gray-300
                                                            dark:hover:bg-gray-700
                                                        "
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
                <div className="
                    fixed inset-0 z-50
                    flex items-start justify-center
                    overflow-y-auto bg-black/50 p-4
                    sm:items-center
                ">
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="couponFormTitle"
                        className="
                            my-4 w-full max-w-2xl
                            rounded-2xl border border-[#e0e7e3]
                            bg-white p-5 shadow-xl
                            dark:border-gray-700 dark:bg-gray-800
                            sm:p-7
                        "
                    >
                        {/* Modal heading */}
                        <div className="mb-6 flex items-center justify-between gap-3">
                            <h2
                                id="couponFormTitle"
                                className="font-serif text-xl font-semibold text-[#263d32] dark:text-white"
                            >
                                {editingCoupon ? "Edit Coupon" : "Create Coupon"}
                            </h2>

                            <button
                                type="button"
                                onClick={handleCloseForm}
                                aria-label="Close coupon form"
                                className="
                                    rounded-lg px-3 py-1
                                    text-xl text-[#65756c]
                                    transition hover:bg-[#f1f4f9]
                                    dark:text-gray-300
                                    dark:hover:bg-gray-700
                                "
                            >
                                ×
                            </button>
                        </div>

                        {/* Form error */}
                        {formError && (
                            <p
                                role="alert"
                                className="
                                    mb-4 rounded-lg
                                    border border-red-200
                                    bg-red-50 p-3 text-sm text-red-700
                                    dark:border-red-900
                                    dark:bg-red-950/30 dark:text-red-300
                                "
                            >
                                {formError}
                            </p>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            noValidate
                            className="space-y-4"
                        >
                            <div className="grid gap-4 sm:grid-cols-2">

                                {/* Coupon code */}
                                <label className="block text-sm font-medium text-[#46574e] dark:text-gray-200">
                                    Coupon code

                                    <input
                                        name="code"
                                        value={formData.code}
                                        onChange={handleChange}
                                        maxLength={40}
                                        required
                                        className="
                                            mt-1 w-full rounded-lg
                                            border border-[#d6e0da]
                                            bg-white px-4 py-2.5
                                            text-[#263d32] outline-none
                                            placeholder:text-[#9aa69f]
                                            focus:border-[#7a9e8f]
                                            focus:ring-2 focus:ring-[#dce7e2]
                                            dark:border-gray-600
                                            dark:bg-gray-700 dark:text-white
                                        "
                                        placeholder="e.g. BABY20"
                                    />

                                    {errors.code?.message && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {errors.code.message}
                                        </p>
                                    )}
                                </label>

                                {/* Discount type */}
                                <label className="block text-sm font-medium text-[#46574e] dark:text-gray-200">
                                    Discount type

                                    <select
                                        name="discountType"
                                        value={formData.discountType}
                                        onChange={handleChange}
                                        className="
                                            mt-1 w-full rounded-lg
                                            border border-[#d6e0da]
                                            bg-white px-4 py-2.5
                                            text-[#263d32] outline-none
                                            focus:border-[#7a9e8f]
                                            focus:ring-2 focus:ring-[#dce7e2]
                                            dark:border-gray-600
                                            dark:bg-gray-700 dark:text-white
                                        "
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed amount (₹)</option>
                                    </select>

                                    {errors.discountType?.message && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {errors.discountType.message}
                                        </p>
                                    )}
                                </label>

                                {/* Discount value */}
                                <label className="block text-sm font-medium text-[#46574e] dark:text-gray-200">
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
                                        className="
                                            mt-1 w-full rounded-lg
                                            border border-[#d6e0da]
                                            bg-white px-4 py-2.5
                                            text-[#263d32] outline-none
                                            focus:border-[#7a9e8f]
                                            focus:ring-2 focus:ring-[#dce7e2]
                                            dark:border-gray-600
                                            dark:bg-gray-700 dark:text-white
                                        "
                                    />

                                    {errors.discountValue?.message && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {errors.discountValue.message}
                                        </p>
                                    )}
                                </label>

                                {/* Minimum order amount */}
                                <label className="block text-sm font-medium text-[#46574e] dark:text-gray-200">
                                    Minimum order amount (₹)

                                    <input
                                        name="minOrderAmount"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formData.minOrderAmount}
                                        onChange={handleChange}
                                        required
                                        className="
                                            mt-1 w-full rounded-lg
                                            border border-[#d6e0da]
                                            bg-white px-4 py-2.5
                                            text-[#263d32] outline-none
                                            focus:border-[#7a9e8f]
                                            focus:ring-2 focus:ring-[#dce7e2]
                                            dark:border-gray-600
                                            dark:bg-gray-700 dark:text-white
                                        "
                                    />

                                    {errors.minOrderAmount?.message && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {errors.minOrderAmount.message}
                                        </p>
                                    )}
                                </label>

                                {/* Maximum discount */}
                                {formData.discountType === "percentage" && (
                                    <label className="block text-sm font-medium text-[#46574e] dark:text-gray-200">
                                        Maximum discount (₹, optional)

                                        <input
                                            name="maxDiscount"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={formData.maxDiscount}
                                            onChange={handleChange}
                                            className="
                                                mt-1 w-full rounded-lg
                                                border border-[#d6e0da]
                                                bg-white px-4 py-2.5
                                                text-[#263d32] outline-none
                                                placeholder:text-[#9aa69f]
                                                focus:border-[#7a9e8f]
                                                focus:ring-2 focus:ring-[#dce7e2]
                                                dark:border-gray-600
                                                dark:bg-gray-700 dark:text-white
                                            "
                                            placeholder="No maximum"
                                        />

                                        {errors.maxDiscount?.message && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                {errors.maxDiscount.message}
                                            </p>
                                        )}
                                    </label>
                                )}

                                {/* Usage limit */}
                                <label className="block text-sm font-medium text-[#46574e] dark:text-gray-200">
                                    Usage limit (optional)

                                    <input
                                        name="usageLimit"
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={formData.usageLimit}
                                        onChange={handleChange}
                                        className="
                                            mt-1 w-full rounded-lg
                                            border border-[#d6e0da]
                                            bg-white px-4 py-2.5
                                            text-[#263d32] outline-none
                                            placeholder:text-[#9aa69f]
                                            focus:border-[#7a9e8f]
                                            focus:ring-2 focus:ring-[#dce7e2]
                                            dark:border-gray-600
                                            dark:bg-gray-700 dark:text-white
                                        "
                                        placeholder="Unlimited uses"
                                    />

                                    {errors.usageLimit?.message && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {errors.usageLimit.message}
                                        </p>
                                    )}
                                </label>

                                {/* Start date and time */}
                                <label className="block text-sm font-medium text-[#46574e] dark:text-gray-200">
                                    Start date and time

                                    <input
                                        name="startDate"
                                        type="datetime-local"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        required
                                        className="
                                            mt-1 w-full rounded-lg
                                            border border-[#d6e0da]
                                            bg-white px-4 py-2.5
                                            text-[#263d32] outline-none
                                            focus:border-[#7a9e8f]
                                            focus:ring-2 focus:ring-[#dce7e2]
                                            dark:border-gray-600
                                            dark:bg-gray-700 dark:text-white
                                        "
                                    />

                                    {errors.startDate?.message && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {errors.startDate.message}
                                        </p>
                                    )}
                                </label>

                                {/* Expiry date and time */}
                                <label className="block text-sm font-medium text-[#46574e] dark:text-gray-200">
                                    Expiry date and time

                                    <input
                                        name="expiryDate"
                                        type="datetime-local"
                                        value={formData.expiryDate}
                                        onChange={handleChange}
                                        required
                                        className="
                                            mt-1 w-full rounded-lg
                                            border border-[#d6e0da]
                                            bg-white px-4 py-2.5
                                            text-[#263d32] outline-none
                                            focus:border-[#7a9e8f]
                                            focus:ring-2 focus:ring-[#dce7e2]
                                            dark:border-gray-600
                                            dark:bg-gray-700 dark:text-white
                                        "
                                    />

                                    {errors.expiryDate?.message && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {errors.expiryDate.message}
                                        </p>
                                    )}
                                </label>
                            </div>

                            {/* Active status */}
                            <label className="flex items-center gap-3 text-sm font-medium text-[#46574e] dark:text-gray-200">
                                <input
                                    name="isActive"
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    className="h-4 w-4 rounded accent-[#436558]"
                                />
                                Coupon is active
                            </label>

                            {/* Modal actions */}
                            <div className="
                                flex flex-col-reverse gap-3
                                border-t border-[#e0e7e3] pt-5
                                dark:border-gray-700
                                sm:flex-row sm:justify-end
                            ">
                                <button
                                    type="button"
                                    onClick={handleCloseForm}
                                    className="
                                        rounded-lg
                                        border border-[#d6e0da]
                                        px-5 py-2.5 font-medium
                                        text-[#46574e] transition
                                        hover:bg-[#f1f4f9]
                                        dark:border-gray-600
                                        dark:text-gray-200
                                        dark:hover:bg-gray-700
                                    "
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="
                                        rounded-lg bg-[#436558]
                                        px-5 py-2.5 font-medium text-white
                                        transition hover:bg-[#354f44]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-60
                                    "
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
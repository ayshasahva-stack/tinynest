
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    fetchAllKitsForAdminThunk,
    createKitThunk,
    updateKitThunk,
    updateKitStatusThunk,
} from "../../features/kits/kitThunk";

import {
    selectAdminKits,
    selectAdminKitsLoading,
    selectAdminKitsError,
    selectKitSaving,
    selectKitSaveError,
    selectKitSaveSuccess,
} from "../../features/kits/kitSelectors";

import { clearKitSaveFeedback } from "../../features/kits/kitSlice";

import { fetchProducts } from "../../features/products/productThunk";
import {
    selectProducts,
    selectProductsLoading,
} from "../../features/products/productSelectors";

// Initial values for creating a new kit.
const emptyForm = {
    name: "",
    description: "",
    image: "",
    price: "",
    discount: "0",
    isActive: true,
    items: [],
};

// Format prices using Indian currency formatting.
const formatPrice = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

function AdminKits() {
    const dispatch = useDispatch();

    // Kit data and loading/error states from Redux.
    const kits = useSelector(selectAdminKits);
    const loading = useSelector(selectAdminKitsLoading);
    const error = useSelector(selectAdminKitsError);
    const saving = useSelector(selectKitSaving);
    const saveError = useSelector(selectKitSaveError);
    const saveSuccess = useSelector(selectKitSaveSuccess);

    // Available products for the kit selector.
    const products = useSelector(selectProducts);
    const productsLoading = useSelector(selectProductsLoading);

    // Page and form state.
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showForm, setShowForm] = useState(false);
    const [editingKitId, setEditingKitId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [formError, setFormError] = useState("");

    // Searchable product dropdown state.
    const [productSearch, setProductSearch] = useState("");
    const [isProductDropdownOpen, setIsProductDropdownOpen] =
        useState(false);

    // Fetch kits and products when this page mounts.
    useEffect(() => {
        dispatch(fetchAllKitsForAdminThunk());
        dispatch(fetchProducts({ page: 1, limit: 100, search: "" }));
    }, [dispatch]);

    // Filter kits by name and status.
    const filteredKits = useMemo(() => {
        const searchText = search.trim().toLowerCase();

        return kits.filter((kit) => {
            const matchesName = (kit.name || "")
                .toLowerCase()
                .includes(searchText);

            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && kit.isActive) ||
                (statusFilter === "inactive" && !kit.isActive);

            return matchesName && matchesStatus;
        });
    }, [kits, search, statusFilter]);

    // Update ordinary form fields.
    const updateField = (event) => {
        const { name, value, type, checked } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Reset the form and open create mode.
    const handleAddKit = () => {
        dispatch(clearKitSaveFeedback());
        setEditingKitId(null);
        setForm({ ...emptyForm, items: [] });
        setFormError("");
        setProductSearch("");
        setIsProductDropdownOpen(false);
        setShowForm(true);
    };

    // Populate the form when editing an existing kit.
    const handleEditKit = (kit) => {
        dispatch(clearKitSaveFeedback());

        setEditingKitId(kit._id);

        setForm({
            name: kit.name || "",
            description: kit.description || "",
            image: kit.image || "",
            price: String(kit.price ?? ""),
            discount: String(kit.discount ?? 0),
            isActive: Boolean(kit.isActive),
            items: (kit.items || []).map((item) => ({
                // Support populated products and plain product IDs.
                product:
                    typeof item.product === "object"
                        ? String(item.product?._id || "")
                        : String(item.product || ""),
                quantity: Number(item.quantity || 1),
            })),
        });

        setFormError("");
        setProductSearch("");
        setIsProductDropdownOpen(false);
        setShowForm(true);
    };

    // Add a product to the kit.
    const handleAddProduct = (productId) => {
        if (!productId) return;

        // Store product IDs consistently as strings.
        const normalizedId = String(productId);

        setForm((previous) => {
            const existing = previous.items.find(
                (item) => String(item.product) === normalizedId
            );

            // Increase quantity if the product already exists.
            if (existing) {
                return {
                    ...previous,
                    items: previous.items.map((item) =>
                        String(item.product) === normalizedId
                            ? {
                                  ...item,
                                  quantity: Number(item.quantity || 0) + 1,
                              }
                            : item
                    ),
                };
            }

            // Otherwise add it with an initial quantity of one.
            return {
                ...previous,
                items: [
                    ...previous.items,
                    {
                        product: normalizedId,
                        quantity: 1,
                    },
                ],
            };
        });
    };

    // Change the quantity of a selected product.
    const handleQuantityChange = (productId, quantity) => {
        const normalizedId = String(productId);

        setForm((previous) => ({
            ...previous,
            items: previous.items.map((item) =>
                String(item.product) === normalizedId
                    ? { ...item, quantity: Number(quantity) }
                    : item
            ),
        }));
    };

    // Remove a product from the kit.
    const handleRemoveProduct = (productId) => {
        const normalizedId = String(productId);

        setForm((previous) => ({
            ...previous,
            items: previous.items.filter(
                (item) => String(item.product) !== normalizedId
            ),
        }));
    };

    // Filter available products by name and exclude selected products.
    const filteredProducts = useMemo(() => {
        const searchText = productSearch.trim().toLowerCase();

        return products.filter((product) => {
            const alreadySelected = form.items.some(
                (item) => String(item.product) === String(product._id)
            );

            const matchesSearch = (product.title || "")
                .toLowerCase()
                .includes(searchText);

            return !alreadySelected && matchesSearch;
        });
    }, [products, form.items, productSearch]);

    // Find complete product details for the selected product IDs.
    const selectedProducts = form.items.map((item) => {
        const details = products.find(
            (product) => String(product._id) === String(item.product)
        );

        // When editing, the kit may contain a populated product that
        // isn't present in the currently loaded product list.
        const savedItem = kits
            .find((kit) => String(kit._id) === String(editingKitId))
            ?.items?.find(
                (kitItem) =>
                    String(
                        typeof kitItem.product === "object"
                            ? kitItem.product?._id
                            : kitItem.product
                    ) === String(item.product)
            );

        const populatedDetails =
            savedItem?.product && typeof savedItem.product === "object"
                ? savedItem.product
                : null;

        return {
            ...item,
            details: details || populatedDetails || null,
        };
    });

    // Validate form fields before saving.
    const validateForm = () => {
        if (!form.name.trim()) {
            return "Please enter a kit name.";
        }

        if (!form.description.trim()) {
            return "Please enter a kit description.";
        }

        if (!form.image.trim()) {
            return "Please enter a kit image URL.";
        }

        if (form.items.length === 0) {
            return "Please add at least one product.";
        }

        if (
            form.items.some(
                (item) =>
                    !item.product ||
                    !Number.isInteger(Number(item.quantity)) ||
                    Number(item.quantity) < 1
            )
        ) {
            return "Each product must have a quantity of at least 1.";
        }

        const price = Number(form.price);
        const discount = Number(form.discount);

        if (!Number.isFinite(price) || price < 0) {
            return "Please enter a valid kit price.";
        }

        if (
            !Number.isFinite(discount) ||
            discount < 0 ||
            discount > 100
        ) {
            return "Discount must be between 0 and 100.";
        }

        return "";
    };

    // Create or update the kit using the existing Redux thunks.
    const handleSubmit = async (event) => {
        event.preventDefault();

        const validationError = validateForm();

        if (validationError) {
            setFormError(validationError);
            return;
        }

        setFormError("");
        dispatch(clearKitSaveFeedback());

        const kitData = {
            name: form.name.trim(),
            description: form.description.trim(),
            image: form.image.trim(),
            price: Number(form.price),
            discount: Number(form.discount),
            isActive: form.isActive,
            items: form.items.map((item) => ({
                product: String(item.product),
                quantity: Number(item.quantity),
            })),
        };

        try {
            if (editingKitId) {
                await dispatch(
                    updateKitThunk({
                        kitId: editingKitId,
                        kitData,
                    })
                ).unwrap();
            } else {
                await dispatch(createKitThunk(kitData)).unwrap();
            }

            await dispatch(fetchAllKitsForAdminThunk()).unwrap();

            setShowForm(false);
            setEditingKitId(null);
            setForm({ ...emptyForm, items: [] });
            setProductSearch("");
            setIsProductDropdownOpen(false);
        } catch {
            // The existing Redux error state displays API errors.
        }
    };

    // Activate or deactivate a kit.
    const handleToggleStatus = async (kit) => {
        const nextStatus = !kit.isActive;

        const confirmed = window.confirm(
            `${nextStatus ? "Activate" : "Deactivate"} "${kit.name}"?`
        );

        if (!confirmed) return;

        dispatch(clearKitSaveFeedback());

        try {
            await dispatch(
                updateKitStatusThunk({
                    kitId: kit._id,
                    isActive: nextStatus,
                })
            ).unwrap();

            await dispatch(fetchAllKitsForAdminThunk()).unwrap();
        } catch {
            // The existing Redux error state displays API errors.
        }
    };

    return (
        <div className="min-h-screen bg-[#f7f9ff] p-4 dark:bg-slate-950 md:p-8">
            {/* Page heading */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-serif text-3xl font-semibold text-[#263d32] dark:text-white">
                        Kit Management
                    </h1>

                    <p className="mt-1 text-[#77847d] dark:text-gray-400">
                        Create and manage TinyNest product kits.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleAddKit}
                    className="rounded-lg bg-[#436558] px-5 py-2.5 font-medium text-white transition hover:bg-[#354f44] focus:outline-none focus:ring-2 focus:ring-[#a8c2b5]"
                >
                    + Add Kit
                </button>
            </div>

            {/* Search kits and filter by status */}
            <div className="mb-6 grid grid-cols-1 gap-4 rounded-2xl border border-[#e0e7e3] bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:grid-cols-3">
                <div className="md:col-span-2">
                    <label
                        htmlFor="kitSearch"
                        className="mb-2 block text-sm font-semibold text-[#46574e] dark:text-gray-200"
                    >
                        Search Kits
                    </label>

                    <input
                        id="kitSearch"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search by kit name..."
                        className="w-full rounded-lg border border-[#d6e0da] bg-white px-4 py-2.5 text-[#263d32] outline-none placeholder:text-[#9aa69f] focus:border-[#7a9e8f] focus:ring-2 focus:ring-[#dce7e2] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <div>
                    <label
                        htmlFor="kitStatusFilter"
                        className="mb-2 block text-sm font-semibold text-[#46574e] dark:text-gray-200"
                    >
                        Status
                    </label>

                    <select
                        id="kitStatusFilter"
                        value={statusFilter}
                        onChange={(event) => setStatusFilter(event.target.value)}
                        className="w-full rounded-lg border border-[#d6e0da] bg-white px-4 py-2.5 text-[#263d32] focus:border-[#7a9e8f] focus:ring-2 focus:ring-[#dce7e2] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="all">All kits</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* API feedback */}
            {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                    {error}
                </div>
            )}

            {saveError && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                    {saveError}
                </div>
            )}

            {saveSuccess && (
                <div className="mb-4 rounded-xl border border-[#cbdcd3] bg-[#edf4f0] p-4 text-[#436558] dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
                    Kit changes saved successfully.
                </div>
            )}

            {/* Kit table */}
            <div className="overflow-hidden rounded-2xl border border-[#e0e7e3] bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                {loading ? (
                    <div className="py-16 text-center text-[#77847d] dark:text-gray-400">
                        Loading kits...
                    </div>
                ) : filteredKits.length === 0 ? (
                    <div className="py-16 text-center">
                        <h2 className="font-serif text-lg font-semibold text-[#263d32] dark:text-white">
                            No kits found
                        </h2>

                        <p className="mt-1 text-sm text-[#77847d] dark:text-gray-400">
                            Try a different search or add a new kit.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-[#e0e7e3] bg-[#f1f4f9] dark:border-gray-700 dark:bg-gray-700">
                                <tr>
                                    {[
                                        "Kit",
                                        "Products",
                                        "Price",
                                        "Discount",
                                        "Status",
                                        "Actions",
                                    ].map((heading) => (
                                        <th
                                            key={heading}
                                            className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-[#46574e] dark:text-gray-200"
                                        >
                                            {heading}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[#edf1ee] dark:divide-gray-700">
                                {filteredKits.map((kit) => (
                                    <tr
                                        key={kit._id}
                                        className="transition-colors hover:bg-[#f7f9f8] dark:hover:bg-gray-700/50"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                {kit.image ? (
                                                    <img
                                                        src={kit.image}
                                                        alt={kit.name}
                                                        className="h-14 w-14 rounded-lg border border-[#e0e7e3] object-cover dark:border-gray-700"
                                                    />
                                                ) : (
                                                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#edf4f0] text-xs text-[#9aa69f] dark:bg-gray-700">
                                                        No image
                                                    </div>
                                                )}

                                                <div className="min-w-40">
                                                    <p className="font-semibold text-[#263d32] dark:text-white">
                                                        {kit.name}
                                                    </p>

                                                    <p className="mt-1 max-w-xs text-xs text-[#77847d] dark:text-gray-400">
                                                        {kit.description}
                                                    </p>

                                                    <p className="mt-1 break-all text-xs text-[#9aa69f]">
                                                        ID: {kit._id}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4 text-sm text-[#65756c] dark:text-gray-300">
                                            {kit.items?.length || 0} product type(s)
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-[#263d32] dark:text-white">
                                            {formatPrice(kit.price)}
                                        </td>

                                        <td className="px-5 py-4 text-sm text-[#65756c] dark:text-gray-300">
                                            {kit.discount || 0}%
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                    kit.isActive
                                                        ? "bg-[#edf4f0] text-[#436558] dark:bg-emerald-950/40 dark:text-emerald-300"
                                                        : "bg-[#f1f4f9] text-[#77847d] dark:bg-gray-700 dark:text-gray-300"
                                                }`}
                                            >
                                                {kit.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex flex-col items-start gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEditKit(kit)}
                                                    className="rounded-lg border border-[#cbdcd3] px-3 py-1.5 text-sm font-medium text-[#436558] transition hover:bg-[#edf4f0] dark:border-[#536e61] dark:text-[#b7d0c3] dark:hover:bg-gray-700"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleStatus(kit)}
                                                    className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                                                        kit.isActive
                                                            ? "border-[#ead2c9] text-[#a85f4a] hover:bg-[#fbf0eb] dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
                                                            : "border-[#cbdcd3] text-[#436558] hover:bg-[#edf4f0] dark:border-emerald-900 dark:text-emerald-300 dark:hover:bg-emerald-950/40"
                                                    }`}
                                                >
                                                    {kit.isActive ? "Deactivate" : "Activate"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create and edit kit modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 py-8">
                    <form
                        onSubmit={handleSubmit}
                        className="my-auto w-full max-w-3xl space-y-5 rounded-2xl border border-[#e0e7e3] bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="font-serif text-xl font-semibold text-[#263d32] dark:text-white">
                                    {editingKitId ? "Edit Kit" : "Create Kit"}
                                </h2>

                                <p className="mt-1 text-sm text-[#77847d] dark:text-gray-400">
                                    Configure kit information and its products.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    setIsProductDropdownOpen(false);
                                }}
                                className="rounded-lg px-3 py-1 text-2xl text-[#65756c] transition hover:bg-[#f1f4f9] dark:hover:bg-gray-700"
                                aria-label="Close form"
                            >
                                ×
                            </button>
                        </div>

                        {formError && (
                            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                                {formError}
                            </div>
                        )}

                        {/* Basic kit details */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="kitName"
                                    className="mb-1 block text-sm font-medium text-[#46574e] dark:text-gray-200"
                                >
                                    Kit Name
                                </label>

                                <input
                                    id="kitName"
                                    name="name"
                                    value={form.name}
                                    onChange={updateField}
                                    required
                                    className="w-full rounded-lg border border-[#d6e0da] bg-white px-3 py-2 text-[#263d32] outline-none focus:border-[#7a9e8f] focus:ring-2 focus:ring-[#dce7e2] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="kitImage"
                                    className="mb-1 block text-sm font-medium text-[#46574e] dark:text-gray-200"
                                >
                                    Image URL
                                </label>

                                <input
                                    id="kitImage"
                                    name="image"
                                    type="url"
                                    value={form.image}
                                    onChange={updateField}
                                    required
                                    placeholder="https://..."
                                    className="w-full rounded-lg border border-[#d6e0da] bg-white px-3 py-2 text-[#263d32] outline-none focus:border-[#7a9e8f] focus:ring-2 focus:ring-[#dce7e2] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="kitDescription"
                                className="mb-1 block text-sm font-medium text-[#46574e] dark:text-gray-200"
                            >
                                Description
                            </label>

                            <textarea
                                id="kitDescription"
                                name="description"
                                value={form.description}
                                onChange={updateField}
                                required
                                rows={3}
                                className="w-full rounded-lg border border-[#d6e0da] bg-white px-3 py-2 text-[#263d32] outline-none focus:border-[#7a9e8f] focus:ring-2 focus:ring-[#dce7e2] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="kitPrice"
                                    className="mb-1 block text-sm font-medium text-[#46574e] dark:text-gray-200"
                                >
                                    Kit Price (₹)
                                </label>

                                <input
                                    id="kitPrice"
                                    name="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.price}
                                    onChange={updateField}
                                    required
                                    className="w-full rounded-lg border border-[#d6e0da] bg-white px-3 py-2 text-[#263d32] outline-none focus:border-[#7a9e8f] focus:ring-2 focus:ring-[#dce7e2] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="kitDiscount"
                                    className="mb-1 block text-sm font-medium text-[#46574e] dark:text-gray-200"
                                >
                                    Discount (%)
                                </label>

                                <input
                                    id="kitDiscount"
                                    name="discount"
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    value={form.discount}
                                    onChange={updateField}
                                    required
                                    className="w-full rounded-lg border border-[#d6e0da] bg-white px-3 py-2 text-[#263d32] outline-none focus:border-[#7a9e8f] focus:ring-2 focus:ring-[#dce7e2] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Searchable product dropdown */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-[#46574e] dark:text-gray-200">
                                Add Products to Kit
                            </label>

                            <div className="relative">
                                <button
                                    type="button"
                                    disabled={productsLoading}
                                    onClick={() =>
                                        setIsProductDropdownOpen((open) => !open)
                                    }
                                    className="flex w-full items-center justify-between rounded-lg border border-[#d6e0da] bg-white px-4 py-3 text-left text-[#263d32] outline-none transition focus:border-[#7a9e8f] focus:ring-2 focus:ring-[#dce7e2] disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    aria-expanded={isProductDropdownOpen}
                                >
                                    <span>
                                        {productsLoading
                                            ? "Loading products..."
                                            : "Select a product to add"}
                                    </span>

                                    <span aria-hidden="true">
                                        {isProductDropdownOpen ? "▲" : "▼"}
                                    </span>
                                </button>

                                {isProductDropdownOpen && !productsLoading && (
                                    <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-[#d6e0da] bg-white shadow-xl dark:border-gray-600 dark:bg-gray-800">
                                        <div className="border-b border-[#e0e7e3] p-3 dark:border-gray-700">
                                            <input
                                                type="search"
                                                value={productSearch}
                                                onChange={(event) =>
                                                    setProductSearch(event.target.value)
                                                }
                                                placeholder="Search products by name..."
                                                autoComplete="off"
                                                className="w-full rounded-lg border border-[#d6e0da] bg-white px-3 py-2 text-sm text-[#263d32] outline-none focus:border-[#7a9e8f] focus:ring-2 focus:ring-[#dce7e2] dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
                                                aria-label="Search products"
                                            />
                                        </div>

                                        <div className="max-h-56 overflow-y-auto p-1">
                                            {filteredProducts.length === 0 ? (
                                                <p className="px-3 py-4 text-sm text-[#77847d] dark:text-gray-400">
                                                    {products.length === 0
                                                        ? "No products available."
                                                        : "No matching products found."}
                                                </p>
                                            ) : (
                                                filteredProducts.map((product) => (
                                                    <button
                                                        key={product._id}
                                                        type="button"
                                                        onClick={() => {
                                                            handleAddProduct(product._id);
                                                            setProductSearch("");
                                                            setIsProductDropdownOpen(false);
                                                        }}
                                                        className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-[#edf4f0] dark:hover:bg-gray-700"
                                                    >
                                                        <span className="min-w-0">
                                                            <span className="block truncate text-sm font-medium text-[#263d32] dark:text-gray-100">
                                                                {product.title}
                                                            </span>

                                                            <span className="mt-1 block text-xs text-[#77847d] dark:text-gray-400">
                                                                {formatPrice(product.price)}
                                                            </span>
                                                        </span>

                                                        <span className="shrink-0 text-sm font-semibold text-[#436558] dark:text-[#a9cfbe]">
                                                            + Add
                                                        </span>
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Selected products and quantities */}
                            {selectedProducts.length === 0 ? (
                                <p className="rounded-lg bg-[#f1f4f9] p-4 text-sm text-[#77847d] dark:bg-gray-700/50 dark:text-gray-400">
                                    No products selected yet.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {selectedProducts.map((item) => (
                                        <div
                                            key={item.product}
                                            className="flex flex-col gap-3 rounded-lg border border-[#e0e7e3] p-3 dark:border-gray-700 sm:flex-row sm:items-center"
                                        >
                                            {item.details?.images?.[0] && (
                                                <img
                                                    src={item.details.images[0]}
                                                    alt={item.details.title || "Product"}
                                                    className="h-12 w-12 rounded-lg object-cover"
                                                />
                                            )}

                                            <div className="min-w-0 flex-1">
                                                <p className="font-medium text-[#263d32] dark:text-gray-200">
                                                    {item.details?.title ||
                                                        "Product unavailable"}
                                                </p>

                                                <p className="text-xs text-[#77847d] dark:text-gray-400">
                                                    {formatPrice(item.details?.price)}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <label
                                                    htmlFor={`quantity-${item.product}`}
                                                    className="text-sm text-[#65756c] dark:text-gray-300"
                                                >
                                                    Qty
                                                </label>

                                                <input
                                                    id={`quantity-${item.product}`}
                                                    type="number"
                                                    min="1"
                                                    step="1"
                                                    value={item.quantity}
                                                    onChange={(event) =>
                                                        handleQuantityChange(
                                                            item.product,
                                                            event.target.value
                                                        )
                                                    }
                                                    className="w-20 rounded-lg border border-[#d6e0da] bg-white px-2 py-1.5 text-[#263d32] focus:border-[#7a9e8f] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemoveProduct(item.product)
                                                    }
                                                    className="rounded-lg px-2 py-1.5 text-sm font-medium text-[#a85f4a] transition hover:bg-[#fbf0eb] dark:text-red-300 dark:hover:bg-red-950/40"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Kit active status */}
                        <label className="flex items-center gap-3 text-sm font-medium text-[#46574e] dark:text-gray-200">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={form.isActive}
                                onChange={updateField}
                                className="h-4 w-4 rounded border-gray-300 accent-[#436558] focus:ring-[#7a9e8f]"
                            />
                            Make this kit available to customers
                        </label>

                        {/* Form buttons */}
                        <div className="flex flex-col-reverse justify-end gap-3 border-t border-[#e0e7e3] pt-4 dark:border-gray-700 sm:flex-row">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    setIsProductDropdownOpen(false);
                                }}
                                className="rounded-lg border border-[#d6e0da] px-5 py-2.5 font-medium text-[#46574e] transition hover:bg-[#f1f4f9] dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-lg bg-[#436558] px-5 py-2.5 font-medium text-white transition hover:bg-[#354f44] focus:outline-none focus:ring-2 focus:ring-[#a8c2b5] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving
                                    ? "Saving..."
                                    : editingKitId
                                      ? "Save Changes"
                                      : "Create Kit"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default AdminKits;
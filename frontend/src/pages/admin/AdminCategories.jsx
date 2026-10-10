
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    fetchAdminCategories,
    createCategory,
    updateCategory,
    deactivateCategory,
} from "../../features/categories/categoryThunk";

import {
    selectAdminCategories,
    selectAdminCategoriesLoading,
    selectAdminCategoriesError,
    selectCategorySaving,
    selectCategorySaveError,
} from "../../features/categories/categorySelectors";

const initialForm = {
    name: "",
    description: "",
    image: "",
    isActive: true,
};

function AdminCategories() {
    const dispatch = useDispatch();

    // Read category data and request states from Redux.
    const categories = useSelector(selectAdminCategories);
    const loading = useSelector(selectAdminCategoriesLoading);
    const error = useSelector(selectAdminCategoriesError);
    const saving = useSelector(selectCategorySaving);
    const saveError = useSelector(selectCategorySaveError);

    // Keep form values and editing state locally.
    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    // Fetch categories when this page first opens.
    useEffect(() => {
        dispatch(fetchAdminCategories());
    }, [dispatch]);

    // Update the relevant field when an input changes.
    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setForm((currentForm) => ({
            ...currentForm,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Reset the form and leave edit mode.
    const resetForm = () => {
        setForm(initialForm);
        setEditingId(null);
    };

    // Populate the form with the selected category.
    const handleEdit = (category) => {
        setEditingId(category._id);

        setForm({
            name: category.name || "",
            description: category.description || "",
            image: category.image || "",
            isActive: category.isActive,
        });

        setSuccessMessage("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Create a category or save changes to an existing one.
    const handleSubmit = async (event) => {
        event.preventDefault();
        setSuccessMessage("");

        const categoryData = {
            name: form.name.trim(),
            description: form.description.trim(),
            image: form.image.trim(),
            isActive: form.isActive,
        };

        // Stop if the category name is empty.
        if (!categoryData.name) {
            return;
        }

        try {
            if (editingId) {
                // Update the selected category.
                await dispatch(
                    updateCategory({
                        id: editingId,
                        categoryData,
                    })
                ).unwrap();

                setSuccessMessage("Category updated successfully.");
            } else {
                // Create a new category.
                await dispatch(createCategory(categoryData)).unwrap();

                setSuccessMessage("Category created successfully.");
            }

            resetForm();
        } catch {
            // Redux stores the API error for display below.
        }
    };

    // Deactivate an active category without permanently deleting it.
    const handleDeactivate = async (category) => {
        const confirmed = window.confirm(
            `Deactivate "${category.name}"?`
        );

        if (!confirmed) return;

        setSuccessMessage("");

        try {
            await dispatch(deactivateCategory(category._id)).unwrap();
            setSuccessMessage("Category deactivated successfully.");
        } catch {
            // Redux stores the API error.
        }
    };

    // Reactivate an inactive category using the update endpoint.
    const handleReactivate = async (category) => {
        setSuccessMessage("");

        try {
            await dispatch(
                updateCategory({
                    id: category._id,
                    categoryData: { isActive: true },
                })
            ).unwrap();

            setSuccessMessage("Category reactivated successfully.");
        } catch {
            // Redux stores the API error.
        }
    };

    return (
        <div className="min-h-screen p-6 md:p-8">
            {/* Page heading */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Category Management
                </h1>

                <p className="mt-1 text-gray-500 dark:text-gray-400">
                    Create, edit, and manage TinyNest categories.
                </p>
            </div>

            {/* Create/edit form */}
            <form
                onSubmit={handleSubmit}
                className="mb-8 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800"
            >
                <h2 className="mb-5 text-xl font-semibold text-gray-900 dark:text-white">
                    {editingId ? "Edit Category" : "Add New Category"}
                </h2>

                <div className="grid gap-5 md:grid-cols-2">
                    {/* Category name */}
                    <div>
                        <label
                            htmlFor="categoryName"
                            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
                        >
                            Category Name *
                        </label>

                        <input
                            id="categoryName"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            maxLength={100}
                            placeholder="e.g. Baby Clothing"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    {/* Category image URL */}
                    <div>
                        <label
                            htmlFor="categoryImage"
                            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
                        >
                            Image URL
                        </label>

                        <input
                            id="categoryImage"
                            name="image"
                            type="url"
                            value={form.image}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label
                            htmlFor="categoryDescription"
                            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
                        >
                            Description
                        </label>

                        <textarea
                            id="categoryDescription"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Describe this category..."
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    {/* Active status */}
                    <label className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={form.isActive}
                            onChange={handleChange}
                            className="h-4 w-4 rounded accent-blue-600"
                        />
                        Category is active
                    </label>
                </div>

                {/* API error */}
                {saveError && (
                    <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
                        {saveError}
                    </p>
                )}

                {/* Form actions */}
                <div className="mt-6 flex flex-wrap gap-3">
                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {saving
                            ? "Saving..."
                            : editingId
                              ? "Save Changes"
                              : "Create Category"}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            onClick={resetForm}
                            disabled={saving}
                            className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {/* Success feedback */}
            {successMessage && (
                <div
                    role="status"
                    className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300"
                >
                    {successMessage}
                </div>
            )}

            {/* Fetching error */}
            {error && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
                    {error}
                </div>
            )}

            {/* Category table */}
            <div className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-gray-800">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
                        <p className="mt-4 text-gray-500 dark:text-gray-400">
                            Loading categories...
                        </p>
                    </div>
                ) : categories.length === 0 ? (
                    <div className="py-16 text-center">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                            No categories found
                        </h3>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">
                            Create your first category using the form above.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                        Category
                                    </th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                        Description
                                    </th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {categories.map((category) => (
                                    <tr
                                        key={category._id}
                                        className="transition hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {category.image ? (
                                                    <img
                                                        src={category.image}
                                                        alt={category.name}
                                                        className="h-12 w-12 rounded-lg border border-gray-200 object-cover dark:border-gray-700"
                                                    />
                                                ) : (
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400 dark:bg-gray-700">
                                                        No image
                                                    </div>
                                                )}

                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white">
                                                        {category.name}
                                                    </p>
                                                    <p className="mt-1 text-xs text-gray-400">
                                                        ID: {category._id}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="max-w-xs px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                            {category.description || "—"}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                    category.isActive
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200"
                                                }`}
                                            >
                                                {category.isActive
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleEdit(category)
                                                    }
                                                    className="rounded-lg border border-blue-200 px-3 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                                                >
                                                    Edit
                                                </button>

                                                {category.isActive ? (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDeactivate(
                                                                category
                                                            )
                                                        }
                                                        disabled={saving}
                                                        className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                                    >
                                                        Deactivate
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleReactivate(
                                                                category
                                                            )
                                                        }
                                                        disabled={saving}
                                                        className="rounded-lg border border-green-200 px-3 py-1.5 text-sm font-medium text-green-700 transition hover:bg-green-50 disabled:opacity-50"
                                                    >
                                                        Reactivate
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminCategories;

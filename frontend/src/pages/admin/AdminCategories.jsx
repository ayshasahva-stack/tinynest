
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

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

import { categorySchema } from "../../validations/admin/categorySchema";

// Default values used when adding or resetting a category.
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

    // Local state for editing and success messages.
    const [editingId, setEditingId] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    // React Hook Form handles form values and Yup validation.
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(categorySchema),
        defaultValues: initialForm,
    });

    // Fetch categories when this page first opens.
    useEffect(() => {
        dispatch(fetchAdminCategories());
    }, [dispatch]);

    // Reset the form and leave edit mode.
    const resetForm = () => {
        reset(initialForm);
        setEditingId(null);
        setSuccessMessage("");
    };

    // Populate the form with the selected category.
    const handleEdit = (category) => {
        setEditingId(category._id);

        // Reset fills the form with the selected category values.
        reset({
            name: category.name || "",
            description: category.description || "",
            image: category.image || "",
            isActive: category.isActive ?? true,
        });

        setSuccessMessage("");

        // Scroll to the form when editing.
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Create a category or update an existing category.
    // This function runs only after Yup validation succeeds.
    const onSubmit = async (values) => {
        setSuccessMessage("");

        // Prepare clean category data for the existing API.
        const categoryData = {
            name: values.name.trim(),
            description: values.description?.trim() || "",
            image: values.image?.trim() || "",
            isActive: values.isActive,
        };

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
                await dispatch(
                    createCategory(categoryData)
                ).unwrap();

                setSuccessMessage("Category created successfully.");
            }

            // Clear the form after successful submission.
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
            await dispatch(
                deactivateCategory(category._id)
            ).unwrap();

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
        <div className="min-h-screen bg-[#f7f9ff] p-6 md:p-8 dark:bg-slate-950">

            {/* Page heading */}
            <div className="mb-8">
                <h1 className="font-serif text-3xl font-semibold text-[#263d32] dark:text-white">
                    Category Management
                </h1>

                <p className="mt-1 text-[#77847d] dark:text-gray-400">
                    Create, edit, and manage TinyNest categories.
                </p>
            </div>

            {/* Create/edit category form */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="
                    mb-8 rounded-2xl
                    border border-[#e0e7e3]
                    bg-white p-6 shadow-sm
                    dark:border-gray-700 dark:bg-gray-800
                "
            >
                <h2 className="mb-5 font-serif text-xl font-semibold text-[#263d32] dark:text-white">
                    {editingId ? "Edit Category" : "Add New Category"}
                </h2>

                <div className="grid gap-5 md:grid-cols-2">

                    {/* Category name */}
                    <div>
                        <label
                            htmlFor="categoryName"
                            className="mb-2 block text-sm font-medium text-[#46574e] dark:text-gray-200"
                        >
                            Category Name *
                        </label>

                        <input
                            id="categoryName"
                            type="text"
                            maxLength={100}
                            placeholder="e.g. Baby Clothing"
                            {...register("name")}
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

                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Category image URL */}
                    <div>
                        <label
                            htmlFor="categoryImage"
                            className="mb-2 block text-sm font-medium text-[#46574e] dark:text-gray-200"
                        >
                            Image URL
                        </label>

                        <input
                            id="categoryImage"
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            {...register("image")}
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

                        {errors.image && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {errors.image.message}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label
                            htmlFor="categoryDescription"
                            className="mb-2 block text-sm font-medium text-[#46574e] dark:text-gray-200"
                        >
                            Description
                        </label>

                        <textarea
                            id="categoryDescription"
                            rows={3}
                            placeholder="Describe this category..."
                            {...register("description")}
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

                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    {/* Active status */}
                    <label className="flex items-center gap-3 text-sm text-[#46574e] dark:text-gray-200">
                        <input
                            type="checkbox"
                            {...register("isActive")}
                            className="h-4 w-4 rounded accent-[#436558]"
                        />

                        Category is active
                    </label>
                </div>

                {/* API error */}
                {saveError && (
                    <p className="
                        mt-4 rounded-lg
                        border border-red-200
                        bg-red-50 p-3 text-sm text-red-700
                        dark:border-red-900
                        dark:bg-red-950/30 dark:text-red-300
                    ">
                        {saveError}
                    </p>
                )}

                {/* Form actions */}
                <div className="mt-6 flex flex-wrap gap-3">
                    <button
                        type="submit"
                        disabled={saving}
                        className="
                            rounded-lg bg-[#436558]
                            px-5 py-2.5 font-medium text-white
                            transition hover:bg-[#354f44]
                            focus:outline-none focus:ring-2
                            focus:ring-[#a8c2b5]
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
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
                            className="
                                rounded-lg
                                border border-[#d6e0da]
                                px-5 py-2.5 font-medium
                                text-[#46574e] transition
                                hover:bg-[#f1f4f9]
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                                dark:border-gray-600
                                dark:text-gray-200
                                dark:hover:bg-gray-700
                            "
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
                    className="
                        mb-6 rounded-xl
                        border border-[#cbdcd3]
                        bg-[#edf4f0] p-4
                        text-[#436558]
                        dark:border-emerald-900
                        dark:bg-emerald-950/30
                        dark:text-emerald-300
                    "
                >
                    {successMessage}
                </div>
            )}

            {/* Fetching error */}
            {error && (
                <div className="
                    mb-6 rounded-xl
                    border border-red-200
                    bg-red-50 p-4 text-red-700
                    dark:border-red-900
                    dark:bg-red-950/30 dark:text-red-300
                ">
                    {error}
                </div>
            )}

            {/* Category table */}
            <div className="
                overflow-hidden rounded-2xl
                border border-[#e0e7e3]
                bg-white shadow-sm
                dark:border-gray-700 dark:bg-gray-800
            ">
                {loading ? (
                    /* Loading state */
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="
                            h-10 w-10 animate-spin
                            rounded-full border-4
                            border-[#dce7e2]
                            border-t-[#436558]
                        " />

                        <p className="mt-4 text-sm text-[#77847d] dark:text-gray-400">
                            Loading categories...
                        </p>
                    </div>
                ) : categories.length === 0 ? (
                    /* Empty state */
                    <div className="py-16 text-center">
                        <h3 className="font-serif text-lg font-semibold text-[#263d32] dark:text-white">
                            No categories found
                        </h3>

                        <p className="mt-1 text-sm text-[#77847d] dark:text-gray-400">
                            Create your first category using the form above.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">

                            {/* Table header */}
                            <thead className="
                                border-b border-[#e0e7e3]
                                bg-[#f1f4f9]
                                dark:border-gray-700 dark:bg-gray-700
                            ">
                                <tr>
                                    <th className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-[#46574e] dark:text-gray-200">
                                        Category
                                    </th>

                                    <th className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-[#46574e] dark:text-gray-200">
                                        Description
                                    </th>

                                    <th className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-[#46574e] dark:text-gray-200">
                                        Status
                                    </th>

                                    <th className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-[#46574e] dark:text-gray-200">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            {/* Table body */}
                            <tbody className="divide-y divide-[#edf1ee] dark:divide-gray-700">
                                {categories.map((category) => (
                                    <tr
                                        key={category._id}
                                        className="
                                            transition-colors
                                            hover:bg-[#f7f9f8]
                                            dark:hover:bg-gray-700/50
                                        "
                                    >
                                        {/* Category image and details */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {category.image ? (
                                                    <img
                                                        src={category.image}
                                                        alt={category.name}
                                                        className="
                                                            h-12 w-12 shrink-0
                                                            rounded-lg
                                                            border border-[#e0e7e3]
                                                            object-cover
                                                            dark:border-gray-700
                                                        "
                                                    />
                                                ) : (
                                                    <div className="
                                                        flex h-12 w-12 shrink-0
                                                        items-center justify-center
                                                        rounded-lg bg-[#edf4f0]
                                                        text-xs text-[#9aa69f]
                                                        dark:bg-gray-700
                                                    ">
                                                        No image
                                                    </div>
                                                )}

                                                <div className="min-w-0">
                                                    <p className="font-semibold text-[#263d32] dark:text-white">
                                                        {category.name}
                                                    </p>

                                                    <p className="mt-1 text-xs text-[#9aa69f]">
                                                        ID: {category._id}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Category description */}
                                        <td className="max-w-xs px-6 py-4 text-sm text-[#65756c] dark:text-gray-300">
                                            {category.description || "—"}
                                        </td>

                                        {/* Active/inactive status */}
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                    category.isActive
                                                        ? "bg-[#edf4f0] text-[#436558] dark:bg-emerald-950/40 dark:text-emerald-300"
                                                        : "bg-[#f1f4f9] text-[#77847d] dark:bg-gray-700 dark:text-gray-300"
                                                }`}
                                            >
                                                {category.isActive
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>
                                        </td>

                                        {/* Edit and activate/deactivate actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEdit(category)}
                                                    className="
                                                        rounded-lg
                                                        border border-[#cbdcd3]
                                                        px-3 py-1.5
                                                        text-sm font-medium
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

                                                {category.isActive ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeactivate(category)}
                                                        disabled={saving}
                                                        className="
                                                            rounded-lg
                                                            border border-[#ead2c9]
                                                            px-3 py-1.5
                                                            text-sm font-medium
                                                            text-[#a85f4a]
                                                            transition
                                                            hover:bg-[#fbf0eb]
                                                            disabled:cursor-not-allowed
                                                            disabled:opacity-50
                                                            dark:border-red-900
                                                            dark:text-red-300
                                                            dark:hover:bg-red-950/40
                                                        "
                                                    >
                                                        Deactivate
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleReactivate(category)}
                                                        disabled={saving}
                                                        className="
                                                            rounded-lg
                                                            border border-[#cbdcd3]
                                                            px-3 py-1.5
                                                            text-sm font-medium
                                                            text-[#436558]
                                                            transition
                                                            hover:bg-[#edf4f0]
                                                            disabled:cursor-not-allowed
                                                            disabled:opacity-50
                                                            dark:border-emerald-900
                                                            dark:text-emerald-300
                                                            dark:hover:bg-emerald-950/40
                                                        "
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


import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { createProductThunk } from "../../features/products/productThunk";

import {
    selectProductsLoading,
    selectProductsError,
} from "../../features/products/productSelectors";

import { fetchCategories } from "../../features/categories/categoryThunk";

import {
    selectCategories,
    selectCategoriesLoading,
    selectCategoriesError,
} from "../../features/categories/categorySelectors";

function AdminAddProduct() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Existing Redux state.
    const loading = useSelector(selectProductsLoading);
    const error = useSelector(selectProductsError);
    const categories = useSelector(selectCategories);
    const categoriesLoading = useSelector(selectCategoriesLoading);
    const categoriesError = useSelector(selectCategoriesError);

    // Existing form state.
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        discount: "0",
        category: "",
        brand: "",
        ageGroup: "",
        stock: "",
        tags: "",
    });

    // Store selected image files.
    const [images, setImages] = useState([]);

    // Fetch categories for the dropdown.
    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    // Handle text and select inputs.
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };
    // Store all selected image files, up to five.
    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files || []);

        setImages((previousImages) => {
            // Combine existing images with the newly selected images.
            const combinedImages = [...previousImages, ...selectedFiles];

            // Keep no more than five images.
            return combinedImages.slice(0, 5);
        });

        // Allow selecting the same file again if needed.
        e.target.value = "";
    };
    // Remove a selected image.
    const handleRemoveImage = (indexToRemove) => {
        setImages((previousImages) =>
            previousImages.filter(
                (_, index) => index !== indexToRemove
            )
        );
    };

    // Submit the product form.
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Require at least one product image.
        if (images.length === 0) {
            alert("Please select at least one product image.");
            return;
        }

        // Send text fields and files using FormData.
        const data = new FormData();

        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("price", formData.price);
        data.append("discount", formData.discount);
        data.append("category", formData.category);
        data.append("brand", formData.brand);
        data.append("ageGroup", formData.ageGroup);
        data.append("stock", formData.stock);

        // The backend converts the comma-separated string into an array.
        data.append("tags", formData.tags);

        // Use the same "images" field for every selected file.
        images.forEach((image) => {
            data.append("images", image);
        });

        // Existing Redux thunk.
        const result = await dispatch(createProductThunk(data));

        // Navigate to the product list after successful creation.
        if (createProductThunk.fulfilled.match(result)) {
            navigate("/admin/products");
        }
    };

    // Shared styles use the TinyNest sage-green palette.
    const inputClass = `
        w-full rounded-lg border border-[#dce3df]
        bg-white px-4 py-3 text-sm text-[#34443d]
        placeholder:text-[#9aa7a0]
        outline-none transition
        focus:border-[#7a9e8f] focus:ring-2 focus:ring-[#dce7e2]
        dark:border-gray-600 dark:bg-gray-700 dark:text-white
    `;

    const labelClass = `
        mb-2 block text-sm font-medium
        text-[#46574e] dark:text-gray-200
    `;

    const cardClass = `
        rounded-2xl border border-[#e0e7e3]
        bg-white p-5 shadow-sm
        sm:p-6
        dark:border-gray-700 dark:bg-gray-800
    `;

    return (
        <div className="min-h-screen bg-[#f7f9ff] px-4 py-6 sm:px-6 lg:px-8 dark:bg-gray-900">
            <div className="mx-auto max-w-5xl">

                {/* Page heading */}
                <header className="mb-7">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/products")}
                        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#436558] transition hover:text-[#2f4e42] dark:text-[#a9c7ba]"
                    >
                        <span aria-hidden="true">←</span>
                        Back to Products
                    </button>

                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-[#7a9e8f]">
                                Product Management
                            </p>

                            <h1 className="font-serif text-3xl text-[#263d32] sm:text-4xl dark:text-white">
                                Add Product
                            </h1>

                            <p className="mt-2 text-sm text-[#77847d] dark:text-gray-400">
                                Add a new product to TinyNest.
                            </p>
                        </div>

                        <span className="rounded-full border border-[#dce7e2] bg-[#edf4f0] px-4 py-2 text-xs font-medium text-[#436558] dark:bg-gray-800 dark:text-[#b9d6c9]">
                            New Product
                        </span>
                    </div>
                </header>

                {/* Existing error display */}
                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Basic Information */}
                    <section className={cardClass}>
                        <div className="mb-6 flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf4f0] text-lg text-[#436558] dark:bg-gray-700 dark:text-[#b9d6c9]">
                                ✎
                            </span>

                            <div>
                                <h2 className="font-serif text-xl text-[#263d32] dark:text-white">
                                    Basic Information
                                </h2>
                                <p className="mt-1 text-xs text-[#89958e]">
                                    Enter the product name, description and pricing.
                                </p>
                            </div>
                        </div>

                        {/* Product title */}
                        <div className="mb-5">
                            <label htmlFor="title" className={labelClass}>
                                Product Name
                            </label>

                            <input
                                id="title"
                                name="title"
                                type="text"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter product name"
                                required
                                className={inputClass}
                            />
                        </div>

                        {/* Description */}
                        <div className="mb-5">
                            <label htmlFor="description" className={labelClass}>
                                Description
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter product description"
                                rows="5"
                                required
                                className={`${inputClass} resize-none`}
                            />
                        </div>

                        {/* Price and discount */}
                        <div className="grid gap-5 md:grid-cols-2">
                            <div>
                                <label htmlFor="price" className={labelClass}>
                                    Price
                                </label>

                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#7a9e8f]">
                                        ₹
                                    </span>

                                    <input
                                        id="price"
                                        name="price"
                                        type="number"
                                        min="1"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="699"
                                        required
                                        className={`${inputClass} pl-9`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="discount" className={labelClass}>
                                    Discount (%)
                                </label>

                                <div className="relative">
                                    <input
                                        id="discount"
                                        name="discount"
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={formData.discount}
                                        onChange={handleChange}
                                        className={`${inputClass} pr-10`}
                                    />

                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#7a9e8f]">
                                        %
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Product Details */}
                    <section className={cardClass}>
                        <div className="mb-6 flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fbf0eb] text-lg text-[#bd8069] dark:bg-gray-700">
                                ◇
                            </span>

                            <div>
                                <h2 className="font-serif text-xl text-[#263d32] dark:text-white">
                                    Product Details
                                </h2>
                                <p className="mt-1 text-xs text-[#89958e]">
                                    Organize the product for your TinyNest catalogue.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">

                            {/* Category */}
                            <div>
                                <label htmlFor="category" className={labelClass}>
                                    Category
                                </label>

                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    disabled={categoriesLoading}
                                    className={inputClass}
                                >
                                    <option value="">
                                        {categoriesLoading
                                            ? "Loading categories..."
                                            : "Select category"}
                                    </option>

                                    {categories.map((category) => (
                                        <option
                                            key={category._id}
                                            value={category._id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>

                                {categoriesError && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {categoriesError}
                                    </p>
                                )}
                            </div>

                            {/* Brand */}
                            <div>
                                <label htmlFor="brand" className={labelClass}>
                                    Brand
                                </label>

                                <input
                                    id="brand"
                                    name="brand"
                                    type="text"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    placeholder="TinyNest"
                                    required
                                    className={inputClass}
                                />
                            </div>

                            {/* Age group */}
                            <div>
                                <label htmlFor="ageGroup" className={labelClass}>
                                    Age Group
                                </label>

                                <select
                                    id="ageGroup"
                                    name="ageGroup"
                                    value={formData.ageGroup}
                                    onChange={handleChange}
                                    required
                                    className={inputClass}
                                >
                                    <option value="">Select age group</option>
                                    <option value="0-6 months">0-6 months</option>
                                    <option value="0-6 months">0-12 months</option>
                                    <option value="6-12 months">6-12 months</option>
                                    <option value="1-2 years">1-2 years</option>
                                    <option value="2-4 years">2-4 years</option>
                                    <option value="4+ years">4+ years</option>
                                </select>
                            </div>

                            {/* Stock */}
                            <div>
                                <label htmlFor="stock" className={labelClass}>
                                    Stock
                                </label>

                                <input
                                    id="stock"
                                    name="stock"
                                    type="number"
                                    min="0"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    placeholder="10"
                                    required
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="mt-5">
                            <label htmlFor="tags" className={labelClass}>
                                Tags
                            </label>

                            <input
                                id="tags"
                                name="tags"
                                type="text"
                                value={formData.tags}
                                onChange={handleChange}
                                placeholder="romper, baby clothing, cotton"
                                className={inputClass}
                            />

                            <p className="mt-2 text-xs text-[#89958e]">
                                Separate tags with commas.
                            </p>
                        </div>
                    </section>

                    {/* Product Images */}
                    <section className={cardClass}>
                        <div className="mb-6 flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf4f0] text-lg text-[#436558] dark:bg-gray-700 dark:text-[#b9d6c9]">
                                ▧
                            </span>

                            <div>
                                <h2 className="font-serif text-xl text-[#263d32] dark:text-white">
                                    Product Images
                                </h2>
                                <p className="mt-1 text-xs text-[#89958e]">
                                    Upload up to 5 product images.
                                </p>
                            </div>
                        </div>

                        {/* Existing file input and selection handler */}
                        <label
                            htmlFor="productImages"
                            className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-[#cbdcd3] bg-[#f7faf8] px-5 py-8 text-center transition hover:border-[#7a9e8f] hover:bg-[#edf4f0] dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
                        >
                            <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl text-[#436558] shadow-sm dark:bg-gray-800 dark:text-[#b9d6c9]">
                                ↑
                            </span>

                            <span className="text-sm font-medium text-[#436558] dark:text-[#b9d6c9]">
                                Click to upload product images
                            </span>

                            <span className="mt-2 text-xs text-[#89958e]">
                                JPEG, PNG or WebP · Maximum 5 images
                            </span>

                            <input
                                id="productImages"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                multiple
                                onChange={handleImageChange}
                                className="sr-only"
                            />
                        </label>

                        {/* Existing image previews and remove behaviour */}
                        {images.length > 0 && (
                            <div className="mt-6">
                                <div className="mb-3 flex items-center justify-between">
                                    <p className="text-sm font-medium text-[#46574e] dark:text-gray-200">
                                        Selected Images
                                    </p>

                                    <span className="rounded-full bg-[#edf4f0] px-3 py-1 text-xs font-medium text-[#436558] dark:bg-gray-700 dark:text-[#b9d6c9]">
                                        {images.length} / 5
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                                    {images.map((image, index) => (
                                        <div
                                            key={`${image.name}-${index}`}
                                            className="group relative overflow-hidden rounded-xl border border-[#e0e7e3] bg-white dark:border-gray-600 dark:bg-gray-700"
                                        >
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt={`Product ${index + 1}`}
                                                className="h-32 w-full object-cover"
                                            />

                                            <div className="px-2 py-2">
                                                <p className="truncate text-xs text-[#65736b] dark:text-gray-300">
                                                    {image.name}
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(index)}
                                                aria-label={`Remove image ${index + 1}`}
                                                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#bd8069] text-lg text-white shadow-sm transition hover:bg-[#a96954]"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Form actions */}
                    <div className="flex flex-wrap justify-end gap-3 pb-4">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/products")}
                            className="rounded-lg border border-[#d5ded9] bg-white px-5 py-3 text-sm font-medium text-[#52635a] transition hover:bg-[#f1f5f2] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#436558] px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#355447] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                    Creating Product...
                                </>
                            ) : (
                                "Create Product"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminAddProduct;
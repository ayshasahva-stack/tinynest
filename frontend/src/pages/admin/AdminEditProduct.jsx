
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { productSchema } from "../../validations/admin/productSchema";

import {
    fetchProductById,
    updateProductThunk,
} from "../../features/products/productThunk";

import {
    selectProductsLoading,
    selectProductsError,
    selectSelectedProduct,
} from "../../features/products/productSelectors";

import { fetchCategories } from "../../features/categories/categoryThunk";

import {
    selectCategories,
    selectCategoriesError,
    selectCategoriesLoading,
} from "../../features/categories/categorySelectors";

function AdminEditProduct() {
    const { id } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Get selected product and Redux states.
    const selectedProduct = useSelector(selectSelectedProduct);
    const productLoading = useSelector(selectProductsLoading);
    const productError = useSelector(selectProductsError);

    // Get category data from Redux.
    const categories = useSelector(selectCategories);
    const categoriesLoading = useSelector(selectCategoriesLoading);
    const categoriesError = useSelector(selectCategoriesError);

    // React Hook Form + Yup validation.
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(productSchema),

        // Initial values before the product is loaded.
        defaultValues: {
            title: "",
            description: "",
            price: "",
            discount: "0",
            category: "",
            brand: "",
            ageGroup: "",
            stock: "",
            tags: "",
        },
    });

    // Existing Cloudinary image URLs.
    const [existingImages, setExistingImages] = useState([]);

    // Newly selected image files.
    const [newImages, setNewImages] = useState([]);

    // Image validation error.
    const [imageError, setImageError] = useState("");

    // Update button loading state.
    const [submitting, setSubmitting] = useState(false);

    // Fetch product and categories when the page loads.
    useEffect(() => {
        dispatch(fetchProductById(id));
        dispatch(fetchCategories());
    }, [dispatch, id]);

    // Populate the form when the selected product is loaded.
    useEffect(() => {
        if (!selectedProduct) return;

        // Make sure this is the product requested by the URL.
        if (selectedProduct._id !== id) return;

        // Fill the form with the existing product details.
        reset({
            title: selectedProduct.title || "",
            description: selectedProduct.description || "",
            price: selectedProduct.price ?? "",
            discount: selectedProduct.discount ?? 0,

            // Handle populated category or category ID.
            category:
                selectedProduct.category?._id ||
                selectedProduct.category ||
                "",

            brand: selectedProduct.brand || "",
            ageGroup: selectedProduct.ageGroup || "",
            stock: selectedProduct.stock ?? "",

            // Convert tags array into comma-separated text.
            tags: Array.isArray(selectedProduct.tags)
                ? selectedProduct.tags.join(", ")
                : selectedProduct.tags || "",
        });

        // Keep existing images separate from new uploads.
        setExistingImages(selectedProduct.images || []);

        // Clear previously selected new images.
        setNewImages([]);

        setImageError("");
    }, [selectedProduct, id, reset]);

    // Handle new image selection.
    const handleImageChange = (event) => {
        const selectedFiles = Array.from(event.target.files || []);

        // Only allow JPEG, PNG and WebP images.
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        const invalidFiles = selectedFiles.filter(
            (file) => !allowedTypes.includes(file.type)
        );

        if (invalidFiles.length > 0) {
            setImageError(
                "Only JPEG, PNG and WebP images are allowed."
            );
            event.target.value = "";
            return;
        }

        // Existing images and new images together cannot exceed five.
        const totalImages =
            existingImages.length +
            newImages.length +
            selectedFiles.length;

        if (totalImages > 5) {
            setImageError("You can have a maximum of 5 images in total.");
            event.target.value = "";
            return;
        }

        // Add newly selected files.
        setNewImages((previousImages) => [
            ...previousImages,
            ...selectedFiles,
        ]);

        setImageError("");

        // Allow selecting the same file again.
        event.target.value = "";
    };

    // Remove one existing image.
    const removeExistingImage = (indexToRemove) => {
        setExistingImages((previousImages) =>
            previousImages.filter(
                (_, index) => index !== indexToRemove
            )
        );

        setImageError("");
    };

    // Remove one newly selected image.
    const removeNewImage = (indexToRemove) => {
        setNewImages((previousImages) =>
            previousImages.filter(
                (_, index) => index !== indexToRemove
            )
        );

        setImageError("");
    };

    // Handle valid form submission.
    const onSubmit = async (values) => {
        // At least one image must remain.
        if (
            existingImages.length === 0 &&
            newImages.length === 0
        ) {
            setImageError("Please keep at least one product image.");
            return;
        }

        // Maximum five images in total.
        if (existingImages.length + newImages.length > 5) {
            setImageError("You can have a maximum of 5 images.");
            return;
        }

        setImageError("");
        setSubmitting(true);

        try {
            // FormData is needed because the request may contain files.
            const data = new FormData();

            // Append validated product fields.
            data.append("title", values.title);
            data.append("description", values.description);
            data.append("price", values.price);
            data.append("discount", values.discount ?? 0);
            data.append("category", values.category);
            data.append("brand", values.brand);
            data.append("ageGroup", values.ageGroup);
            data.append("stock", values.stock);
            data.append("tags", values.tags || "");

            // Send the existing image URLs that should be retained.
            data.append(
                "existingImages",
                JSON.stringify(existingImages)
            );

            // Append newly selected image files.
            newImages.forEach((image) => {
                data.append("images", image);
            });

            // Keep the existing Redux update thunk and payload structure.
            const result = await dispatch(
                updateProductThunk({
                    productId: id,
                    formData: data,
                })
            );

            // Navigate only after a successful update.
            if (updateProductThunk.fulfilled.match(result)) {
                alert("Product updated successfully!");
                navigate("/admin/products");
            } else {
                // Display backend or Redux error.
                console.error(
                    "Product update failed:",
                    result.payload || result.error
                );

                alert(
                    result.payload ||
                    result.error?.message ||
                    "Failed to update product."
                );
            }
        } catch (error) {
            console.error("Failed to update product:", error);

            alert("Something went wrong while updating the product.");
        } finally {
            setSubmitting(false);
        }
    };

    // Show loading while fetching product.
    if (productLoading && !selectedProduct) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-gray-600 dark:text-gray-300">
                    Loading product...
                </p>
            </div>
        );
    }

    // Show product error.
    if (productError && !selectedProduct) {
        return (
            <div className="p-6">
                <p className="rounded-lg bg-red-50 p-4 text-red-600">
                    {productError}
                </p>
            </div>
        );
    }

    // Shared input styles.
    const inputClass = `
        w-full rounded-lg border border-[#dce3df]
        bg-white px-4 py-3 text-sm text-[#34443d]
        outline-none transition
        focus:border-[#7a9e8f] focus:ring-2 focus:ring-[#dce7e2]
        dark:border-gray-600 dark:bg-gray-700 dark:text-white
    `;

    // Shared label styles.
    const labelClass = `
        mb-2 block text-sm font-medium
        text-[#46574e] dark:text-gray-200
    `;

    // Display a field validation error.
    const renderError = (field) =>
        errors[field] && (
            <p className="mt-1 text-sm text-red-600">
                {errors[field].message}
            </p>
        );

    return (
        <div className="min-h-screen bg-[#f7f9ff] px-4 py-6 sm:px-6 lg:px-8 dark:bg-gray-900">
            <div className="mx-auto max-w-5xl">

                {/* Page heading */}
                <div className="mb-7">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/products")}
                        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#436558] transition hover:text-[#2f4e42] dark:text-[#a9c7ba]"
                    >
                        ← Back to Products
                    </button>

                    <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-[#7a9e8f]">
                        Product Management
                    </p>

                    <h1 className="font-serif text-3xl text-[#263d32] sm:text-4xl dark:text-white">
                        Edit Product
                    </h1>

                    <p className="mt-2 text-sm text-[#77847d] dark:text-gray-400">
                        Update the product information and images.
                    </p>
                </div>

                {/* Product form */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6 rounded-2xl border border-[#e0e7e3] bg-white p-5 shadow-sm sm:p-7 dark:border-gray-700 dark:bg-gray-800"
                >

                    {/* Product title */}
                    <div>
                        <label htmlFor="title" className={labelClass}>
                            Product Title
                        </label>

                        <input
                            id="title"
                            type="text"
                            placeholder="Enter product title"
                            {...register("title")}
                            className={inputClass}
                        />

                        {renderError("title")}
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className={labelClass}>
                            Description
                        </label>

                        <textarea
                            id="description"
                            rows="5"
                            placeholder="Enter product description"
                            {...register("description")}
                            className={`${inputClass} resize-y`}
                        />

                        {renderError("description")}
                    </div>

                    {/* Price, Discount and Stock */}
                    <div className="grid gap-5 md:grid-cols-3">

                        {/* Price */}
                        <div>
                            <label htmlFor="price" className={labelClass}>
                                Price
                            </label>

                            <input
                                id="price"
                                type="number"
                                min="0"
                                placeholder="699"
                                {...register("price")}
                                className={inputClass}
                            />

                            {renderError("price")}
                        </div>

                        {/* Discount */}
                        <div>
                            <label htmlFor="discount" className={labelClass}>
                                Discount (%)
                            </label>

                            <input
                                id="discount"
                                type="number"
                                min="0"
                                max="100"
                                {...register("discount")}
                                className={inputClass}
                            />

                            {renderError("discount")}
                        </div>

                        {/* Stock */}
                        <div>
                            <label htmlFor="stock" className={labelClass}>
                                Stock
                            </label>

                            <input
                                id="stock"
                                type="number"
                                min="0"
                                placeholder="10"
                                {...register("stock")}
                                className={inputClass}
                            />

                            {renderError("stock")}
                        </div>
                    </div>

                    {/* Category, Brand and Age Group */}
                    <div className="grid gap-5 md:grid-cols-3">

                        {/* Category */}
                        <div>
                            <label htmlFor="category" className={labelClass}>
                                Category
                            </label>

                            <select
                                id="category"
                                disabled={categoriesLoading}
                                {...register("category")}
                                className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-60`}
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

                            {renderError("category")}
                        </div>

                        {/* Brand */}
                        <div>
                            <label htmlFor="brand" className={labelClass}>
                                Brand
                            </label>

                            <input
                                id="brand"
                                type="text"
                                placeholder="TinyNest"
                                {...register("brand")}
                                className={inputClass}
                            />

                            {renderError("brand")}
                        </div>

                        {/* Age Group */}
                        <div>
                            <label htmlFor="ageGroup" className={labelClass}>
                                Age Group
                            </label>

                            <select
                                id="ageGroup"
                                {...register("ageGroup")}
                                className={inputClass}
                            >
                                <option value="">Select age group</option>
                                <option value="0-6 months">0-6 months</option>
                                <option value="0-12 months">0-12 months</option>
                                <option value="6-12 months">6-12 months</option>
                                <option value="1-2 years">1-2 years</option>
                                <option value="2-4 years">2-4 years</option>
                                <option value="4+ years">4+ years</option>
                            </select>

                            {renderError("ageGroup")}
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label htmlFor="tags" className={labelClass}>
                            Tags
                        </label>

                        <input
                            id="tags"
                            type="text"
                            placeholder="baby, clothing, cotton"
                            {...register("tags")}
                            className={inputClass}
                        />

                        <p className="mt-2 text-xs text-[#89958e] dark:text-gray-400">
                            Separate tags using commas.
                        </p>

                        {renderError("tags")}
                    </div>

                    {/* Existing Images */}
                    <div>
                        <label className={labelClass}>
                            Existing Images
                        </label>

                        {existingImages.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                                {existingImages.map((image, index) => (
                                    <div
                                        key={`${image}-${index}`}
                                        className="group relative overflow-hidden rounded-xl border border-[#e0e7e3] bg-white dark:border-gray-600 dark:bg-gray-700"
                                    >
                                        <img
                                            src={image}
                                            alt={`Product ${index + 1}`}
                                            className="h-32 w-full object-cover"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeExistingImage(index)
                                            }
                                            aria-label={`Remove existing image ${index + 1}`}
                                            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#bd8069] text-lg text-white shadow-sm transition hover:bg-[#a96954]"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="rounded-lg bg-[#f7faf8] px-4 py-3 text-sm text-[#89958e] dark:bg-gray-700 dark:text-gray-400">
                                No existing images.
                            </p>
                        )}
                    </div>

                    {/* Add New Images */}
                    <div>
                        <label
                            htmlFor="images"
                            className={labelClass}
                        >
                            Add New Images
                        </label>

                        <div className="rounded-xl border-2 border-dashed border-[#cbdcd3] bg-[#f7faf8] p-4 transition hover:border-[#7a9e8f] dark:border-gray-600 dark:bg-gray-700">
                            <input
                                id="images"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                multiple
                                onChange={handleImageChange}
                                className="block w-full cursor-pointer text-sm text-[#65736b] file:mr-4 file:rounded-lg file:border-0 file:bg-[#436558] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#355447] dark:text-gray-300"
                            />
                        </div>

                        <p className="mt-2 text-xs text-[#89958e] dark:text-gray-400">
                            JPEG, PNG or WebP. Maximum 5 images in total.
                        </p>

                        {/* Image validation error */}
                        {imageError && (
                            <p className="mt-2 text-sm text-red-600">
                                {imageError}
                            </p>
                        )}

                        {/* Total image count */}
                        <p className="mt-2 text-xs font-medium text-[#436558] dark:text-[#b9d6c9]">
                            {existingImages.length + newImages.length} / 5 images selected
                        </p>
                    </div>

                    {/* New Image Previews */}
                    {newImages.length > 0 && (
                        <div>
                            <p className="mb-3 text-sm font-medium text-[#46574e] dark:text-gray-200">
                                New Images
                            </p>

                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                                {newImages.map((image, index) => (
                                    <div
                                        key={`${image.name}-${index}`}
                                        className="group relative overflow-hidden rounded-xl border border-[#e0e7e3] bg-white dark:border-gray-600 dark:bg-gray-700"
                                    >
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt={`New image ${index + 1}`}
                                            className="h-32 w-full object-cover"
                                        />

                                        <div className="px-2 py-2">
                                            <p className="truncate text-xs text-[#65736b] dark:text-gray-300">
                                                {image.name}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => removeNewImage(index)}
                                            aria-label={`Remove new image ${index + 1}`}
                                            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#bd8069] text-lg text-white shadow-sm transition hover:bg-[#a96954]"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Category API error */}
                    {categoriesError && (
                        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
                            {categoriesError}
                        </p>
                    )}

                    {/* Submit buttons */}
                    <div className="flex flex-wrap justify-end gap-3 border-t border-[#e6ebe8] pt-5 dark:border-gray-700">

                        <button
                            type="button"
                            onClick={() => navigate("/admin/products")}
                            className="rounded-lg border border-[#d5ded9] bg-white px-5 py-2.5 text-sm font-medium text-[#52635a] transition hover:bg-[#f1f5f2] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={submitting || productLoading}
                            className="rounded-lg bg-[#436558] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#355447] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {submitting
                                ? "Updating..."
                                : "Update Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminEditProduct;

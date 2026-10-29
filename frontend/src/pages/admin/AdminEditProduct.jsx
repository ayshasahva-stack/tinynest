import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
    fetchProductById,
    updateProductThunk,
} from "../../features/products/productThunk";

import { selectProductsLoading,
    selectProductsError,
    selectSelectedProduct
    
 } from "../../features/products/productSelectors";

import { fetchCategories } from "../../features/categories/categoryThunk";

import {
    selectCategories,
    selectCategoriesError,
    selectCategoriesLoading,
} from "../../features/categories/categorySelectors";


function AdminEditProduct() {
    // Get product ID from the URL.
    // Example: /admin/products/edit/68abc123
    const { id } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Get product data from Redux.
    const selectedProduct = useSelector(selectSelectedProduct);

    // Product loading/error state.
    const productLoading = useSelector(selectProductsLoading);
    const productError = useSelector(selectProductsError);

    // Get categories from Redux.
    const categories = useSelector(selectCategories);
    const categoriesLoading = useSelector(selectCategoriesLoading);
    const categoriesError = useSelector(selectCategoriesError);

    // Form data.
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        discount: "",
        category: "",
        brand: "",
        ageGroup: "",
        stock: "",
        tags: "",
    });
    useEffect(() => {
    console.log("Selected product category:", formData.category);
    console.log("Available categories:", categories);
}, [formData.category, categories]);

    // Existing images already stored in MongoDB/Cloudinary.
    const [existingImages, setExistingImages] = useState([]);

    // Newly selected image files.
    const [newImages, setNewImages] = useState([]);

    // Submit state.
    const [submitting, setSubmitting] = useState(false);

    // Fetch the product and categories when the page loads.
    useEffect(() => {
        dispatch(fetchProductById(id));
        dispatch(fetchCategories());
    }, [dispatch, id]);


    // When the product is received from Redux,
    // fill the form with its existing values.
    useEffect(() => {
        if (!selectedProduct) return;

        // Make sure this is the product requested by this page.
        if (selectedProduct._id !== id) return;

        setFormData({
            title: selectedProduct.title || "",
            description: selectedProduct.description || "",
            price: selectedProduct.price ?? "",
            discount: selectedProduct.discount ?? "",
            category:
                selectedProduct.category?._id ||
                selectedProduct.category ||
                "",
            brand: selectedProduct.brand || "",
            ageGroup: selectedProduct.ageGroup || "",
            stock: selectedProduct.stock ?? "",
            tags: Array.isArray(selectedProduct.tags)
                ? selectedProduct.tags.join(", ")
                : selectedProduct.tags || "",
        });

        // Save existing image URLs separately.
        setExistingImages(selectedProduct.images || []);

        // Clear any previously selected files.
        setNewImages([]);
    }, [selectedProduct, id]);


    // Handle normal text/number/select inputs.
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };


    // Handle new image selection.
    const handleImageChange = (event) => {
        const selectedFiles = Array.from(event.target.files);

        // Existing images + new images cannot exceed 5.
        const totalImages =
            existingImages.length +
            newImages.length +
            selectedFiles.length;

        if (totalImages > 5) {
            alert("You can have a maximum of 5 images.");
            event.target.value = "";
            return;
        }

        // Add the newly selected files.
        setNewImages((previous) => [
            ...previous,
            ...selectedFiles,
        ]);

        // Allows selecting the same file again if needed.
        event.target.value = "";
    };


    // Remove one existing image.
    const removeExistingImage = (indexToRemove) => {
        setExistingImages((previous) =>
            previous.filter(
                (_, index) => index !== indexToRemove
            )
        );
    };


    // Remove one newly selected image.
    const removeNewImage = (indexToRemove) => {
        setNewImages((previous) =>
            previous.filter(
                (_, index) => index !== indexToRemove
            )
        );
    };


    // Submit updated product.
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Make sure the product has at least one image.
        if (
            existingImages.length === 0 &&
            newImages.length === 0
        ) {
            alert("Please keep at least one product image.");
            return;
        }

        setSubmitting(true);

        try {
            // FormData is required because we may upload images.
            const data = new FormData();

            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("price", formData.price);
            data.append("discount", formData.discount);
            data.append("category", formData.category);
            data.append("brand", formData.brand);
            data.append("ageGroup", formData.ageGroup);
            data.append("stock", formData.stock);
            data.append("tags", formData.tags);

            // Tell the backend which old images should remain.
            data.append(
                "existingImages",
                JSON.stringify(existingImages)
            );

            // Add newly selected image files.
            newImages.forEach((image) => {
                data.append("images", image);
            });

            // Dispatch our existing Redux update thunk.
           const result = await dispatch(
    updateProductThunk({
        productId: id,
        formData: data,
    })
);

// Handle success and failure explicitly.
if (updateProductThunk.fulfilled.match(result)) {
    alert("Product updated successfully!");
    navigate("/admin/products");
} else {
    // Show the real backend or validation error.
    console.error("Product update failed:", result.payload || result.error);

    alert(
        result.payload ||
        result.error?.message ||
        "Failed to update product."
    );
}
        } catch (error) {
            console.error(
                "Failed to update product:",
                error
            );
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
                onSubmit={handleSubmit}
                className="space-y-6 rounded-2xl border border-[#e0e7e3] bg-white p-5 shadow-sm sm:p-7 dark:border-gray-700 dark:bg-gray-800"
            >
                {/* Shared styling for form controls */}
                {/* Apply the same classes to each existing input, textarea and select. */}

                {/* Product title */}
                <div>
                    <label
                        htmlFor="title"
                        className="mb-2 block text-sm font-medium text-[#46574e] dark:text-gray-200"
                    >
                        Product Title
                    </label>

                    <input
                        id="title"
                        name="title"
                        type="text"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-[#dce3df] bg-white px-4 py-3 text-sm text-[#34443d] outline-none transition placeholder:text-[#9aa7a0] focus:border-[#7a9e8f] focus:ring-2 focus:ring-[#dce7e2] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                {/* Description */}
                <div>
                    <label
                        htmlFor="description"
                        className="mb-2 block text-sm font-medium text-[#46574e] dark:text-gray-200"
                    >
                        Description
                    </label>

                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows="5"
                        className="w-full resize-y rounded-lg border border-[#dce3df] bg-white px-4 py-3 text-sm text-[#34443d] outline-none transition focus:border-[#7a9e8f] focus:ring-2 focus:ring-[#dce7e2] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                {/* Price / Discount / Stock */}
                <div className="grid gap-5 md:grid-cols-3">
                    <div>
                        <label
                            htmlFor="price"
                            className="mb-2 block text-sm font-medium text-[#46574e] dark:text-gray-200"
                        >
                            Price
                        </label>

                        <input
                            id="price"
                            name="price"
                            type="number"
                            min="0"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-[#dce3df] bg-white px-4 py-3 text-sm text-[#34443d] outline-none transition focus:border-[#7a9e8f] focus:ring-2 focus:ring-[#dce7e2] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="discount"
                            className="mb-2 block text-sm font-medium text-[#46574e] dark:text-gray-200"
                        >
                            Discount (%)
                        </label>

                        <input
                            id="discount"
                            name="discount"
                            type="number"
                            min="0"
                            max="100"
                            value={formData.discount}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-[#dce3df] bg-white px-4 py-3 text-sm text-[#34443d] outline-none transition focus:border-[#7a9e8f] focus:ring-2 focus:ring-[#dce7e2] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="stock"
                            className="mb-2 block text-sm font-medium text-[#46574e] dark:text-gray-200"
                        >
                            Stock
                        </label>

                        <input
                            id="stock"
                            name="stock"
                            type="number"
                            min="0"
                            value={formData.stock}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-[#dce3df] bg-white px-4 py-3 text-sm text-[#34443d] outline-none transition focus:border-[#7a9e8f] focus:ring-2 focus:ring-[#dce7e2] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                </div>

                {/* Category / Brand / Age Group */}
                <div className="grid gap-5 md:grid-cols-3">
                    {/* Category */}
                    <div>
                        <label
                            htmlFor="category"
                            className="mb-2 block text-sm font-medium text-[#46574e] dark:text-gray-200"
                        >
                            Category
                        </label>

                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            disabled={categoriesLoading}
                            className="w-full rounded-lg border border-[#dce3df] bg-white px-4 py-3 text-sm text-[#34443d] outline-none transition focus:border-[#7a9e8f] focus:ring-2 focus:ring-[#dce7e2] disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">Select category</option>

                            {categories.map((category) => (
                                <option
                                    key={category._id}
                                    value={category._id}
                                >
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Brand */}
                    <div>
                        <label
                            htmlFor="brand"
                            className="mb-2 block text-sm font-medium text-[#46574e] dark:text-gray-200"
                        >
                            Brand
                        </label>

                        <input
                            id="brand"
                            name="brand"
                            type="text"
                            value={formData.brand}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-[#dce3df] bg-white px-4 py-3 text-sm text-[#34443d] outline-none transition focus:border-[#7a9e8f] focus:ring-2 focus:ring-[#dce7e2] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    {/* Age Group */}
                    
{/* Age Group dropdown */}
<div>
    <label
        htmlFor="ageGroup"
        className="mb-2 block text-sm font-medium text-[#46574e] dark:text-gray-200"
    >
        Age Group
    </label>

    <select
        id="ageGroup"
        name="ageGroup"
        value={formData.ageGroup}
        onChange={handleChange}
        required
        className="w-full rounded-lg border border-[#dce3df] bg-white px-4 py-3 text-sm text-[#34443d] outline-none transition focus:border-[#7a9e8f] focus:ring-2 focus:ring-[#dce7e2] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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

                </div>

                {/* Tags */}
                <div>
                    <label
                        htmlFor="tags"
                        className="mb-2 block text-sm font-medium text-[#46574e] dark:text-gray-200"
                    >
                        Tags
                    </label>

                    <input
                        id="tags"
                        name="tags"
                        type="text"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="baby, clothing, cotton"
                        className="w-full rounded-lg border border-[#dce3df] bg-white px-4 py-3 text-sm text-[#34443d] outline-none transition placeholder:text-[#9aa7a0] focus:border-[#7a9e8f] focus:ring-2 focus:ring-[#dce7e2] dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />

                    <p className="mt-2 text-xs text-[#89958e] dark:text-gray-400">
                        Separate tags using commas.
                    </p>
                </div>

                {/* Existing images */}
                <div>
                    <label className="mb-3 block text-sm font-medium text-[#46574e] dark:text-gray-200">
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
                                        onClick={() => removeExistingImage(index)}
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

                {/* Add new images */}
                <div>
                    <label
                        htmlFor="images"
                        className="mb-2 block text-sm font-medium text-[#46574e] dark:text-gray-200"
                    >
                        Add New Images
                    </label>

                    <div className="rounded-xl border-2 border-dashed border-[#cbdcd3] bg-[#f7faf8] p-4 transition hover:border-[#7a9e8f] dark:border-gray-600 dark:bg-gray-700">
                        <input
                            id="images"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            className="block w-full cursor-pointer text-sm text-[#65736b] file:mr-4 file:rounded-lg file:border-0 file:bg-[#436558] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#355447] dark:text-gray-300"
                        />
                    </div>

                    <p className="mt-2 text-xs text-[#89958e] dark:text-gray-400">
                        Maximum 5 images in total.
                    </p>
                </div>

                {/* New image previews */}
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

                {/* Category error */}
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
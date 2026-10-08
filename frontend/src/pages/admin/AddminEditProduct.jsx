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

            // Check whether Redux update succeeded.
            if (updateProductThunk.fulfilled.match(result)) {
                alert("Product updated successfully!");

                // Return to product management page.
                navigate("/admin/products");
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
        <div className="p-6">

            {/* Page heading */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Edit Product
                </h1>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Update the product information and images.
                </p>
            </div>


            {/* Product form */}
            <form
                onSubmit={handleSubmit}
                className="
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    p-6
                    shadow-sm
                    dark:border-gray-700
                    dark:bg-gray-800
                "
            >

                {/* Product title */}
                <div className="mb-5">
                    <label
                        htmlFor="title"
                        className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
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
                        className="
                            w-full
                            rounded-lg
                            border
                            border-gray-300
                            px-4
                            py-2.5
                            outline-none
                            focus:border-blue-500
                            dark:border-gray-600
                            dark:bg-gray-700
                            dark:text-white
                        "
                    />
                </div>


                {/* Description */}
                <div className="mb-5">
                    <label
                        htmlFor="description"
                        className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
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
                        className="
                            w-full
                            rounded-lg
                            border
                            border-gray-300
                            px-4
                            py-2.5
                            outline-none
                            focus:border-blue-500
                            dark:border-gray-600
                            dark:bg-gray-700
                            dark:text-white
                        "
                    />
                </div>


                {/* Price / Discount / Stock */}
                <div className="mb-5 grid gap-5 md:grid-cols-3">

                    <div>
                        <label
                            htmlFor="price"
                            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
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
                            className="
                                w-full
                                rounded-lg
                                border
                                border-gray-300
                                px-4
                                py-2.5
                                outline-none
                                focus:border-blue-500
                                dark:border-gray-600
                                dark:bg-gray-700
                                dark:text-white
                            "
                        />
                    </div>


                    <div>
                        <label
                            htmlFor="discount"
                            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
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
                            className="
                                w-full
                                rounded-lg
                                border
                                border-gray-300
                                px-4
                                py-2.5
                                outline-none
                                focus:border-blue-500
                                dark:border-gray-600
                                dark:bg-gray-700
                                dark:text-white
                            "
                        />
                    </div>


                    <div>
                        <label
                            htmlFor="stock"
                            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
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
                            className="
                                w-full
                                rounded-lg
                                border
                                border-gray-300
                                px-4
                                py-2.5
                                outline-none
                                focus:border-blue-500
                                dark:border-gray-600
                                dark:bg-gray-700
                                dark:text-white
                            "
                        />
                    </div>

                </div>


                {/* Category / Brand / Age Group */}
                <div className="mb-5 grid gap-5 md:grid-cols-3">

                    {/* Category */}
                    <div>
                        <label
                            htmlFor="category"
                            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
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
                            className="
                                w-full
                                rounded-lg
                                border
                                border-gray-300
                                bg-white
                                px-4
                                py-2.5
                                outline-none
                                focus:border-blue-500
                                dark:border-gray-600
                                dark:bg-gray-700
                                dark:text-white
                            "
                        >
                            <option value="">
                                Select category
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
                    </div>


                    {/* Brand */}
                    <div>
                        <label
                            htmlFor="brand"
                            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
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
                            className="
                                w-full
                                rounded-lg
                                border
                                border-gray-300
                                px-4
                                py-2.5
                                outline-none
                                focus:border-blue-500
                                dark:border-gray-600
                                dark:bg-gray-700
                                dark:text-white
                            "
                        />
                    </div>


                    {/* Age Group */}
                    <div>
                        <label
                            htmlFor="ageGroup"
                            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
                        >
                            Age Group
                        </label>

                        <input
                            id="ageGroup"
                            name="ageGroup"
                            type="text"
                            value={formData.ageGroup}
                            onChange={handleChange}
                            required
                            className="
                                w-full
                                rounded-lg
                                border
                                border-gray-300
                                px-4
                                py-2.5
                                outline-none
                                focus:border-blue-500
                                dark:border-gray-600
                                dark:bg-gray-700
                                dark:text-white
                            "
                        />
                    </div>

                </div>


                {/* Tags */}
                <div className="mb-5">
                    <label
                        htmlFor="tags"
                        className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
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
                        className="
                            w-full
                            rounded-lg
                            border
                            border-gray-300
                            px-4
                            py-2.5
                            outline-none
                            focus:border-blue-500
                            dark:border-gray-600
                            dark:bg-gray-700
                            dark:text-white
                        "
                    />

                    <p className="mt-1 text-xs text-gray-500">
                        Separate tags using commas.
                    </p>
                </div>


                {/* Existing images */}
                <div className="mb-6">
                    <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Existing Images
                    </label>

                    {existingImages.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">

                            {existingImages.map((image, index) => (
                                <div
                                    key={`${image}-${index}`}
                                    className="relative"
                                >
                                    <img
                                        src={image}
                                        alt={`Product ${index + 1}`}
                                        className="
                                            h-32
                                            w-full
                                            rounded-lg
                                            border
                                            border-gray-200
                                            object-cover
                                            dark:border-gray-600
                                        "
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeExistingImage(index)
                                        }
                                        className="
                                            absolute
                                            right-1
                                            top-1
                                            rounded-full
                                            bg-red-600
                                            px-2
                                            py-1
                                            text-xs
                                            font-bold
                                            text-white
                                            hover:bg-red-700
                                        "
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}

                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">
                            No existing images.
                        </p>
                    )}
                </div>


                {/* Add new images */}
                <div className="mb-6">
                    <label
                        htmlFor="images"
                        className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                        Add New Images
                    </label>

                    <input
                        id="images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="
                            block
                            w-full
                            text-sm
                            text-gray-500
                        "
                    />

                    <p className="mt-1 text-xs text-gray-500">
                        Maximum 5 images in total.
                    </p>
                </div>


                {/* New image previews */}
                {newImages.length > 0 && (
                    <div className="mb-6">
                        <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-200">
                            New Images
                        </p>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">

                            {newImages.map((image, index) => (
                                <div
                                    key={`${image.name}-${index}`}
                                    className="relative"
                                >
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt={`New image ${index + 1}`}
                                        className="
                                            h-32
                                            w-full
                                            rounded-lg
                                            border
                                            border-gray-200
                                            object-cover
                                            dark:border-gray-600
                                        "
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeNewImage(index)
                                        }
                                        className="
                                            absolute
                                            right-1
                                            top-1
                                            rounded-full
                                            bg-red-600
                                            px-2
                                            py-1
                                            text-xs
                                            font-bold
                                            text-white
                                            hover:bg-red-700
                                        "
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
                    <p className="mb-4 text-sm text-red-600">
                        {categoriesError}
                    </p>
                )}


                {/* Submit buttons */}
                <div className="flex gap-3">

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/admin/products")
                        }
                        className="
                            rounded-lg
                            border
                            border-gray-300
                            px-5
                            py-2.5
                            text-sm
                            font-medium
                            text-gray-700
                            hover:bg-gray-50
                            dark:border-gray-600
                            dark:text-gray-200
                            dark:hover:bg-gray-700
                        "
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        disabled={submitting || productLoading}
                        className="
                            rounded-lg
                            bg-blue-600
                            px-5
                            py-2.5
                            text-sm
                            font-medium
                            text-white
                            hover:bg-blue-700
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        {submitting
                            ? "Updating..."
                            : "Update Product"}
                    </button>

                </div>

            </form>
        </div>
    );
}

export default AdminEditProduct;
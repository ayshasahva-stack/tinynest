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

    // ==========================================
    // REDUX STATE
    // ==========================================

    const loading = useSelector(
        selectProductsLoading
    );

    const error = useSelector(
        selectProductsError
    );

    const categories = useSelector(
        selectCategories
    );

    const categoriesLoading = useSelector(
        selectCategoriesLoading
    );

    const categoriesError = useSelector(
        selectCategoriesError
    );


    // ==========================================
    // FORM STATE
    // ==========================================

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


    // ==========================================
    // FETCH CATEGORIES
    // ==========================================

    useEffect(() => {
        // Load categories for the category dropdown.
        dispatch(fetchCategories());
    }, [dispatch]);


    // ==========================================
    // HANDLE TEXT INPUT
    // ==========================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,

            [name]: value,
        }));
    };


    // ==========================================
    // HANDLE IMAGE SELECTION
    // ==========================================

    const handleImageChange = (event) => {
        const selectedFiles = Array.from(
            event.target.files
        );

        // Only allow a maximum of 5 images.
        if (selectedFiles.length > 5) {
            alert(
                "You can upload a maximum of 5 images."
            );

            // Reset the input.
            event.target.value = "";

            return;
        }

        // Store the selected files.
        setImages(selectedFiles);
    };


    // ==========================================
    // REMOVE SELECTED IMAGE
    // ==========================================

    const handleRemoveImage = (indexToRemove) => {
        setImages((previousImages) =>
            previousImages.filter(
                (_, index) => index !== indexToRemove
            )
        );
    };


    // ==========================================
    // FORM SUBMIT
    // ==========================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Make sure at least one image is selected.
        if (images.length === 0) {
            alert(
                "Please select at least one product image."
            );

            return;
        }

        // Create FormData because we are sending
        // both text fields and image files.
        const data = new FormData();

        // Add normal product fields.
        data.append("title", formData.title);
        data.append(
            "description",
            formData.description
        );
        data.append("price", formData.price);
        data.append(
            "discount",
            formData.discount
        );
        data.append(
            "category",
            formData.category
        );
        data.append("brand", formData.brand);
        data.append(
            "ageGroup",
            formData.ageGroup
        );
        data.append("stock", formData.stock);

        // Backend converts this comma-separated
        // string into an array.
        data.append("tags", formData.tags);

        // Add every selected image using the
        // SAME field name: "images".
        images.forEach((image) => {
            data.append("images", image);
        });


        // Send the product to Redux.
        const result = await dispatch(
            createProductThunk(data)
        );


        // If creation was successful...
        if (
            createProductThunk.fulfilled.match(result)
        ) {
            // Return to the product list.
            navigate("/admin/products");
        }
    };


    return (
        <div className="min-h-screen p-6 md:p-8">

            {/* ==========================================
                PAGE HEADER
            =========================================== */}

            <div className="mb-8">

                <button
                    type="button"
                    onClick={() =>
                        navigate("/admin/products")
                    }
                    className="
                        mb-4
                        text-sm
                        font-medium
                        text-blue-600
                        hover:text-blue-700
                    "
                >
                    ← Back to Products
                </button>

                <h1 className="
                    text-3xl
                    font-bold
                    text-gray-900
                    dark:text-white
                ">
                    Add Product
                </h1>

                <p className="
                    mt-1
                    text-gray-500
                    dark:text-gray-400
                ">
                    Add a new product to TinyNest.
                </p>

            </div>


            {/* ==========================================
                ERROR
            =========================================== */}

            {error && (
                <div className="
                    mb-6
                    rounded-lg
                    border
                    border-red-200
                    bg-red-50
                    p-4
                    text-red-700
                ">
                    {error}
                </div>
            )}


            {/* ==========================================
                FORM
            =========================================== */}

            <form
                onSubmit={handleSubmit}
                className="
                    space-y-6
                "
            >

                {/* ======================================
                    BASIC INFORMATION
                ======================================= */}

                <div className="
                    rounded-xl
                    bg-white
                    p-6
                    shadow-sm
                    dark:bg-gray-800
                ">

                    <h2 className="
                        mb-6
                        text-xl
                        font-semibold
                        text-gray-900
                        dark:text-white
                    ">
                        Basic Information
                    </h2>


                    {/* Product title */}
                    <div className="mb-5">

                        <label
                            htmlFor="title"
                            className="
                                mb-2
                                block
                                text-sm
                                font-semibold
                                text-gray-700
                                dark:text-gray-200
                            "
                        >
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
                            className="
                                w-full
                                rounded-lg
                                border
                                border-gray-300
                                px-4
                                py-2.5
                                outline-none
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-200
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
                            className="
                                mb-2
                                block
                                text-sm
                                font-semibold
                                text-gray-700
                                dark:text-gray-200
                            "
                        >
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
                            className="
                                w-full
                                resize-none
                                rounded-lg
                                border
                                border-gray-300
                                px-4
                                py-2.5
                                outline-none
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-200
                                dark:border-gray-600
                                dark:bg-gray-700
                                dark:text-white
                            "
                        />

                    </div>


                    {/* Price / Discount */}
                    <div className="
                        grid
                        gap-5
                        md:grid-cols-2
                    ">

                        <div>

                            <label
                                htmlFor="price"
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-semibold
                                    text-gray-700
                                    dark:text-gray-200
                                "
                            >
                                Price
                            </label>

                            <input
                                id="price"
                                name="price"
                                type="number"
                                min="1"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="699"
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
                                    focus:ring-2
                                    focus:ring-blue-200
                                    dark:border-gray-600
                                    dark:bg-gray-700
                                    dark:text-white
                                "
                            />

                        </div>


                        <div>

                            <label
                                htmlFor="discount"
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-semibold
                                    text-gray-700
                                    dark:text-gray-200
                                "
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
                                    focus:ring-2
                                    focus:ring-blue-200
                                    dark:border-gray-600
                                    dark:bg-gray-700
                                    dark:text-white
                                "
                            />

                        </div>

                    </div>

                </div>


                {/* ======================================
                    PRODUCT DETAILS
                ======================================= */}

                <div className="
                    rounded-xl
                    bg-white
                    p-6
                    shadow-sm
                    dark:bg-gray-800
                ">

                    <h2 className="
                        mb-6
                        text-xl
                        font-semibold
                        text-gray-900
                        dark:text-white
                    ">
                        Product Details
                    </h2>


                    <div className="
                        grid
                        gap-5
                        md:grid-cols-2
                    ">

                        {/* Category */}
                        <div>

                            <label
                                htmlFor="category"
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-semibold
                                    text-gray-700
                                    dark:text-gray-200
                                "
                            >
                                Category
                            </label>

                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                disabled={
                                    categoriesLoading
                                }
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
                                    focus:ring-2
                                    focus:ring-blue-200
                                    dark:border-gray-600
                                    dark:bg-gray-700
                                    dark:text-white
                                "
                            >

                                <option value="">
                                    {categoriesLoading
                                        ? "Loading categories..."
                                        : "Select category"}
                                </option>

                                {categories.map(
                                    (category) => (
                                        <option
                                            key={
                                                category._id
                                            }
                                            value={
                                                category._id
                                            }
                                        >
                                            {category.name}
                                        </option>
                                    )
                                )}

                            </select>

                            {categoriesError && (
                                <p className="
                                    mt-2
                                    text-sm
                                    text-red-600
                                ">
                                    {categoriesError}
                                </p>
                            )}

                        </div>


                        {/* Brand */}
                        <div>

                            <label
                                htmlFor="brand"
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-semibold
                                    text-gray-700
                                    dark:text-gray-200
                                "
                            >
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
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-gray-300
                                    px-4
                                    py-2.5
                                    outline-none
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-200
                                    dark:border-gray-600
                                    dark:bg-gray-700
                                    dark:text-white
                                "
                            />

                        </div>


                        {/* Age group */}
                        <div>

                            <label
                                htmlFor="ageGroup"
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-semibold
                                    text-gray-700
                                    dark:text-gray-200
                                "
                            >
                                Age Group
                            </label>

                            <select
                                id="ageGroup"
                                name="ageGroup"
                                value={formData.ageGroup}
                                onChange={handleChange}
                                required
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
                                    focus:ring-2
                                    focus:ring-blue-200
                                    dark:border-gray-600
                                    dark:bg-gray-700
                                    dark:text-white
                                "
                            >

                                <option value="">
                                    Select age group
                                </option>

                                <option value="0-6 months">
                                    0-6 months
                                </option>

                                <option value="6-12 months">
                                    6-12 months
                                </option>

                                <option value="1-2 years">
                                    1-2 years
                                </option>

                                <option value="2-4 years">
                                    2-4 years
                                </option>

                                <option value="4+ years">
                                    4+ years
                                </option>

                            </select>

                        </div>


                        {/* Stock */}
                        <div>

                            <label
                                htmlFor="stock"
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-semibold
                                    text-gray-700
                                    dark:text-gray-200
                                "
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
                                placeholder="10"
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
                                    focus:ring-2
                                    focus:ring-blue-200
                                    dark:border-gray-600
                                    dark:bg-gray-700
                                    dark:text-white
                                "
                            />

                        </div>

                    </div>


                    {/* Tags */}
                    <div className="mt-5">

                        <label
                            htmlFor="tags"
                            className="
                                mb-2
                                block
                                text-sm
                                font-semibold
                                text-gray-700
                                dark:text-gray-200
                            "
                        >
                            Tags
                        </label>

                        <input
                            id="tags"
                            name="tags"
                            type="text"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder="romper, baby clothing, cotton"
                            className="
                                w-full
                                rounded-lg
                                border
                                border-gray-300
                                px-4
                                py-2.5
                                outline-none
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-200
                                dark:border-gray-600
                                dark:bg-gray-700
                                dark:text-white
                            "
                        />

                        <p className="
                            mt-2
                            text-xs
                            text-gray-500
                        ">
                            Separate tags with commas.
                        </p>

                    </div>

                </div>


                {/* ======================================
                    PRODUCT IMAGES
                ======================================= */}

                <div className="
                    rounded-xl
                    bg-white
                    p-6
                    shadow-sm
                    dark:bg-gray-800
                ">

                    <h2 className="
                        mb-2
                        text-xl
                        font-semibold
                        text-gray-900
                        dark:text-white
                    ">
                        Product Images
                    </h2>

                    <p className="
                        mb-5
                        text-sm
                        text-gray-500
                    ">
                        Upload up to 5 product images.
                    </p>


                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        onChange={handleImageChange}
                        className="
                            block
                            w-full
                            cursor-pointer
                            rounded-lg
                            border
                            border-gray-300
                            bg-gray-50
                            text-sm
                            text-gray-700
                            file:mr-4
                            file:border-0
                            file:bg-blue-600
                            file:px-4
                            file:py-2.5
                            file:font-medium
                            file:text-white
                            hover:file:bg-blue-700
                            dark:border-gray-600
                            dark:bg-gray-700
                            dark:text-gray-200
                        "
                    />


                    {/* Image previews */}
                    {images.length > 0 && (

                        <div className="
                            mt-6
                            grid
                            grid-cols-2
                            gap-4
                            sm:grid-cols-3
                            md:grid-cols-5
                        ">

                            {images.map(
                                (image, index) => (

                                    <div
                                        key={`${image.name}-${index}`}
                                        className="
                                            relative
                                            overflow-hidden
                                            rounded-lg
                                            border
                                            border-gray-200
                                            dark:border-gray-600
                                        "
                                    >

                                        <img
                                            src={URL.createObjectURL(
                                                image
                                            )}
                                            alt={`Product ${index + 1}`}
                                            className="
                                                h-32
                                                w-full
                                                object-cover
                                            "
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveImage(
                                                    index
                                                )
                                            }
                                            className="
                                                absolute
                                                right-2
                                                top-2
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

                                )
                            )}

                        </div>

                    )}

                </div>


                {/* ======================================
                    SUBMIT
                ======================================= */}

                <div className="
                    flex
                    justify-end
                    gap-3
                ">

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
                            font-medium
                            text-gray-700
                            hover:bg-gray-100
                            dark:border-gray-600
                            dark:text-gray-200
                            dark:hover:bg-gray-700
                        "
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            rounded-lg
                            bg-blue-600
                            px-6
                            py-2.5
                            font-medium
                            text-white
                            transition
                            hover:bg-blue-700
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >
                        {loading
                            ? "Creating Product..."
                            : "Create Product"}
                    </button>

                </div>

            </form>

        </div>
    );
}

export default AdminAddProduct;
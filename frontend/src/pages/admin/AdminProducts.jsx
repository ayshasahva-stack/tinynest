import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
    fetchProducts,
    deleteProductThunk,
} from "../../features/products/productThunk";

import {
    selectProducts,
    selectProductsLoading,
    selectProductsError,
    selectProductsPagination,
} from "../../features/products/productSelectors";

function AdminProducts() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // Get product information from Redux.
    const products = useSelector(selectProducts);

    // Get loading state from Redux.
    const loading = useSelector(selectProductsLoading);

    // Get error message from Redux.
    const error = useSelector(selectProductsError);

    // Get pagination information from Redux.
    const pagination = useSelector(
        selectProductsPagination
    );

    // Store the search text.
    const [search, setSearch] = useState("");

    // Store the current page number.
    const [page, setPage] = useState(1);

    // Fetch products whenever page or search changes.
    useEffect(() => {
        dispatch(
            fetchProducts({
                page,
                limit: 10,
                search,
            })
        );
    }, [dispatch, page, search]);

    // Delete a product.
    const handleDelete = async (productId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        // Stop if the admin cancels.
        if (!confirmed) {
            return;
        }

        // Dispatch the delete request.
        const result = await dispatch(
            deleteProductThunk(productId)
        );

        // If the last product on the current page
        // was deleted, go back to the previous page.
        if (
            deleteProductThunk.fulfilled.match(result) &&
            products.length === 1 &&
            page > 1
        ) {
            setPage((currentPage) => currentPage - 1);
        }
    };

    // Go to the next page.
    const handleNextPage = () => {
        if (page < pagination.totalPages) {
            setPage((currentPage) => currentPage + 1);
        }
    };

    // Go to the previous page.
    const handlePreviousPage = () => {
        if (page > 1) {
            setPage((currentPage) => currentPage - 1);
        }
    };

    return (
        <div className="min-h-screen p-6 md:p-8">

            {/* =========================================
                PAGE HEADER
            ========================================== */}

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Product Management
                    </h1>

                    <p className="mt-1 text-gray-500 dark:text-gray-400">
                        Manage TinyNest products.
                    </p>
                </div>

                {/* Add Product will be implemented next */}
                <button
                    type="button"
                    onClick={() =>
                        navigate("/admin/products/new")
                    }
                    className="
        rounded-lg
        bg-blue-600
        px-5    
        py-2.5
        font-medium
        text-white
        transition
        hover:bg-blue-700
    "
                >
                    + Add Product
                </button>

            </div>

            {/* =========================================
                SEARCH
            ========================================== */}

            <div className="
                mb-6
                rounded-xl
                bg-white
                p-5
                shadow-sm
                dark:bg-gray-800
            ">

                <label
                    htmlFor="productSearch"
                    className="
                        mb-2
                        block
                        text-sm
                        font-semibold
                        text-gray-700
                        dark:text-gray-200
                    "
                >
                    Search Products
                </label>

                <input
                    id="productSearch"
                    type="text"
                    placeholder="Search by product name..."
                    value={search}
                    onChange={(event) => {
                        // Update search text.
                        setSearch(event.target.value);

                        // Start from page 1 when a new search
                        // is entered.
                        setPage(1);
                    }}
                    className="
                        w-full
                        rounded-lg
                        border
                        border-gray-300
                        bg-white
                        px-4
                        py-2.5
                        text-gray-900
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

            {/* =========================================
                ERROR MESSAGE
            ========================================== */}

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

            {/* =========================================
                PRODUCT TABLE
            ========================================== */}

            <div className="
                overflow-hidden
                rounded-xl
                bg-white
                shadow-sm
                dark:bg-gray-800
            ">

                {loading ? (

                    /* Loading state */
                    <div className="flex flex-col items-center justify-center py-16">

                        <div className="
                            h-10
                            w-10
                            animate-spin
                            rounded-full
                            border-4
                            border-gray-200
                            border-t-blue-600
                        " />

                        <p className="mt-4 text-gray-500">
                            Loading products...
                        </p>

                    </div>

                ) : products.length === 0 ? (

                    /* Empty state */
                    <div className="py-16 text-center">

                        <h3 className="
                            text-lg
                            font-semibold
                            text-gray-800
                            dark:text-white
                        ">
                            No products found
                        </h3>

                        <p className="mt-1 text-gray-500">
                            Try a different search.
                        </p>

                    </div>

                ) : (

                    /* Responsive table */
                    <div className="overflow-x-auto">

                        <table className="w-full text-left">

                            {/* Table header */}
                            <thead className="
                                border-b
                                border-gray-200
                                bg-gray-50
                                dark:border-gray-700
                                dark:bg-gray-700
                            ">

                                <tr>

                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                        Product
                                    </th>

                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                        Category
                                    </th>

                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                        Brand
                                    </th>

                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                        Price
                                    </th>

                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                        Stock
                                    </th>

                                    <th className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            {/* Table body */}
                            <tbody className="
                                divide-y
                                divide-gray-100
                                dark:divide-gray-700
                            ">

                                {products.map((product) => (

                                    <tr
                                        key={product._id}
                                        className="
                                            transition
                                            hover:bg-gray-50
                                            dark:hover:bg-gray-700/50
                                        "
                                    >

                                        {/* Product */}
                                        <td className="px-6 py-4">

                                            <div className="flex items-center gap-4">

                                                {/* Product thumbnails */}
                                                {product.images?.length > 0 ? (
                                                    <div className="flex items-center gap-1.5">

                                                        {/* Show maximum 3 thumbnails */}
                                                        {product.images.slice(0, 3).map((image, index) => (
                                                            <img
                                                                key={`${image}-${index}`}
                                                                src={image}
                                                                alt={`${product.title} ${index + 1}`}
                                                                className="
                    h-14
                    w-14
                    rounded-lg
                    border
                    border-gray-200
                    object-cover
                    dark:border-gray-700
                "
                                                            />
                                                        ))}

                                                        {/* Show remaining image count */}
                                                        {product.images.length > 3 && (
                                                            <div
                                                                className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-lg
                    bg-gray-100
                    text-xs
                    font-semibold
                    text-gray-600
                    dark:bg-gray-700
                    dark:text-gray-200
                "
                                                            >
                                                                +{product.images.length - 3}
                                                            </div>
                                                        )}

                                                    </div>
                                                ) : (
                                                    <div className="
        flex
        h-14
        w-14
        items-center
        justify-center
        rounded-lg
        bg-gray-100
        text-xs
        text-gray-400
    ">
                                                        No image
                                                    </div>
                                                )}
                                                <div className="min-w-0">

                                                    <p className="
                                                        font-semibold
                                                        text-gray-900
                                                        dark:text-white
                                                    ">
                                                        {product.title}
                                                    </p>

                                                    <p className="
                                                        mt-1
                                                        text-xs
                                                        text-gray-400
                                                    ">
                                                        ID: {product._id}
                                                    </p>

                                                </div>

                                            </div>

                                        </td>

                                        {/* Category */}
                                        <td className="
                                            px-6
                                            py-4
                                            text-sm
                                            text-gray-600
                                            dark:text-gray-300
                                        ">
                                            {product.category?.name || "N/A"}
                                        </td>

                                        {/* Brand */}
                                        <td className="
                                            px-6
                                            py-4
                                            text-sm
                                            text-gray-600
                                            dark:text-gray-300
                                        ">
                                            {product.brand || "N/A"}
                                        </td>

                                        {/* Price */}
                                        <td className="
                                            px-6
                                            py-4
                                            text-sm
                                            font-semibold
                                            text-gray-900
                                            dark:text-white
                                        ">
                                            ₹{product.price}
                                        </td>

                                        {/* Stock */}
                                        <td className="px-6 py-4">

                                            <span
                                                className={`
                                                    inline-flex
                                                    rounded-full
                                                    px-3
                                                    py-1
                                                    text-xs
                                                    font-semibold
                                                    ${product.stock <= 5
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-green-100 text-green-700"
                                                    }
                                                `}
                                            >
                                                {product.stock}
                                            </span>

                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4">

                                            <div className="flex gap-2">

                                                {/* Edit will be implemented next */}
                                                {/* Edit product */}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(`/admin/products/edit/${product._id}`)
                                                    }
                                                    className="
        rounded-lg
        border
        border-blue-200
        px-3
        py-1.5
        text-sm
        font-medium
        text-blue-600
        transition
        hover:bg-blue-50
    "
                                                >
                                                    Edit
                                                </button>
                                                {/* Delete */}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            product._id
                                                        )
                                                    }
                                                    className="
                                                        rounded-lg
                                                        border
                                                        border-red-200
                                                        px-3
                                                        py-1.5
                                                        text-sm
                                                        font-medium
                                                        text-red-600
                                                        transition
                                                        hover:bg-red-50
                                                    "
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

                {/* =========================================
                    PAGINATION
                ========================================== */}

                <div className="
                    flex
                    flex-col
                    gap-3
                    border-t
                    border-gray-200
                    px-6
                    py-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    dark:border-gray-700
                ">

                    <p className="
                        text-sm
                        text-gray-500
                        dark:text-gray-400
                    ">
                        Page {pagination.currentPage} of{" "}
                        {pagination.totalPages || 1}
                    </p>

                    <div className="flex gap-2">

                        <button
                            type="button"
                            onClick={handlePreviousPage}
                            disabled={page <= 1 || loading}
                            className="
                                rounded-lg
                                border
                                border-gray-300
                                px-4
                                py-2
                                text-sm
                                font-medium
                                text-gray-700
                                transition
                                hover:bg-gray-100
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                                dark:border-gray-600
                                dark:text-gray-200
                                dark:hover:bg-gray-700
                            "
                        >
                            Previous
                        </button>

                        <button
                            type="button"
                            onClick={handleNextPage}
                            disabled={
                                page >= pagination.totalPages ||
                                loading
                            }
                            className="
                                rounded-lg
                                bg-blue-600
                                px-4
                                py-2
                                text-sm
                                font-medium
                                text-white
                                transition
                                hover:bg-blue-700
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            Next
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AdminProducts;
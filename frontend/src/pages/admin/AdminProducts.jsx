import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
    fetchProducts,
    deleteProductThunk,
} from "../../features/products/productThunk";

// Fetch categories from the backend.
import { fetchCategories } from "../../features/categories/categoryThunk";

// Read categories from Redux.
import { selectCategories } from "../../features/categories/categorySelectors";
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
    // Store the selected category ID.
// An empty string means all categories.
const [category, setCategory] = useState("");

// Get available categories from Redux.
const categories = useSelector(selectCategories);
// Load active categories for the filter dropdown.
useEffect(() => {
    dispatch(fetchCategories());
}, [dispatch]);

    // Fetch products whenever page or search changes.
   
// Fetch products whenever the page, search, or category changes.
useEffect(() => {
    dispatch(
        fetchProducts({
            page,
            limit: 10,
            search,
            category, // Send the selected category ID to the backend.
            includeOutOfStock: true,
        })
    );
}, [dispatch, page, search, category]);


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
    <div className="min-h-screen bg-[#f7f9ff] p-6 md:p-8 dark:bg-slate-950">

        {/* =========================================
            PAGE HEADER
        ========================================== */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="font-serif text-3xl font-semibold text-[#263d32] dark:text-white">
                    Product Management
                </h1>

                <p className="mt-1 text-[#77847d] dark:text-gray-400">
                    Manage TinyNest products.
                </p>
            </div>

            {/* Navigate to the Add Product page */}
            <button
                type="button"
                onClick={() => navigate("/admin/products/new")}
                className="
                    rounded-lg
                    bg-[#436558]
                    px-5 py-2.5
                    font-medium
                    text-white
                    transition
                    hover:bg-[#354f44]
                    focus:outline-none
                    focus:ring-2
                    focus:ring-[#a8c2b5]
                "
            >
                + Add Product
            </button>
        </div>

        {/* =========================================
            SEARCH
        ========================================== */}
       
{/* Search and category filter */}
<div className="
    mb-6 grid grid-cols-1 gap-4
    rounded-2xl bg-white p-5
    shadow-sm ring-1 ring-[#e0e7e3]
    sm:grid-cols-2
    dark:bg-gray-800 dark:ring-gray-700
">
    {/* Search by product name */}
    <div>
        <label
            htmlFor="productSearch"
            className="
                mb-2 block text-sm font-semibold
                text-[#46574e] dark:text-gray-200
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
                // Update the search term and return to page 1.
                setSearch(event.target.value);
                setPage(1);
            }}
            className="
                w-full rounded-lg border border-[#d6e0da]
                bg-white px-4 py-2.5 text-[#263d32]
                outline-none transition
                placeholder:text-[#9aa69f]
                focus:border-[#7a9e8f]
                focus:ring-2 focus:ring-[#dce7e2]
                dark:border-gray-600 dark:bg-gray-700
                dark:text-white
            "
        />
    </div>

    {/* Filter by category */}
    <div>
        <label
            htmlFor="categoryFilter"
            className="
                mb-2 block text-sm font-semibold
                text-[#46574e] dark:text-gray-200
            "
        >
            Filter by Category
        </label>

        <select
            id="categoryFilter"
            value={category}
            onChange={(event) => {
                // Update the category ID and reset pagination.
                setCategory(event.target.value);
                setPage(1);
            }}
            className="
                w-full rounded-lg border border-[#d6e0da]
                bg-white px-4 py-2.5 text-[#263d32]
                outline-none transition
                focus:border-[#7a9e8f]
                focus:ring-2 focus:ring-[#dce7e2]
                dark:border-gray-600 dark:bg-gray-700
                dark:text-white
            "
        >
            <option value="">All Categories</option>

            {/* Populate options using categories from MongoDB */}
            {categories.map((item) => (
                <option key={item._id} value={item._id}>
                    {item.name}
                </option>
            ))}
        </select>
    </div>
</div>


        {/* =========================================
            ERROR MESSAGE
        ========================================== */}
        {error && (
            <div className="
                mb-6
                rounded-xl
                border border-red-200
                bg-red-50
                p-4
                text-red-700
                dark:border-red-900
                dark:bg-red-950/30
                dark:text-red-300
            ">
                {error}
            </div>
        )}

        {/* =========================================
            PRODUCT TABLE
        ========================================== */}
        <div className="
            overflow-hidden
            rounded-2xl
            bg-white
            shadow-sm
            ring-1 ring-[#e0e7e3]
            dark:bg-gray-800
            dark:ring-gray-700
        ">

            {loading ? (

                /* Loading state */
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="
                        h-10 w-10
                        animate-spin
                        rounded-full
                        border-4 border-[#dce7e2]
                        border-t-[#436558]
                    " />

                    <p className="mt-4 text-sm text-[#77847d] dark:text-gray-400">
                        Loading products...
                    </p>
                </div>

            ) : products.length === 0 ? (

                /* Empty state */
                <div className="py-16 text-center">
                    <h3 className="
                        text-lg
                        font-semibold
                        text-[#263d32]
                        dark:text-white
                    ">
                        No products found
                    </h3>

                    <p className="mt-1 text-sm text-[#77847d] dark:text-gray-400">
                        Try a different search.
                    </p>
                </div>

            ) : (

                /* Responsive product table */
                <div className="overflow-x-auto">
                    <table className="w-full text-left">

                        {/* Table header */}
                        <thead className="
                            border-b border-[#e0e7e3]
                            bg-[#f1f4f9]
                            dark:border-gray-700
                            dark:bg-gray-700
                        ">
                            <tr>
                                <th className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-[#46574e] dark:text-gray-200">
                                    Product
                                </th>

                                <th className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-[#46574e] dark:text-gray-200">
                                    Category
                                </th>

                                <th className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-[#46574e] dark:text-gray-200">
                                    Brand
                                </th>

                                <th className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-[#46574e] dark:text-gray-200">
                                    Price
                                </th>

                                <th className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-[#46574e] dark:text-gray-200">
                                    Stock
                                </th>

                                <th className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-[#46574e] dark:text-gray-200">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        {/* Table body */}
                        <tbody className="
                            divide-y divide-[#edf1ee]
                            dark:divide-gray-700
                        ">
                            {products.map((product) => (
                                <tr
                                    key={product._id}
                                    className="
                                        transition-colors
                                        hover:bg-[#f7f9f8]
                                        dark:hover:bg-gray-700/50
                                    "
                                >
                                    {/* Product images and details */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">

                                            {/* Show up to three product thumbnails */}
                                            {product.images?.length > 0 ? (
                                                <div className="flex shrink-0 items-center gap-1.5">
                                                    {product.images
                                                        .slice(0, 3)
                                                        .map((image, index) => (
                                                            <img
                                                                key={`${image}-${index}`}
                                                                src={image}
                                                                alt={`${product.title} ${index + 1}`}
                                                                className="
                                                                    h-14 w-14
                                                                    rounded-lg
                                                                    border border-[#e0e7e3]
                                                                    object-cover
                                                                    dark:border-gray-700
                                                                "
                                                            />
                                                        ))}

                                                    {/* Display the number of remaining images */}
                                                    {product.images.length > 3 && (
                                                        <div className="
                                                            flex h-14 w-14
                                                            items-center justify-center
                                                            rounded-lg
                                                            bg-[#edf4f0]
                                                            text-xs font-semibold
                                                            text-[#436558]
                                                            dark:bg-gray-700
                                                            dark:text-gray-200
                                                        ">
                                                            +{product.images.length - 3}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                /* Fallback when no product image exists */
                                                <div className="
                                                    flex h-14 w-14 shrink-0
                                                    items-center justify-center
                                                    rounded-lg
                                                    bg-[#edf4f0]
                                                    text-xs
                                                    text-[#9aa69f]
                                                    dark:bg-gray-700
                                                ">
                                                    No image
                                                </div>
                                            )}

                                            <div className="min-w-0">
                                                <p className="
                                                    font-semibold
                                                    text-[#263d32]
                                                    dark:text-white
                                                ">
                                                    {product.title}
                                                </p>

                                                <p className="mt-1 text-xs text-[#9aa69f]">
                                                    ID: {product._id}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Category */}
                                    <td className="
                                        px-6 py-4
                                        text-sm text-[#65756c]
                                        dark:text-gray-300
                                    ">
                                        {product.category?.name || "N/A"}
                                    </td>

                                    {/* Brand */}
                                    <td className="
                                        px-6 py-4
                                        text-sm text-[#65756c]
                                        dark:text-gray-300
                                    ">
                                        {product.brand || "N/A"}
                                    </td>

                                    {/* Price */}
                                    <td className="
                                        whitespace-nowrap
                                        px-6 py-4
                                        text-sm font-semibold
                                        text-[#263d32]
                                        dark:text-white
                                    ">
                                        ₹{product.price}
                                    </td>

                                    {/* Stock status */}
                                    <td className="px-6 py-4">
                                        <span
                                            className={`
                                                inline-flex
                                                rounded-full
                                                px-3 py-1
                                                text-xs font-semibold
                                                ${
                                                    product.stock <= 5
                                                        ? "bg-[#fbf0eb] text-[#a85f4a] dark:bg-red-950/40 dark:text-red-300"
                                                        : "bg-[#edf4f0] text-[#436558] dark:bg-emerald-950/40 dark:text-emerald-300"
                                                }
                                            `}
                                        >
                                            {product.stock}
                                        </span>
                                    </td>

                                    {/* Edit and Delete actions */}
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">

                                            {/* Navigate to Edit Product */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(`/admin/products/edit/${product._id}`)
                                                }
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

                                            {/* Delete the selected product */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(product._id)
                                                }
                                                className="
                                                    rounded-lg
                                                    border border-red-200
                                                    px-3 py-1.5
                                                    text-sm font-medium
                                                    text-red-600
                                                    transition
                                                    hover:bg-red-50
                                                    dark:border-red-900
                                                    dark:text-red-400
                                                    dark:hover:bg-red-950/40
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
                flex flex-col gap-3
                border-t border-[#e0e7e3]
                px-6 py-4
                sm:flex-row
                sm:items-center
                sm:justify-between
                dark:border-gray-700
            ">
                <p className="text-sm text-[#77847d] dark:text-gray-400">
                    Page {pagination.currentPage} of{" "}
                    {pagination.totalPages || 1}
                </p>

                <div className="flex gap-2">
                    {/* Previous page */}
                    <button
                        type="button"
                        onClick={handlePreviousPage}
                        disabled={page <= 1 || loading}
                        className="
                            rounded-lg
                            border border-[#d6e0da]
                            bg-white
                            px-4 py-2
                            text-sm font-medium
                            text-[#46574e]
                            transition
                            hover:bg-[#edf4f0]
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                            dark:border-gray-600
                            dark:bg-gray-800
                            dark:text-gray-200
                            dark:hover:bg-gray-700
                        "
                    >
                        Previous
                    </button>

                    {/* Next page */}
                    <button
                        type="button"
                        onClick={handleNextPage}
                        disabled={
                            page >= pagination.totalPages ||
                            loading
                        }
                        className="
                            rounded-lg
                            bg-[#436558]
                            px-4 py-2
                            text-sm font-medium
                            text-white
                            transition
                            hover:bg-[#354f44]
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
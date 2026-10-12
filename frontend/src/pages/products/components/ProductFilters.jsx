
import { useSelector } from "react-redux";

import Input from "../../../components/Input";
import { selectCategories } from "../../../features/categories/categorySelectors";

// Product filters displayed in the left sidebar
function ProductFilters({
    search,
    setSearch,
    category,
    setCategory,
}) {
    // Get the categories already loaded into Redux
    const categories = useSelector(selectCategories);

    return (
        <aside className="h-fit rounded-2xl border border-[#E8E5DA] bg-[#FAFAF5] p-5 dark:border-gray-800 dark:bg-gray-900">

            {/* Sidebar heading */}
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Filters
            </h2>

            {/* Search products */}
            <div className="mt-5">
                <Input
                    label="Search products"
                    name="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search products..."
                />
            </div>

            {/* Active filters */}
            <div className="mt-6 border-b border-[#E2E0D6] pb-5 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    Active Filters
                </h3>

                <div className="mt-3 flex flex-wrap gap-2">
                    {search.trim() || category ? (
                        <>
                            {search.trim() && (
                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
                                    className="rounded-full bg-[#E4EBDD] px-3 py-1.5 text-xs font-medium text-[#49634B] dark:bg-[#26372A] dark:text-[#C9DFC5]"
                                >
                                    Search: {search}
                                    <span className="ml-2" aria-hidden="true">
                                        ×
                                    </span>
                                </button>
                            )}

                            {category && (
                                <button
                                    type="button"
                                    onClick={() => setCategory("")}
                                    className="rounded-full bg-[#E4EBDD] px-3 py-1.5 text-xs font-medium text-[#49634B] dark:bg-[#26372A] dark:text-[#C9DFC5]"
                                >
                                    {categories.find(
                                        (item) => item._id === category
                                    )?.name || "Category"}
                                    <span className="ml-2" aria-hidden="true">
                                        ×
                                    </span>
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={() => {
                                    setSearch("");
                                    setCategory("");
                                }}
                                className="text-xs text-gray-600 underline underline-offset-2 hover:text-[#49634B] dark:text-gray-400 dark:hover:text-[#C9DFC5]"
                            >
                                Clear all
                            </button>
                        </>
                    ) : (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            No active filters
                        </p>
                    )}
                </div>
            </div>

            {/* Category selection */}
            <div className="mt-5">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    Categories
                </h3>

                <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <input
                        type="radio"
                        name="product-category"
                        checked={!category}
                        onChange={() => setCategory("")}
                        className="accent-[#496F49]"
                    />
                    All Categories
                </label>

                <div className="mt-3 space-y-3">
                    {categories.map((item) => (
                        <label
                            key={item._id}
                            className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                        >
                            <input
                                type="radio"
                                name="product-category"
                                value={item._id}
                                checked={category === item._id}
                                onChange={() => setCategory(item._id)}
                                className="accent-[#496F49]"
                            />

                            <span>{item.name}</span>
                        </label>
                    ))}
                </div>
            </div>
        </aside>
    );
}

export default ProductFilters;

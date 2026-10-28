
import { useSelector } from "react-redux";

import Input from "../../../components/Input";
import { selectCategories } from "../../../features/categories/categorySelectors";

// Reusable filters for both desktop sidebar and mobile dropdown.
function ProductFilters({
    search,
    setSearch,
    category,
    setCategory,
    ageGroup,
    setAgeGroup,
    brand,
    setBrand,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    
}) {
    const categories = useSelector(selectCategories);

    // Find the selected category to show its actual name.
    const selectedCategory = categories.find(
        (item) => item._id === category
    );

    // Check whether any filter is currently active.
    const hasActiveFilters = Boolean(
        search.trim() ||
        category ||
        ageGroup.trim() ||
        brand.trim() ||
        minPrice !== "" ||
        maxPrice !== "" 
    );

    // Clear every filter together.
    const clearFilters = () => {
        setSearch("");
        setCategory("");
        setAgeGroup("");
        setBrand("");
        setMinPrice("");
        setMaxPrice("");
    };

    // Shared styles for the new filter inputs.
    const inputClass =
        "mt-2 w-full rounded-lg border border-[#DCE1E6] bg-white px-3 py-2.5 text-sm text-[#181C20] outline-none transition focus:border-[#436558] focus:ring-1 focus:ring-[#436558] dark:border-gray-700 dark:bg-gray-800 dark:text-white";

    const labelClass =
        "block text-sm font-medium text-[#414845] dark:text-gray-300";

    return (
        <aside className="space-y-4">

            {/* Active filters panel. */}
            <section className="rounded-xl border border-[#E0E3E8] bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-sm font-semibold text-[#181C20] dark:text-white">
                        Active Filters
                    </h2>

                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="text-xs font-medium text-[#436558] underline underline-offset-2 hover:text-[#2B4D41] dark:text-[#B5D0AC]"
                        >
                            Clear all
                        </button>
                    )}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                    {search.trim() && (
                        <button
                            type="button"
                            onClick={() => setSearch("")}
                            className="rounded-full bg-[#EBEEF3] px-3 py-1.5 text-xs text-[#414845] dark:bg-gray-800 dark:text-gray-200"
                        >
                            Search: {search} ×
                        </button>
                    )}

                    {selectedCategory && (
                        <button
                            type="button"
                            onClick={() => setCategory("")}
                            className="rounded-full bg-[#EBEEF3] px-3 py-1.5 text-xs text-[#414845] dark:bg-gray-800 dark:text-gray-200"
                        >
                            {selectedCategory.name} ×
                        </button>
                    )}

                    {ageGroup.trim() && (
                        <button
                            type="button"
                            onClick={() => setAgeGroup("")}
                            className="rounded-full bg-[#EBEEF3] px-3 py-1.5 text-xs text-[#414845] dark:bg-gray-800 dark:text-gray-200"
                        >
                            Age: {ageGroup} ×
                        </button>
                    )}

                    {brand.trim() && (
                        <button
                            type="button"
                            onClick={() => setBrand("")}
                            className="rounded-full bg-[#EBEEF3] px-3 py-1.5 text-xs text-[#414845] dark:bg-gray-800 dark:text-gray-200"
                        >
                            Brand: {brand} ×
                        </button>
                    )}

                    {(minPrice !== "" || maxPrice !== "") && (
                        <button
                            type="button"
                            onClick={() => {
                                setMinPrice("");
                                setMaxPrice("");
                            }}
                            className="rounded-full bg-[#EBEEF3] px-3 py-1.5 text-xs text-[#414845] dark:bg-gray-800 dark:text-gray-200"
                        >
                            Price range ×
                        </button>
                    )}

                    
                    {!hasActiveFilters && (
                        <p className="text-xs leading-5 text-[#68716D] dark:text-gray-400">
                            Your selected filters will appear here.
                        </p>
                    )}
                </div>
            </section>

            {/* Search panel. */}
            <section className="rounded-xl border border-[#E0E3E8] bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <h3 className="font-serif text-lg text-[#181C20] dark:text-white">
                    Find your essentials
                </h3>

                <div className="mt-3">
                    <Input
                        label="Search products"
                        name="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search products..."
                    />
                </div>
            </section>

            {/* Category filter uses real categories from Redux. */}
            <section className="rounded-xl border border-[#E0E3E8] bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <h3 className="font-serif text-lg text-[#181C20] dark:text-white">
                    Category
                </h3>

                <div className="mt-4 space-y-3">
                    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-[#414845] dark:text-gray-300">
                        <input
                            type="radio"
                            name="product-category"
                            checked={!category}
                            onChange={() => setCategory("")}
                            className="h-4 w-4 accent-[#436558]"
                        />
                        All Categories
                    </label>

                    {categories.map((item) => (
                        <label
                            key={item._id}
                            className="flex cursor-pointer items-center gap-2.5 text-sm text-[#414845] dark:text-gray-300"
                        >
                            <input
                                type="radio"
                                name="product-category"
                                value={item._id}
                                checked={category === item._id}
                                onChange={() => setCategory(item._id)}
                                className="h-4 w-4 accent-[#436558]"
                            />
                            {item.name}
                        </label>
                    ))}
                </div>
            </section>

            {/* Age group filter. Enter a value used by your products. */}
            <section className="rounded-xl border border-[#E0E3E8] bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <label className={labelClass} htmlFor="filter-age-group">
                    Baby age group
                </label>

                <input
                    id="filter-age-group"
                    type="text"
                    value={ageGroup}
                    onChange={(event) => setAgeGroup(event.target.value)}
                    placeholder="e.g. 0-6 months"
                    className={inputClass}
                />
            </section>

            {/* Brand filter. */}
            <section className="rounded-xl border border-[#E0E3E8] bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <label className={labelClass} htmlFor="filter-brand">
                    Brand
                </label>

                <input
                    id="filter-brand"
                    type="text"
                    value={brand}
                    onChange={(event) => setBrand(event.target.value)}
                    placeholder="Enter brand name"
                    className={inputClass}
                />
            </section>

            {/* Minimum and maximum original product prices. */}
            <section className="rounded-xl border border-[#E0E3E8] bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <h3 className="font-serif text-lg text-[#181C20] dark:text-white">
                    Price range
                </h3>

                <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                        <label
                            className={labelClass}
                            htmlFor="filter-min-price"
                        >
                            Min (₹)
                        </label>

                        <input
                            id="filter-min-price"
                            type="number"
                            min="0"
                            value={minPrice}
                            onChange={(event) => setMinPrice(event.target.value)}
                            placeholder="0"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label
                            className={labelClass}
                            htmlFor="filter-max-price"
                        >
                            Max (₹)
                        </label>

                        <input
                            id="filter-max-price"
                            type="number"
                            min="0"
                            value={maxPrice}
                            onChange={(event) => setMaxPrice(event.target.value)}
                            placeholder="1000"
                            className={inputClass}
                        />
                    </div>
                </div>
            </section>

    
        </aside>
    );
}

export default ProductFilters;

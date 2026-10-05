// Import Redux's useSelector hook
import { useSelector } from "react-redux";

// Import the reusable Input component
import Input from "../../../components/Input";

// Import the category selector
import { selectCategories } from "../../../features/categories/categorySelectors";

// ProductFilters component
function ProductFilters({
    search,
    setSearch,
    category,
    setCategory,
})  {
    // Get categories from Redux
    const categories = useSelector(selectCategories);

    return (
        <section className="mb-8">
            {/* Search products by title */}
            <div className="max-w-md">
                <Input
                    label="Search products"
                    name="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by product name..."
                />
            </div>

           {/* Category filter */}
<div className="mt-4 max-w-md">
    <label
        htmlFor="category"
        className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
        Category
    </label>

    <select
    id="category"
    name="category"
    value={category}
    onChange={(event) => setCategory(event.target.value)}
    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-white dark:focus:ring-gray-700"
>
        <option value="">
            All Categories
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
        </section>
    );
}

export default ProductFilters;
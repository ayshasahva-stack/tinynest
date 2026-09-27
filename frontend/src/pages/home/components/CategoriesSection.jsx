// Temporary category data for the home page
const categories = [
    {
        id: 1,
        name: "Baby Care",
        description: "Everyday care essentials",
    },
    {
        id: 2,
        name: "Feeding",
        description: "Everything for feeding time",
    },
    {
        id: 3,
        name: "Clothing",
        description: "Comfortable clothes for little ones",
    },
    {
        id: 4,
        name: "Toys",
        description: "Fun and learning essentials",
    },
];

// Featured categories section
function CategoriesSection() {
    return (
        <section className="bg-white py-16 dark:bg-gray-950">

            {/* Section container */}
            <div className="mx-auto max-w-7xl px-4">

                {/* Section heading */}
                <div className="text-center">

                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Shop by Category
                    </h2>

                    <p className="mt-3 text-gray-600 dark:text-gray-400">
                        Find everything you need for your little one.
                    </p>

                </div>

                {/* Category cards */}
                <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="rounded-xl border border-gray-200 bg-gray-50 p-6 transition hover:-translate-y-1 hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
                        >

                            {/* Category name */}
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {category.name}
                            </h3>

                            {/* Category description */}
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                {category.description}
                            </p>

                        </div>
                    ))}

                </div>

            </div>

        </section>
    );
}

export default CategoriesSection;
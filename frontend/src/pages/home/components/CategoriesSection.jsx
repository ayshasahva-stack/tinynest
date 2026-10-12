
import { Link } from "react-router-dom";

// Category images should be placed in:
// frontend/public/images/categories/
const categories = [
    {
        id: 1,
        name: "Baby Clothing",
      image: "/images/categories/baby-clothing.jpg",
    },
    {
        id: 2,
        name: "Feeding",
        image: "/images/categories/feeding.jpg",
    },
    {
        id: 3,
        name: "Diapers",
        image: "/images/categories/diapers.jpg",
    },
    {
        id: 4,
        name: "Toys",
        image: "/images/categories/toys.jpg",
    },
    {
        id: 5,
        name: "Bedding",
        image: "/images/categories/bedding.jpg",
    },
    {
        id: 6,
        name: "Accessories",
        image: "/images/categories/accessories.jpg",
    },
];

function CategoriesSection() {
    return (
        <section className="bg-[#FAFAF3] py-12 transition-colors duration-300 dark:bg-gray-950 sm:py-16">

            {/* Main section container */}
            <div className="mx-auto max-w-7xl px-4 sm:px-8">

                {/* Section heading */}
                <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                    Shop by Category
                </h2>

                {/* Horizontal category row */}
                <div className="mt-8 grid grid-cols-3 gap-x-4 gap-y-7 sm:grid-cols-6 sm:gap-x-5">

                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            to="/products"
                            aria-label={`Shop ${category.name}`}
                            className="group flex min-w-0 flex-col items-center text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#718B70] focus-visible:ring-offset-4"
                        >
                            {/* Circular category photograph */}
                            <div className="aspect-square w-full max-w-[140px] overflow-hidden rounded-full bg-[#EEE8DC] shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:shadow-md dark:bg-gray-800">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    loading="lazy"
                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                />
                            </div>

                            {/* Category name */}
                            <span className="mt-3 text-xs font-medium text-gray-800 transition-colors group-hover:text-[#718B70] dark:text-gray-200 dark:group-hover:text-[#B5D0AC] sm:text-sm">
                                {category.name}
                            </span>
                        </Link>
                    ))}

                </div>
            </div>
        </section>
    );
}

export default CategoriesSection;

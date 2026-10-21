
import { Link } from "react-router-dom";

// Six image-based categories matching the visual reference.
// These image URLs come from your Stitch reference design.

const categories = [
    {
        id: 1,
        name: "Baby Clothing",
        description: "Organic onesies & sets",
        image: "/images/categories/baby-clothing.jpg",
    },
    {
        id: 2,
        name: "Feeding & Weaning",
        description: "Bowls, bottles & feeding sets",
        image: "/images/categories/feeding.jpg",
    },
    {
        id: 3,
        name: "Baby Care",
        description: "Gentle everyday essentials",
        image: "/images/categories/baby-care.jpg",
    },
    {
        id: 4,
        name: "Diapers & Wipes",
        description: "Soft, everyday changing care",
        image: "/images/categories/diapers.jpg",
    },
    {
        id: 5,
        name: "Wooden Toys",
        description: "Playful little discoveries",
        image: "/images/categories/toys.jpg",
    },
    {
        id: 6,
        name: "Baby Bedding",
        description: "Comfort for sweeter dreams",
        image: "/images/categories/bedding.jpg",
    },
    {
        id: 7,
        name: "Accessories",
        description: "Little extras for every day",
        image: "/images/categories/accessories.jpg",
    },
    {
        id: 8,
        name: "Newborn Kits",
        description: "Thoughtful essentials in one bundle",
        image: "/images/categories/newborn-kits.jpg",
    },
];


function CategoriesSection() {
    return (
       <section className="bg-[#F7F9FF] px-5 py-12 transition-colors duration-300 dark:bg-gray-950 sm:px-8 sm:py-16 lg:px-10">

            {/* Keep the content aligned with the hero section. */}
            <div className="mx-auto max-w-7xl">

                {/* Heading and supporting description. */}
               <header className="mx-auto mb-10 max-w-2xl text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#668875] dark:text-[#B5D0AC]">
                      Thoughtfully Curated
                    </p>

                    <h2 className="mt-2 font-serif text-3xl font-normal tracking-tight text-[#252A28] dark:text-white sm:text-4xl">
                       Shop by Category
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-[#68716D] dark:text-gray-400 sm:text-base">
                       Everyday essentials created with non-toxic botanical materials and timeless Nordic simplicity
                    </p>
                 
                </header>
                {/* Circular image cards. */}
                
<div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
    {categories.map((category) => (
        <Link
            key={category.id}
            to="/products"
            aria-label={`Explore ${category.name}`}
            className="group flex flex-col items-center text-center"
        >
            {/* Circular category image */}
            <div className="aspect-square w-full max-w-[180px] overflow-hidden rounded-full bg-[#EAE6DC]">
                <img
                    src={category.image}
                    alt={category.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </div>

            {/* Category name and description */}
            <h3 className="mt-4 text-sm font-medium text-[#252A28] group-hover:text-[#668875] dark:text-white sm:text-base">
                {category.name}
            </h3>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                {category.description}
            </p>
        </Link>
    ))}
</div>

            </div>
        </section>
    );
}

export default CategoriesSection;

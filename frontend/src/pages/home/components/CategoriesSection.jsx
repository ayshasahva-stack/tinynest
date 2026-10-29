
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchCategories } from "../../../features/categories/categoryThunk";

import {
    selectCategories,
    selectCategoriesLoading,
    selectCategoriesError,
} from "../../../features/categories/categorySelectors";

function CategoriesSection() {
    const dispatch = useDispatch();

    // Read active categories and request status from Redux.
    const categories = useSelector(selectCategories);
    const loading = useSelector(selectCategoriesLoading);
    const error = useSelector(selectCategoriesError);

    // Fetch categories from the backend when the section mounts.
    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    return (
        <section className="bg-[#F7F9FF] px-5 py-12 transition-colors duration-300 dark:bg-gray-950 sm:px-8 sm:py-16 lg:px-10">
            <div className="mx-auto max-w-7xl">

                {/* Section heading */}
                <header className="mx-auto mb-10 max-w-2xl text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#668875] dark:text-[#B5D0AC]">
                        Thoughtfully Curated
                    </p>

                    <h2 className="mt-2 font-serif text-3xl font-normal tracking-tight text-[#252A28] dark:text-white sm:text-4xl">
                        Shop by Category
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-[#68716D] dark:text-gray-400 sm:text-base">
                        Discover thoughtfully selected essentials for
                        every little stage of your baby's journey.
                    </p>
                </header>

                {/* Loading state */}
                {loading && (
                    <p className="py-10 text-center text-[#68716D] dark:text-gray-400">
                        Loading categories...
                    </p>
                )}

                {/* Error state */}
                {!loading && error && (
                    <p
                        role="alert"
                        className="py-10 text-center text-red-600 dark:text-red-400"
                    >
                        Unable to load categories. Please try again later.
                    </p>
                )}

                {/* Empty state */}
                {!loading && !error && categories.length === 0 && (
                    <p className="py-10 text-center text-[#68716D] dark:text-gray-400">
                        Categories will be available soon.
                    </p>
                )}

                {/* Categories fetched from the backend */}
                {!loading && !error && categories.length > 0 && (
                    <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
                        {categories.map((category) => (
                          <Link
    key={category.id}
    to={`/products?category=${category._id}`}
    aria-label={`Explore ${category.name}`}
    className="group flex flex-col items-center text-center"
>
                                {/* Circular category image */}
                                <div className="aspect-square w-full max-w-[180px] overflow-hidden rounded-full bg-[#EAE6DC]">
                                    {category.image ? (
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center px-3 text-sm text-[#68716D] dark:text-gray-400">
                                            {category.name}
                                        </div>
                                    )}
                                </div>

                                {/* Category details from MongoDB */}
                                <h3 className="mt-4 text-sm font-medium text-[#252A28] transition-colors group-hover:text-[#668875] dark:text-white sm:text-base">
                                    {category.name}
                                </h3>

                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                                    {category.description}
                                </p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default CategoriesSection;

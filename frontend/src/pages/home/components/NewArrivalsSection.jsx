
import { useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

// Reuse the existing TinyNest product data from Redux.
import { selectProducts } from "../../../features/products/productSelectors";

// Reuse the product card with working cart and wishlist actions.
import ProductCard from "../../products/components/ProductCard";

function NewArrivalsSection() {
    // Reference to the horizontal scrolling product list.
    const scrollTrackRef = useRef(null);

    // Read products already fetched by the Home page.
    const products = useSelector(selectProducts);

    // Sort newest-first when creation dates are available.
    const newArrivals = useMemo(() => {
        return [...products]
            .sort((a, b) => {
                const dateA = a.createdAt
                    ? new Date(a.createdAt).getTime()
                    : 0;

                const dateB = b.createdAt
                    ? new Date(b.createdAt).getTime()
                    : 0;

                return dateB - dateA;
            })
            .slice(0, 8);
    }, [products]);

    // Scroll the product row using the reference's arrow buttons.
    const scrollProducts = (direction) => {
        if (scrollTrackRef.current) {
            scrollTrackRef.current.scrollBy({
                left: direction * 320,
                behavior: "smooth",
            });
        }
    };

    return (
        <section className="w-full bg-[#F7F9FF] px-5 py-14 transition-colors duration-300 dark:bg-gray-950 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
            <div className="mx-auto max-w-7xl">

                {/* Section title and horizontal navigation controls. */}
                <div className="mb-7 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#668875] dark:text-[#B5D0AC]">
                            Seasonal Drop
                        </p>

                        <h2 className="mt-1 font-serif text-3xl font-normal tracking-tight text-[#252A28] dark:text-white sm:text-4xl">
                            New Arrivals
                        </h2>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                        <button
                            type="button"
                            onClick={() => scrollProducts(-1)}
                            aria-label="Previous products"
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#405B43] shadow-sm transition-colors hover:bg-[#E1E9DC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#668875] dark:bg-gray-900 dark:text-[#B5D0AC] dark:hover:bg-gray-800"
                        >
                            <span aria-hidden="true">←</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => scrollProducts(1)}
                            aria-label="Next products"
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#405B43] shadow-sm transition-colors hover:bg-[#E1E9DC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#668875] dark:bg-gray-900 dark:text-[#B5D0AC] dark:hover:bg-gray-800"
                        >
                            <span aria-hidden="true">→</span>
                        </button>
                    </div>
                </div>

                {newArrivals.length === 0 ? (
                    <div className="rounded-2xl bg-white px-6 py-10 text-center text-sm text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                        No products are available right now.
                    </div>
                ) : (
                    <>
                        {/* Horizontal product carousel, as in the reference. */}
                        <div
                            ref={scrollTrackRef}
                            className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4"
                        >
                            {newArrivals.map((product) => (
                                <div
                                    key={product._id}
                                    className="w-[260px] shrink-0 snap-start sm:w-[280px]"
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}

export default NewArrivalsSection;

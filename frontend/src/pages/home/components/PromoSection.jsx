
import { Link } from "react-router-dom";

// Promotional section for the TinyNest home page
function PromoSection() {
    return (
        <section className="bg-white px-5 py-12 transition-colors duration-300 dark:bg-gray-950 sm:px-8 sm:py-16">

            {/* Main container */}
            <div className="mx-auto max-w-7xl">

                {/* Soft pastel promotional banner */}
                <div className="relative overflow-hidden rounded-3xl bg-[#F3DFD9] px-6 py-14 text-center dark:bg-[#352B30] sm:px-12 sm:py-16">

                    {/* Decorative background circles */}
                    <div
                        aria-hidden="true"
                        className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-white/30"
                    />

                    <div
                        aria-hidden="true"
                        className="absolute -bottom-20 -left-12 h-56 w-56 rounded-full bg-[#E4C9BE]/50 dark:bg-[#49353B]"
                    />

                    {/* Promo content */}
                    <div className="relative z-10 mx-auto max-w-2xl">

                        {/* Small introductory label */}
                        <span className="inline-block rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-[#946B62] dark:bg-white/10 dark:text-[#E8BDB2]">
                            For every little moment
                        </span>

                        {/* Promo heading */}
                        <h2 className="mt-5 text-3xl font-bold tracking-tight text-[#352B30] dark:text-white sm:text-4xl lg:text-5xl">
                            Made for little moments
                        </h2>

                        {/* Promo description */}
                        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#65534F] dark:text-gray-300 sm:text-lg">
                            Discover carefully selected essentials designed
                            to bring comfort, care, and joy to your little
                            one's everyday adventures.
                        </p>

                        {/* Navigate to the existing products page */}
                        <Link
                            to="/products"
                            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#718B70] px-7 py-3.5 font-semibold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-[#5D765C] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#718B70] focus:ring-offset-2 dark:focus:ring-offset-[#352B30]"
                        >
                            Explore Products
                            <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default PromoSection;

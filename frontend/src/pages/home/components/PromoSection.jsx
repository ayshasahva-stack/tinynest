// Promotional section for the TinyNest home page
function PromoSection() {
    return (
        <section className="bg-gray-900 py-16 dark:bg-gray-800">

            {/* Promo content container */}
            <div className="mx-auto max-w-7xl px-4">

                {/* Promo content */}
                <div className="rounded-2xl px-6 py-12 text-center sm:px-12">

                    {/* Promo heading */}
                    <h2 className="text-3xl font-bold text-white sm:text-4xl">
                        Made for little moments
                    </h2>

                    {/* Promo description */}
                    <p className="mx-auto mt-4 max-w-2xl text-gray-300">
                        Discover carefully selected essentials designed
                        to bring comfort, care and joy to every little moment.
                    </p>

                    {/* Promo button */}
                    <button
                        type="button"
                        className="mt-8 rounded-lg bg-white px-6 py-3 font-medium text-gray-900 transition hover:bg-gray-200"
                    >
                        Explore Products
                    </button>

                </div>

            </div>

        </section>
    );
}

export default PromoSection;
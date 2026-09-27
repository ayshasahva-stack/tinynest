// Hero section for the TinyNest home page
function HeroSection() {
    return (
        <section className="bg-gray-100 dark:bg-gray-800">

            {/* Hero content container */}
            <div className="mx-auto flex min-h-[500px] max-w-7xl items-center px-4 py-16">

                {/* Hero text */}
                <div className="max-w-2xl">

                    {/* Main heading */}
                    <h1 className="text-4xl font-bold leading-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
                        Everything your little one needs
                    </h1>

                    {/* Supporting text */}
                    <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
                        Safe, comfortable and carefully selected baby
                        essentials for everyday moments.
                    </p>

                    {/* Call-to-action button */}
                    <button
                        type="button"
                        className="mt-8 rounded-lg bg-gray-900 px-6 py-3 font-medium text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                    >
                        Shop Now
                    </button>

                </div>

            </div>

        </section>
    );
}

export default HeroSection;
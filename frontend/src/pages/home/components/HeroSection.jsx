
import { Link } from "react-router-dom";

// Premium hero section for the TinyNest home page
function HeroSection() {
    return (
        <section className="overflow-hidden bg-[#FBF7F0] text-gray-900 transition-colors duration-300 dark:bg-gray-950 dark:text-white">

            {/* Main hero container: text on the left, visual on the right */}
            <div className="mx-auto grid min-h-[560px] max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-10">

                {/* Left side: heading, description, and CTA */}
                <div className="max-w-xl">

                    {/* Small introductory label */}
                    <span className="inline-block rounded-full bg-[#E4EBDD] px-4 py-2 text-sm font-semibold text-[#49634B] dark:bg-[#26372A] dark:text-[#C9DFC5]">
                        Little essentials, lots of love
                    </span>

                    {/* Main heading */}
                    <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                        Everything your{" "}
                        <span className="text-[#718B70] dark:text-[#B5D0AC]">
                            little one
                        </span>{" "}
                        needs
                    </h1>

                    {/* Supporting description */}
                    <p className="mt-6 max-w-lg text-base leading-8 text-gray-600 sm:text-lg dark:text-gray-300">
                        Discover thoughtfully selected baby essentials
                        designed to bring comfort, care, and happiness
                        to your little one’s everyday moments.
                    </p>

                    {/* CTA: navigate to the existing products page */}
                    <div className="mt-8 flex flex-wrap items-center gap-4">
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 rounded-xl bg-[#718B70] px-7 py-3.5 font-semibold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-[#5D765C] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#718B70] focus:ring-offset-2 dark:focus:ring-offset-gray-950"
                        >
                            Shop Now
                            <span aria-hidden="true">→</span>
                        </Link>

                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Made for little beginnings
                        </span>
                    </div>
                </div>

                {/* Right side: decorative showcase, no external images required */}
                <div className="relative mx-auto flex min-h-[340px] w-full max-w-lg items-center justify-center sm:min-h-[420px]">

                    {/* Soft pastel background shape */}
                    <div className="absolute inset-4 rounded-[45%] bg-[#F3DFD9] rotate-[-5deg] dark:bg-[#352B30]" />

                    {/* Main showcase card */}
                    <div className="relative z-10 flex min-h-[300px] w-full max-w-sm flex-col items-center justify-center rounded-[2rem] border border-white/70 bg-white/75 p-8 text-center shadow-xl shadow-[#8A7560]/10 backdrop-blur-sm sm:min-h-[350px] dark:border-white/10 dark:bg-gray-900/80">

                        {/* Decorative baby essentials illustration */}
                        <div className="flex h-36 w-36 items-center justify-center rounded-full bg-[#E4EBDD] text-7xl dark:bg-[#26372A]">
                            🧸
                        </div>

                        <p className="mt-6 text-2xl font-bold tracking-tight">
                            Tiny things,
                            <br />
                            <span className="text-[#718B70] dark:text-[#B5D0AC]">
                                endless love.
                            </span>
                        </p>

                        <p className="mt-3 max-w-xs text-sm leading-6 text-gray-600 dark:text-gray-300">
                            Everyday essentials for your baby's
                            special little moments.
                        </p>
                    </div>

                    {/* Floating decorative badge */}
                    <div className="absolute right-0 top-8 z-20 rounded-2xl bg-white px-4 py-3 shadow-lg sm:right-2 dark:bg-gray-800">
                        <p className="text-sm font-semibold text-[#718B70] dark:text-[#B5D0AC]">
                            Made with care ♡
                        </p>
                    </div>

                    {/* Floating decorative accent */}
                    <div className="absolute bottom-8 left-0 z-20 rounded-2xl bg-[#E4EBDD] px-4 py-3 shadow-md sm:left-2 dark:bg-[#26372A]">
                        <p className="text-sm font-semibold text-[#49634B] dark:text-[#C9DFC5]">
                            For little ones ✨
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;

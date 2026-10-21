
import { Link } from "react-router-dom";

// Hero section for the TinyNest homepage.
// This follows the layout and visual style of your Stitch reference.
function HeroSection() {
    // Product photograph used in the original Stitch reference.
    const heroImage =
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBl3Twu__khBAZgQeiKd2tgXndWxfBbYuprtW_RR4S9xXEsJOx-qhMz9DXR0oihKbJm-2bTKma6_u_6HdEhzTmCc0yQQ73Akud_i5P3tBEOlAWS2VFyRrS4gr4CYMgxwjIafhG2pLxA7o75oRBjaVVCAT01ig1uRH7vOwMgjgPmbWOlJOJDJAc78bHLe8VrFXG2Sj3D1OAXFf0RdVdwka0TiZoDspkq6PtmUBztwDMKJ5Fdl-BW4hAbLA";

    return (
        <section className="overflow-hidden bg-[#F7F9FF] text-[#252A28] transition-colors duration-300 dark:bg-gray-950 dark:text-white">

            {/* Two-column hero: introduction on the left, photograph on the right. */}
            <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-2 lg:gap-14 lg:px-10 lg:py-20">

                {/* Left column: brand message and shopping actions. */}
                <div className="relative z-10">

                    {/* Small introductory badge. */}
                    <div className="inline-flex flex-wrap items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-medium text-[#53615A] shadow-sm dark:bg-gray-800 dark:text-gray-200 sm:text-sm">
                        <span className="h-2 w-2 rounded-full bg-[#789E8D]" />
                        Thoughtfully chosen for little beginnings
                    </div>

                    {/* Main heading inspired by the reference's editorial typography. */}
                    <h1 className="mt-7 max-w-xl font-serif text-4xl font-normal leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                        Gentle essentials for your{" "}
                        <span className="italic text-[#668875] dark:text-[#B5D0AC]">
                            little one.
                        </span>
                    </h1>

                    {/* Explain what customers can discover at TinyNest. */}
                    <p className="mt-6 max-w-xl text-base leading-7 text-[#68716D] dark:text-gray-300 sm:text-lg sm:leading-8">
                        Discover thoughtfully selected baby clothing,
                        feeding essentials, gentle care, and everyday
                        comforts for your little one's journey.
                    </p>

                    {/* Shopping buttons use existing application routes. */}
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                            to="/products"
                            className="inline-flex items-center justify-center gap-3 rounded-full bg-[#426758] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#345446] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#789E8D] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
                        >
                            Shop Now
                            <span aria-hidden="true">→</span>
                        </Link>

                        <Link
                            to="/kits"
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[#35443C] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#EDF2EC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#789E8D] focus-visible:ring-offset-2 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus-visible:ring-offset-gray-950"
                        >
                            <span aria-hidden="true">♡</span>
                            Explore Baby Kits
                        </Link>
                    </div>

                    {/* Simple supporting message without inventing customer statistics. */}
                    <div className="mt-8 flex items-center gap-3 text-sm text-[#68716D] dark:text-gray-400">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#DCE9DE] text-lg text-[#426758] dark:bg-[#26372A] dark:text-[#C9DFC5]">
                            ♡
                        </span>
                        <p>Little details, thoughtfully chosen with care.</p>
                    </div>
                </div>

                {/* Right column: product photography and floating labels. */}
                <div className="relative mx-auto w-full max-w-xl">

                    {/* Soft decorative background shape. */}
                    <div
                        aria-hidden="true"
                        className="absolute -inset-3 -rotate-2 rounded-[2rem] bg-[#E5EDE5] dark:bg-[#26372A]"
                    />

                    {/* Main photograph. */}
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-[#E9E6DE] shadow-xl shadow-[#4C554B]/10 sm:rounded-[2rem]">
                        <img
                            src={heroImage}
                            alt="Soft sage baby clothing, a wooden baby rattle, and a terracotta feeding bowl arranged on a warm neutral surface"
                            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                    </div>

                    {/* Floating information card at the bottom of the image. */}
                    <div className="absolute -bottom-5 left-3 right-3 flex items-center gap-3 rounded-2xl border border-white/80 bg-white/95 p-3 shadow-lg backdrop-blur sm:bottom-5 sm:left-5 sm:right-5 sm:p-4 dark:border-gray-700 dark:bg-gray-900/95">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#DCE9DE] text-xl text-[#426758] dark:bg-[#26372A] dark:text-[#C9DFC5]">
                            ♡
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-[#35443C] dark:text-white">
                                Everyday comfort, made thoughtful
                            </p>
                            <p className="mt-1 text-xs leading-5 text-[#68716D] dark:text-gray-400">
                                Explore essentials for every little milestone.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;


import { Link } from "react-router-dom";

// Footer for TinyNest customer-facing pages.
// Keeps the existing content and routes while updating the reference styling.
function Footer() {
    return (
        <footer className="w-full border-t border-[#E0E4E8] bg-[#F1F4F9] text-[#414845] transition-colors duration-300 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">

            {/* Main footer content, inspired by the Stitch reference. */}
            <div className="mx-auto max-w-[1440px] px-5 pb-8 pt-12 sm:px-8 sm:pb-10 sm:pt-14 lg:px-10">

                {/* Footer columns. */}
                <div className="mb-10 grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">

                    {/* TinyNest brand and existing description. */}
                    <div className="lg:col-span-5 lg:pr-10">
                        <Link
                            to="/"
                            aria-label="TinyNest home"
                            className="inline-flex items-center rounded-lg font-serif text-3xl font-medium tracking-tight text-[#252A28] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#668875] dark:text-white"
                        >
                            TinyNest
                            <span className="text-[#668875] dark:text-[#B5D0AC]">
                                .
                            </span>
                        </Link>

                        <p className="mt-4 max-w-sm text-sm leading-7 text-[#68716D] dark:text-gray-400">
                            Thoughtfully selected baby essentials for
                            every little journey, filled with comfort,
                            care, and love.
                        </p>
                    </div>

                    {/* Existing Explore links and routes. */}
                    <div className="lg:col-span-3">
                        <h3 className="font-serif text-xl text-[#252A28] dark:text-white">
                            Explore
                        </h3>

                        <ul className="mt-4 space-y-3 text-sm text-[#68716D] dark:text-gray-400">
                            <li>
                                <Link
                                    to="/"
                                    className="transition-colors hover:text-[#436558] dark:hover:text-[#B5D0AC]"
                                >
                                    Home
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/products"
                                    className="transition-colors hover:text-[#436558] dark:hover:text-[#B5D0AC]"
                                >
                                    Shop Products
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/kits"
                                    className="transition-colors hover:text-[#436558] dark:hover:text-[#B5D0AC]"
                                >
                                    Baby Kits
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Existing TinyNest brand message. */}
                    <div className="lg:col-span-4">
                        <h3 className="font-serif text-xl text-[#252A28] dark:text-white">
                            Little things, big love
                        </h3>

                        <p className="mt-4 max-w-sm text-sm leading-7 text-[#68716D] dark:text-gray-400">
                            Making everyday moments with your little
                            one a little more special.
                        </p>

                        <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#52745C] dark:text-[#B5D0AC]">
                            Made with love
                            <span aria-hidden="true" className="text-lg">
                                ♡
                            </span>
                        </span>
                    </div>
                </div>

                {/* Bottom copyright row, matching the reference spacing. */}
                <div className="flex flex-col items-center justify-between gap-3 border-t border-[#DCE1E6] pt-6 text-center text-xs text-[#68716D] dark:border-gray-800 dark:text-gray-400 sm:flex-row sm:text-left">
                    <p>
                        © {new Date().getFullYear()} TinyNest. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;


import { Link } from "react-router-dom";

// Footer component for customer-facing pages
function Footer() {
    return (
        <footer className="border-t border-[#E8E5DA] bg-[#FBF7F0] text-gray-700 transition-colors duration-300 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">

            {/* Main footer container */}
            <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12">

                {/* Footer columns */}
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">

                    {/* TinyNest brand and description */}
                    <div>
                        <Link
                            to="/"
                            className="text-2xl font-bold tracking-tight text-[#607D5F] dark:text-[#B5D0AC]"
                        >
                            TinyNest<span className="text-[#D8A99C]">.</span>
                        </Link>

                        <p className="mt-3 max-w-xs text-sm leading-7 text-gray-600 dark:text-gray-400">
                            Thoughtfully selected baby essentials for
                            every little journey, filled with comfort,
                            care, and love.
                        </p>
                    </div>

                    {/* Quick navigation */}
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            Explore
                        </h3>

                        <ul className="mt-4 space-y-3 text-sm">
                            <li>
                                <Link
                                    to="/"
                                    className="transition-colors hover:text-[#607D5F] dark:hover:text-[#B5D0AC]"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/products"
                                    className="transition-colors hover:text-[#607D5F] dark:hover:text-[#B5D0AC]"
                                >
                                    Shop Products
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/kits"
                                    className="transition-colors hover:text-[#607D5F] dark:hover:text-[#B5D0AC]"
                                >
                                    Baby Kits
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Brand message */}
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            Little things, big love
                        </h3>

                        <p className="mt-4 max-w-xs text-sm leading-7 text-gray-600 dark:text-gray-400">
                            Making everyday moments with your little
                            one a little more special.
                        </p>

                        <span className="mt-3 inline-block text-sm font-medium text-[#607D5F] dark:text-[#B5D0AC]">
                            Made with love ♡
                        </span>
                    </div>
                </div>

                {/* Copyright row */}
                <div className="mt-10 border-t border-[#E8E5DA] pt-5 dark:border-gray-800">
                    <p className="text-center text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                        © {new Date().getFullYear()} TinyNest. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;

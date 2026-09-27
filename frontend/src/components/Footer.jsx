// Footer component for customer-facing pages
function Footer() {
    return (
        <footer className="border-t bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">

            {/* Footer content container */}
            <div className="mx-auto max-w-7xl px-4 py-8">

                {/* TinyNest brand */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    TinyNest
                </h3>

                {/* Store description */}
                <p className="mt-2">
                    Baby essentials for every little journey.
                </p>

                {/* Copyright information */}
                <p className="mt-4 text-sm">
                    © 2026 TinyNest. All rights reserved.
                </p>

            </div>

        </footer>
    );
}

export default Footer;
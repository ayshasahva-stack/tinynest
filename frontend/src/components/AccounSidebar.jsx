
import { Link, NavLink, useLocation } from "react-router-dom";

// Shared icons used by the customer account navigation.
function AccountIcon({ type }) {
    const common = {
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.8,
        strokeLinecap: "round",
        strokeLinejoin: "round",
    };

    const paths = {
        overview: (
            <>
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
            </>
        ),
        orders: (
            <>
                <path d="m12 3 9 5-9 5-9-5 9-5Z" />
                <path d="m3 12 9 5 9-5" />
                <path d="m3 16 9 5 9-5" />
            </>
        ),
        addresses: (
            <>
                <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
            </>
        ),
        wishlist: (
            <path d="M20.8 8.6c0 5.4-8.8 11-8.8 11S3.2 14 3.2 8.6A4.6 4.6 0 0 1 12 6.2a4.6 4.6 0 0 1 8.8 2.4Z" />
        ),
        coupons: (
            <>
                <path d="M3 8a2 2 0 0 0 0 4v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 1 0-4V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2Z" />
                <path d="m9 14 6-6" />
                <circle cx="9" cy="8" r=".7" />
                <circle cx="15" cy="14" r=".7" />
            </>
        ),
        settings: (
            <>
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a8 8 0 0 0 0-6l1.4-1.1-1.5-2.6-1.7.6a8 8 0 0 0-5.6-1.8l-.3-1.8h-3l-.3 1.8a8 8 0 0 0-1.6.9l-1.7-.6-1.5 2.6L5 8.1a8 8 0 0 0 0 7.8l-1.4 1.1 1.5 2.6 1.7-.6a8 8 0 0 0 1.6.9l.3 1.8h3l.3-1.8a8 8 0 0 0 1.6-.9l1.7.6 1.5-2.6L19.4 15Z" />
            </>
        ),
    };

    return (
        <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 shrink-0"
            aria-hidden="true"
            {...common}
        >
            {paths[type]}
        </svg>
    );
}

// Reusable sidebar shared by Profile, Orders, and Saved Addresses.
function AccountSidebar({ user, className = "" }) {
    const location = useLocation();

    const links = [
        { to: "/profile", label: "Overview", icon: "overview", key: "overview" },
        { to: "/orders", label: "My Orders", icon: "orders", key: "orders" },
        { to: "/addresses", label: "Saved Addresses", icon: "addresses", key: "addresses" },
        { to: "/wishlist", label: "Saved Wishlist", icon: "wishlist", key: "wishlist" },
        { to: "/coupons", label: "My Coupons", icon: "coupons", key: "coupons" },
        { to: "/refunds", label: "My Refunds", icon: "orders", key: "refunds" },
        { to: "/profile", label: "Account Settings", icon: "settings", key: "settings" },
    ];

    const customerName =
        user?.fullName ||
        user?.name ||
        user?.email?.split("@")[0] ||
        "TinyNest Customer";

    const initials =
        customerName
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase())
            .join("") || "TN";

    return (
        <aside className={`space-y-5 self-start lg:sticky lg:top-24 ${className}`}>
            {/* Customer identity card */}
            <div className="flex items-center gap-3 rounded-2xl bg-white p-5 shadow-sm dark:bg-gray-900">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#dcece4] text-sm font-semibold text-[#436558]">
                    {initials}
                </div>

                <div className="min-w-0">
                    <p className="text-xs text-[#717974] dark:text-gray-400">
                        Welcome back,
                    </p>
                    <p className="mt-1 truncate font-semibold text-[#181c20] dark:text-white">
                        {customerName}
                    </p>
                    <p className="mt-1 text-xs text-[#436558] dark:text-emerald-300">
                        Little things, lots of love
                    </p>
                </div>
            </div>

            {/* Account navigation */}
            <nav
                aria-label="Account navigation"
                className="rounded-2xl bg-white p-2.5 shadow-sm dark:bg-gray-900"
            >
                {links.map((item) => {
                    // Account Settings shares the profile route, so keep
                    // Overview as the only active link on /profile.
                    const isCurrentPage =
                        item.key !== "settings" &&
                        location.pathname === item.to;

                    return (
                        <NavLink
                            key={item.key}
                            to={item.to}
                            end={item.key === "overview"}
                            className={`mb-1 flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm transition last:mb-0 ${
                                isCurrentPage
                                    ? "bg-[#dce7e2] font-semibold text-[#436558] dark:bg-emerald-950 dark:text-emerald-300"
                                    : "text-[#414845] hover:bg-[#f1f4f9] dark:text-gray-200 dark:hover:bg-gray-800"
                            }`}
                        >
                            <AccountIcon type={item.icon} />
                            <span>{item.label}</span>
                        </NavLink>
                    );
                })}
            </nav>

            {/* Concierge card */}
            <div className="rounded-2xl bg-[#f8eeec] p-5 dark:bg-[#382925]">
                <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#8a604c] dark:text-[#e0b8a7]">
                    TinyNest Concierge
                </p>

                <h3 className="mt-2 font-serif text-xl leading-7 text-[#30231e] dark:text-white">
                    Here for your little one's journey.
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#76635b] dark:text-gray-300">
                    Discover thoughtful essentials for every little milestone.
                </p>

                <Link
                    to="/products"
                    className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#8a604c] shadow-sm transition hover:bg-[#fffaf8] dark:bg-gray-900 dark:text-[#e0b8a7]"
                >
                    Explore essentials
                </Link>
            </div>
        </aside>
    );
}

export default AccountSidebar;

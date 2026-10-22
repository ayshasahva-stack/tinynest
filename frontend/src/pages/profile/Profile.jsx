
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";

import {
    getProfileThunk,
    updateProfileThunk,
} from "../../features/auth/authThunk";

import {
    selectAuthUser,
    selectProfileSaving,
    selectProfileError,
} from "../../features/auth/authSelectors";

// Reusable icons for the account sidebar.
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

// Sticky customer sidebar shared with the Orders and Coupons pages.
function AccountSidebar({ user }) {
    const links = [
        { to: "/profile", label: "Overview", icon: "overview" },
        { to: "/orders", label: "My Orders", icon: "orders" },
        { to: "/addresses", label: "Saved Addresses", icon: "addresses" },
        { to: "/wishlist", label: "Saved Wishlist", icon: "wishlist" },
        { to: "/coupons", label: "My Coupons", icon: "coupons" },
        { to: "/profile", label: "Account Settings", icon: "settings" },
    ];

    return (
        <aside className="space-y-5 lg:sticky lg:top-24">
            {/* Customer identity card */}
            <div className="flex items-center gap-3 rounded-2xl bg-white p-5 shadow-sm dark:bg-gray-900">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#dcece4] text-[#436558]">
                    <svg
                        viewBox="0 0 24 24"
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        aria-hidden="true"
                    >
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 21a8 8 0 0 1 16 0" />
                    </svg>
                </div>

                <div className="min-w-0">
                    <p className="text-xs text-[#717974] dark:text-gray-400">
                        Welcome back,
                    </p>

                    <p className="mt-1 truncate font-semibold text-[#181c20] dark:text-white">
                        {user?.fullName || "TinyNest Customer"}
                    </p>

                    <p className="mt-1 text-xs text-[#436558]">
                        Little things, lots of love
                    </p>
                </div>
            </div>

            {/* Account navigation */}
            <nav
                aria-label="Account navigation"
                className="rounded-2xl bg-white p-2.5 shadow-sm dark:bg-gray-900"
            >
                {links.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.to}
                        end={item.to === "/profile"}
                        className={({ isActive }) => {
                            // Only Overview is active for the /profile route.
                            const active =
                                item.label === "Overview" && isActive;

                            return `mb-1 flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm transition last:mb-0 ${
                                active
                                    ? "bg-[#dce7e2] font-semibold text-[#436558] dark:bg-emerald-950 dark:text-emerald-300"
                                    : "text-[#414845] hover:bg-[#f1f4f9] dark:text-gray-200 dark:hover:bg-gray-800"
                            }`;
                        }}
                    >
                        <AccountIcon type={item.icon} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Concierge promotional card */}
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

function Profile() {
    const dispatch = useDispatch();

    // Existing Redux selectors are preserved.
    const user = useSelector(selectAuthUser);
    const saving = useSelector(selectProfileSaving);
    const error = useSelector(selectProfileError);

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
    });

    const [success, setSuccess] = useState("");

    // Fetch profile details if they are not already in Redux.
    useEffect(() => {
        if (!user) {
            dispatch(getProfileThunk());
        }
    }, [dispatch, user]);

    // Populate the form when profile data becomes available.
    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || "",
                phone: user.phone || "",
            });
        }
    }, [user]);

    // Update the form field that the customer edits.
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setSuccess("");
    };

    // Save changes through the existing backend-connected thunk.
    const handleSubmit = async (event) => {
        event.preventDefault();
        setSuccess("");

        try {
            await dispatch(
                updateProfileThunk({
                    fullName: formData.fullName.trim(),
                    phone: formData.phone.trim(),
                })
            ).unwrap();

            setSuccess("Your profile has been updated successfully.");
        } catch {
            // Redux provides the API error displayed below.
        }
    };

    return (
        <main className="min-h-screen bg-[#f7f9ff] px-4 py-7 text-[#181c20] dark:bg-gray-950 dark:text-gray-100 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-[1400px]">
                {/* Page heading */}
                <header className="mb-7 rounded-2xl bg-gradient-to-r from-white via-[#f1f4f9] to-[#e5f4ed] p-6 dark:from-gray-900 dark:via-gray-900 dark:to-emerald-950/30 sm:p-8">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#436558] dark:text-emerald-300">
                        Your TinyNest account
                    </p>

                    <h1 className="mt-2 font-serif text-4xl font-normal tracking-tight text-[#181c20] dark:text-white sm:text-5xl">
                        My Profile
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[#626c68] dark:text-gray-300">
                        A little space for you. Keep your account details
                        updated for a smoother shopping experience.
                    </p>
                </header>

                {/* Sticky sidebar and profile content */}
                <div className="grid items-start gap-6 lg:grid-cols-[290px_minmax(0,1fr)]">
                    <AccountSidebar user={user} />

                    <section className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-gray-900">
                        {/* Profile card heading */}
                        <div className="border-b border-[#edf0f5] p-5 sm:p-7 dark:border-gray-800">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#436558] dark:text-emerald-300">
                                Personal information
                            </p>

                            <h2 className="mt-2 font-serif text-2xl text-[#181c20] dark:text-white sm:text-3xl">
                                Account Details
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-[#626c68] dark:text-gray-400">
                                Update your name and contact number below.
                            </p>
                        </div>

                        {/* Profile form */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6 p-5 sm:p-7 lg:p-8"
                        >
                            {/* Name field */}
                            <div>
                                <label
                                    htmlFor="fullName"
                                    className="mb-2 block text-sm font-semibold text-[#414845] dark:text-gray-200"
                                >
                                    Full name
                                </label>

                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    maxLength={100}
                                    required
                                    autoComplete="name"
                                    placeholder="Enter your full name"
                                    className="w-full rounded-xl border border-[#dfe4e1] bg-[#fcfdfc] px-4 py-3.5 text-sm outline-none transition placeholder:text-[#a0a7a3] focus:border-[#436558] focus:ring-2 focus:ring-[#dce7e2] dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-emerald-950"
                                />
                            </div>

                            {/* Read-only email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-semibold text-[#414845] dark:text-gray-200"
                                >
                                    Email address
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    value={user?.email || ""}
                                    readOnly
                                    aria-readonly="true"
                                    className="w-full cursor-not-allowed rounded-xl border border-[#edf0f5] bg-[#f1f4f9] px-4 py-3.5 text-sm text-[#717974] outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                />

                                <p className="mt-2 text-xs leading-5 text-[#717974] dark:text-gray-400">
                                    Your registered email cannot be changed
                                    from this page.
                                </p>
                            </div>

                            {/* Phone field */}
                            <div>
                                <label
                                    htmlFor="phone"
                                    className="mb-2 block text-sm font-semibold text-[#414845] dark:text-gray-200"
                                >
                                    Phone number
                                </label>

                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    maxLength={20}
                                    required
                                    autoComplete="tel"
                                    placeholder="Enter your phone number"
                                    className="w-full rounded-xl border border-[#dfe4e1] bg-[#fcfdfc] px-4 py-3.5 text-sm outline-none transition placeholder:text-[#a0a7a3] focus:border-[#436558] focus:ring-2 focus:ring-[#dce7e2] dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-emerald-950"
                                />
                            </div>

                            {/* Existing API error */}
                            {error && (
                                <div
                                    role="alert"
                                    className="rounded-xl bg-[#ffdad6] p-4 text-sm text-[#93000a] dark:bg-red-950 dark:text-red-200"
                                >
                                    {error}
                                </div>
                            )}

                            {/* Save success message */}
                            {success && (
                                <div
                                    role="status"
                                    className="rounded-xl border border-[#dce7e2] bg-[#e5f4ed] p-4 text-sm text-[#315e4d] dark:border-gray-700 dark:bg-emerald-950 dark:text-emerald-200"
                                >
                                    {success}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-col gap-3 border-t border-[#edf0f5] pt-6 dark:border-gray-800 sm:flex-row sm:items-center">
                                <button
                                    type="submit"
                                    disabled={saving || !user}
                                    className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#436558] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#315447] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saving ? "Saving changes..." : "Save Changes"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData({
                                            fullName: user?.fullName || "",
                                            phone: user?.phone || "",
                                        });
                                        setSuccess("");
                                    }}
                                    disabled={saving || !user}
                                    className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#dfe4e1] bg-white px-7 py-3 text-sm font-semibold text-[#436558] transition hover:bg-[#f1f4f9] disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-emerald-300 dark:hover:bg-gray-800"
                                >
                                    Reset Changes
                                </button>
                            </div>
                        </form>

                        {/* Account information footer */}
                        {user?.role && (
                            <div className="border-t border-[#edf0f5] bg-[#f7f9ff] px-5 py-4 sm:px-7 dark:border-gray-800 dark:bg-gray-950">
                                <p className="text-xs text-[#717974] dark:text-gray-400">
                                    Account type:{" "}
                                    <span className="font-semibold capitalize text-[#436558] dark:text-emerald-300">
                                        {user.role}
                                    </span>
                                </p>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
}

export default Profile;

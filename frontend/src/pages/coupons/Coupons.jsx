
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";

import { fetchActiveCouponsThunk } from "../../features/coupons/couponThunk";

// Format expiry dates consistently for Indian customers.
const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

// Display the actual discount configured by the admin.
const getDiscountTitle = (coupon) => {
    if (coupon.discountType === "percentage") {
        return `Flat ${coupon.discountValue}% off`;
    }

    return `Flat ₹${coupon.discountValue} off`;
};

// Customer account navigation, inspired by Flipkart.
function AccountSidebar({ user }) {
    const links = [
        { to: "/orders", label: "My Orders", icon: "📦" },
        { to: "/profile", label: "Profile Information", icon: "👤" },
        { to: "/addresses", label: "Manage Addresses", icon: "📍" },
        { to: "/wishlist", label: "My Wishlist", icon: "♡" },
        { to: "/coupons", label: "My Coupons", icon: "🎟️" },
        { to: "/notifications", label: "Notifications", icon: "🔔" },
    ];

    return (
        <aside className="
            h-fit overflow-hidden rounded-sm
            border border-gray-200 bg-white shadow-sm
            dark:border-gray-700 dark:bg-gray-800
        ">
            {/* Customer greeting */}
            <div className="
                flex items-center gap-3 border-b
                border-gray-200 p-5
                dark:border-gray-700
            ">
                <div className="
                    flex h-12 w-12 shrink-0 items-center
                    justify-center rounded-full bg-blue-100
                    text-xl dark:bg-gray-700
                ">
                    👤
                </div>

                <div className="min-w-0">
                    <p className="
                        text-xs text-gray-500
                        dark:text-gray-400
                    ">
                        Hello,
                    </p>

                    <p className="
                        break-words font-semibold
                        text-gray-900 dark:text-white
                    ">
                        {user?.fullName || "Customer"}
                    </p>
                </div>
            </div>

            {/* Account navigation */}
            <nav className="p-2">
                {links.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === "/coupons"}
                        className={({ isActive }) =>
                            `flex items-center gap-3 rounded-md
                            px-4 py-3 text-sm transition ${
                                isActive
                                    ? "bg-blue-50 font-semibold text-blue-600 dark:bg-gray-700 dark:text-blue-400"
                                    : "text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
                            }`
                        }
                    >
                        <span aria-hidden="true">
                            {item.icon}
                        </span>

                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}

// Display additional coupon conditions when requested.
function CouponTerms({ coupon, onClose }) {
    if (!coupon) return null;

    return (
        <div
            className="
                fixed inset-0 z-50 flex items-center
                justify-center bg-black/50 p-4
            "
            onClick={onClose}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="coupon-terms-title"
                className="
                    w-full max-w-md rounded-lg bg-white
                    p-6 shadow-xl dark:bg-gray-800
                "
                onClick={(event) => event.stopPropagation()}
            >
                <div className="
                    flex items-start justify-between gap-4
                ">
                    <h2
                        id="coupon-terms-title"
                        className="
                            text-lg font-semibold
                            text-gray-900 dark:text-white
                        "
                    >
                        Coupon Terms & Conditions
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close terms"
                        className="
                            text-xl text-gray-500
                            hover:text-gray-900
                            dark:hover:text-white
                        "
                    >
                        ×
                    </button>
                </div>

                <div className="
                    mt-5 space-y-3 text-sm
                    text-gray-600 dark:text-gray-300
                ">
                    <p>
                        <strong>Coupon code:</strong>{" "}
                        {coupon.code}
                    </p>

                    <p>
                        <strong>Offer:</strong>{" "}
                        {getDiscountTitle(coupon)}
                    </p>

                    <p>
                        <strong>Minimum order amount:</strong>{" "}
                        ₹{coupon.minOrderAmount ?? 0}
                    </p>

                    {coupon.discountType === "percentage" &&
                        coupon.maxDiscount != null && (
                            <p>
                                <strong>Maximum discount:</strong>{" "}
                                ₹{coupon.maxDiscount}
                            </p>
                        )}

                    <p>
                        <strong>Valid from:</strong>{" "}
                        {formatDate(coupon.startDate)}
                    </p>

                    <p>
                        <strong>Valid until:</strong>{" "}
                        {formatDate(coupon.expiryDate)}
                    </p>

                    {coupon.usageLimit != null && (
                        <p>
                            <strong>Total usage limit:</strong>{" "}
                            {coupon.usageLimit}
                        </p>
                    )}

                    <p>
                        This offer is subject to the coupon's
                        availability and checkout validation.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="
                        mt-6 w-full rounded-md bg-blue-600
                        px-4 py-2 font-medium text-white
                        hover:bg-blue-700
                    "
                >
                    Close
                </button>
            </section>
        </div>
    );
}

function Coupons() {
    const dispatch = useDispatch();
    const [selectedCoupon, setSelectedCoupon] = useState(null);

    // Keep customer coupon state separate from admin coupons.
    const {
        activeCoupons = [],
        activeLoading = false,
        activeError = null,
    } = useSelector((state) => state.coupons);

    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        dispatch(fetchActiveCouponsThunk());
    }, [dispatch]);

    return (
        <main className="
            min-h-screen bg-gray-100 px-4 py-6
            dark:bg-gray-900 sm:px-6 lg:px-8
        ">
            <div className="
                mx-auto grid max-w-6xl grid-cols-1
                items-start gap-5 md:grid-cols-[270px_minmax(0,1fr)]
            ">
                {/* Customer account sidebar */}
                <AccountSidebar user={user} />

                {/* Available coupons panel */}
                <section className="
                    min-h-[420px] rounded-sm border
                    border-gray-200 bg-white p-5 shadow-sm
                    dark:border-gray-700 dark:bg-gray-800
                    sm:p-8
                ">
                    <div className="
                        mb-6 border-b border-gray-200 pb-4
                        dark:border-gray-700
                    ">
                        <h1 className="
                            text-xl font-semibold text-gray-900
                            dark:text-white sm:text-2xl
                        ">
                            Available Coupons
                        </h1>

                        <p className="
                            mt-2 text-sm text-gray-500
                            dark:text-gray-400
                        ">
                            Discover offers available for your
                            next TinyNest purchase.
                        </p>
                    </div>

                    {/* Loading state */}
                    {activeLoading && (
                        <p className="
                            py-10 text-center text-gray-500
                            dark:text-gray-400
                        ">
                            Loading available coupons...
                        </p>
                    )}

                    {/* API error and retry */}
                    {!activeLoading && activeError && (
                        <div className="py-8 text-center">
                            <p className="text-red-600 dark:text-red-400">
                                {activeError}
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    dispatch(fetchActiveCouponsThunk())
                                }
                                className="
                                    mt-4 rounded-md bg-blue-600
                                    px-4 py-2 text-white
                                    hover:bg-blue-700
                                "
                            >
                                Try again
                            </button>
                        </div>
                    )}

                    {/* Empty state */}
                    {!activeLoading &&
                        !activeError &&
                        activeCoupons.length === 0 && (
                            <div className="
                                py-14 text-center
                            ">
                                <div className="mb-3 text-4xl">
                                    🎟️
                                </div>

                                <h2 className="
                                    font-semibold text-gray-800
                                    dark:text-white
                                ">
                                    No coupons available right now
                                </h2>

                                <p className="
                                    mt-2 text-sm text-gray-500
                                    dark:text-gray-400
                                ">
                                    Please check again later for
                                    new TinyNest offers.
                                </p>

                                <Link
                                    to="/products"
                                    className="
                                        mt-5 inline-block rounded-md
                                        bg-blue-600 px-5 py-2
                                        text-sm font-medium text-white
                                        hover:bg-blue-700
                                    "
                                >
                                    Explore Products
                                </Link>
                            </div>
                        )}

                    {/* Coupon cards */}
                    {!activeLoading &&
                        !activeError &&
                        activeCoupons.length > 0 && (
                            <div className="
                                divide-y divide-gray-200
                                border border-gray-200
                                dark:divide-gray-700
                                dark:border-gray-700
                            ">
                                {activeCoupons.map((coupon) => (
                                    <article
                                        key={coupon._id}
                                        className="
                                            p-5 transition
                                            hover:bg-gray-50
                                            dark:hover:bg-gray-700/40
                                            sm:p-6
                                        "
                                    >
                                        {/* Offer title and expiry */}
                                        <div className="
                                            flex flex-col gap-2
                                            sm:flex-row sm:items-start
                                            sm:justify-between
                                        ">
                                            <h2 className="
                                                font-semibold
                                                text-green-600
                                                dark:text-green-400
                                            ">
                                                {getDiscountTitle(coupon)}
                                            </h2>

                                            <span className="
                                                shrink-0 text-sm
                                                text-gray-500
                                                dark:text-gray-400
                                            ">
                                                Valid till{" "}
                                                {formatDate(coupon.expiryDate)}
                                            </span>
                                        </div>

                                        {/* Coupon code */}
                                        <div className="
                                            mt-4 flex flex-wrap
                                            items-center justify-between
                                            gap-3
                                        ">
                                            <div>
                                                <p className="
                                                    font-medium
                                                    text-gray-900
                                                    dark:text-white
                                                ">
                                                    {coupon.code}
                                                </p>

                                                <p className="
                                                    mt-1 text-sm
                                                    text-gray-600
                                                    dark:text-gray-300
                                                ">
                                                    {coupon.discountType ===
                                                    "percentage"
                                                        ? `${coupon.discountValue}% off`
                                                        : `₹${coupon.discountValue} off`}
                                                    {" "}on eligible orders
                                                    {coupon.minOrderAmount > 0
                                                        ? ` above ₹${coupon.minOrderAmount}`
                                                        : ""}
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedCoupon(coupon)
                                                }
                                                className="
                                                    shrink-0 text-sm
                                                    font-medium text-blue-600
                                                    hover:underline
                                                    dark:text-blue-400
                                                "
                                            >
                                                View T&amp;C
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                </section>
            </div>

            {/* Terms dialog for the selected coupon */}
            <CouponTerms
                coupon={selectedCoupon}
                onClose={() => setSelectedCoupon(null)}
            />
        </main>
    );
}

export default Coupons;

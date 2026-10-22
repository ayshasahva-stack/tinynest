
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";

import { fetchActiveCouponsThunk } from "../../features/coupons/couponThunk";
import AccountSidebar from "../../components/AccounSidebar";
// Format coupon dates for Indian customers.
const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

// Use the discount values configured by the backend.
const getDiscountTitle = (coupon) =>
    coupon.discountType === "percentage"
        ? `Flat ${coupon.discountValue}% off`
        : `Flat ₹${coupon.discountValue} off`;


// Coupon terms modal: retains all existing coupon information.
function CouponTerms({ coupon, onClose }) {
    if (!coupon) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#181c20]/45 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="coupon-terms-title"
                className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900 sm:p-8"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4 border-b border-[#edf0f5] pb-5 dark:border-gray-800">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#436558]">
                            TinyNest offers
                        </p>

                        <h2
                            id="coupon-terms-title"
                            className="mt-2 font-serif text-2xl text-[#181c20] dark:text-white"
                        >
                            Terms & Conditions
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close terms"
                        className="rounded-full p-2 text-[#626c68] transition hover:bg-[#f1f4f9] dark:hover:bg-gray-800"
                    >
                        <span className="text-2xl leading-none">×</span>
                    </button>
                </div>

                <div className="mt-5 space-y-4 text-sm text-[#626c68] dark:text-gray-300">
                    <div className="rounded-xl bg-[#f1f4f9] p-4 dark:bg-gray-800">
                        <p className="text-xs text-[#717974]">Coupon code</p>
                        <p className="mt-1 text-lg font-bold tracking-wider text-[#436558] dark:text-emerald-300">
                            {coupon.code}
                        </p>
                        <p className="mt-1 font-medium text-[#181c20] dark:text-white">
                            {getDiscountTitle(coupon)}
                        </p>
                    </div>

                    <p>
                        <strong className="text-[#414845] dark:text-gray-100">
                            Minimum order:
                        </strong>{" "}
                        ₹{coupon.minOrderAmount ?? 0}
                    </p>

                    {coupon.discountType === "percentage" &&
                        coupon.maxDiscount != null && (
                            <p>
                                <strong className="text-[#414845] dark:text-gray-100">
                                    Maximum discount:
                                </strong>{" "}
                                ₹{coupon.maxDiscount}
                            </p>
                        )}

                    <p>
                        <strong className="text-[#414845] dark:text-gray-100">
                            Valid from:
                        </strong>{" "}
                        {formatDate(coupon.startDate)}
                    </p>

                    <p>
                        <strong className="text-[#414845] dark:text-gray-100">
                            Valid until:
                        </strong>{" "}
                        {formatDate(coupon.expiryDate)}
                    </p>

                    {coupon.usageLimit != null && (
                        <p>
                            <strong className="text-[#414845] dark:text-gray-100">
                                Total usage limit:
                            </strong>{" "}
                            {coupon.usageLimit}
                        </p>
                    )}

                    <p className="rounded-lg border border-[#dce7e2] p-4 leading-6 dark:border-gray-700">
                        Offers are subject to availability and validation at checkout. The final discount is calculated according to the coupon's conditions.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="mt-6 w-full rounded-lg bg-[#436558] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#315447]"
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

    // Use the existing customer coupon state and API thunk.
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
        <main className="min-h-screen bg-[#f7f9ff] px-4 py-7 text-[#181c20] dark:bg-gray-950 dark:text-gray-100 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-[1400px]">
                {/* Page heading */}
                <header className="mb-7 rounded-2xl bg-gradient-to-r from-white via-[#f1f4f9] to-[#e5f4ed] p-6 dark:from-gray-900 dark:via-gray-900 dark:to-emerald-950/30 sm:p-8">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#436558] dark:text-emerald-300">
                        Special offers for your little one
                    </p>

                    <h1 className="mt-2 font-serif text-4xl font-normal tracking-tight text-[#181c20] dark:text-white sm:text-5xl">
                        My Coupons
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[#626c68] dark:text-gray-300">
                        Discover available savings on baby essentials and make every TinyNest purchase a little more special.
                    </p>
                </header>

                {/* Sticky account sidebar + coupons content */}
                <div className="grid items-start gap-6 lg:grid-cols-[290px_minmax(0,1fr)]">
                    <AccountSidebar user={user} />

                    <section className="min-h-[480px] rounded-2xl bg-white p-5 shadow-sm dark:bg-gray-900 sm:p-7 lg:p-8">
                        <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-[#edf0f5] pb-5 dark:border-gray-800">
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#436558]">
                                    Just for you
                                </p>

                                <h2 className="mt-2 font-serif text-2xl text-[#181c20] dark:text-white sm:text-3xl">
                                    Available Offers
                                </h2>

                                <p className="mt-2 text-sm text-[#626c68] dark:text-gray-400">
                                    Check the offer details before checkout.
                                </p>
                            </div>

                            {!activeLoading && !activeError && (
                                <span className="rounded-full bg-[#dce7e2] px-3 py-1.5 text-xs font-semibold text-[#436558] dark:bg-emerald-950 dark:text-emerald-300">
                                    {activeCoupons.length}{" "}
                                    {activeCoupons.length === 1
                                        ? "offer"
                                        : "offers"}
                                </span>
                            )}
                        </div>

                        {/* Loading state */}
                        {activeLoading && (
                            <div className="flex min-h-64 flex-col items-center justify-center text-center">
                                <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#dce7e2] border-t-[#436558]" />

                                <p className="mt-4 text-sm text-[#626c68] dark:text-gray-400">
                                    Finding your available offers...
                                </p>
                            </div>
                        )}

                        {/* API error and retry */}
                        {!activeLoading && activeError && (
                            <div className="rounded-xl bg-[#ffdad6] p-6 text-center dark:bg-red-950">
                                <p className="font-semibold text-[#93000a] dark:text-red-200">
                                    We couldn't load your coupons.
                                </p>

                                <p className="mt-2 text-sm text-[#93000a] dark:text-red-200">
                                    {activeError}
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        dispatch(fetchActiveCouponsThunk())
                                    }
                                    className="mt-5 rounded-lg bg-[#436558] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#315447]"
                                >
                                    Try again
                                </button>
                            </div>
                        )}

                        {/* Empty state */}
                        {!activeLoading &&
                            !activeError &&
                            activeCoupons.length === 0 && (
                                <div className="flex min-h-72 flex-col items-center justify-center rounded-xl bg-[#f1f4f9] px-5 py-10 text-center dark:bg-gray-800">
                                  
                                    <h3 className="mt-5 font-serif text-2xl text-[#181c20] dark:text-white">
                                        No coupons available
                                    </h3>

                                    <p className="mt-2 max-w-sm text-sm leading-6 text-[#626c68] dark:text-gray-400">
                                        There are no active offers right now. Please check back soon for new TinyNest savings.
                                    </p>

                                    <Link
                                        to="/products"
                                        className="mt-5 inline-flex rounded-lg bg-[#436558] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#315447]"
                                    >
                                        Explore Products
                                    </Link>
                                </div>
                            )}

                        {/* Coupon cards */}
                        {!activeLoading &&
                            !activeError &&
                            activeCoupons.length > 0 && (
                                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                                    {activeCoupons.map((coupon) => (
                                        <article
                                            key={coupon._id}
                                            className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#dce7e2] bg-white transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
                                        >
                                            {/* Offer banner */}
                                            <div className="relative overflow-hidden bg-gradient-to-br from-[#e5f4ed] to-[#f1f4f9] p-5 dark:from-emerald-950/70 dark:to-gray-800 sm:p-6">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#436558] dark:text-emerald-300">
                                                            TinyNest special
                                                        </p>

                                                        <h3 className="mt-2 font-serif text-2xl leading-tight text-[#315447] dark:text-white">
                                                            {getDiscountTitle(coupon)}
                                                        </h3>

                                                        <p className="mt-2 text-xs text-[#626c68] dark:text-gray-300">
                                                            On eligible orders
                                                        </p>
                                                    </div>

                                                 
                                                </div>
                                            </div>

                                            {/* Ticket-style perforation */}
                                            <div className="relative flex items-center">
                                                <span className="-ml-2 h-4 w-4 rounded-full bg-[#f7f9ff] dark:bg-gray-950" />
                                                <div className="mx-1 flex-1 border-t-2 border-dashed border-[#dce7e2] dark:border-gray-700" />
                                                <span className="-mr-2 h-4 w-4 rounded-full bg-[#f7f9ff] dark:bg-gray-950" />
                                            </div>

                                            {/* Coupon information */}
                                            <div className="flex flex-1 flex-col p-5 sm:p-6">
                                                <div className="flex flex-wrap items-center justify-between gap-2">
                                                    <div>
                                                        <p className="text-[10px] uppercase tracking-[0.12em] text-[#717974]">
                                                            Coupon code
                                                        </p>

                                                        <p className="mt-1 break-all text-lg font-bold tracking-[0.08em] text-[#436558] dark:text-emerald-300">
                                                            {coupon.code}
                                                        </p>
                                                    </div>

                                                    <span className="rounded-full bg-[#f1f4f9] px-3 py-1.5 text-[10px] font-medium text-[#626c68] dark:bg-gray-800 dark:text-gray-300">
                                                        Valid offer
                                                    </span>
                                                </div>

                                                <p className="mt-4 text-sm leading-6 text-[#626c68] dark:text-gray-300">
                                                    {coupon.discountType === "percentage"
                                                        ? `${coupon.discountValue}% discount`
                                                        : `₹${coupon.discountValue} discount`}
                                                    {Number(coupon.minOrderAmount) > 0
                                                        ? ` on orders above ₹${coupon.minOrderAmount}`
                                                        : " on eligible orders"}
                                                    .
                                                </p>

                                                <div className="mt-4 flex items-start gap-2 border-t border-[#edf0f5] pt-4 text-xs text-[#626c68] dark:border-gray-800 dark:text-gray-400">
                                                    <svg
                                                        viewBox="0 0 24 24"
                                                        className="mt-0.5 h-4 w-4 shrink-0 text-[#436558]"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.8"
                                                        aria-hidden="true"
                                                    >
                                                        <circle cx="12" cy="12" r="9" />
                                                        <path d="M12 7v5l3 2" />
                                                    </svg>

                                                    <span>
                                                        Valid until{" "}
                                                        <strong className="font-semibold text-[#414845] dark:text-gray-200">
                                                            {formatDate(coupon.expiryDate)}
                                                        </strong>
                                                    </span>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedCoupon(coupon)
                                                    }
                                                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-[#436558] px-4 py-3 text-sm font-semibold text-[#436558] transition hover:bg-[#e5f4ed] dark:text-emerald-300 dark:hover:bg-emerald-950"
                                                >
                                                    View Terms & Conditions
                                                    <span aria-hidden="true">
                                                        →
                                                    </span>
                                                </button>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}
                    </section>
                </div>
            </div>

            {/* Existing coupon terms functionality */}
            <CouponTerms
                coupon={selectedCoupon}
                onClose={() => setSelectedCoupon(null)}
            />
        </main>
    );
}

export default Coupons;

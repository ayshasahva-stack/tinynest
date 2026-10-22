
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Fetch real TinyNest kits from the backend through Redux.
import { fetchKitsThunk } from "../../../features/kits/kitThunk";

import {
    selectKits,
    selectKitLoading,
    selectKitError,
} from "../../../features/kits/kitSelectors";

// Reuse existing feedback components.
import Loading from "../../../components/Loading";
import EmptyState from "../../../components/EmptyState";
import ErrorMessage from "../../../components/ErrorMessage";

function BabyKitSection() {
    const dispatch = useDispatch();

    // Read the available kits and request status from Redux.
    const kits = useSelector(selectKits);
    const loading = useSelector(selectKitLoading);
    const error = useSelector(selectKitError);

    // Fetch kits when this homepage section mounts.
    useEffect(() => {
        dispatch(fetchKitsThunk());
    }, [dispatch]);

    return (
        <section
            id="baby-kits"
            className="bg-[#F7F9FF] px-5 py-14 transition-colors duration-300 dark:bg-gray-950 sm:px-8 sm:py-16 lg:px-10 lg:py-20"
        >
            <div className="mx-auto max-w-7xl">

                {/* Section heading based on the Stitch reference. */}
                <header className="mx-auto mb-10 max-w-2xl text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#668875] dark:text-[#B5D0AC]">
                        Mindfully Packaged
                    </p>

                    <h2 className="mt-2 font-serif text-3xl font-normal tracking-tight text-[#252A28] dark:text-white sm:text-4xl">
                        Baby Essentials Kits
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-[#68716D] dark:text-gray-400 sm:text-base">
                        Explore thoughtfully bundled essentials for your
                        little one's everyday needs.
                    </p>
                    {/* Navigate to the existing product catalogue. */}
                    <Link
                        to="/kits"
                        className="inline-flex w-fit items-center gap-2 text-sm font-medium text-[#52745C] transition-colors hover:text-[#344E3A] dark:text-[#B5D0AC] dark:hover:text-white"
                    >
                        <span>View all kits</span>
                        <span aria-hidden="true">→</span>
                    </Link>
                </header>

                {/* Preserve the existing loading, error, and empty states. */}
                {loading ? (
                    <Loading />
                ) : error ? (
                    <ErrorMessage
                        title="Unable to load kits"
                        message={error}
                    />
                ) : kits.length === 0 ? (
                    <EmptyState
                        title="No kits available"
                        message="There are currently no baby essentials kits available."
                    />
                ) : (
                    <>
                        {/* Display up to three real kits like the reference. */}
                        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">

                            {kits.slice(0, 3).map((kit) => {
                                // Calculate the actual discounted price.
                                const price = Number(kit.price || 0);
                                const discount = Number(kit.discount || 0);
                                const finalPrice =
                                    price - (price * discount) / 100;

                                // Get real included-product names when available.
                                const includedItems = (kit.items || [])
                                    .slice(0, 4)
                                    .map((item) => {
                                        const product = item.product;

                                        return (
                                            product?.title ||
                                            product?.name ||
                                            item.title ||
                                            null
                                        );
                                    })
                                    .filter(Boolean);

                                return (
                                    <article
                                        key={kit._id}
                                        className="flex h-full flex-col rounded-3xl bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-gray-900 sm:p-4"
                                    >
                                        {/* Wide kit image with a discount badge. */}
                                        <Link
                                            to={`/kits/${kit._id}`}
                                            aria-label={`View ${kit.name}`}
                                            className="block"
                                        >
                                            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-[#EEEFE8] dark:bg-gray-800">
                                                {kit.image ? (
                                                    <img
                                                        src={kit.image}
                                                        alt={kit.name}
                                                        loading="lazy"
                                                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                                                        No image available
                                                    </div>
                                                )}

                                                {discount > 0 && (
                                                    <span className="absolute left-3 top-3 rounded-full bg-[#E1E9DC] px-3 py-1.5 text-xs font-bold text-[#3F5B43] shadow-sm dark:bg-[#344638] dark:text-[#E2EBDD]">
                                                        Save {discount}%
                                                    </span>
                                                )}
                                            </div>
                                        </Link>

                                        {/* Kit name, description, and included items. */}
                                        <div className="flex flex-1 flex-col px-1 pt-4">
                                            <Link to={`/kits/${kit._id}`}>
                                                <h3 className="font-serif text-xl text-[#292D29] transition-colors hover:text-[#52745C] dark:text-white dark:hover:text-[#B5D0AC]">
                                                    {kit.name}
                                                </h3>
                                            </Link>

                                            {kit.description && (
                                                <p className="mt-2 text-sm leading-6 text-[#68716D] dark:text-gray-400">
                                                    {kit.description}
                                                </p>
                                            )}

                                            {/* Only show actual item names returned by the API. */}
                                            {includedItems.length > 0 ? (
                                                <ul className="my-5 space-y-3">
                                                    {includedItems.map(
                                                        (itemName, index) => (
                                                            <li
                                                                key={`${kit._id}-${index}`}
                                                                className="flex items-start gap-2 text-sm text-[#68716D] dark:text-gray-300"
                                                            >
                                                                <span
                                                                    aria-hidden="true"
                                                                    className="mt-0.5 text-[#668875] dark:text-[#B5D0AC]"
                                                                >
                                                                    ✓
                                                                </span>
                                                                <span>{itemName}</span>
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            ) : (
                                                <p className="my-5 text-sm text-[#68716D] dark:text-gray-400">
                                                    {kit.items?.length || 0}{" "}
                                                    {(kit.items?.length || 0) === 1
                                                        ? "product"
                                                        : "products"}{" "}
                                                    included
                                                </p>
                                            )}

                                            {/* Keep pricing and the action at the bottom. */}
                                            <div className="mt-auto border-t border-[#ECEDE6] pt-4 dark:border-gray-800">
                                                <div className="mb-4 flex flex-wrap items-baseline gap-2">
                                                    <span className="font-serif text-xl font-semibold text-[#292D29] dark:text-white">
                                                        ₹
                                                        {finalPrice.toLocaleString(
                                                            "en-IN",
                                                            {
                                                                maximumFractionDigits: 2,
                                                            }
                                                        )}
                                                    </span>

                                                    {discount > 0 && (
                                                        <span className="text-sm text-gray-400 line-through">
                                                            ₹
                                                            {price.toLocaleString(
                                                                "en-IN",
                                                                {
                                                                    maximumFractionDigits: 2,
                                                                }
                                                            )}
                                                        </span>
                                                    )}
                                                </div>

                                                <Link
                                                    to={`/kits/${kit._id}`}
                                                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#49634B] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#344E3A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#668875] focus-visible:ring-offset-2 dark:bg-[#607D5F] dark:hover:bg-[#49634B]"
                                                >
                                                    view Details
                                                    <span aria-hidden="true">
                                                        →
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>

                    </>
                )}
            </div>
        </section>
    );
}

export default BabyKitSection;

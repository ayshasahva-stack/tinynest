
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchKitsThunk } from "../../features/kits/kitThunk";

import {
    selectKits,
    selectKitLoading,
    selectKitError,
} from "../../features/kits/kitSelectors";

import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import ErrorMessage from "../../components/ErrorMessage";

import KitCard from "./components/KitCard";

// Baby kits listing page
function Kits() {
    const dispatch = useDispatch();

    // Read kits and request status from Redux
    const kits = useSelector(selectKits);
    const loading = useSelector(selectKitLoading);
    const error = useSelector(selectKitError);

    // Fetch available kits when the page loads
    useEffect(() => {
        dispatch(fetchKitsThunk());
    }, [dispatch]);

    // Reuse the same page background for all request states
    const pageClasses =
        "min-h-screen bg-[#FBF7F0] px-5 py-10 transition-colors duration-300 dark:bg-gray-950 sm:px-8 sm:py-14";

    return (
        <main className={pageClasses}>
            <div className="mx-auto max-w-7xl">

                {/* Page heading */}
                <header className="mb-10">
                    <span className="inline-block rounded-full bg-[#E4EBDD] px-4 py-2 text-sm font-semibold text-[#49634B] dark:bg-[#26372A] dark:text-[#C9DFC5]">
                        Thoughtfully bundled
                    </span>

                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                        Baby Essentials Kits
                    </h1>

                    <p className="mt-3 max-w-2xl leading-7 text-gray-600 dark:text-gray-400">
                        Carefully selected bundles for your baby's
                        everyday needs, from feeding to bedtime.
                    </p>
                </header>

                {/* Loading state */}
                {loading && <Loading />}

                {/* Error state */}
                {!loading && error && (
                    <ErrorMessage
                        title="Unable to load kits"
                        message={error}
                    />
                )}

                {/* Empty state */}
                {!loading && !error && kits.length === 0 && (
                    <EmptyState
                        title="No kits available"
                        message="There are currently no baby essentials kits available."
                    />
                )}

                {/* Kit cards */}
                {!loading && !error && kits.length > 0 && (
                    <section
                        aria-label="Available baby essentials kits"
                        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    >
                        {kits.map((kit) => (
                            <KitCard
                                key={kit._id}
                                kit={kit}
                            />
                        ))}
                    </section>
                )}
            </div>
        </main>
    );
}

export default Kits;

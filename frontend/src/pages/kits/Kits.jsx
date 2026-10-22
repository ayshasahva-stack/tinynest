
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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

// Baby kits listing page styled to match the TinyNest product catalogue.
function Kits() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Read kits and request status from Redux.
    const kits = useSelector(selectKits);
    const loading = useSelector(selectKitLoading);
    const error = useSelector(selectKitError);

    // Fetch kits when the page mounts.
    useEffect(() => {
        dispatch(fetchKitsThunk());
    }, [dispatch]);

    const pageKits = Array.isArray(kits) ? kits : [];

    return (
        <main className="min-h-screen bg-[#F7F9FF] px-4 py-7 text-[#181C20] transition-colors duration-300 dark:bg-gray-950 dark:text-gray-100 sm:px-6 lg:py-10">
         <div className="mx-auto max-w-6xl">

                {/* Breadcrumbs match the product pages. */}
                <nav
                    aria-label="Breadcrumb"
                    className="mb-7 flex items-center gap-2 text-sm text-[#414845] dark:text-gray-400"
                >
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="transition hover:text-[#436558]"
                    >
                        Home
                    </button>

                    <span>/</span>

                    <span className="font-medium text-[#436558] dark:text-[#C5EBDA]">
                        Baby Kits
                    </span>
                </nav>

                {/* Page heading. */}
                <header className="mb-9 sm:mb-12">
                    <span className="inline-flex rounded-full bg-[#C5EBDA] px-4 py-2 text-xs font-semibold tracking-wide text-[#2B4D41]">
                        Thoughtfully Bundled
                    </span>

                    <h1 className="mt-4 font-serif text-4xl font-normal tracking-tight text-[#181C20] dark:text-white sm:text-5xl">
                        Baby Essentials Kits
                    </h1>

                    <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#414845] dark:text-gray-400">
                        Discover thoughtfully bundled essentials for your
                        little one, all in one convenient kit.
                    </p>

                    {/* Show the actual number of kits only after loading. */}
                    {!loading && !error && pageKits.length > 0 && (
                        <p className="mt-5 text-sm text-[#717974] dark:text-gray-400">
                            {pageKits.length}{" "}
                            {pageKits.length === 1 ? "kit" : "kits"} available
                        </p>
                    )}
                </header>

                {/* Loading state. */}
                {loading && <Loading />}

                {/* Error state. */}
                {!loading && error && (
                    <ErrorMessage
                        title="Unable to load kits"
                        message={error}
                    />
                )}

                {/* Empty state. */}
                {!loading && !error && pageKits.length === 0 && (
                    <EmptyState
                        title="No kits available"
                        message="There are currently no baby essentials kits available. Please check again later."
                    />
                )}

                {/* Responsive kit grid. */}
                {!loading && !error && pageKits.length > 0 && (
                    <section
                        aria-label="Available baby essentials kits"
                        className="grid grid-cols-1 gap-5 min-[420px]:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"
                    >
                        {pageKits.map((kit) => (
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

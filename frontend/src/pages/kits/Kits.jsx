import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
    fetchKitsThunk,
} from "../../features/kits/kitThunk";

import {
    selectKits,
    selectKitLoading,
    selectKitError,
} from "../../features/kits/kitSelectors";

import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import ErrorMessage from "../../components/ErrorMessage";

import KitCard from "./components/KitCard";


function Kits() {

    // Redux dispatch function
    const dispatch = useDispatch();


    // -----------------------------------------
    // REDUX STATE
    // -----------------------------------------

    // Get all kits
    const kits = useSelector(selectKits);

    // Get loading state
    const loading = useSelector(selectKitLoading);

    // Get error state
    const error = useSelector(selectKitError);


    // -----------------------------------------
    // FETCH KITS
    // -----------------------------------------

    useEffect(() => {

        // Fetch all active kits
        dispatch(fetchKitsThunk());

    }, [dispatch]);


    // -----------------------------------------
    // LOADING
    // -----------------------------------------

    if (loading) {

        return (

            <main className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-900">

                <div className="mx-auto max-w-7xl">

                    <Loading />

                </div>

            </main>

        );

    }


    // -----------------------------------------
    // ERROR
    // -----------------------------------------

    if (error) {

        return (

            <main className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-900">

                <div className="mx-auto max-w-7xl">

                    <ErrorMessage message={error} />

                </div>

            </main>

        );

    }


    // -----------------------------------------
    // PAGE
    // -----------------------------------------

    return (

        <main className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-900">

            <div className="mx-auto max-w-7xl">


                {/* Page heading */}
                <div className="mb-8">

                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">

                        Baby Essentials Kits

                    </h1>

                    <p className="mt-2 text-gray-600 dark:text-gray-400">

                        Carefully selected bundles for your baby's everyday needs.

                    </p>

                </div>


                {/* Empty state */}
                {kits.length === 0 ? (

                    <EmptyState
                        title="No kits available"
                        message="There are currently no baby essentials kits available."
                    />

                ) : (

                    /* --------------------------------- */
                    /* KIT GRID */
                    /* --------------------------------- */

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                        {kits.map((kit) => (

                            <KitCard
                                key={kit._id}
                                kit={kit}
                            />

                        ))}

                    </div>

                )}

            </div>

        </main>

    );
}


export default Kits;
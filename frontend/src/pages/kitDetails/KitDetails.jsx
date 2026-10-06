import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate, useParams } from "react-router-dom";

import {
    fetchKitByIdThunk,
} from "../../features/kits/kitThunk";

import {
    selectSelectedKit,
    selectKitLoading,
    selectKitError,
} from "../../features/kits/kitSelectors";

import {
    addToCartThunk,
} from "../../features/cart/cartThunk";

import {
    selectCartLoading,
} from "../../features/cart/cartSelectors";

import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";


function KitDetails() {

    // Redux dispatch
    const dispatch = useDispatch();

    // Navigation
    const navigate = useNavigate();

    // Get kit ID from URL
    const { kitId } = useParams();


    // -----------------------------------------
    // KIT STATE
    // -----------------------------------------

    const kit = useSelector(selectSelectedKit);

    const loading = useSelector(selectKitLoading);

    const error = useSelector(selectKitError);


    // -----------------------------------------
    // CART STATE
    // -----------------------------------------

    const cartLoading = useSelector(
        selectCartLoading
    );


    // -----------------------------------------
    // FETCH KIT
    // -----------------------------------------

    useEffect(() => {

        dispatch(fetchKitByIdThunk(kitId));

    }, [dispatch, kitId]);


    // -----------------------------------------
    // CALCULATE FINAL PRICE
    // -----------------------------------------

    const finalPrice = kit
        ? kit.price -
          (kit.price * kit.discount) / 100
        : 0;


    // -----------------------------------------
    // ADD KIT TO CART
    // -----------------------------------------

    const handleAddToCart = async () => {

        if (!kit) {
            return;
        }

        const result = await dispatch(
            addToCartThunk({
                itemType: "kit",
                kit: kit._id,
                quantity: 1,
            })
        );


        // Navigate to cart after successful addition
        if (addToCartThunk.fulfilled.match(result)) {

            navigate("/cart");

        }

    };


    // -----------------------------------------
    // LOADING
    // -----------------------------------------

    if (loading) {

        return (

            <main className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-900">

                <div className="mx-auto max-w-6xl">

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

                <div className="mx-auto max-w-6xl">

                    <ErrorMessage message={error} />

                </div>

            </main>

        );

    }


    // -----------------------------------------
    // KIT NOT FOUND
    // -----------------------------------------

    if (!kit) {

        return (

            <main className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-900">

                <div className="mx-auto max-w-6xl">

                    <p className="text-gray-600 dark:text-gray-400">
                        Kit not found.
                    </p>

                </div>

            </main>

        );

    }


    // -----------------------------------------
    // PAGE
    // -----------------------------------------

    return (

        <main className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-900">

            <div className="mx-auto max-w-6xl">


                {/* ================================= */}
                {/* KIT INFORMATION */}
                {/* ================================= */}

                <div className="grid gap-10 md:grid-cols-2">


                    {/* --------------------------------- */}
                    {/* KIT IMAGE */}
                    {/* --------------------------------- */}

                    <div className="overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">

                        <img
                            src={kit.image}
                            alt={kit.name}
                            className="h-full min-h-96 w-full object-cover"
                        />

                    </div>


                    {/* --------------------------------- */}
                    {/* KIT DETAILS */}
                    {/* --------------------------------- */}

                    <div>


                        {/* Kit name */}
                        <h1 className="text-3xl font-bold capitalize text-gray-900 dark:text-white">

                            {kit.name}

                        </h1>


                        {/* Description */}
                        <p className="mt-5 leading-7 text-gray-700 dark:text-gray-300">

                            {kit.description}

                        </p>


                        {/* Price */}
                        <div className="mt-6 flex items-center gap-3">

                            <span className="text-3xl font-bold text-gray-900 dark:text-white">

                                ₹{finalPrice.toFixed(2)}

                            </span>


                            {/* Original price */}
                            {kit.discount > 0 && (

                                <span className="text-lg text-gray-400 line-through">

                                    ₹{kit.price.toFixed(2)}

                                </span>

                            )}

                        </div>


                        {/* Discount */}
                        {kit.discount > 0 && (

                            <p className="mt-2 font-medium text-green-600">

                                {kit.discount}% off

                            </p>

                        )}


                        {/* Add to cart */}
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            disabled={cartLoading}
                            className="mt-8 w-full rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                        >

                            {cartLoading
                                ? "Adding to Cart..."
                                : "Add Kit to Cart"}

                        </button>

                    </div>

                </div>


                {/* ================================= */}
                {/* INCLUDED PRODUCTS */}
                {/* ================================= */}

                <section className="mt-10 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">

                        What's Included

                    </h2>


                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">

                        Products included in this kit.

                    </p>


                    {/* Product list */}
                    <div className="mt-6 space-y-4">

                        {kit.items.map((item) => {

                            const product = item.product;

                            // Skip invalid kit items
                            if (!product) {
                                return null;
                            }


                            return (

                                <div
                                    key={product._id}
                                    className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 dark:border-gray-700"
                                >

                                    {/* Product image */}
                                    <img
                                        src={product.images?.[0]}
                                        alt={product.title}
                                        className="h-20 w-20 rounded-lg object-cover"
                                    />


                                    {/* Product details */}
                                    <div className="flex-1">

                                        <h3 className="font-semibold text-gray-900 dark:text-white">

                                            {product.title}

                                        </h3>

                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">

                                            {product.brand}

                                        </p>

                                        <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">

                                            ₹{product.price}

                                        </p>

                                    </div>


                                    {/* Quantity */}
                                    <div className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200">

                                        × {item.quantity}

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                </section>

            </div>

        </main>

    );
}


export default KitDetails;
// Import Link for navigation to kit details
import { Link } from "react-router-dom";


function KitCard({ kit }) {

    // Calculate the final price after discount
    const discountedPrice =
        kit.price -
        (kit.price * kit.discount) / 100;


    return (

        <article className="overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:bg-gray-800">

            {/* Kit image */}
            <div className="h-56 overflow-hidden bg-gray-100 dark:bg-gray-700">

                <img
                    src={kit.image}
                    alt={kit.name}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                />

            </div>


            {/* Kit information */}
            <div className="p-5">

                {/* Kit name */}
                <h2 className="text-lg font-semibold capitalize text-gray-900 dark:text-white">

                    {kit.name}

                </h2>


                {/* Kit description */}
                <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">

                    {kit.description}

                </p>


                {/* Price */}
                <div className="mt-4 flex items-center gap-2">

                    <span className="text-xl font-bold text-gray-900 dark:text-white">

                        ₹{discountedPrice.toFixed(2)}

                    </span>


                    {/* Original price */}
                    {kit.discount > 0 && (

                        <span className="text-sm text-gray-400 line-through">

                            ₹{kit.price.toFixed(2)}

                        </span>

                    )}

                </div>


                {/* Discount */}
                {kit.discount > 0 && (

                    <p className="mt-1 text-sm font-medium text-green-600">

                        {kit.discount}% off

                    </p>

                )}


                {/* Number of products */}
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">

                    {kit.items.length}{" "}
                    {kit.items.length === 1
                        ? "product"
                        : "products"}{" "}
                    included

                </p>


                {/* View details */}
                <Link
                    to={`/kits/${kit._id}`}
                    className="mt-5 block rounded-lg bg-gray-900 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                >
                    View Kit
                </Link>

            </div>

        </article>

    );
}


export default KitCard;
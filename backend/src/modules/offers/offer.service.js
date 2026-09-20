import Offer from "./offer.model.js";

// Calculate the final price of a product after applying
// the currently active offer, if one exists.
export const getProductOfferPrice = async (product) => {
    // Get the current date and time
    const now = new Date();

    // ------------------------------------------------
    // FIND PRODUCT-SPECIFIC OFFER
    // ------------------------------------------------

    const productOffer = await Offer.findOne({
        isActive: true,
        startDate: { $lte: now },
        expiryDate: { $gte: now },
        product: product._id
    }).sort({ createdAt: -1 });

    // ------------------------------------------------
    // FIND CATEGORY OFFER ONLY IF PRODUCT OFFER
    // DOES NOT EXIST
    // ------------------------------------------------

    let offer = productOffer;

    if (!offer && product.category) {
        offer = await Offer.findOne({
            isActive: true,
            startDate: { $lte: now },
            expiryDate: { $gte: now },
            category: product.category
        }).sort({ createdAt: -1 });
    }

    // If no active offer exists,
    // return the normal product price.
    if (!offer) {
        return {
            originalPrice: product.price,
            offerPrice: product.price,
            discount: 0,
            offer: null
        };
    }

    // ------------------------------------------------
    // CALCULATE DISCOUNT
    // ------------------------------------------------

    let discount = 0;

    // Percentage offer
    if (offer.discountType === "percentage") {
        discount =
            (product.price * offer.discountValue) / 100;
    }

    // Fixed amount offer
    if (offer.discountType === "fixed") {
        discount = offer.discountValue;
    }

    // Never allow the discount to exceed
    // the original product price.
    if (discount > product.price) {
        discount = product.price;
    }

    // Round discount to two decimal places
    discount =
        Math.round(discount * 100) / 100;

    // Calculate final selling price
    const offerPrice =
        Math.round(
            (product.price - discount) * 100
        ) / 100;

    return {
        originalPrice: product.price,
        offerPrice,
        discount,
        offer
    };
};
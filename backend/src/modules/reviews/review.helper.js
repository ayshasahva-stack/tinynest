import Review from "./review.model.js";
import Product from "../products/product.model.js";

// Recalculate and update the average rating of a product
export const updateProductRating = async (productId) => {
    // Get all reviews for this product
    const reviews = await Review.find({ product: productId });

    // If there are no reviews, reset the rating to 0
    if (reviews.length === 0) {
        await Product.findByIdAndUpdate(productId, {
            rating: 0
        });

        return 0;
    }

    // Add all ratings together
    const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
    );

    // Calculate the average rating
    const averageRating = totalRating / reviews.length;

    // Round to one decimal place
    const roundedRating = Math.round(averageRating * 10) / 10;

    // Update the product's rating
    await Product.findByIdAndUpdate(productId, {
        rating: roundedRating
    });

    return roundedRating;
};
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        // User who wrote the review
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // Product being reviewed
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        // Rating given by the user
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },

        // Optional review comment
        comment: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

// One user can review a particular product only once
reviewSchema.index(
    { user: 1, product: 1 },
    { unique: true }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
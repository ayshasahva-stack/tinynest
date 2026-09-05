import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
    {
        // Each wishlist belongs to one user
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        // Products saved by the user
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            }
        ]
    },
    {
        timestamps: true
    }
);

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

export default Wishlist;
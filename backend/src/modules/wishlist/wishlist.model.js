
import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
    {
        // Each wishlist belongs to one user.
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        // Existing product wishlist support.
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        ],

        // New: baby kits saved by the user.
        kits: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Kit",
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

export default Wishlist;

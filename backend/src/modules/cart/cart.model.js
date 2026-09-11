import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
    {
        // Tells us whether this cart item is a product or a kit
        itemType: {
            type: String,
            enum: ["product", "kit"],
            default: "product",
            required: true
        },

        // Reference to the product
        // This is null when the cart item is a kit
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            default: null
        },

        // Reference to the kit
        // This is null when the cart item is a product
        kit: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Kit",
            default: null
        },

        // Number of units the user wants to purchase
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    },
    {
        _id: false
    }
);


const cartSchema = new mongoose.Schema(
    {
        // Each cart belongs to one user
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        // Products currently inside the cart
        items: {
            type: [cartItemSchema],
            default: []
        }
    },
    {
        timestamps: true
    }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
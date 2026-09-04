import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        // Product name
        title: {
            type: String,
            required: true,
            trim: true
        },

        // Detailed product information
        description: {
            type: String,
            required: true,
            trim: true
        },

        // Original product price
        price: {
            type: Number,
            required: true,
            min: 0
        },

        // Discount percentage
        discount: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },

        // Product category
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },

        // Product brand
        brand: {
            type: String,
            required: true,
            trim: true
        },

        // Suitable baby age group
        ageGroup: {
            type: String,
            required: true,
            trim: true
        },

        // Product image URLs
        images: {
            type: [String],
            required: true,
            validate: {
                validator: (images) => images.length > 0,
                message: "At least one product image is required"
            }
        },

        // Number of products currently available
        stock: {
            type: Number,
            required: true,
            min: 0
        },

        // Average customer rating
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },

        // Search/filter keywords
        tags: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true
    }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
import mongoose from "mongoose";

// Schema for each product inside a kit
const kitItemSchema = new mongoose.Schema(
    {
        // Reference to an existing product
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        // Number of units of this product in the kit
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    },
    {
        // We don't need separate _id values for kit items
        _id: false
    }
);

// Schema for a Baby Essentials Kit
const kitSchema = new mongoose.Schema(
    {
        // Name of the kit
        name: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        // Description of the kit
        description: {
            type: String,
            required: true,
            trim: true
        },

        // Image URL for the kit
        image: {
            type: String,
            required: true,
            trim: true
        },

        // Products included in the kit
        items: {
            type: [kitItemSchema],
            required: true,

            // A kit must contain at least one product
            validate: {
                validator: (items) => items.length > 0,
                message: "Kit must contain at least one product"
            }
        },

        // Selling price of the complete kit
        price: {
            type: Number,
            required: true,
            min: 0
        },

        // Discount offered on the kit
        discount: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },

        // Controls whether the kit is available to customers
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        // Automatically adds createdAt and updatedAt
        timestamps: true
    }
);

// Create the Kit model
const Kit = mongoose.model("Kit", kitSchema);

export default Kit;
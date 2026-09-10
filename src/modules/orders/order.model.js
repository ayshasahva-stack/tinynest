import mongoose from "mongoose";

// Schema for each product inside an order.
// We store a snapshot of important product information
// so the order remains accurate even if the product changes later.
const orderItemSchema = new mongoose.Schema(
    {
        // Reference to the original product
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        // Product name at the time the order was placed
        title: {
            type: String,
            required: true,
            trim: true
        },

        // Product price at the time the order was placed
        price: {
            type: Number,
            required: true,
            min: 0
        },

        // Number of units purchased
        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        // Product image at the time the order was placed
        image: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        // Order items don't need their own MongoDB _id
        _id: false
    }
);

// Shipping address snapshot.
// We copy the address into the order instead of referencing
// the user's Address document.
const shippingAddressSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        addressLine: {
            type: String,
            required: true,
            trim: true
        },

        city: {
            type: String,
            required: true,
            trim: true
        },

        state: {
            type: String,
            required: true,
            trim: true
        },

        postalCode: {
            type: String,
            required: true,
            trim: true
        },

        country: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        // Address is embedded inside the order,
        // so it doesn't need its own _id.
        _id: false
    }
);

// Main Order schema
const orderSchema = new mongoose.Schema(
    {
        // User who placed the order
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // Products purchased in this order
        items: {
            type: [orderItemSchema],
            required: true,
            validate: {
                validator: (items) => items.length > 0,
                message: "Order must contain at least one item"
            }
        },

        // Shipping address used for this order
        shippingAddress: {
            type: shippingAddressSchema,
            required: true
        },

        // Total of all products before discount and shipping
        subtotal: {
            type: Number,
            required: true,
            min: 0
        },

        // Discount applied to the order
        discount: {
            type: Number,
            default: 0,
            min: 0
        },

        // Shipping charge
        shippingFee: {
            type: Number,
            default: 0,
            min: 0
        },

        // Final amount the customer needs to pay
        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },

        // Optional coupon used for this order
        coupon: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Coupon",
            default: null
        },

        // Current order status
        status: {
            type: String,
            enum: [
                "pending",
                "confirmed",
                "processing",
                "shipped",
                "delivered",
                "cancelled"
            ],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
    {
        // The user who owns this address
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // Name of the person receiving the order
        fullName: {
            type: String,
            required: true,
            trim: true
        },

        // Phone number for delivery
        phone: {
            type: String,
            required: true,
            trim: true
        },

        // Complete street/house address
        addressLine: {
            type: String,
            required: true,
            trim: true
        },

        // City where the address is located
        city: {
            type: String,
            required: true,
            trim: true
        },

        // State where the address is located
        state: {
            type: String,
            required: true,
            trim: true
        },

        // Postal/PIN code
        postalCode: {
            type: String,
            required: true,
            trim: true
        },

        // Country
        country: {
            type: String,
            required: true,
            trim: true
        },

        // Whether this is the user's default delivery address
        isDefault: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Address = mongoose.model("Address", addressSchema);

export default Address;
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        // Category name
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        // Short description of the category
        description: {
            type: String,
            trim: true,
            default: ""
        },

        // Category image URL
        image: {
            type: String,
            trim: true,
            default: ""
        },

        // Controls whether the category is visible to customers
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
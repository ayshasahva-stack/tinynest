import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../modules/products/product.model.js";
import Category from "../modules/categories/category.model.js";

dotenv.config();

// Connect to MongoDB
await mongoose.connect(process.env.MONGO_URI);

console.log("Connected to MongoDB");

try {
    // Get all products
    const products = await Product.find();

    for (const product of products) {
        // Skip products that are already using an ObjectId
        if (mongoose.Types.ObjectId.isValid(product.category)) {
            console.log(`Skipping ${product.title} - already migrated`);
            continue;
        }

        // Normalize the existing category name
        const categoryName = product.category.trim().toLowerCase();

        // Find the matching category
        const category = await Category.findOne({
            name: categoryName
        });

        // Stop if no matching category exists
        if (!category) {
            console.log(
                `No category found for product: ${product.title}`
            );
            continue;
        }

        // Replace the category name with the Category ObjectId
        product.category = category._id;

        // Save the migrated product
        await product.save();

        console.log(
            `Migrated ${product.title} → ${category.name}`
        );
    }

    console.log("Category migration completed");
} catch (error) {
    console.error("Migration failed:", error);
} finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
}
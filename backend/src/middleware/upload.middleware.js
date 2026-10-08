// Multer handles incoming file uploads
import multer from "multer";

// Cloudinary storage allows Multer to upload
// files directly to Cloudinary
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Our configured Cloudinary instance
import cloudinary from "../config/cloudinary.js";

// Configure Cloudinary as Multer's storage engine
const storage = new CloudinaryStorage({
    cloudinary,

    params: {
        // All TinyNest product images will be
        // organized inside this Cloudinary folder
        folder: "tinynest/products",

        // Only allow these image formats
        allowed_formats: [
            "jpg",
            "jpeg",
            "png",
            "webp",
        ],

        // Use the original filename when possible
        use_filename: true,

        // Add a unique identifier so files
        // don't overwrite each other
        unique_filename: true,
    },
});

// Create the Multer middleware
const upload = multer({
    storage,

    // Maximum file size = 5 MB
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

// Export upload middleware
export default upload;
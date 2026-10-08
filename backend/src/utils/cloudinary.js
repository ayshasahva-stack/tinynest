    import { v2 as cloudinary } from "cloudinary";

// Delete an image from Cloudinary using its stored URL
export const deleteCloudinaryImage = async (imageUrl) => {
    try {
        // Ignore empty URLs
        if (!imageUrl) {
            return;
        }

        /*
         * Example Cloudinary URL:
         *
         * https://res.cloudinary.com/z9sygmj8/image/upload/
         * v1791474364/tinynest/products/file_cavph2.webp
         *
         * We need:
         *
         * tinynest/products/file_cavph2
         */

        const uploadMarker = "/upload/";

        // Find where "/upload/" appears in the URL
        const uploadIndex = imageUrl.indexOf(uploadMarker);

        // If this is not a Cloudinary URL, don't try to delete it
        if (uploadIndex === -1) {
            return;
        }

        // Get everything after "/upload/"
        let publicId = imageUrl.substring(
            uploadIndex + uploadMarker.length
        );

        /*
         * Remove the version part.
         *
         * Example:
         * v1791474364/tinynest/products/file.webp
         *
         * becomes:
         * tinynest/products/file.webp
         */
        publicId = publicId.replace(/^v\d+\//, "");

        // Remove the file extension
        publicId = publicId.replace(/\.[^/.]+$/, "");

        // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(publicId);

        console.log(
            `Cloudinary image deleted: ${publicId}`
        );

    } catch (error) {
        // Log the error but don't crash the whole request
        console.error(
            "Failed to delete Cloudinary image:",
            error.message
        );
    }
};  
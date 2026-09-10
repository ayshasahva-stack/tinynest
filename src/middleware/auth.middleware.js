import jwt from "jsonwebtoken";
import User from "../modules/auth/auth.model.js";
import ApiError from "../utils/Apierror.js";

// Protect routes that require a logged-in user
const protect = async (req, res, next) => {
    try {
        // Get the Authorization header from the request
        const authHeader = req.headers.authorization;

        // Check whether the header exists and starts with "Bearer"
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return next(
                new ApiError(401, "Authorization header missing or invalid")
            );
        }

        // Extract the JWT from "Bearer <token>"
        const token = authHeader.split(" ")[1];

        // Verify the JWT using our secret
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Find the user whose ID is stored inside the JWT
        const user = await User.findById(decoded.userId);

        // Check whether the user still exists
        if (!user) {
            return next(new ApiError(401, "User not found"));
        }

        /* Attach the logged-in user to the request,
        Controllers can access it using req.user*/
        req.user = user;

        // Continue to the next middleware/controller
        next();

    } catch (error) {
        // Token is invalid or expired
        return next(
            new ApiError(401, "Invalid or expired token")
        );
    }
};

export default protect;
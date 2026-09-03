import ApiError from "../utils/Apierror.js";

// Allow access only to admin users
const authorizeAdmin = (req, res, next) => {
    // protect middleware must run before this middleware
    // because it adds the logged-in user to req.user
    if (!req.user) {
        return next(
            new ApiError(401, "Authentication required")
        );
    }

    // Check the user's role
    if (req.user.role !== "admin") {
        return next(
            new ApiError(403, "Admin access required")
        );
    }

    // User is an admin, so continue
    next();
};

export default authorizeAdmin;
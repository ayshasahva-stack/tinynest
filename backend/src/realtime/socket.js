import jwt from "jsonwebtoken";
import User from "../modules/auth/auth.model.js";
import ApiError from "../utils/Apierror.js";

// Authenticates a Socket.IO connection using the user's JWT
const authenticateSocket = async (socket, next) => {
    try {
        // Get the token sent by the Socket.IO client
        const token = socket.handshake.auth?.token;

        // Make sure a token was provided
        if (!token) {
            return next(new Error("Authentication token is required"));
        }

        // Verify the JWT using the same secret
        // that we use for normal API authentication
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Find the user from the ID stored inside the JWT
        const user = await User.findById(decoded.userId);

        // Make sure the user still exists
        if (!user) {
            return next(new Error("User not found"));
        }

        // Prevent blocked users from creating socket connections
        if (user.isBlocked) {
            return next(new Error("User account is blocked"));
        }

        // Attach the authenticated user to the socket
        // so other socket functions can access it
        socket.user = user;

        // Allow the connection to continue
        next();

    } catch (error) {
        // Reject invalid or expired JWTs
        return next(new Error("Invalid or expired token"));
    }
};
// Handles a new Socket.IO client connection
const handleSocketConnection = (socket) => {

    // Show the connected client's unique socket ID
    console.log(`Socket connected: ${socket.id}`);

    // Create a private room for the authenticated user
    const userRoom = `user:${socket.user._id}`;

    // Add this socket to the user's private room
    socket.join(userRoom);

    console.log(`User joined room: ${userRoom}`);

    // Add admin users to the shared admin room
    if (socket.user.role === "admin") {
        socket.join("admin");

        console.log(`Admin joined room: admin`);
    }

    // Listen for when this client disconnects
    socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
};

export {
    authenticateSocket
};

export default handleSocketConnection;
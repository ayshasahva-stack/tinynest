
import { io } from "socket.io-client";

// Use the configured backend URL.
// Locally: http://localhost:3000
// Production: Your deployed Render backend URL.
const SOCKET_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3000";

// Create one shared Socket.IO client for TinyNest.
const socket = io(SOCKET_URL, {
    // Connect only after the user is authenticated.
    autoConnect: false,

    // Send the JWT using the property expected by the backend.
    auth: (callback) => {
        const token = localStorage.getItem("token");
        callback({ token });
    },
});

export default socket;

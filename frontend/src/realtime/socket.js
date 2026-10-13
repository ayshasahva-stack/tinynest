
import { io } from "socket.io-client";

// Create one shared Socket.IO client for TinyNest.
const socket = io("http://localhost:3000", {
    // Connect only after the user is authenticated.
    autoConnect: false,

    // Send the JWT using the property expected by the backend.
    auth: (callback) => {
        const token = localStorage.getItem("token");
        callback({ token });
    },
});

export default socket;

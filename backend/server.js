import app from "./src/app.js";
import dotenv from "dotenv";
import connectDb from "./src/config/db.js";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const PORT = process.env.PORT || 3000;

// Create an HTTP server using the Express app
const httpServer = createServer(app);

// Attach Socket.IO to the HTTP server
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
});

// Runs whenever a client connects to Socket.IO
io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Runs when the client disconnects
    socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
});

const startServer = async () => {
    // Connect to MongoDB first
    await connectDb();

    // Start the HTTP server
    // This server now handles both Express and Socket.IO
    httpServer.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
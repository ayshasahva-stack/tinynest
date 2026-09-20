import app from "./src/app.js";
import dotenv from "dotenv";
import connectDb from "./src/config/db.js";
import { createServer } from "http";
import { Server } from "socket.io";
import handleSocketConnection from "./src/realtime/socket.js";

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

// Handle every new Socket.IO connection
io.on("connection", handleSocketConnection);

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
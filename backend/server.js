import app from "./src/app.js";
import dotenv from "dotenv";
import connectDb from "./src/config/db.js";
import { createServer } from "http";
import { Server } from "socket.io";
import handleSocketConnection, {
    authenticateSocket
} from "./src/realtime/socket.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

// Create an HTTP server using the Express app
const httpServer = createServer(app);

// Attach Socket.IO to the HTTP server
// Attach Socket.IO to the HTTP server
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
});

// Authenticate every Socket.IO connection
io.use(authenticateSocket);

// Handle authenticated Socket.IO connections
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
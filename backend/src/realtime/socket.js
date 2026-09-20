// Handles a new Socket.IO client connection
const handleSocketConnection = (socket) => {

    // Show the connected client's unique socket ID
    console.log(`Socket connected: ${socket.id}`);

    // Listen for when this client disconnects
    socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
};

export default handleSocketConnection;
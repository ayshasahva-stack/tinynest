// Store the Socket.IO server instance
let io;

// Set the Socket.IO instance
export const setIo = (socketIo) => {
    io = socketIo;
};

// Get the Socket.IO instance
export const getIo = () => {
    if (!io) {
        throw new Error("Socket.IO has not been initialized");
    }

    return io;
};
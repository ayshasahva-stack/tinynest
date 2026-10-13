
import { useEffect } from "react";
import { useSelector } from "react-redux";

import socket from "./Socket";
import {
    selectIsAuthenticated,
    selectAuthUser,
} from "../features/auth/authSelectors";

function SocketManager() {
    // Get the current authentication state and user from Redux.
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectAuthUser);

    useEffect(() => {
        // Read the JWT saved by the existing login flow.
        const token = localStorage.getItem("token");

        // Don't connect when logged out or when the token is missing.
        if (!isAuthenticated || !token) {
            socket.disconnect();
            return;
        }

        // Log successful connections and connection errors.
        const handleConnect = () => {
            console.log("TinyNest socket connected:", socket.id);
        };

        const handleConnectError = (error) => {
            console.error(
                "TinyNest socket connection error:",
                error.message
            );
        };

        // Admins receive notifications about new orders.
        const handleNewOrder = (order) => {
            console.log("New order notification:", order);
        };

        // Customers receive updates about their order status.
        const handleOrderStatusUpdated = (order) => {
            console.log("Order status updated:", order);
        };

        // Register connection and order-event listeners.
        socket.on("connect", handleConnect);
        socket.on("connect_error", handleConnectError);
        socket.on("order:new", handleNewOrder);
        socket.on("order:statusUpdated", handleOrderStatusUpdated);

        // Connect to the authenticated backend socket.
        socket.connect();

        // Remove listeners and disconnect during cleanup.
        return () => {
            socket.off("connect", handleConnect);
            socket.off("connect_error", handleConnectError);
            socket.off("order:new", handleNewOrder);
            socket.off("order:statusUpdated", handleOrderStatusUpdated);
            socket.disconnect();
        };
    }, [isAuthenticated, user]);

    // This component handles sockets without rendering visible UI.
    return null;
}

export default SocketManager;

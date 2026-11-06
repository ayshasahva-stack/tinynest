
import { useEffect } from "react";
import { useSelector } from "react-redux";

import socket from "./socket";
import {
    selectIsAuthenticated,
    selectAuthUser,
} from "../features/auth/authSelectors";

function SocketManager() {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectAuthUser);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!isAuthenticated || !token) {
            socket.disconnect();
            return;
        }

        const handleConnect = () => {
            console.log("TinyNest socket connected:", socket.id);
        };

        const handleConnectError = (error) => {
            console.error(
                "TinyNest socket connection error:",
                error.message
            );
        };

        const handleNewOrder = (order) => {
            console.log("New order notification:", order);
        };

        const handleOrderStatusUpdated = (order) => {
            console.log("Order status updated:", order);
        };

        socket.on("connect", handleConnect);
        socket.on("connect_error", handleConnectError);
        socket.on("order:new", handleNewOrder);
        socket.on("order:statusUpdated", handleOrderStatusUpdated);

        socket.connect();

        return () => {
            socket.off("connect", handleConnect);
            socket.off("connect_error", handleConnectError);
            socket.off("order:new", handleNewOrder);
            socket.off("order:statusUpdated", handleOrderStatusUpdated);
            socket.disconnect();
        };
    }, [isAuthenticated, user]);

    return null;
}

export default SocketManager;

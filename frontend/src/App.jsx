
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import AppRouter from "./app/router/AppRouter";
import { getProfileThunk } from "./features/auth/authThunk";
import {
    logout,
    setSessionChecked,
} from "./features/auth/authSlice";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        // Restore the session when a saved access token exists.
        const token = localStorage.getItem("token");

        if (token) {
            dispatch(getProfileThunk());
        } else {
            // No saved token: the initial session check is complete.
            dispatch(setSessionChecked());
        }
    }, [dispatch]);

    useEffect(() => {
        // Clear Redux authentication if automatic token refresh fails.
        const handleSessionExpired = () => {
            dispatch(logout());
        };

        window.addEventListener(
            "tinynest:session-expired",
            handleSessionExpired
        );

        return () => {
            window.removeEventListener(
                "tinynest:session-expired",
                handleSessionExpired
            );
        };
    }, [dispatch]);

    return <AppRouter />;
}

export default App;

// Import React's useEffect hook
import { useEffect } from "react";

// Import Redux's dispatch hook
import { useDispatch } from "react-redux";

// Import the application's router
import AppRouter from "./app/router/AppRouter";

// Import the profile thunk
import { getProfileThunk } from "./features/auth/authThunk";

// Main application component
function App() {
    // Get the Redux dispatch function
    const dispatch = useDispatch();

    // Restore authentication when the application starts
    useEffect(() => {
        // Check whether a JWT token exists in localStorage
        const token = localStorage.getItem("token");

        // Only request the profile when a token exists
        if (token) {
            dispatch(getProfileThunk());
        }
    }, [dispatch]);

    return <AppRouter />;
}

export default App;
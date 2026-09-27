// Import React development mode
import { StrictMode } from "react";

// Import React's function for creating the application root
import { createRoot } from "react-dom/client";

// Import Redux Provider
import { Provider } from "react-redux";

// Import the Redux store
import store from "./app/store";

// Import the Theme Provider
import { ThemeProvider } from "./app/ThemeContext";

// Import global CSS
import "./index.css";

// Import the main application component
import App from "./App.jsx";

// Find the root HTML element and render our React application
createRoot(document.getElementById("root")).render(
    <StrictMode>
        {/* ThemeProvider makes theme available throughout the app */}
        <ThemeProvider>

            {/* Redux Provider makes Redux state available throughout the app */}
            <Provider store={store}>
                <App />
            </Provider>

        </ThemeProvider>
    </StrictMode>
);
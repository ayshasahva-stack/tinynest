// Import React tools needed to create and use Context
import { createContext, useContext, useState } from "react";

// Create the Theme Context
const ThemeContext = createContext();

// Theme Provider manages the application's theme
export function ThemeProvider({ children }) {

    // Store the current theme
    const [theme, setTheme] = useState("light");

    // Toggle between light and dark themes
    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// Custom hook for accessing the Theme Context
export function useTheme() {
    return useContext(ThemeContext);
}

import { createContext, useContext, useEffect, useState } from "react";

// Share the selected theme with components throughout TinyNest.
const ThemeContext = createContext();

// Provide the theme and toggle function to the application.
export function ThemeProvider({ children }) {
    // Restore the saved theme; use light mode for a first-time visitor.
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem("tinynest-theme");

        return savedTheme === "dark" ? "dark" : "light";
    });

    useEffect(() => {
        // Tailwind's custom dark variant reads this HTML attribute.
        document.documentElement.setAttribute("data-theme", theme);

        // Remember the theme when the user refreshes the page.
        localStorage.setItem("tinynest-theme", theme);
    }, [theme]);

    // Switch between the two supported themes.
    const toggleTheme = () => {
        setTheme((currentTheme) =>
            currentTheme === "light" ? "dark" : "light"
        );
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// Custom hook used by the navbar and other themed components.
export function useTheme() {
    return useContext(ThemeContext);
}

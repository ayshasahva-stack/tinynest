// Import Vite's configuration helper
import { defineConfig } from "vite";

// Import the React plugin
import react from "@vitejs/plugin-react";

// Import Tailwind's Vite plugin
import tailwindcss from "@tailwindcss/vite";

// Export the Vite configuration
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
});
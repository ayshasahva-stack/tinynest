// Import the components required for routing
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import the pages that we want to display
import Home from "../pages/Home";
import Products from "../pages/Product";

// Main router component
function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Home page */}
                <Route path="/" element={<Home />} />

                {/* Products page */}
                <Route path="/products" element={<Products />} />

            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;
// Import the components required for routing
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import the pages
import Home from "../pages/Home";
import Products from "../pages/Product";

// Import the user layout
import UserLayout from "../layouts/UserLayout";

// Main router component
function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>

                {/* All customer pages use the UserLayout */}
                <Route element={<UserLayout />}>

                    {/* Home page */}
                    <Route path="/" element={<Home />} />

                    {/* Products page */}
                    <Route path="/products" element={<Products />} />

                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;
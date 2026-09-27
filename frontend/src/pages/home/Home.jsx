// Import React's useEffect hook
import { useEffect } from "react";

// Import Redux's dispatch hook
import { useDispatch } from "react-redux";

// Import the product fetching thunk
import { fetchProducts } from "../../features/products/ProductThunk";

// Import the Home page sections
import HeroSection from "./components/HeroSection";
import CategoriesSection from "./components/CategoriesSection";
import FeaturedProducts from "./components/FeaturedProducts";
import PromoSection from "./components/PromoSection";

// Home page component
function Home() {
    // Get the Redux dispatch function
    const dispatch = useDispatch();

    // Fetch products when the Home page loads
    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    return (
        <main>
            {/* Hero section */}
            <HeroSection />

            {/* Categories section */}
            <CategoriesSection />

            {/* Featured products section */}
            <FeaturedProducts />

            {/* Promotional section */}
            <PromoSection />
        </main>
    );
}

export default Home;
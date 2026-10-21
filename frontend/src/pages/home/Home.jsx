// Import React's useEffect hook
import { useEffect } from "react";

// Import Redux's dispatch hook
import { useDispatch } from "react-redux";

// Import the product fetching thunk
import { fetchProducts } from "../../features/products/productThunk";

// Import the Home page sections
import HeroSection from "./components/HeroSection";
import CategoriesSection from "./components/CategoriesSection";
import FeaturedProducts from "./components/FeaturedProducts";
import BabyKitSection from "./components/BabyKitSection";
import NewArrivalsSection from "./components/NewArrivalsSection";
import BenefitsSection from "./components/BenefitsSection";

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
            {/* Baby essentials kits section */}
            <BabyKitSection />

            <NewArrivalsSection />
            <BenefitsSection />

        </main>
    );
}

export default Home;
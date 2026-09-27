// Import the Hero section
import HeroSection from "./components/HeroSection";
import CategoriesSection from "./components/CategoriesSection";
import FeaturedProducts from "./components/FeaturedProducts";
import PromoSection from "./components/PromoSection";

// Home page component
function Home() {
    return (
        <main>
            {/* Hero section */}
            <HeroSection />
            <CategoriesSection/>
            <FeaturedProducts/>
            <PromoSection/>
        </main>
    );
}

export default Home;
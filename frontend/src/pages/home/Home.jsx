// Import the Hero section
import HeroSection from "./HeroSection";
import CategoriesSection from "./CategoriesSection";
import FeaturedProducts from "./FeaturedProduct";

// Home page component
function Home() {
    return (
        <main>
            {/* Hero section */}
            <HeroSection />
            <CategoriesSection/>
            <FeaturedProducts/>
        </main>
    );
}

export default Home;
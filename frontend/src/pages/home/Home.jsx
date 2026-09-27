// Import the Hero section
import HeroSection from "./HeroSection";
import CategoriesSection from "./CategoriesSection";

// Home page component
function Home() {
    return (
        <main>
            {/* Hero section */}
            <HeroSection />
            <CategoriesSection/>
        </main>
    );
}

export default Home;
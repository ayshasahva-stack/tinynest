import { useEffect } from "react";

import { useDispatch } from "react-redux";

import { fetchProducts } from "../../features/products/productThunk";

import HeroSection from "./components/HeroSection";
import CategoriesSection from "./components/CategoriesSection";
import FeaturedProducts from "./components/FeaturedProducts";
import BabyKitSection from "./components/BabyKitSection";
import NewArrivalsSection from "./components/NewArrivalsSection";
import BenefitsSection from "./components/BenefitsSection";

function Home() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    return (
        <main>
            <HeroSection />

            <CategoriesSection />

            <FeaturedProducts />

            <BabyKitSection />

            <NewArrivalsSection />
            
            <BenefitsSection />

        </main>
    );
}

export default Home;

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Reset the page scroll whenever the URL path changes.
function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Start the new page at the top.
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant",
        });
    }, [pathname]);

    // This component handles scrolling only, so it renders nothing.
    return null;
}

export default ScrollToTop;

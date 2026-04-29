import { useState, useEffect } from 'react';

export const useResponsive = () => {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        
        // Initial check
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return {
        width,
        isMobile: width <= 768,
        isTablet: width > 768 && width <= 900,
        isDesktop: width > 900,
    };
};

import React, { useState, useEffect } from 'react';

interface FooterProps {
    t: any;
}

const Footer: React.FC<FooterProps> = ({ t }) => {
    const [visitorCount, setVisitorCount] = useState<number>(0);

    useEffect(() => {
        // This effect runs only once after the component mounts
        let count = parseInt(localStorage.getItem('visitorCount') || '0', 10);
        
        if (count === 0) {
            // First time visit on this browser, initialize with a random base between 0 and 999
            count = Math.floor(Math.random() * 1000);
        }
        
        count += 1; // Increment for the current visit
        
        localStorage.setItem('visitorCount', count.toString());
        setVisitorCount(count);
    }, []); // Empty dependency array ensures it runs only once

    return (
        <footer className="w-full text-center py-6 mt-8 text-sm opacity-60">
            {/* Don't render until count is initialized to avoid flash of 0 */}
            {visitorCount > 0 && <p>{t.visitors}: {visitorCount.toLocaleString()}</p>}
            <p>{t.copyright}</p>
        </footer>
    );
};

export default Footer;
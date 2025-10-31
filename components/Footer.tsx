import React, { useState } from 'react';

interface FooterProps {
    t: any;
}

const Footer: React.FC<FooterProps> = ({ t }) => {
    const [visitorCount] = useState(Math.floor(Math.random() * 900000) + 100000);
    return (
        <footer className="w-full text-center py-6 mt-8 text-sm opacity-60">
            <p>{t.visitors}: {visitorCount.toLocaleString()}</p>
            <p>{t.copyright}</p>
        </footer>
    );
};

export default Footer;

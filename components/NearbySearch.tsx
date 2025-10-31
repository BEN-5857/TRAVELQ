import React, { useState, useEffect, useMemo } from 'react';
import ResultCard from './ResultCard';
import { MapPinIcon } from './Icons';

interface NearbySearchProps {
    t: any;
}

const NearbySearch: React.FC<NearbySearchProps> = ({ t }) => {
    const categories = useMemo(() => ({
        [t.restaurants]: t.subCategories.restaurants,
        [t.attractions]: t.subCategories.attractions,
        [t.cafes]: t.subCategories.cafes,
        [t.shops]: t.subCategories.shops,
        [t.gasStations]: [],
        [t.publicRestrooms]: []
    }), [t]);

    const [mainCategory, setMainCategory] = useState(t.restaurants);
    const [subCategory, setSubCategory] = useState(categories[t.restaurants]?.[0] || '');
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            (err) => { console.error(err); setError(t.errorLocation); }
        );
    }, [t.errorLocation]);

    useEffect(() => {
        const newMainCategory = t.restaurants;
        setMainCategory(newMainCategory);
        const newSubCategories = categories[newMainCategory] || [];
        setSubCategory(newSubCategories.length > 0 ? newSubCategories[0] : '');
    }, [t, categories]);

    const handleMainCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newMainCategory = e.target.value;
        setMainCategory(newMainCategory);
        const newSubCategories = categories[newMainCategory] || [];
        setSubCategory(newSubCategories.length > 0 ? newSubCategories[0] : '');
    };

    const handleSearch = () => {
        if (!location) { 
            setError(t.errorLocation); 
            return; 
        }
        setError('');
        const query = subCategory ? `${subCategory} ${mainCategory}` : mainCategory;
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}&ll=${location.lat},${location.lng}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <ResultCard title={t.nearbyHotspots} icon={<MapPinIcon />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">{t.lookingFor}</label>
                    <select value={mainCategory} onChange={handleMainCategoryChange} className="input-primary">
                        {Object.keys(categories).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">&nbsp;</label>
                    <select value={subCategory} onChange={e => setSubCategory(e.target.value)} className="input-primary" disabled={categories[mainCategory]?.length === 0}>
                        {categories[mainCategory]?.length === 0 ? <option value="">--</option> : null}
                        {categories[mainCategory]?.map(sc => <option key={sc} value={sc}>{sc}</option>)}
                    </select>
                </div>
            </div>
            <button onClick={handleSearch} disabled={!location} className="button-primary w-full mt-4 flex items-center justify-center gap-2">
                {t.search}
            </button>
            {error && <p className="mt-4 text-red-400 text-center" aria-live="polite">{error}</p>}
        </ResultCard>
    );
};

export default NearbySearch;
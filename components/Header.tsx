import React, { useState } from 'react';
import { PaletteIcon } from './Icons';

interface Theme {
    name: string;
    class: string;
    bg: string;
    text: string;
}

interface HeaderProps {
    lang: string;
    setLang: (l: string) => void;
    setTheme: (t: string) => void;
    t: any;
    themes: Theme[];
}

const Header: React.FC<HeaderProps> = ({ lang, setLang, setTheme, t, themes }) => {
    const [showThemeMenu, setShowThemeMenu] = useState(false);

    return (
        <header className="w-full max-w-5xl mx-auto p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">
                {t.title}
            </h1>
            <div className="flex items-center gap-4">
                <div className="text-sm font-medium">
                    {['tw', 'en', 'jp'].map(l => (
                        <button key={l} onClick={() => setLang(l)} className={`px-2 py-1 transition ${lang === l ? 'text-cyan-400 scale-110' : 'opacity-60'}`}>
                            {l.toUpperCase()}
                        </button>
                    ))}
                </div>
                <div className="relative">
                    <button onClick={() => setShowThemeMenu(!showThemeMenu)} aria-label={t.selectTheme}>
                        <PaletteIcon />
                    </button>
                    {showThemeMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-xl p-2 z-10">
                            {themes.map(th => (
                                <button key={th.name} onClick={() => { setTheme(th.class); setShowThemeMenu(false); }}
                                    className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-white/20 transition flex items-center gap-2">
                                    <span className={`w-4 h-4 rounded-full ${th.bg} border border-white/20`}></span>
                                    <span className="text-white/80">{th.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;

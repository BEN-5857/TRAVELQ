import React, { useState, useEffect, useMemo } from 'react';
import { findNearbyPlaces } from './services/geminiService';

// --- 元件定義 (直接整合以避免 build errors) ---

const Spinner: React.FC = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const PaletteIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
  </svg>
);

const CameraIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const MapPinIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const CurrencyExchangeIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
);

interface ResultCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const ResultCard: React.FC<ResultCardProps> = ({ title, icon, children }) => (
  <div className="w-full card backdrop-blur-lg rounded-2xl shadow-2xl p-6 animate-fade-in">
    <div className="flex items-center gap-3 mb-4">
      <div className="text-cyan-400">{icon}</div>
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
    <div>{children}</div>
  </div>
);

declare global {
  interface Window { adsbygoogle?: { [key: string]: unknown }[]; }
}

const AdsenseBanner: React.FC = () => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[70px] flex justify-center items-center bg-[var(--card-bg)] backdrop-blur-md border-t border-[var(--border-color)] z-50">
      <div className="w-full max-w-lg h-[50px] text-center">
        <ins className="adsbygoogle"
             style={{ display: 'block', width: '100%', height: '50px' }}
             data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // 您的發布商 ID
             data-ad-slot="YYYYYYYYYY"             // 您的廣告單元 ID
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>
    </div>
  );
};


// --- 多語言翻譯資源 ---
const translations = {
  tw: {
    title: '旅行快查',
    currencyConverter: '快速幣值轉換',
    localPrice: '當地價格',
    sourceCurrency: '來源幣別',
    targetCurrency: '目標幣別',
    taxRefundRate: '退稅率 (%)',
    finalPrice: '最終價格',
    snapshotPriceCheck: '快照查詢價格',
    nearbyHotspots: '附近熱點查詢',
    lookingFor: '我想找',
    search: '查詢',
    copyright: '@2025 Made By 旅幫',
    visitors: '使用人次',
    selectTheme: '選擇主題',
    errorLocation: '無法獲取位置資訊，請檢查權限。',
    errorGeneric: '發生錯誤，請稍後再試。',
    restaurants: '餐廳',
    attractions: '景點',
    cafes: '咖啡廳和飲料',
    shops: '商店',
    gasStations: '加油站',
    publicRestrooms: '公共廁所',
    subCategories: {
      restaurants: ['拉麵', '火鍋', '麵食', '飯食', '義大利麵', '異國料理'],
      attractions: ['公園', '博物館', '百貨公司', '展覽館', '古蹟', '遊樂場'],
      cafes: ['咖啡廳', '冰店', '酒吧', '夜店'],
      shops: ['便利商店', '五金行', '百元商店', '雜貨店', '菸酒行', '自動販賣機'],
    }
  },
  en: {
    title: 'Travel Quick Check',
    currencyConverter: 'Currency Converter',
    localPrice: 'Local Price',
    sourceCurrency: 'Source Currency',
    targetCurrency: 'Target Currency',
    taxRefundRate: 'Tax Refund Rate (%)',
    finalPrice: 'Final Price',
    snapshotPriceCheck: 'Snapshot Price Check',
    nearbyHotspots: 'Nearby Hotspots',
    lookingFor: 'I\'m looking for',
    search: 'Search',
    copyright: '@2025 Made By Travel-Helper',
    visitors: 'Visitors',
    selectTheme: 'Select Theme',
    errorLocation: 'Could not get location. Please check permissions.',
    errorGeneric: 'An error occurred. Please try again later.',
    restaurants: 'Restaurants',
    attractions: 'Attractions',
    cafes: 'Cafes & Drinks',
    shops: 'Shops',
    gasStations: 'Gas Stations',
    publicRestrooms: 'Public Restrooms',
    subCategories: {
      restaurants: ['Ramen', 'Hot Pot', 'Noodles', 'Rice Dishes', 'Italian', 'International Cuisine'],
      attractions: ['Park', 'Museum', 'Department Store', 'Exhibition Hall', 'Historic Site', 'Amusement Park'],
      cafes: ['Cafe', 'Ice Cream Shop', 'Bar', 'Nightclub'],
      shops: ['Convenience Store', 'Hardware Store', 'Dollar Store', 'General Store', 'Liquor Store', 'Vending Machine'],
    }
  },
  jp: {
    title: '旅行クイックチェック',
    currencyConverter: 'クイック通貨換算',
    localPrice: '現地価格',
    sourceCurrency: '元通貨',
    targetCurrency: '換算通貨',
    taxRefundRate: '免税率 (%)',
    finalPrice: '最終価格',
    snapshotPriceCheck: 'スナップショット価格検索',
    nearbyHotspots: '近くのホットスポット検索',
    lookingFor: '探している場所',
    search: '検索',
    copyright: '@2025 Made By 旅幫',
    visitors: '利用者数',
    selectTheme: 'テーマを選択',
    errorLocation: '位置情報を取得できません。権限を確認してください。',
    errorGeneric: 'エラーが発生しました。後でもう一度お試しください。',
    restaurants: 'レストラン',
    attractions: '観光スポット',
    cafes: 'カフェ＆ドリンク',
    shops: 'ショップ',
    gasStations: 'ガソリンスタンド',
    publicRestrooms: '公衆トイレ',
    subCategories: {
      restaurants: ['ラーメン', '鍋', '麺類', 'ご飯もの', 'イタリアン', '各国料理'],
      attractions: ['公園', '博物館', 'デパート', '展示館', '史跡', '遊園地'],
      cafes: ['カフェ', 'アイス店', 'バー', 'ナイトクラブ'],
      shops: ['コンビニ', '金物店', '100円ショップ', '雑貨店', '酒屋', '自動販売機'],
    }
  }
};

// --- 佈景主題定義 ---
const themes = [
    { name: 'Dark', class: 'theme-dark', bg: 'bg-gray-900', text: 'text-white' },
    { name: 'Light', class: 'theme-light', bg: 'bg-gray-100', text: 'text-black' },
    { name: 'Morandi Blue', class: 'theme-morandi-blue', bg: 'bg-blue-100', text: 'text-gray-800' },
    { name: 'Morandi Green', class: 'theme-morandi-green', bg: 'bg-green-100', text: 'text-gray-800' },
    { name: 'Morandi Pink', class: 'theme-morandi-pink', bg: 'bg-pink-100', text: 'text-gray-800' },
    { name: 'Morandi Gray', class: 'theme-morandi-gray', bg: 'bg-gray-200', text: 'text-gray-800' },
];

const currencies = ['TWD', 'JPY', 'USD', 'KRW', 'CNY', 'THB', 'IDR'];
const exchangeRates: { [key: string]: number } = {
  'TWD': 1, 'JPY': 4.6, 'USD': 0.031, 'KRW': 42.8, 'CNY': 0.22, 'THB': 1.14, 'IDR': 507,
};

// --- App Sub-Components ---

const Header: React.FC<{ lang: string, setLang: (l: string) => void; setTheme: (t: string) => void; t: any }> = 
  ({ lang, setLang, setTheme, t }) => {
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

const CurrencyConverter: React.FC<{ t: any }> = ({ t }) => {
    const [amount, setAmount] = useState('');
    const [fromCurrency, setFromCurrency] = useState('JPY');
    const [toCurrency, setToCurrency] = useState('TWD');
    const [tax, setTax] = useState('');
    const [result, setResult] = useState<number | null>(null);

    useEffect(() => {
        const fromRate = exchangeRates[fromCurrency];
        const toRate = exchangeRates[toCurrency];
        const numAmount = parseFloat(amount);
        if (!isNaN(numAmount) && fromRate && toRate) {
            const baseConversion = (numAmount / fromRate) * toRate;
            const taxRate = parseFloat(tax);
            const final = !isNaN(taxRate) ? baseConversion * (1 - taxRate / 100) : baseConversion;
            setResult(final);
        } else {
            setResult(null);
        }
    }, [amount, fromCurrency, toCurrency, tax]);
    
    return (
        <ResultCard title={t.currencyConverter} icon={<CurrencyExchangeIcon />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">{t.localPrice}</label>
                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="1000" className="input-primary" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">{t.taxRefundRate}</label>
                    <input type="number" value={tax} onChange={e => setTax(e.target.value)} placeholder="10" className="input-primary" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">{t.sourceCurrency}</label>
                    <select value={fromCurrency} onChange={e => setFromCurrency(e.target.value)} className="input-primary">
                        {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">{t.targetCurrency}</label>
                    <select value={toCurrency} onChange={e => setToCurrency(e.target.value)} className="input-primary">
                        {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>
            {result !== null && (
                <div className="mt-4 p-4 bg-black/20 rounded-lg text-center">
                    <span className="text-lg font-medium opacity-80">{t.finalPrice}: </span>
                    <span className="text-2xl font-bold text-cyan-400">{result.toFixed(2)} {toCurrency}</span>
                </div>
            )}
            <a href="https://images.google.com/" target="_blank" rel="noopener noreferrer" className="button-secondary w-full mt-4 flex items-center justify-center gap-2 text-center">
                <CameraIcon /> {t.snapshotPriceCheck}
            </a>
        </ResultCard>
    );
};

const NearbySearch: React.FC<{ t: any }> = ({ t }) => {
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
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<{text: string, chunks: any[]}>({text: '', chunks: []});
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

    const handleSearch = async () => {
        if (!location) { setError(t.errorLocation); return; }
        setIsLoading(true);
        setError('');
        setResults({text: '', chunks: []});
        try {
            const query = `${subCategory} ${mainCategory}`;
            const res = await findNearbyPlaces(query, { latitude: location.lat, longitude: location.lng });
            setResults({text: res.text, chunks: res.candidates?.[0]?.groundingMetadata?.groundingChunks || []});
        } catch (err) {
            console.error(err);
            setError(t.errorGeneric);
        } finally {
            setIsLoading(false);
        }
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
            <button onClick={handleSearch} disabled={isLoading || !location} className="button-primary w-full mt-4 flex items-center justify-center gap-2">
                {isLoading ? <><Spinner />{t.search}...</> : t.search}
            </button>
            {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
            <div className="mt-6 space-y-4">
              {results.chunks.map((chunk, index) => (
                <a href={chunk.maps.uri} target="_blank" rel="noopener noreferrer" key={index} 
                  className="block p-4 bg-black/20 rounded-lg hover:bg-black/30 transition">
                  <h3 className="font-bold text-cyan-400">{chunk.maps.title}</h3>
                  {chunk.maps.placeAnswerSources?.reviewSnippets?.[0] && (
                    <p className="text-sm opacity-80 mt-1 italic">"{chunk.maps.placeAnswerSources.reviewSnippets[0]}"</p>
                  )}
                </a>
              ))}
            </div>
        </ResultCard>
    );
};

const Footer: React.FC<{ t: any }> = ({ t }) => {
    const [visitorCount] = useState(Math.floor(Math.random() * 900000) + 100000);
    return (
        <footer className="w-full text-center py-6 mt-8 text-sm opacity-60 pb-24"> {/* Added padding-bottom */}
            <p>{t.visitors}: {visitorCount.toLocaleString()}</p>
            <p>{t.copyright}</p>
        </footer>
    );
};

// --- 主應用程式組件 ---
const App: React.FC = () => {
    const [lang, setLang] = useState('tw');
    const [theme, setTheme] = useState('theme-dark');
    const t = useMemo(() => translations[lang], [lang]);

    return (
        <div className={`min-h-screen w-full font-sans transition-colors duration-500 ${theme}`}>
            <div className="theme-bg text-color min-h-screen">
                <Header lang={lang} setLang={setLang} setTheme={setTheme} t={t} />
                <main className="container mx-auto p-4 flex flex-col items-center gap-8">
                    <div className="w-full max-w-2xl">
                        <CurrencyConverter t={t} />
                    </div>
                    <div className="w-full max-w-2xl">
                        <NearbySearch t={t} />
                    </div>
                </main>
                <Footer t={t} />
                <AdsenseBanner />
                <style>{`
                    .theme-dark { --bg-color: #111827; --text-color: #e5e7eb; --card-bg: rgba(255,255,255,0.05); --input-bg: rgba(255,255,255,0.1); --border-color: rgba(255,255,255,0.1); }
                    .theme-light { --bg-color: #f3f4f6; --text-color: #1f2937; --card-bg: rgba(255,255,255,0.8); --input-bg: #e5e7eb; --border-color: #d1d5db; }
                    .theme-morandi-blue { --bg-color: #e0f2fe; --text-color: #0c4a6e; --card-bg: rgba(255,255,255,0.6); --input-bg: #bae6fd; --border-color: #7dd3fc; }
                    .theme-morandi-green { --bg-color: #f0fdf4; --text-color: #14532d; --card-bg: rgba(255,255,255,0.6); --input-bg: #dcfce7; --border-color: #bbf7d0; }
                    .theme-morandi-pink { --bg-color: #fdf2f8; --text-color: #831843; --card-bg: rgba(255,255,255,0.6); --input-bg: #fce7f3; --border-color: #fbcfe8; }
                    .theme-morandi-gray { --bg-color: #e5e7eb; --text-color: #374151; --card-bg: rgba(255,255,255,0.6); --input-bg: #d1d5db; --border-color: #9ca3af; }

                    .theme-bg { background-color: var(--bg-color); }
                    .text-color { color: var(--text-color); }
                    .card { background-color: var(--card-bg); border: 1px solid var(--border-color); }
                    .input-primary { background-color: var(--bg-color); border: 1px solid var(--border-color); color: var(--text-color); width: 100%; padding: 0.75rem; border-radius: 0.5rem; transition: all 0.2s; -webkit-appearance: none; appearance: none; }
                    .input-primary:focus { outline: 2px solid #22d3ee; border-color: #22d3ee; }
                    select.input-primary { background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e"); background-position: right 0.5rem center; background-repeat: no-repeat; background-size: 1.5em 1.5em; padding-right: 2.5rem; }
                    .button-primary { padding: 0.75rem 1rem; background-color: #0891b2; color: white; border-radius: 0.5rem; font-weight: 600; transition: all 0.2s; border: none; }
                    .button-primary:hover:not(:disabled) { background-color: #06b6d4; }
                    .button-primary:disabled { background-color: #475569; cursor: not-allowed; }
                    .button-secondary { padding: 0.75rem 1rem; background-color: rgba(14, 165, 233, 0.2); color: #22d3ee; border-radius: 0.5rem; font-weight: 600; transition: all 0.2s; border: 1px solid #0e7490; }
                    .button-secondary:hover { background-color: rgba(14, 165, 233, 0.3); border-color: #06b6d4;}
                    @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                    .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
                `}</style>
            </div>
        </div>
    );
};

export default App;
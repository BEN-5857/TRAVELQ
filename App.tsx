import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { PaletteIcon, CameraIcon, MapPinIcon, CurrencyExchangeIcon, CloseIcon } from './components/Icons.tsx';
import { ResultCard } from './components/MarkdownRenderer.tsx';

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
    adPlaceholder: '旅遊類廣告橫幅區域',
    selectTheme: '選擇主題',
    capture: '拍攝',
    analyzing: '分析中...',
    analysisResult: '分析結果:',
    errorLocation: '無法獲取位置資訊，請檢查權限。',
    errorCamera: '無法啟動相機，請檢查權限。',
    errorGeneric: '發生錯誤，請稍後再試。',
    errorApiKey: 'API 金鑰無效或權限不足，請重新選擇。',
    apiKeyNeeded: '此功能需要有效的 Gemini API 金鑰才能使用地圖查詢服務。',
    selectApiKey: '選擇 API 金鑰',
    billingInfo: '了解計費方式',
    loadingRates: '正在載入最新匯率...',
    ratesUpdated: '匯率更新時間:',
    ratesFallback: '無法載入即時匯率，使用預設值',
    // 地點類別
    restaurants: '餐廳',
    attractions: '景點',
    cafes: '咖啡廳和飲料',
    shops: '商店',
    gasStations: '加油站',
    publicRestrooms: '公共廁所',
    // 地點子類別
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
    adPlaceholder: 'Travel Ad Banner Area',
    selectTheme: 'Select Theme',
    capture: 'Capture',
    analyzing: 'Analyzing...',
    analysisResult: 'Analysis Result:',
    errorLocation: 'Could not get location. Please check permissions.',
    errorCamera: 'Could not start camera. Please check permissions.',
    errorGeneric: 'An error occurred. Please try again later.',
    errorApiKey: 'Invalid API key or insufficient permissions. Please select again.',
    apiKeyNeeded: 'This feature requires a valid Gemini API key to use the map search service.',
    selectApiKey: 'Select API Key',
    billingInfo: 'Learn about billing',
    loadingRates: 'Loading latest rates...',
    ratesUpdated: 'Rates updated:',
    ratesFallback: 'Could not load live rates, using defaults.',
    // Categories
    restaurants: 'Restaurants',
    attractions: 'Attractions',
    cafes: 'Cafes & Drinks',
    shops: 'Shops',
    gasStations: 'Gas Stations',
    publicRestrooms: 'Public Restrooms',
    // Sub-categories
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
    adPlaceholder: '旅行関連広告バナーエリア',
    selectTheme: 'テーマを選択',
    capture: '撮影',
    analyzing: '分析中...',
    analysisResult: '分析結果:',
    errorLocation: '位置情報を取得できません。権限を確認してください。',
    errorCamera: 'カメラを起動できません。権限を確認してください。',
    errorGeneric: 'エラーが発生しました。後でもう一度お試しください。',
    errorApiKey: 'APIキーが無効か、権限が不足しています。もう一度選択してください。',
    apiKeyNeeded: 'この機能には、マップ検索サービスを使用するための有効なGemini APIキーが必要です。',
    selectApiKey: 'APIキーを選択',
    billingInfo: '課金について',
    loadingRates: '最新為替レートを読み込み中...',
    ratesUpdated: '為替レート更新日時:',
    ratesFallback: 'ライブレートを読み込めませんでした。デフォルト値を使用しています。',
    // Categories
    restaurants: 'レストラン',
    attractions: '観光スポット',
    cafes: 'カフェ＆ドリンク',
    shops: 'ショップ',
    gasStations: 'ガソリンスタンド',
    publicRestrooms: '公衆トイレ',
    // Sub-categories
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
// 模擬匯率，作為無法獲取即時匯率時的備用
const exchangeRates: { [key: string]: number } = {
  'TWD': 1, 'JPY': 4.6, 'USD': 0.031, 'KRW': 42.8, 'CNY': 0.22, 'THB': 1.14, 'IDR': 507,
};

// --- 元件定義 ---

const Header: React.FC<{ lang: string, setLang: (l: string) => void, theme: string, setTheme: (t: string) => void, t: any }> = 
  ({ lang, setLang, theme, setTheme, t }) => {
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
    const [liveRates, setLiveRates] = useState<{ [key: string]: number } | null>(null);
    const [ratesDate, setRatesDate] = useState<string | null>(null);
    const [isLoadingRates, setIsLoadingRates] = useState(true);

    // 在元件載入時獲取即時匯率
    useEffect(() => {
        const fetchRates = async () => {
            setIsLoadingRates(true);
            try {
                // 使用 TWD 作為基礎貨幣進行換算
                const response = await fetch('https://open.er-api.com/v6/latest/TWD');
                if (!response.ok) throw new Error('Network response was not ok');
                
                const data = await response.json();
                if (data.result === 'success' && data.rates) {
                    setLiveRates(data.rates);
                    setRatesDate(data.time_last_update_utc);
                } else {
                    // API 回應錯誤，將退回使用模擬匯率
                    setLiveRates(null);
                }
            } catch (error) {
                console.error("無法獲取匯率，使用備用匯率。", error);
                // 發生錯誤，將退回使用模擬匯率
                setLiveRates(null); 
            } finally {
                setIsLoadingRates(false);
            }
        };

        fetchRates();
    }, []);

    useEffect(() => {
        // 如果有即時匯率則使用，否則退回使用預設的匯率
        const ratesToUse = liveRates || exchangeRates;
        
        const fromRate = ratesToUse[fromCurrency];
        const toRate = ratesToUse[toCurrency];
        const numAmount = parseFloat(amount);

        if (!isNaN(numAmount) && fromRate && toRate) {
            // 匯率皆以基礎貨幣 (TWD) 為單位
            // 計算方式: (來源金額 / 來源貨幣對TWD匯率) * 目標貨幣對TWD匯率
            const baseConversion = (numAmount / fromRate) * toRate;
            const taxRate = parseFloat(tax);
            const final = !isNaN(taxRate) ? baseConversion * (1 - taxRate / 100) : baseConversion;
            setResult(final);
        } else {
            setResult(null);
        }
    }, [amount, fromCurrency, toCurrency, tax, liveRates]);
    
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
            <div className="text-center text-xs opacity-50 mt-2 h-4">
                {isLoadingRates ? (
                    t.loadingRates
                ) : liveRates && ratesDate ? (
                    `${t.ratesUpdated} ${new Date(ratesDate).toLocaleDateString()}`
                ) : (
                    t.ratesFallback
                )}
            </div>
            <a 
                href="https://images.google.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="button-secondary w-full mt-2 flex items-center justify-center gap-2 text-center"
            >
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
    const [locationError, setLocationError] = useState('');

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                setLocationError('');
            },
            (err) => {
                console.error(err);
                setLocationError(t.errorLocation);
            }
        );
    }, [t.errorLocation]);

    // 當語言改變時，重設類別選擇
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
            // 錯誤訊息已由 locationError 狀態顯示
            return;
        }
        
        const query = encodeURIComponent(subCategory ? `${subCategory} ${mainCategory}` : mainCategory);
        const url = `https://www.google.com/maps/search/?api=1&query=${query}&ll=${location.lat},${location.lng}`;
        
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
            
            {locationError && <p className="mt-4 text-red-400 text-center">{locationError}</p>}
        </ResultCard>
    );
};

const Footer: React.FC<{ t: any }> = ({ t }) => {
    const [visitorCount] = useState(Math.floor(Math.random() * 900000) + 100000);
    return (
        <footer className="w-full text-center py-6 mt-8 text-sm opacity-60">
            <p>{t.visitors}: {visitorCount.toLocaleString()}</p>
            <p>{t.copyright}</p>
            <div className="mt-4 max-w-lg mx-auto p-4 border-2 border-dashed border-white/30 rounded-lg">
                {t.adPlaceholder}
            </div>
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
                <Header lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} t={t} />
                <main className="container mx-auto p-4 flex flex-col items-center gap-8">
                    <div className="w-full max-w-2xl">
                        <CurrencyConverter t={t} />
                    </div>
                    <div className="w-full max-w-2xl">
                        <NearbySearch t={t} />
                    </div>
                </main>
                <Footer t={t} />
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
                    .input-primary:focus { ring: 2px; ring-color: #22d3ee; border-color: #22d3ee; }
                    .button-primary { padding: 0.75rem 1rem; background-color: #0891b2; color: white; border-radius: 0.5rem; font-weight: 600; transition: all 0.2s; border: none; }
                    .button-primary:hover:not(:disabled) { background-color: #06b6d4; }
                    .button-primary:disabled { background-color: #475569; cursor: not-allowed; }
                    .button-secondary { padding: 0.75rem 1rem; background-color: rgba(14, 165, 233, 0.2); color: #22d3ee; border-radius: 0.5rem; font-weight: 600; transition: all 0.2s; border: 1px solid #0e7490; }
                    .button-secondary:hover { background-color: rgba(14, 165, 233, 0.3); border-color: #06b6d4;}
                `}</style>
            </div>
        </div>
    );
};

export default App;
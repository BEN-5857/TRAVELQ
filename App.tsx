import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import CurrencyConverter from './components/CurrencyConverter';
import NearbySearch from './components/NearbySearch';
import Footer from './components/Footer';
import AdsenseBanner from './components/AdsenseBanner';

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
    },
    updatingRates: '匯率更新中...',
    ratesUpdateError: '無法獲取最新匯率，使用備用資料。',
    ratesLastUpdated: '匯率更新於',
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
    },
    updatingRates: 'Updating rates...',
    ratesUpdateError: 'Could not fetch latest rates. Using fallback data.',
    ratesLastUpdated: 'Rates updated on',
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
    },
    updatingRates: '為替レートを更新中...',
    ratesUpdateError: '最新の為替レートを取得できませんでした。代替データを使用しています。',
    ratesLastUpdated: '為替レート更新日',
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

// --- 主應用程式組件 ---
const App: React.FC = () => {
    const [lang, setLang] = useState('tw');
    const [theme, setTheme] = useState('theme-dark');
    const t = useMemo(() => translations[lang], [lang]);

    return (
        <div className={`min-h-screen w-full font-sans transition-colors duration-500 ${theme}`}>
            <div className="theme-bg text-color min-h-screen">
                <Header lang={lang} setLang={setLang} setTheme={setTheme} t={t} themes={themes} />
                <main className="container mx-auto p-4 pb-24 flex flex-col items-center gap-8">
                    <div className="w-full max-w-2xl">
                        <CurrencyConverter t={t} />
                    </div>
                    <div className="w-full max-w-2xl">
                        <NearbySearch t={t} />
                    </div>
                    <Footer t={t} />
                </main>
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
                    select.input-primary { background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e"); background-position: right 0.5rem center; background-repeat: no-repeat; background-size: 1.5em 1.5em; padding-right: 2.5rem; }
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
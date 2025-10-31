import React, { useEffect } from 'react';

// 定義 window 物件上的 adsbygoogle 屬性
declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

const AdsenseBanner: React.FC = () => {
  useEffect(() => {
    try {
      // 初始化廣告
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('Adsense error:', e);
    }
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full h-[60px] flex justify-center items-center bg-gray-900/50 backdrop-blur-sm z-50">
      <ins
        className="adsbygoogle"
        style={{ 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          width: '100%', 
          maxWidth: '728px', 
          height: '50px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          color: 'rgba(255, 255, 255, 0.4)',
          fontSize: '0.875rem'
        }}
        data-ad-client="ca-pub-3043955817472909"
        data-ad-slot="8594833592"
        data-ad-format="auto"
        data-full-width-responsive="true"
      >
        {/* 
          此文字為開發預覽用的佔位符。
          在您的正式網站上，Google AdSense 腳本會自動將其替換為真實廣告。
        */}
        廣告預覽版位 (Ad Preview)
      </ins>
    </div>
  );
};

export default AdsenseBanner;
import React, { useEffect } from 'react';

// 定義 window 物件上的 adsbygoogle 屬性
declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

const InArticleAd: React.FC = () => {
  useEffect(() => {
    try {
      // 初始化廣告
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('Adsense error:', e);
    }
  }, []);

  return (
    // 這是一個容器，將廣告作為一個內容區塊放置在頁面流中
    <div className="w-full max-w-2xl my-4">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', textAlign: 'center' }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-3043955817472909"
        data-ad-slot="1570383953"
      ></ins>
    </div>
  );
};

export default InArticleAd;

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// 將 ai client 的初始化延遲，避免在 build time 就因找不到 API_KEY 而報錯
let ai: GoogleGenAI | null = null;

/**
 * 獲取 Gemini AI 客戶端實例。
 * 如果尚未初始化，則使用環境變數中的 API 金鑰進行初始化。
 * 這種模式稱為「延遲初始化」(Lazy Initialization)。
 */
function getAiClient(): GoogleGenAI {
    if (!ai) {
        // Fix: Use process.env.API_KEY as per the coding guidelines to resolve the TypeScript error.
        const API_KEY = process.env.API_KEY;
        if (!API_KEY) {
            // 這個錯誤現在只會在函數被調用且環境變數未設定時拋出
            console.error("API_KEY environment variable is not set.");
            throw new Error("API_KEY environment variable is not set.");
        }
        ai = new GoogleGenAI({ apiKey: API_KEY });
    }
    return ai;
}

export async function findNearbyPlaces(query: string, location: { latitude: number, longitude: number }): Promise<GenerateContentResponse> {
  try {
    const client = getAiClient(); // 在實際需要時才獲取 client
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find ${query} near me.`,
      config: {
        tools: [{googleMaps: {}}],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: location.latitude,
              longitude: location.longitude,
            }
          }
        }
      },
    });
    
    return response;
  } catch (error) {
    console.error("Gemini API 請求失敗 (findNearbyPlaces):", error);
    throw new Error("與 Gemini API 通信時發生錯誤。");
  }
}

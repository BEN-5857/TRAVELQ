import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// 延遲 AI 客戶端初始化，以避免在缺少 API_KEY 的情況下於建置時出錯。
let ai: GoogleGenAI | null = null;

/**
 * 獲取 Gemini AI 客戶端實例。
 * 如果尚未初始化，它將使用環境變數中的 API 金鑰進行初始化。
 */
function getAiClient(): GoogleGenAI {
    if (!ai) {
        // FIX: The API key must be obtained exclusively from `process.env.API_KEY`.
        // This also resolves the TypeScript error "Property 'env' does not exist on type 'ImportMeta'".
        const apiKey = process.env.API_KEY;

        if (!apiKey) {
            // 此錯誤訊息將顯示在使用者的瀏覽器控制台中，以利除錯。
            console.error("找不到 API_KEY 環境變數。請確保已在 Vercel 或 .env 檔案中正確設定。");
            throw new Error("API 設定錯誤。請檢查部署設定。");
        }
        
        // 使用從環境變數中獲取的金鑰初始化客戶端。
        ai = new GoogleGenAI({ apiKey });
    }
    return ai;
}

export async function findNearbyPlaces(query: string, location: { latitude: number, longitude: number }): Promise<GenerateContentResponse> {
  try {
    const client = getAiClient(); // 僅在實際需要時才獲取客戶端。
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
    console.error("Gemini API request failed (findNearbyPlaces):", error);
    throw new Error("An error occurred while communicating with the Gemini API.");
  }
}

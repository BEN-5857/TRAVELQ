import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Defer AI client initialization to avoid errors at build time if the API_KEY is missing.
let ai: GoogleGenAI | null = null;

/**
 * Gets the Gemini AI client instance.
 * If not already initialized, it initializes the client using the API key
 * from the environment variables. This pattern is called "Lazy Initialization".
 */
function getAiClient(): GoogleGenAI {
    if (!ai) {
        // Fix: The API key must be obtained from process.env.API_KEY according to the guidelines. This change also resolves the TypeScript error regarding 'import.meta.env'.
        const apiKey = process.env.API_KEY;

        if (!apiKey) {
            // This error message will be displayed in the user's browser console for debugging.
            console.error("API_KEY environment variable is not set. Please check your project settings.");
            throw new Error("API_KEY environment variable is not set.");
        }
        ai = new GoogleGenAI({ apiKey: apiKey });
    }
    return ai;
}

export async function findNearbyPlaces(query: string, location: { latitude: number, longitude: number }): Promise<GenerateContentResponse> {
  try {
    const client = getAiClient(); // Get the client only when it's actually needed.
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

import { GoogleGenAI, Type } from "@google/genai";
import { GeminiInsights } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getMovieInsights = async (movieTitle: string): Promise<GeminiInsights> => {
  if (!apiKey) {
    return {
      buzz: "API Key missing. Unable to generate insights.",
      mood: "Unknown",
      reviewSummary: "Details unavailable."
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate short, catchy marketing insights for the movie "${movieTitle}". 
      I need 3 specific things:
      1. "buzz": A one-sentence hook on why this is a must-watch.
      2. "mood": 3 adjectives describing the atmosphere (e.g., "Tense, Gripping, Dark").
      3. "reviewSummary": A short 2-sentence fake critical consensus praising the visual effects and acting.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            buzz: { type: Type.STRING },
            mood: { type: Type.STRING },
            reviewSummary: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as GeminiInsights;
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      buzz: "Experience the magic of cinema.",
      mood: "Exciting, Dramatic",
      reviewSummary: "Audiences are loving this latest release."
    };
  }
};

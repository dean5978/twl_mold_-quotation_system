import { GoogleGenAI } from "@google/genai";

export const polishText = async (text: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.warn("API Key is missing. Returning original text.");
    return text; 
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a professional industrial tooling procurement assistant. 
      Rewrite the following supplier remarks to be more professional, concise, and technically accurate. 
      Keep the language in Traditional Chinese (Taiwan).
      
      Original Text: ${text}`,
    });
    
    return response.text?.trim() || text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return text; // Fallback to original
  }
};
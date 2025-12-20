
import { GoogleGenAI, Type } from "@google/genai";
import { Product } from "./types";

// Always use the process.env.API_KEY directly for initialization.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartSuggestions = async (query: string, availableProducts: Product[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `The user is looking for: "${query}". 
      From the following JSON list of products, identify which ones best match the intent. 
      Also, suggest a 'Smart Bundle' of 2-3 items if they might want to cook something specific.
      
      Available Products: ${JSON.stringify(availableProducts.map(p => ({ id: p.id, name: p.name, category: p.category })))}
      
      Respond ONLY in JSON format with two keys:
      - "matchedIds": Array of string IDs
      - "bundleSuggestion": A string explaining why these are good together (e.g. "Making Pasta? Here is what you need.")`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchedIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "The IDs of products that match the search query.",
            },
            bundleSuggestion: {
              type: Type.STRING,
              description: "A recommendation for a bundle of items.",
            }
          },
          required: ["matchedIds", "bundleSuggestion"],
          propertyOrdering: ["matchedIds", "bundleSuggestion"],
        }
      }
    });

    // Directly access the text property of the response object.
    const jsonStr = response.text?.trim();
    if (!jsonStr) return null;
    
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};

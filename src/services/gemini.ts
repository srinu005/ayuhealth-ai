import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface HealthAnalysis {
  diagnosis: string;
  medication: string;
  advice: string;
  fullResponse: string;
}

export async function analyzeSymptoms(
  symptoms: string,
  userProfile: { gender: string; age: string; location: string },
  language: string
): Promise<HealthAnalysis> {
  const model = "gemini-3-flash-preview";
  
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Gemini API key is missing. Please add GEMINI_API_KEY to your .env file in the project root and restart the server.");
  }

  const systemInstruction = `
    You are a professional medical AI assistant. 
    Analyze the user's symptoms and provide a concise diagnosis and medication advice.
    
    User Profile:
    - Age: ${userProfile.age}
    - Gender: ${userProfile.gender}
    - Location: ${userProfile.location}
    
    Constraints:
    1. The response MUST be in ${language}.
    2. The total length MUST be around 150 words.
    3. Include a diagnosis section.
    4. Include a medication section (suggest common over-the-counter tablets if appropriate, but always advise consulting a doctor).
    5. Use a positive, reassuring, and curable tone.
    6. Ensure the advice is culturally relevant to the user's location if possible.
    
    Return the response as a clear, scannable text.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: symptoms,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const text = response.text || "I'm sorry, I couldn't analyze the symptoms. Please try again.";
    
    return {
      diagnosis: "", // We can parse if needed, but for now we'll use the full text
      medication: "",
      advice: "",
      fullResponse: text
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze symptoms. Please check your connection.");
  }
}

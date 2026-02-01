import { GoogleGenAI } from "@google/genai";
import { StoryContent } from "../types";

// In a real environment, this comes from process.env.API_KEY
// We wrap this to prevent crashing if key is missing in demo
const apiKey = process.env.API_KEY || 'DEMO_KEY'; 

const ai = new GoogleGenAI({ apiKey });

export const aiService = {
  /**
   * Chat with the Sensei (AI Tutor)
   */
  chatWithSensei: async (message: string, history: any[]) => {
    try {
      if (apiKey === 'DEMO_KEY') throw new Error("No API Key");

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-latest',
        contents: [
            ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
            { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction: "You are Quizeon Sensei, a helpful and encouraging Japanese language tutor for JLPT N5 students. Keep answers concise, explain grammar simply, and use emojis. If the user makes a mistake, gently correct them.",
        }
      });
      return response.text;
    } catch (error) {
      console.warn("AI Service unavailable (Demo Mode):", error);
      // Fallback response for demo
      await new Promise(r => setTimeout(r, 1000));
      return "Konnichiwa! I am in Demo Mode because the API Key is missing. But imagine I just gave you a brilliant explanation of 'Wa' vs 'Ga' particles! 🌸";
    }
  },

  /**
   * Generate a JLPT N5 Story
   */
  generateStory: async (topic: string): Promise<StoryContent> => {
    try {
      if (apiKey === 'DEMO_KEY') throw new Error("No API Key");

      const prompt = `Create a simple JLPT N5 level short story about "${topic}". 
      Return ONLY valid JSON with this structure:
      {
        "title": "Title in Japanese",
        "japanese": "The story in Japanese (Kanji/Kana)",
        "english": "English translation",
        "vocab": [{"word": "word", "meaning": "meaning"}],
        "quiz": [{"question": "Simple question in English", "options": ["A", "B", "C"], "answer": "Correct Option"}]
      }`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-latest',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      
      const text = response.text || "{}";
      return JSON.parse(text);

    } catch (error) {
      console.warn("AI Service unavailable (Demo Mode)");
      await new Promise(r => setTimeout(r, 1500));
      return {
        title: "喫茶店で (At the Cafe)",
        japanese: "私は昨日、友達と喫茶店に行きました。コーヒーを飲みました。ケーキも食べました。とてもおいしかったです。",
        english: "Yesterday, I went to a cafe with a friend. I drank coffee. I also ate cake. It was very delicious.",
        vocab: [
            { word: "喫茶店 (kissaten)", meaning: "Cafe" },
            { word: "昨日 (kinou)", meaning: "Yesterday" },
            { word: "友達 (tomodachi)", meaning: "Friend" }
        ],
        quiz: [
            { question: "Where did they go?", options: ["Library", "Cafe", "Park"], answer: "Cafe" },
            { question: "What did they drink?", options: ["Tea", "Water", "Coffee"], answer: "Coffee" }
        ]
      };
    }
  }
};

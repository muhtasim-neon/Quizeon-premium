
import { GoogleGenAI } from "@google/genai";
import { StoryContent, LearningItem, SongContent } from "../types";

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
            ...history.map(h => ({ role: h.role, parts: [{ text: h.text || "" }] })),
            { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction: "You are Quizeon Sensei, a helpful and encouraging Japanese language tutor for JLPT N5 students. Keep answers concise, explain grammar simply, and use emojis. If the user makes a mistake, gently correct them.",
        }
      });
      return response.text || "";
    } catch (error) {
      console.warn("AI Service unavailable (Demo Mode):", error);
      // Fallback response for demo
      await new Promise(r => setTimeout(r, 1000));
      return "Konnichiwa! I am in Demo Mode because the API Key is missing. But imagine I just gave you a brilliant explanation of 'Wa' vs 'Ga' particles! 🌸";
    }
  },

  /**
   * Generate a JLPT N5 Story based on topic or vocabulary list
   */
  generateStory: async (topicOrVocab: string | LearningItem[]): Promise<StoryContent> => {
    try {
      if (apiKey === 'DEMO_KEY') throw new Error("No API Key");

      let prompt = "";
      
      if (typeof topicOrVocab === 'string') {
          prompt = `Create a simple JLPT N5 level short story about "${topicOrVocab}".`;
      } else {
          const words = topicOrVocab.slice(0, 15).map(v => `${v.ja} (${v.en})`).join(', ');
          prompt = `Create a short, simple JLPT N5 story using these specific vocabulary words: ${words}. Ensure the story makes sense.`;
      }

      prompt += `
      Return ONLY valid JSON with this structure:
      {
        "title": "Title in Japanese",
        "japanese": "The story in Japanese (Kanji/Kana)",
        "english": "English translation",
        "bangla": "Bengali translation",
        "vocab": [{"word": "word from story", "meaning": "meaning"}],
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
        bangla: "গতকাল আমি আমার বন্ধুর সাথে একটি ক্যাফেতে গিয়েছিলাম। আমি কফি পান করেছিলাম। কেকও খেয়েছিলাম। এটা খুব সুস্বাদু ছিল।",
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
  },

  /**
   * Generate a Song based on vocabulary
   */
  generateSong: async (items: LearningItem[]): Promise<SongContent> => {
    try {
      if (apiKey === 'DEMO_KEY') throw new Error("No API Key");

      // Increased limit to 40 to include most words in a typical lesson
      const words = items.slice(0, 40).map(v => `${v.ja} (${v.en})`).join(', ');
      
      const prompt = `
      Create a simple, catchy song using these Japanese vocabulary words: ${words}.
      Try to incorporate as many of the provided words as possible into the lyrics naturally.
      
      RULES:
      1. The "kana" field MUST contain ONLY Hiragana and Katakana. Do NOT use Kanji at all.
      2. Keep the sentences simple (N5 level).
      3. Provide a line-by-line translation in English and Bangla.
      
      Return ONLY valid JSON with this structure:
      {
        "title": "Song Title (in Kana)",
        "genre": "Pop / Rap / Ballad / Folk",
        "lyrics": [
            { 
              "kana": "Japanese line in Hiragana/Katakana ONLY",
              "romaji": "Romaji reading",
              "en": "English meaning", 
              "bn": "Bangla meaning" 
            }
        ]
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
            title: "がっこう の うた",
            genre: "Happy Pop",
            lyrics: [
                { kana: "わたし は がくせい です", romaji: "Watashi wa gakusei desu", en: "I am a student", bn: "আমি একজন ছাত্র" },
                { kana: "せんせい おはよう ございます", romaji: "Sensei ohayou gozaimasu", en: "Teacher, good morning", bn: "শিক্ষক, শুভ সকাল" },
                { kana: "ほん を よみます", romaji: "Hon o yomimasu", en: "I read a book", bn: "আমি বই পড়ি" },
                { kana: "がっこう へ いきます", romaji: "Gakkou e ikimasu", en: "I go to school", bn: "আমি স্কুলে যাই" },
                { kana: "べんきょう は たのしい です", romaji: "Benkyou wa tanoshii desu", en: "Studying is fun", bn: "পড়াশোনা করা মজার" }
            ]
        };
    }
  }
};

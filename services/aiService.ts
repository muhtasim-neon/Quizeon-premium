import { GoogleGenAI, Type } from "@google/genai";
import { StoryContent, LearningItem, SongContent } from "../types";

// Always use process.env.API_KEY directly for initialization
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const aiService = {
  /**
   * Chat with the Sensei (AI Tutor)
   */
  chatWithSensei: async (message: string, history: any[]) => {
    try {
      // Use gemini-3-flash-preview for conversational text tasks
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
            ...history.map(h => ({ role: h.role, parts: [{ text: h.text || "" }] })),
            { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction: "You are Quizeon Sensei, a helpful and encouraging Japanese language tutor for JLPT N5 students. Keep answers concise, explain grammar simply, and use emojis. If the user makes a mistake, gently correct them.",
        }
      });
      // Correct property access: response.text (not a method)
      return response.text || "";
    } catch (error) {
      console.warn("AI Service error:", error);
      await new Promise(r => setTimeout(r, 1000));
      return "Konnichiwa! I encountered a small ripple in the digital pond. Let's try again in a moment! 🌸";
    }
  },

  /**
   * Generate 5 easy practice sentences for a specific word
   */
  generateSentences: async (word: string): Promise<{ja: string, ro: string, en: string}[]> => {
    try {
      const prompt = `Create exactly 5 very easy, JLPT N5 level sentences using the Japanese word "${word}". 
      Each sentence must include the word. 
      Return JSON as an array of objects with "ja" (Japanese), "ro" (Romaji), and "en" (English) keys.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { 
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                ja: { type: Type.STRING },
                ro: { type: Type.STRING },
                en: { type: Type.STRING },
              },
              required: ["ja", "ro", "en"]
            }
          }
        }
      });
      
      const text = response.text || "[]";
      return JSON.parse(text);
    } catch (error) {
      console.warn("Sentence generation error:", error);
      return [
        { ja: `${word}は好きです。`, ro: `${word} wa suki desu.`, en: `I like ${word}.` },
        { ja: `${word}があります。`, ro: `${word} ga arimasu.`, en: `There is ${word}.` },
        { ja: `${word}を食べます。`, ro: `${word} o tabemasu.`, en: `I eat ${word}.` },
        { ja: `${word}はきれいです。`, ro: `${word} wa kirei desu.`, en: `${word} is beautiful.` },
        { ja: `${word}を見ます。`, ro: `${word} o mimasu.`, en: `I look at ${word}.` }
      ];
    }
  },

  /**
   * Generate a JLPT N5 Story based on topic or vocabulary list
   */
  generateStory: async (topicOrVocab: string | LearningItem[]): Promise<StoryContent> => {
    try {
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
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      
      const text = response.text || "{}";
      return JSON.parse(text);

    } catch (error) {
      console.warn("AI Service error");
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
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      
      const text = response.text || "{}";
      return JSON.parse(text);

    } catch (error) {
        console.warn("AI Service error");
        await new Promise(r => setTimeout(r, 1500));
        return {
            title: "がっこう の うた",
            genre: "Happy Pop",
            lyrics: [
                { kana: "わたし は がくせい です", romaji: "Watashi wa gakusei desu", en: "I am a student", bn: "আমি একজন ছাত্র" },
                { kana: "せんせい おはよう ございます", romaji: "Sensei ohayou gozaimasu", en: "Teacher, good morning", bn: "শিক্ষক, শুভ সকাল" },
                { kana: "ほん を よみます", romaji: "Hon o yomimasu", en: "I read a book", bn: "আমি বই পড়ি" },
                { kana: "がっこう へ いきます", romaji: "Gakkou e ikimasu", en: "I go to school", bn: "আমি স্কুলে যাই" },
                { kana: "べんきょう は tanoshii です", romaji: "Benkyou wa tanoshii desu", en: "Studying is fun", bn: "পড়াশোনা করা মজার" }
            ]
        };
    }
  }
};

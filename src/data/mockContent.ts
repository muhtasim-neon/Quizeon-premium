

import { LearningItem, ConversationTopic } from '../types';

export const COUNTER_CATEGORIES = [
  'Things', 'Persons', 'Order', 'Thin & Flat Things', 'Machines & Vehicles', 'Age', 
  'Books & Notebooks', 'Clothes', 'Frequency', 'Small Things', 'Shoes & Socks', 
  'House', 'Floors of Building', 'Thin & Long Things', 'Drinks in Cups & Glasses', 'Small Animals & Fish'
];

export const NUMBER_CATEGORIES = [
  'Counting', 'Month', 'Time', 'Minute', 'Day', 'Date'
];

const createDialogue = (id: string, title: string, jpTitle: string, lines: {s: 'A'|'B', j: string, r: string, e: string, b: string}[]): ConversationTopic => ({
    id,
    title,
    jpTitle,
    lines: lines.map(l => ({ speaker: l.s, ja: l.j, romaji: l.r, en: l.e, bn: l.b }))
});

export const CONVERSATION_DATA: ConversationTopic[] = [
    createDialogue('ordering', 'Ordering', '注文する', [
        { s: 'A', j: 'いらっしゃいませ。何名様ですか？', r: 'Irasshaimase. Nanmeisama desu ka?', e: 'Welcome. How many people?', b: 'স্বাগতম। কতজন?' },
        { s: 'B', j: '二人です。', r: 'Futari desu.', e: 'Two people.', b: 'আমরা দুইজন।' },
        { s: 'A', j: 'こちらの席へどうぞ。', r: 'Kochira no seki e douzo.', e: 'Please come to this seat.', b: 'অনুগ্রহ করে এই সিটে আসুন।' },
        { s: 'B', j: 'メニューを見せてください。', r: 'Menyuu o misete kudasai.', e: 'Please show me the menu.', b: 'দয়া করে মেনুটা দেখান।' },
        { s: 'A', j: 'はい、どうぞ。', r: 'Hai, douzo.', e: 'Yes, here you go.', b: 'হ্যাঁ, এই নিন।' },
        { s: 'B', j: 'おすすめは何ですか？', r: 'Osusume wa nan desu ka?', e: 'What do you recommend?', b: 'আপনার রিকমেন্ডেশন কী?' },
        { s: 'A', j: '天ぷらセットが人気です。', r: 'Tenpura setto ga ninki desu.', e: 'The Tempura set is popular.', b: 'তেম্পুরা সেটটি জনপ্রিয়।' },
        { s: 'B', j: 'じゃあ、それを二つください。', r: 'Jaa, sore o futatsu kudasai.', e: 'Then, please give us two of those.', b: 'তাহলে, ওটা দুটো দিন।' },
        { s: 'A', j: 'お飲み物はどうしますか？', r: 'Onomimono wa dou shimasu ka?', e: 'What would you like for drinks?', b: 'পানীয় কী নেবেন?' },
        { s: 'B', j: '水でいいです。', r: 'Mizu de ii desu.', e: 'Water is fine.', b: 'পানিই চলবে।' },
        { s: 'A', j: 'かしこまりました。', r: 'Kashikomarimashita.', e: 'Certainly.', b: 'অবশ্যই।' },
        { s: 'B', j: 'すみません、トイレはどこですか？', r: 'Sumimasen, toire wa doko desu ka?', e: 'Excuse me, where is the restroom?', b: 'শুনুন, টয়লেটটা কোথায়?' },
        { s: 'A', j: 'あちらの奥です。', r: 'Achira no oku desu.', e: 'It is in the back over there.', b: 'ওই দিকে পিছনে।' },
        { s: 'B', j: 'ありがとうございます。', r: 'Arigatou gozaimasu.', e: 'Thank you.', b: 'ধন্যবাদ।' },
        { s: 'B', j: 'いただきます。', r: 'Itadakimasu.', e: 'Let\'s eat (Thanks for the meal).', b: 'খাওয়া শুরু করছি।' },
        { s: 'B', j: 'これ、とてもおいしいですね。', r: 'Kore, totemo oishii desu ne.', e: 'This is very delicious, isn\'t it?', b: 'এটা খুব সুস্বাদু, তাই না?' },
        { s: 'B', j: 'すみません、お会計をお願いします。', r: 'Sumimasen, okaikei o onegaishimasu.', e: 'Excuse me, check please.', b: 'শুনুন, বিলটা দিন প্লিজ।' },
        { s: 'A', j: 'はい、2000円になります。', r: 'Hai, nisenen ni narimasu.', e: 'Yes, that will be 2000 yen.', b: 'হ্যাঁ, ২০০০ ইয়েন হয়েছে।' },
        { s: 'B', j: 'カードで払えますか？', r: 'Kaado de haraemasu ka?', e: 'Can I pay by card?', b: 'কার্ডে কি বিল দেওয়া যাবে?' },
        { s: 'A', j: 'はい、大丈夫です。', r: 'Hai, daijoubu desu.', e: 'Yes, that is fine.', b: 'হ্যাঁ, সমস্যা নেই।' },
        { s: 'A', j: 'ありがとうございました。', r: 'Arigatou gozaimashita.', e: 'Thank you very much.', b: 'আপনাকে অনেক ধন্যবাদ।' }
    ]),
    createDialogue('shopping', 'Shopping', '買い物', [
        { s: 'A', j: 'いらっしゃいませ。', r: 'Irasshaimase.', e: 'Welcome.', b: 'স্বাগতম।' },
        { s: 'B', j: 'これを見てもいいですか？', r: 'Kore o mite mo ii desu ka?', e: 'May I look at this?', b: 'আমি কি এটা দেখতে পারি?' },
        { s: 'A', j: 'はい、どうぞ。手にとってご覧ください。', r: 'Hai, douzo. Te ni totte goran kudasai.', e: 'Yes, please. Feel free to pick it up.', b: 'হ্যাঁ, প্লিজ। হাতে নিয়ে দেখুন।' },
        { s: 'B', j: 'これはいくらですか？', r: 'Kore wa ikura desu ka?', e: 'How much is this?', b: 'এটার দাম কত?' },
        { s: 'A', j: 'それは3000円です。', r: 'Sore wa sanzenen desu.', e: 'That is 3000 yen.', b: 'ওটা ৩০০০ ইয়েন।' },
        { s: 'B', j: 'ちょっと高いですね。', r: 'Chotto takai desu ne.', e: 'It is a bit expensive.', b: 'একটু বেশি দাম মনে হচ্ছে।' },
        { s: 'B', j: 'もっと安いのはありますか？', r: 'Motto yasui no wa arimasu ka?', e: 'Do you have a cheaper one?', b: 'এর চেয়ে সস্তা কিছু আছে?' },
        { s: 'A', j: 'こちらはいかがですか？', r: 'Kochira wa ikaga desu ka?', e: 'How about this one?', b: 'এটা কেমন?' },
        { s: 'B', j: 'いいですね。これをください。', r: 'Ii desu ne. Kore o kudasai.', e: 'That\'s good. I\'ll take this.', b: 'ভালো। এটাই দিন।' },
        { s: 'B', j: '袋はいりません。', r: 'Fukuro wa irimasen.', e: 'I don\'t need a bag.', b: 'ব্যাগ লাগবে না।' }
    ]),
    // ... Add more dialogues as needed
];

// --- COMPREHENSIVE VOCABULARY DATA (LESSONS 1-25) ---

const rawMinnaVocab = [
  // Lesson 1
  { lesson: 1, ja: "わたし", romaji: "watashi", en: "I", bn: "আমি", cat: "People" },
  { lesson: 1, ja: "わたしたち", romaji: "watashitachi", en: "we", bn: "আমরা", cat: "People" },
  { lesson: 1, ja: "あなた", romaji: "anata", en: "you", bn: "আপনি/তুমি", cat: "People" },
  { lesson: 1, ja: "あのひと", romaji: "ano hito", en: "that person", bn: "ঐ ব্যক্তি", cat: "People" },
  { lesson: 1, ja: "あのかた", romaji: "ano kata", en: "that person (polite)", bn: "ঐ ব্যক্তি (সম্মানসূচক)", cat: "People" },
  { lesson: 1, ja: "みなさん", romaji: "minasan", en: "everyone", bn: "আপনারা সকলে/সুধীবৃন্দ", cat: "People" },
  { lesson: 1, ja: "せんせい", romaji: "sensei", en: "teacher/instructor", bn: "শিক্ষক/প্রশিক্ষক", cat: "Occupation" },
  { lesson: 1, ja: "きょうし", romaji: "kyoushi", en: "teacher/instructor", bn: "শিক্ষক/প্রশিক্ষক", cat: "Occupation" },
  { lesson: 1, ja: "がくせい", romaji: "gakusei", en: "student", bn: "ছাত্র/ছাত্রী", cat: "Occupation" },
  { lesson: 1, ja: "かいしゃいん", romaji: "kaishain", en: "company employee", bn: "কোম্পানিতে চাকুরীরত ব্যক্তি", cat: "Occupation" },
  { lesson: 1, ja: "いしゃ", romaji: "isha", en: "doctor", bn: "ডাক্তার", cat: "Occupation" },
  { lesson: 1, ja: "エンジニア", romaji: "enjinia", en: "engineer", bn: "প্রকৌশলী", cat: "Occupation" },
  { lesson: 1, ja: "だいがく", romaji: "daigaku", en: "university", bn: "বিশ্ববিদ্যালয়", cat: "Place" },
  { lesson: 1, ja: "びょういん", romaji: "byouin", en: "hospital", bn: "হাসপাতাল", cat: "Place" },
  { lesson: 1, ja: "でんき", romaji: "denki", en: "electricity", bn: "বিদ্যুৎ", cat: "Objects" },
  { lesson: 1, ja: "だれ", romaji: "dare", en: "who", bn: "কে", cat: "Question" },
  { lesson: 1, ja: "どなた", romaji: "donata", en: "who (polite)", bn: "কে (সম্মানসূচক)", cat: "Question" },
  { lesson: 1, ja: "～さい", romaji: "~sai", en: "years old", bn: "বৎসর/বয়স", cat: "Suffix" },
  { lesson: 1, ja: "なんさい", romaji: "nansai", en: "how old", bn: "বয়স কত", cat: "Question" },
  { lesson: 1, ja: "はい", romaji: "hai", en: "yes", bn: "জি/হ্যাঁ", cat: "Response" },
  { lesson: 1, ja: "いいえ", romaji: "iie", en: "no", bn: "না", cat: "Response" },
  { lesson: 1, ja: "はじめまして", romaji: "hajimemashite", en: "nice to meet you", bn: "আপনার সাথে প্রথমবার দেখা হলো", cat: "Phrase" },
  
  // Lesson 2
  { lesson: 2, ja: "これ", romaji: "kore", en: "this (thing)", bn: "এটা (বস্তু)", cat: "Demonstrative" },
  { lesson: 2, ja: "それ", romaji: "sore", en: "that (thing)", bn: "ওটা (বস্তু)", cat: "Demonstrative" },
  { lesson: 2, ja: "あれ", romaji: "are", en: "that over there", bn: "ঐটা (একটু দূরের বস্তু)", cat: "Demonstrative" },
  { lesson: 2, ja: "ほん", romaji: "hon", en: "book", bn: "বই", cat: "Objects" },
  { lesson: 2, ja: "じしょ", romaji: "jisho", en: "dictionary", bn: "অভিধান/ডিকশনারি", cat: "Objects" },
  { lesson: 2, ja: "ざっし", romaji: "zasshi", en: "magazine", bn: "ম্যাগাজিন", cat: "Objects" },
  { lesson: 2, ja: "しんぶん", romaji: "shinbun", en: "newspaper", bn: "খবরের কাগজ", cat: "Objects" },
  { lesson: 2, ja: "ノート", romaji: "nooto", en: "notebook", bn: "নোটবুক", cat: "Objects" },
  { lesson: 2, ja: "えんぴつ", romaji: "enpitsu", en: "pencil", bn: "পেন্সিল", cat: "Stationery" },
  { lesson: 2, ja: "とけい", romaji: "tokei", en: "watch/clock", bn: "ঘড়ি", cat: "Objects" },
  { lesson: 2, ja: "かさ", romaji: "kasa", en: "umbrella", bn: "ছাতা", cat: "Objects" },
  { lesson: 2, ja: "かばん", romaji: "kaban", en: "bag", bn: "ব্যাগ", cat: "Objects" },
  { lesson: 2, ja: "じどうしゃ", romaji: "jidousha", en: "car", bn: "মোটর গাড়ি", cat: "Vehicle" },
  { lesson: 2, ja: "つくえ", romaji: "tsukue", en: "desk", bn: "ডেস্কা/টেবিল", cat: "Furniture" },
  { lesson: 2, ja: "いす", romaji: "isu", en: "chair", bn: "চেয়ার", cat: "Furniture" },
  { lesson: 2, ja: "コーヒー", romaji: "koohii", en: "coffee", bn: "কফি", cat: "Food" },
  { lesson: 2, ja: "えいご", romaji: "eigo", en: "English", bn: "ইংরেজি ভাষা", cat: "Language" },
  { lesson: 2, ja: "にほんご", romaji: "nihongo", en: "Japanese", bn: "জাপানি ভাষা", cat: "Language" },
  { lesson: 2, ja: "なん", romaji: "nan", en: "what?", bn: "কী?", cat: "Question" },
  { lesson: 2, ja: "そう", romaji: "sou", en: "so", bn: "তাই", cat: "Phrase" },
  
  // Lesson 3
  { lesson: 3, ja: "ここ", romaji: "koko", en: "here", bn: "এখানে", cat: "Place" },
  { lesson: 3, ja: "そこ", romaji: "soko", en: "there", bn: "ওখানে", cat: "Place" },
  { lesson: 3, ja: "あそこ", romaji: "asoko", en: "over there", bn: "ঐখানে", cat: "Place" },
  { lesson: 3, ja: "どこ", romaji: "doko", en: "where?", bn: "কোথায়?", cat: "Question" },
  { lesson: 3, ja: "きょうしつ", romaji: "kyoushitsu", en: "classroom", bn: "শ্রেণি কক্ষ", cat: "School" },
  { lesson: 3, ja: "しょくどう", romaji: "shokudou", en: "cafeteria", bn: "ক্যান্টিন", cat: "Place" },
  { lesson: 3, ja: "じむしょ", romaji: "jimusho", en: "office", bn: "অফিস", cat: "Place" },
  { lesson: 3, ja: "かいぎしつ", romaji: "kaigishitsu", en: "meeting room", bn: "মিটিংরুম", cat: "Place" },
  { lesson: 3, ja: "うけつけ", romaji: "uketsuke", en: "reception", bn: "রিসেপশন", cat: "Place" },
  { lesson: 3, ja: "へや", romaji: "heya", en: "room", bn: "রুম/কক্ষ", cat: "Place" },
  { lesson: 3, ja: "トイレ", romaji: "toire", en: "toilet", bn: "টয়লেট", cat: "Place" },
  { lesson: 3, ja: "かいだん", romaji: "kaidan", en: "stairs", bn: "সিঁড়ি", cat: "Place" },
  { lesson: 3, ja: "エレベーター", romaji: "erebeetaa", en: "elevator", bn: "লিফট", cat: "Objects" },
  { lesson: 3, ja: "かいしゃ", romaji: "kaisha", en: "company", bn: "কোম্পানি", cat: "Place" },
  { lesson: 3, ja: "うち", romaji: "uchi", en: "house/home", bn: "বাসা/বাড়ি", cat: "Place" },
  { lesson: 3, ja: "でんわ", romaji: "denwa", en: "telephone", bn: "টেলিফোন", cat: "Objects" },
  { lesson: 3, ja: "いくら", romaji: "ikura", en: "how much?", bn: "দাম কত?", cat: "Question" },
  
  // Lesson 4
  { lesson: 4, ja: "おきます", romaji: "okimasu", en: "wake up", bn: "ঘুম থেকে ওঠা", cat: "Verb" },
  { lesson: 4, ja: "ねます", romaji: "nemasu", en: "sleep", bn: "ঘুমাতে যাওয়া", cat: "Verb" },
  { lesson: 4, ja: "はたらきます", romaji: "hatarakimasu", en: "work", bn: "কাজ করা", cat: "Verb" },
  { lesson: 4, ja: "やすみます", romaji: "yasumimasu", en: "rest", bn: "বিশ্রাম নেওয়া", cat: "Verb" },
  { lesson: 4, ja: "べんきょうします", romaji: "benkyou shimasu", en: "study", bn: "লেখাপড়া করা", cat: "Verb" },
  { lesson: 4, ja: "おわります", romaji: "owarimasu", en: "finish", bn: "শেষ করা", cat: "Verb" },
  { lesson: 4, ja: "デパート", romaji: "depaato", en: "department store", bn: "ডিপার্টমেন্টাল স্টোর", cat: "Place" },
  { lesson: 4, ja: "ぎんこう", romaji: "ginkou", en: "bank", bn: "ব্যাংক", cat: "Place" },
  { lesson: 4, ja: "ゆうびんきょく", romaji: "yuubinkyoku", en: "post office", bn: "পোস্ট অফিস", cat: "Place" },
  { lesson: 4, ja: "としょかん", romaji: "toshokan", en: "library", bn: "লাইব্রেরী", cat: "Place" },
  { lesson: 4, ja: "いま", romaji: "ima", en: "now", bn: "এখন", cat: "Time" },
  { lesson: 4, ja: "なんじ", romaji: "nanji", en: "what time", bn: "কয়টা বাজে", cat: "Question" },
  { lesson: 4, ja: "ごぜん", romaji: "gozen", en: "a.m.", bn: "পূর্বাহ্ন", cat: "Time" },
  { lesson: 4, ja: "ごご", romaji: "gogo", en: "p.m.", bn: "অপরাহ্ন", cat: "Time" },
  { lesson: 4, ja: "あさ", romaji: "asa", en: "morning", bn: "সকালবেলা", cat: "Time" },
  { lesson: 4, ja: "ひる", romaji: "hiru", en: "noon", bn: "দুপুরবেলা", cat: "Time" },
  { lesson: 4, ja: "ばん", romaji: "ban", en: "evening", bn: "রাত্রিবেলা", cat: "Time" },
  { lesson: 4, ja: "きのう", romaji: "kinou", en: "yesterday", bn: "গতকাল", cat: "Time" },
  { lesson: 4, ja: "きょう", romaji: "kyou", en: "today", bn: "আজ", cat: "Time" },
  { lesson: 4, ja: "あした", romaji: "ashita", en: "tomorrow", bn: "আগামীকাল", cat: "Time" },
  { lesson: 4, ja: "げつようび", romaji: "getsuyoubi", en: "Monday", bn: "সোমবার", cat: "Day" },
  { lesson: 4, ja: "かようび", romaji: "kayoubi", en: "Tuesday", bn: "মঙ্গলবার", cat: "Day" },
  
  // Lesson 5
  { lesson: 5, ja: "いきます", romaji: "ikimasu", en: "to go", bn: "যাওয়া", cat: "Verb" },
  { lesson: 5, ja: "きます", romaji: "kimasu", en: "to come", bn: "আসা", cat: "Verb" },
  { lesson: 5, ja: "かえります", romaji: "kaerimasu", en: "to return", bn: "ফিরে আসা", cat: "Verb" },
  { lesson: 5, ja: "がっこう", romaji: "gakkou", en: "school", bn: "বিদ্যালয়", cat: "Place" },
  { lesson: 5, ja: "スーパー", romaji: "suupaa", en: "supermarket", bn: "সুপার মার্কেট", cat: "Place" },
  { lesson: 5, ja: "えき", romaji: "eki", en: "station", bn: "স্টেশন", cat: "Place" },
  { lesson: 5, ja: "ひこうき", romaji: "hikouki", en: "airplane", bn: "উড়োজাহাজ", cat: "Vehicle" },
  { lesson: 5, ja: "でんしゃ", romaji: "densha", en: "train", bn: "ট্রেন", cat: "Vehicle" },
  { lesson: 5, ja: "ちかてつ", romaji: "chikatetsu", en: "subway", bn: "সাবওয়ে", cat: "Vehicle" },
  { lesson: 5, ja: "バス", romaji: "basu", en: "bus", bn: "বাস", cat: "Vehicle" },
  { lesson: 5, ja: "タクシー", romaji: "takushii", en: "taxi", bn: "ট্যাক্সি", cat: "Vehicle" },
  { lesson: 5, ja: "じてんしゃ", romaji: "jitensha", en: "bicycle", bn: "সাইকেল", cat: "Vehicle" },
  { lesson: 5, ja: "ともだち", romaji: "tomodachi", en: "friend", bn: "বন্ধু", cat: "People" },
  { lesson: 5, ja: "かれ", romaji: "kare", en: "he/boyfriend", bn: "সে (ছেলে)", cat: "People" },
  { lesson: 5, ja: "かのじょ", romaji: "kanojo", en: "she/girlfriend", bn: "সে (মেয়ে)", cat: "People" },
  { lesson: 5, ja: "かぞく", romaji: "kazoku", en: "family", bn: "পরিবার", cat: "People" },
  
  // Lesson 6
  { lesson: 6, ja: "たべます", romaji: "tabemasu", en: "to eat", bn: "খাওয়া", cat: "Verb" },
  { lesson: 6, ja: "のみます", romaji: "nomimasu", en: "to drink", bn: "পান করা", cat: "Verb" },
  { lesson: 6, ja: "すいます", romaji: "suimasu", en: "to smoke", bn: "ধূমপান করা", cat: "Verb" },
  { lesson: 6, ja: "みます", romaji: "mimasu", en: "to see", bn: "দেখা", cat: "Verb" },
  { lesson: 6, ja: "ききます", romaji: "kikimasu", en: "to listen", bn: "শোনা", cat: "Verb" },
  { lesson: 6, ja: "よみます", romaji: "yomimasu", en: "to read", bn: "পড়া", cat: "Verb" },
  { lesson: 6, ja: "かきます", romaji: "kakimasu", en: "to write", bn: "লেখা", cat: "Verb" },
  { lesson: 6, ja: "かいます", romaji: "kaimasu", en: "to buy", bn: "ক্রয় করা", cat: "Verb" },
  { lesson: 6, ja: "とります", romaji: "torimasu", en: "to take (photo)", bn: "তোলা (ছবি)", cat: "Verb" },
  { lesson: 6, ja: "します", romaji: "shimasu", en: "to do", bn: "করা", cat: "Verb" },
  { lesson: 6, ja: "あいます", romaji: "aimasu", en: "to meet", bn: "দেখা করা", cat: "Verb" },
  { lesson: 6, ja: "ごはん", romaji: "gohan", en: "rice/meal", bn: "ভাত/খাবার", cat: "Food" },
  { lesson: 6, ja: "パン", romaji: "pan", en: "bread", bn: "রুটি", cat: "Food" },
  { lesson: 6, ja: "たまご", romaji: "tamago", en: "egg", bn: "ডিম", cat: "Food" },
  { lesson: 6, ja: "にく", romaji: "niku", en: "meat", bn: "মাংস", cat: "Food" },
  { lesson: 6, ja: "さかな", romaji: "sakana", en: "fish", bn: "মাছ", cat: "Food" },
  { lesson: 6, ja: "やさい", romaji: "yasai", en: "vegetables", bn: "সবজি", cat: "Food" },
  { lesson: 6, ja: "くだもの", romaji: "kudamono", en: "fruit", bn: "ফলমূল", cat: "Food" },
  { lesson: 6, ja: "みず", romaji: "mizu", en: "water", bn: "পানি", cat: "Drink" },
  { lesson: 6, ja: "おちゃ", romaji: "ocha", en: "tea", bn: "চা", cat: "Drink" },
  { lesson: 6, ja: "ぎゅうにゅう", romaji: "gyuunyuu", en: "milk", bn: "দুধ", cat: "Drink" },
  { lesson: 6, ja: "えいが", romaji: "eiga", en: "movie", bn: "চলচ্চিত্র", cat: "Leisure" },
  
  // Lesson 7
  { lesson: 7, ja: "きります", romaji: "kirimasu", en: "to cut", bn: "কাটা", cat: "Verb" },
  { lesson: 7, ja: "おくります", romaji: "okurimasu", en: "to send", bn: "পাঠানো", cat: "Verb" },
  { lesson: 7, ja: "あげます", romaji: "agemasu", en: "to give", bn: "দেওয়া", cat: "Verb" },
  { lesson: 7, ja: "もらいます", romaji: "moraimasu", en: "to receive", bn: "পাওয়া", cat: "Verb" },
  { lesson: 7, ja: "かします", romaji: "kashimasu", en: "to lend", bn: "ধার দেওয়া", cat: "Verb" },
  { lesson: 7, ja: "かります", romaji: "karimasu", en: "to borrow", bn: "ধার করা", cat: "Verb" },
  { lesson: 7, ja: "おしえます", romaji: "oshiemasu", en: "to teach", bn: "শেখানো", cat: "Verb" },
  { lesson: 7, ja: "ならいます", romaji: "naraimasu", en: "to learn", bn: "শেখা", cat: "Verb" },
  { lesson: 7, ja: "て", romaji: "te", en: "hand", bn: "হাত", cat: "Body" },
  { lesson: 7, ja: "はし", romaji: "hashi", en: "chopsticks", bn: "চপস্টিক", cat: "Objects" },
  { lesson: 7, ja: "スプーン", romaji: "supuun", en: "spoon", bn: "চামচ", cat: "Objects" },
  { lesson: 7, ja: "はさみ", romaji: "hasami", en: "scissors", bn: "কাঁচি", cat: "Objects" },
  { lesson: 7, ja: "かみ", romaji: "kami", en: "paper", bn: "কাগজ", cat: "Objects" },
  { lesson: 7, ja: "はな", romaji: "hana", en: "flower", bn: "ফুল", cat: "Nature" },
  { lesson: 7, ja: "プレゼント", romaji: "purezento", en: "present", bn: "উপহার", cat: "Objects" },
  { lesson: 7, ja: "おかね", romaji: "okane", en: "money", bn: "টাকা", cat: "Objects" },
  
  // Lesson 8
  { lesson: 8, ja: "ハンサム", romaji: "hansamu", en: "handsome", bn: "সুদর্শন", cat: "Adjective" },
  { lesson: 8, ja: "きれい", romaji: "kirei", en: "beautiful/clean", bn: "সুন্দর/পরিষ্কার", cat: "Adjective" },
  { lesson: 8, ja: "しずか", romaji: "shizuka", en: "quiet", bn: "নীরব", cat: "Adjective" },
  { lesson: 8, ja: "にぎやか", romaji: "nigiyaka", en: "lively", bn: "জমজমাট", cat: "Adjective" },
  { lesson: 8, ja: "ゆうめい", romaji: "yuumei", en: "famous", bn: "বিখ্যাত", cat: "Adjective" },
  { lesson: 8, ja: "しんせつ", romaji: "shinsetsu", en: "kind", bn: "দয়ালু", cat: "Adjective" },
  { lesson: 8, ja: "げんき", romaji: "genki", en: "healthy", bn: "সুস্থ", cat: "Adjective" },
  { lesson: 8, ja: "おおきい", romaji: "ookii", en: "big", bn: "বড়", cat: "Adjective" },
  { lesson: 8, ja: "ちいさい", romaji: "chiisai", en: "small", bn: "ছোট", cat: "Adjective" },
  { lesson: 8, ja: "あたらしい", romaji: "atarashii", en: "new", bn: "নতুন", cat: "Adjective" },
  { lesson: 8, ja: "ふるい", romaji: "furui", en: "old", bn: "পুরনো", cat: "Adjective" },
  { lesson: 8, ja: "いい", romaji: "ii", en: "good", bn: "ভালো", cat: "Adjective" },
  { lesson: 8, ja: "わるい", romaji: "warui", en: "bad", bn: "খারাপ", cat: "Adjective" },
  { lesson: 8, ja: "あつい", romaji: "atsui", en: "hot", bn: "গরম", cat: "Adjective" },
  { lesson: 8, ja: "さむい", romaji: "samui", en: "cold", bn: "শীতল", cat: "Adjective" },
  { lesson: 8, ja: "むずかしい", romaji: "muzukashii", en: "difficult", bn: "কঠিন", cat: "Adjective" },
  { lesson: 8, ja: "やさしい", romaji: "yasashii", en: "easy", bn: "সহজ", cat: "Adjective" },
  { lesson: 8, ja: "たかい", romaji: "takai", en: "expensive", bn: "দামি", cat: "Adjective" },
  { lesson: 8, ja: "やすい", romaji: "yasui", en: "cheap", bn: "সস্তা", cat: "Adjective" },
  { lesson: 8, ja: "おいしい", romaji: "oishii", en: "delicious", bn: "সুস্বাদু", cat: "Adjective" },
  
  // Lesson 9
  { lesson: 9, ja: "わかります", romaji: "wakarimasu", en: "to understand", bn: "বুঝা", cat: "Verb" },
  { lesson: 9, ja: "あります", romaji: "arimasu", en: "to have/exist", bn: "আছে", cat: "Verb" },
  { lesson: 9, ja: "すき", romaji: "suki", en: "like", bn: "পছন্দ", cat: "Adjective" },
  { lesson: 9, ja: "きらい", romaji: "kirai", en: "dislike", bn: "অপছন্দ", cat: "Adjective" },
  { lesson: 9, ja: "じょうず", romaji: "jouzu", en: "skillful", bn: "দক্ষ", cat: "Adjective" },
  { lesson: 9, ja: "へた", romaji: "heta", en: "unskillful", bn: "অদক্ষ", cat: "Adjective" },
  { lesson: 9, ja: "りょうり", romaji: "ryouri", en: "cooking", bn: "রান্না", cat: "Hobbies" },
  { lesson: 9, ja: "のみもの", romaji: "nomimono", en: "drinks", bn: "পানীয়", cat: "Food" },
  { lesson: 9, ja: "スポーツ", romaji: "supootsu", en: "sports", bn: "খেলাধুলা", cat: "Hobbies" },
  { lesson: 9, ja: "おんがく", romaji: "ongaku", en: "music", bn: "সংগীত", cat: "Hobbies" },
  { lesson: 9, ja: "うた", romaji: "uta", en: "song", bn: "গান", cat: "Hobbies" },
  { lesson: 9, ja: "え", romaji: "e", en: "picture", bn: "ছবি", cat: "Art" },
  { lesson: 9, ja: "じかん", romaji: "jikan", en: "time", bn: "সময়", cat: "Time" },
  { lesson: 9, ja: "やくそく", romaji: "yakusoku", en: "promise", bn: "প্রতিজ্ঞা", cat: "General" },
  
  // Lesson 10
  { lesson: 10, ja: "います", romaji: "imasu", en: "exist (living)", bn: "আছে (প্রাণী)", cat: "Verb" },
  { lesson: 10, ja: "あります", romaji: "arimasu", en: "exist (object)", bn: "আছে (বস্তু)", cat: "Verb" },
  { lesson: 10, ja: "いろいろ", romaji: "iroiro", en: "various", bn: "বিভিন্ন", cat: "Adjective" },
  { lesson: 10, ja: "おとこのひと", romaji: "otoko no hito", en: "man", bn: "পুরুষ", cat: "People" },
  { lesson: 10, ja: "おんなのひと", romaji: "onna no hito", en: "woman", bn: "মহিলা", cat: "People" },
  { lesson: 10, ja: "おとこのこ", romaji: "otoko no ko", en: "boy", bn: "বালক", cat: "People" },
  { lesson: 10, ja: "おんなのこ", romaji: "onna no ko", en: "girl", bn: "বালিকা", cat: "People" },
  { lesson: 10, ja: "いぬ", romaji: "inu", en: "dog", bn: "কুকুর", cat: "Animals" },
  { lesson: 10, ja: "ねこ", romaji: "neko", en: "cat", bn: "বিড়াল", cat: "Animals" },
  { lesson: 10, ja: "き", romaji: "ki", en: "tree", bn: "গাছ", cat: "Nature" },
  { lesson: 10, ja: "もの", romaji: "mono", en: "thing", bn: "জিনিস", cat: "Objects" },
  { lesson: 10, ja: "はこ", romaji: "hako", en: "box", bn: "বাক্স", cat: "Objects" },
  { lesson: 10, ja: "テーブル", romaji: "teeburu", en: "table", bn: "টেবিল", cat: "Furniture" },
  { lesson: 10, ja: "ベッド", romaji: "beddo", en: "bed", bn: "বেড", cat: "Furniture" },
  { lesson: 10, ja: "ドア", romaji: "doa", en: "door", bn: "দরজা", cat: "House" },
  { lesson: 10, ja: "まど", romaji: "mado", en: "window", bn: "জানালা", cat: "House" },
  { lesson: 10, ja: "うえ", romaji: "ue", en: "above", bn: "উপরে", cat: "Position" },
  { lesson: 10, ja: "した", romaji: "shita", en: "below", bn: "নিচে", cat: "Position" },
  { lesson: 10, ja: "まえ", romaji: "mae", en: "front", bn: "সামনে", cat: "Position" },
  { lesson: 10, ja: "うしろ", romaji: "ushiro", en: "behind", bn: "পিছনে", cat: "Position" },
  { lesson: 10, ja: "みぎ", romaji: "migi", en: "right", bn: "ডান", cat: "Position" },
  { lesson: 10, ja: "ひだり", romaji: "hidari", en: "left", bn: "বাম", cat: "Position" },
  { lesson: 10, ja: "なか", romaji: "naka", en: "inside", bn: "ভিতরে", cat: "Position" },
  { lesson: 10, ja: "そと", romaji: "soto", en: "outside", bn: "বাহিরে", cat: "Position" },
  
  // Lesson 11
  { lesson: 11, ja: "かかります", romaji: "kakarimasu", en: "to take (time/money)", bn: "লাগা", cat: "Verb" },
  { lesson: 11, ja: "ひとつ", romaji: "hitotsu", en: "one", bn: "একটি", cat: "Counter" },
  { lesson: 11, ja: "ふたつ", romaji: "futatsu", en: "two", bn: "দুইটি", cat: "Counter" },
  { lesson: 11, ja: "みっつ", romaji: "mittsu", en: "three", bn: "তিনটি", cat: "Counter" },
  { lesson: 11, ja: "よっつ", romaji: "yottsu", en: "four", bn: "চারটি", cat: "Counter" },
  { lesson: 11, ja: "いつつ", romaji: "itsutsu", en: "five", bn: "পাঁচটি", cat: "Counter" },
  { lesson: 11, ja: "むっつ", romaji: "muttsu", en: "six", bn: "ছয়টি", cat: "Counter" },
  { lesson: 11, ja: "ななつ", romaji: "nanatsu", en: "seven", bn: "সাতটি", cat: "Counter" },
  { lesson: 11, ja: "やっつ", romaji: "yattsu", en: "eight", bn: "আটটি", cat: "Counter" },
  { lesson: 11, ja: "ここのつ", romaji: "kokonotsu", en: "nine", bn: "নয়টি", cat: "Counter" },
  { lesson: 11, ja: "とお", romaji: "too", en: "ten", bn: "দশটি", cat: "Counter" },
  { lesson: 11, ja: "いくつ", romaji: "ikutsu", en: "how many", bn: "কয়টি", cat: "Question" },
  { lesson: 11, ja: "ひとり", romaji: "hitori", en: "one person", bn: "একজন", cat: "Counter" },
  { lesson: 11, ja: "ふたり", romaji: "futari", en: "two people", bn: "দুই জন", cat: "Counter" },
  { lesson: 11, ja: "りんご", romaji: "ringo", en: "apple", bn: "আপেল", cat: "Food" },
  { lesson: 11, ja: "きって", romaji: "kitte", en: "stamp", bn: "ডাকটিকেট", cat: "Objects" },
  
  // Lesson 12
  { lesson: 12, ja: "かんたん", romaji: "kantan", en: "easy", bn: "সহজ", cat: "Adjective" },
  { lesson: 12, ja: "ちかい", romaji: "chikai", en: "near", bn: "কাছের", cat: "Adjective" },
  { lesson: 12, ja: "とおい", romaji: "tooi", en: "far", bn: "দূরে", cat: "Adjective" },
  { lesson: 12, ja: "はやい", romaji: "hayai", en: "fast/early", bn: "দ্রুত", cat: "Adjective" },
  { lesson: 12, ja: "おそい", romaji: "osoi", en: "slow/late", bn: "ধীরে", cat: "Adjective" },
  { lesson: 12, ja: "あまい", romaji: "amai", en: "sweet", bn: "মিষ্টি", cat: "Adjective" },
  { lesson: 12, ja: "からい", romaji: "karai", en: "spicy", bn: "ঝাল", cat: "Adjective" },
  { lesson: 12, ja: "おもい", romaji: "omoi", en: "heavy", bn: "ভারী", cat: "Adjective" },
  { lesson: 12, ja: "かるい", romaji: "karui", en: "light", bn: "হালকা", cat: "Adjective" },
  { lesson: 12, ja: "きせつ", romaji: "kisetsu", en: "season", bn: "ঋতু", cat: "Nature" },
  { lesson: 12, ja: "はる", romaji: "haru", en: "spring", bn: "বসন্ত", cat: "Nature" },
  { lesson: 12, ja: "なつ", romaji: "natsu", en: "summer", bn: "গ্রীষ্ম", cat: "Nature" },
  { lesson: 12, ja: "あき", romaji: "aki", en: "autumn", bn: "শরৎ", cat: "Nature" },
  { lesson: 12, ja: "ふゆ", romaji: "fuyu", en: "winter", bn: "শীত", cat: "Nature" },
  { lesson: 12, ja: "てんき", romaji: "tenki", en: "weather", bn: "আবহাওয়া", cat: "Nature" },
  { lesson: 12, ja: "あめ", romaji: "ame", en: "rain", bn: "বৃষ্টি", cat: "Nature" },
  { lesson: 12, ja: "ゆき", romaji: "yuki", en: "snow", bn: "তুষার", cat: "Nature" },
  
  // Lesson 13
  { lesson: 13, ja: "あそびます", romaji: "asobimasu", en: "to play", bn: "খেলা করা", cat: "Verb" },
  { lesson: 13, ja: "およぎます", romaji: "oyogimasu", en: "to swim", bn: "সাঁতার কাটা", cat: "Verb" },
  { lesson: 13, ja: "つかれます", romaji: "tsukaremasu", en: "to get tired", bn: "ক্লান্ত হওয়া", cat: "Verb" },
  { lesson: 13, ja: "だします", romaji: "dashimasu", en: "to send", bn: "পাঠানো", cat: "Verb" },
  { lesson: 13, ja: "はいります", romaji: "hairimasu", en: "to enter", bn: "ঢোকা", cat: "Verb" },
  { lesson: 13, ja: "でます", romaji: "demasu", en: "to exit", bn: "বের হওয়া", cat: "Verb" },
  { lesson: 13, ja: "ほしい", romaji: "hoshii", en: "want", bn: "চাই", cat: "Adjective" },
  { lesson: 13, ja: "ひろい", romaji: "hiroi", en: "wide", bn: "প্রশস্ত", cat: "Adjective" },
  { lesson: 13, ja: "せまい", romaji: "semai", en: "narrow", bn: "সংকীর্ণ", cat: "Adjective" },
  { lesson: 13, ja: "かわ", romaji: "kawa", en: "river", bn: "নদী", cat: "Nature" },
  
  // Lesson 14
  { lesson: 14, ja: "つけます", romaji: "tsukemasu", en: "to turn on", bn: "জ্বালানো", cat: "Verb" },
  { lesson: 14, ja: "けします", romaji: "keshimasu", en: "to turn off", bn: "নিভানো", cat: "Verb" },
  { lesson: 14, ja: "あけます", romaji: "akemasu", en: "to open", bn: "খোলা", cat: "Verb" },
  { lesson: 14, ja: "しめます", romaji: "shimemasu", en: "to close", bn: "বন্ধ করা", cat: "Verb" },
  { lesson: 14, ja: "いそぎます", romaji: "isogimasu", en: "to hurry", bn: "তাড়াহুড়ো করা", cat: "Verb" },
  { lesson: 14, ja: "まちます", romaji: "machimasu", en: "to wait", bn: "অপেক্ষা করা", cat: "Verb" },
  { lesson: 14, ja: "もちます", romaji: "mochimasu", en: "to hold", bn: "ধরা", cat: "Verb" },
  { lesson: 14, ja: "なまえ", romaji: "namae", en: "name", bn: "নাম", cat: "General" },
  { lesson: 14, ja: "じゅうしょ", romaji: "juusho", en: "address", bn: "ঠিকানা", cat: "General" },
  
  // Lesson 15
  { lesson: 15, ja: "たちます", romaji: "tachimasu", en: "to stand", bn: "দাঁড়ানো", cat: "Verb" },
  { lesson: 15, ja: "すわります", romaji: "suwarimasu", en: "to sit", bn: "বসা", cat: "Verb" },
  { lesson: 15, ja: "つかいます", romaji: "tsukaimasu", en: "to use", bn: "ব্যবহার করা", cat: "Verb" },
  { lesson: 15, ja: "おきます", romaji: "okimasu", en: "to put", bn: "রাখা", cat: "Verb" },
  { lesson: 15, ja: "つくります", romaji: "tsukurimasu", en: "to make", bn: "তৈরি করা", cat: "Verb" },
  { lesson: 15, ja: "うります", romaji: "urimasu", en: "to sell", bn: "বিক্রি করা", cat: "Verb" },
  { lesson: 15, ja: "しります", romaji: "shirimasu", en: "to know", bn: "জানা", cat: "Verb" },
  { lesson: 15, ja: "すみます", romaji: "sumimasu", en: "to live", bn: "বাস করা", cat: "Verb" },
  
  // Lesson 16
  { lesson: 16, ja: "のります", romaji: "norimasu", en: "to ride", bn: "চড়া", cat: "Verb" },
  { lesson: 16, ja: "おります", romaji: "orimasu", en: "to get off", bn: "নামা", cat: "Verb" },
  { lesson: 16, ja: "あびます", romaji: "abimasu", en: "to shower", bn: "গোসল করা", cat: "Verb" },
  { lesson: 16, ja: "わかい", romaji: "wakai", en: "young", bn: "তরুণ", cat: "Adjective" },
  { lesson: 16, ja: "ながい", romaji: "nagai", en: "long", bn: "লম্বা", cat: "Adjective" },
  { lesson: 16, ja: "みじかい", romaji: "mijikai", en: "short", bn: "খাটো", cat: "Adjective" },
  { lesson: 16, ja: "からだ", romaji: "karada", en: "body", bn: "শরীর", cat: "Body" },
  { lesson: 16, ja: "あたま", romaji: "atama", en: "head", bn: "মাথা", cat: "Body" },
  { lesson: 16, ja: "め", romaji: "me", en: "eye", bn: "চোখ", cat: "Body" },
  
  // Lesson 17
  { lesson: 17, ja: "おぼえます", romaji: "oboemasu", en: "to memorize", bn: "মুখস্থ করা", cat: "Verb" },
  { lesson: 17, ja: "わすれます", romaji: "wasuremasu", en: "to forget", bn: "ভুলে যাওয়া", cat: "Verb" },
  { lesson: 17, ja: "なくします", romaji: "nakushimasu", en: "to lose", bn: "হারানো", cat: "Verb" },
  { lesson: 17, ja: "はらいます", romaji: "haraimasu", en: "to pay", bn: "পরিশোধ করা", cat: "Verb" },
  { lesson: 17, ja: "かえします", romaji: "kaeshimasu", en: "to return", bn: "ফেরত দেওয়া", cat: "Verb" },
  { lesson: 17, ja: "でかけます", romaji: "dekakemasu", en: "to go out", bn: "বের হওয়া", cat: "Verb" },
  { lesson: 17, ja: "しんぱいします", romaji: "shinpai shimasu", en: "to worry", bn: "চিন্তা করা", cat: "Verb" },
  
  // Lesson 18
  { lesson: 18, ja: "できます", romaji: "dekimasu", en: "can do", bn: "পারা", cat: "Verb" },
  { lesson: 18, ja: "あらいます", romaji: "araimasu", en: "to wash", bn: "ধোয়া", cat: "Verb" },
  { lesson: 18, ja: "ひきます", romaji: "hikimasu", en: "to play (instrument)", bn: "বাজানো", cat: "Verb" },
  { lesson: 18, ja: "うたいます", romaji: "utaimasu", en: "to sing", bn: "গান করা", cat: "Verb" },
  { lesson: 18, ja: "あつめます", romaji: "atsumemasu", en: "to collect", bn: "সংগ্রহ করা", cat: "Verb" },
  { lesson: 18, ja: "しゅみ", romaji: "shumi", en: "hobby", bn: "শখ", cat: "General" },
  { lesson: 18, ja: "うま", romaji: "uma", en: "horse", bn: "ঘোড়া", cat: "Animals" },
  
  // Lesson 19
  { lesson: 19, ja: "のぼります", romaji: "noborimasu", en: "to climb", bn: "আরোহণ করা", cat: "Verb" },
  { lesson: 19, ja: "とまります", romaji: "tomarimasu", en: "to stay", bn: "থাকা", cat: "Verb" },
  { lesson: 19, ja: "そうじします", romaji: "souji shimasu", en: "to clean", bn: "পরিষ্কার করা", cat: "Verb" },
  { lesson: 19, ja: "なります", romaji: "narimasu", en: "to become", bn: "হওয়া", cat: "Verb" },
  { lesson: 19, ja: "ねむい", romaji: "nemui", en: "sleepy", bn: "ঘুমন্ত", cat: "Adjective" },
  { lesson: 19, ja: "つよい", romaji: "tsuyoi", en: "strong", bn: "শক্তিশালী", cat: "Adjective" },
  { lesson: 19, ja: "よわい", romaji: "yowai", en: "weak", bn: "দুর্বল", cat: "Adjective" },
  
  // Lesson 20
  { lesson: 20, ja: "いります", romaji: "irimasu", en: "to need", bn: "প্রয়োজন", cat: "Verb" },
  { lesson: 20, ja: "しらべます", romaji: "shirabemasu", en: "to check", bn: "পরীক্ষা করা", cat: "Verb" },
  { lesson: 20, ja: "なおします", romaji: "naoshimasu", en: "to repair", bn: "মেরামত করা", cat: "Verb" },
  { lesson: 20, ja: "ことば", romaji: "kotoba", en: "word", bn: "শব্দ", cat: "General" },
  { lesson: 20, ja: "きもの", romaji: "kimono", en: "kimono", bn: "কিমোনো", cat: "Clothes" },
  
  // Lesson 21
  { lesson: 21, ja: "おもいます", romaji: "omoimasu", en: "to think", bn: "মনে করা", cat: "Verb" },
  { lesson: 21, ja: "いいます", romaji: "iimasu", en: "to say", bn: "বলা", cat: "Verb" },
  { lesson: 21, ja: "たります", romaji: "tarimasu", en: "to include", bn: "যথেষ্ট", cat: "Verb" },
  { lesson: 21, ja: "かちます", romaji: "kachimasu", en: "to win", bn: "জেতা", cat: "Verb" },
  { lesson: 21, ja: "まけます", romaji: "makemasu", en: "to lose", bn: "হারা", cat: "Verb" },
  { lesson: 21, ja: "やくにたちます", romaji: "yaku ni tachimasu", en: "to be useful", bn: "কাজে আসা", cat: "Verb" },
  
  // Lesson 22
  { lesson: 22, ja: "きます", romaji: "kimasu", en: "to wear (upper)", bn: "পরা (জামা)", cat: "Verb" },
  { lesson: 22, ja: "はきます", romaji: "hakimasu", en: "to wear (lower)", bn: "পরা (জুতা/প্যান্ট)", cat: "Verb" },
  { lesson: 22, ja: "かぶります", romaji: "kaburimasu", en: "to wear (hat)", bn: "পরা (টুপি)", cat: "Verb" },
  { lesson: 22, ja: "かけます", romaji: "kakemasu", en: "to wear (glasses)", bn: "পরা (চশমা)", cat: "Verb" },
  { lesson: 22, ja: "うまれます", romaji: "umaremasu", en: "to be born", bn: "জন্মগ্রহণ করা", cat: "Verb" },
  { lesson: 22, ja: "ぼうし", romaji: "boushi", en: "hat", bn: "টুপি", cat: "Clothes" },
  
  // Lesson 23
  { lesson: 23, ja: "ききます", romaji: "kikimasu", en: "to ask", bn: "জিজ্ঞাসা করা", cat: "Verb" },
  { lesson: 23, ja: "まわします", romaji: "mawashimasu", en: "to turn", bn: "ঘুরানো", cat: "Verb" },
  { lesson: 23, ja: "ひきます", romaji: "hikimasu", en: "to pull", bn: "টানা", cat: "Verb" },
  { lesson: 23, ja: "さわります", romaji: "sawarimasu", en: "to touch", bn: "স্পর্শ করা", cat: "Verb" },
  { lesson: 23, ja: "うごかします", romaji: "ugokashimasu", en: "to move", bn: "সরানো", cat: "Verb" },
  { lesson: 23, ja: "あるきます", romaji: "arukimasu", en: "to walk", bn: "হাঁটা", cat: "Verb" },
  
  // Lesson 24
  { lesson: 24, ja: "くれます", romaji: "kuremasu", en: "to give (me)", bn: "দেওয়া", cat: "Verb" },
  { lesson: 24, ja: "つれていきます", romaji: "tsurete ikimasu", en: "to take along", bn: "সাথে নেওয়া", cat: "Verb" },
  { lesson: 24, ja: "つれてきます", romaji: "tsurete kimasu", en: "to bring along", bn: "সাথে আনা", cat: "Verb" },
  { lesson: 24, ja: "おくります", romaji: "okurimasu", en: "to send/escort", bn: "পৌঁছে দেওয়া", cat: "Verb" },
  { lesson: 24, ja: "しょうかいします", romaji: "shoukai shimasu", en: "to introduce", bn: "পরিচয় করানো", cat: "Verb" },
  
  // Lesson 25
  { lesson: 25, ja: "かんがえます", romaji: "kangaemasu", en: "to think", bn: "চিন্তা করা", cat: "Verb" },
  { lesson: 25, ja: "つきます", romaji: "tsukimasu", en: "to arrive", bn: "পৌঁছানো", cat: "Verb" },
  { lesson: 25, ja: "りゅうがくします", romaji: "ryuugaku shimasu", en: "to study abroad", bn: "বিদেশে পড়া", cat: "Verb" },
  { lesson: 25, ja: "とります", romaji: "torimasu", en: "to age", bn: "বয়স বাড়া", cat: "Verb" },
  { lesson: 25, ja: "いなか", romaji: "inaka", en: "countryside", bn: "গ্রাম", cat: "Place" }
];

// --- KANJI DATA (UNCHANGED) ---
const rawKanji = [
  { lesson: 1, kanji: "人", jp: "ジン, ひと", romaji: "jin, hito", bn: "মানুষ", cat: "People" },
  { lesson: 1, kanji: "日", jp: "ニチ, ひ", romaji: "nichi, hi", bn: "দিন/সূর্য", cat: "Nature" },
  { lesson: 2, kanji: "本", jp: "ホン, もと", romaji: "hon, moto", bn: "বই/মূল", cat: "Objects" },
  { lesson: 2, kanji: "中", jp: "チュウ, なか", romaji: "chuu, naka", bn: "ভিতরে", cat: "Position" },
  { lesson: 3, kanji: "国", jp: "コク, くに", romaji: "koku, kuni", bn: "দেশ", cat: "Places" },
  { lesson: 4, kanji: "時", jp: "ジ, とき", romaji: "ji, toki", bn: "সময়", cat: "Time" },
  { lesson: 4, kanji: "分", jp: "フン, わける", romaji: "fun, wakeru", bn: "মিনিট/ভাগ", cat: "Time" },
  { lesson: 5, kanji: "行", jp: "コウ, いく", romaji: "kou, iku", bn: "যাওয়া", cat: "Action" }
];

// --- GRAMMAR DATA (UNCHANGED) ---
const rawGrammar = [
  { lesson: 1, rule: "N1 は N2 です", explanation: "Topic marker 'wa'. N1 is N2.", examples: "わたしは学生です (I am a student)" },
  { lesson: 1, rule: "N1 は N2 じゃありません", explanation: "Negative: N1 is not N2.", examples: "わたしは医者じゃありません (I am not a doctor)" },
  { lesson: 1, rule: "S か", explanation: "Question particle 'ka'.", examples: "あの方はどなたですか (Who is that person?)" },
  { lesson: 2, rule: "これ/それ/あれ", explanation: "Demonstratives (This/That/That over there)", examples: "これは本です (This is a book)" },
  { lesson: 2, rule: "この/その/あの N", explanation: "Modifying nouns.", examples: "この本はわたしのです (This book is mine)" },
  { lesson: 3, rule: "ここ/そこ/あそこ", explanation: "Place demonstratives.", examples: "ここは教室です (This is the classroom)" },
  { lesson: 4, rule: "Time に V", explanation: "Specific time particle 'ni'.", examples: "６時におきます (I wake up at 6)" },
  { lesson: 5, rule: "Place へ 行きます", explanation: "Direction particle 'e'.", examples: "日本へ行きます (I go to Japan)" }
];

// --- COUNTERS (UNCHANGED) ---
const rawCounters = [
    { group: "Things", ja: "ひとつ", romaji: "hitotsu", en: "one thing" },
    { group: "Things", ja: "ふたつ", romaji: "futatsu", en: "two things" },
    { group: "Persons", ja: "ひとり", romaji: "hitori", en: "one person" },
    { group: "Persons", ja: "ふたり", romaji: "futari", en: "two people" },
    { group: "Order", ja: "いちばん", romaji: "ichiban", en: "number one" },
    { group: "Thin & Flat Things", ja: "いちまい", romaji: "ichimai", en: "one sheet" },
    { group: "Machines & Vehicles", ja: "いちだい", romaji: "ichidai", en: "one machine" },
    { group: "Age", ja: "いっさい", romaji: "issai", en: "1 year old" },
    { group: "Books & Notebooks", ja: "いっさつ", romaji: "issatsu", en: "one book" },
    { group: "Clothes", ja: "いっちゃく", romaji: "icchaku", en: "one suit" },
    { group: "Frequency", ja: "いっかい", romaji: "ikkai", en: "once" },
    { group: "Small Things", ja: "いっこ", romaji: "ikko", en: "one piece" },
    { group: "Shoes & Socks", ja: "いっそく", romaji: "issoku", en: "one pair" },
    { group: "House", ja: "いっけん", romaji: "ikken", en: "one house" },
    { group: "Floors of Building", ja: "いっかい", romaji: "ikkai", en: "1st floor" },
    { group: "Thin & Long Things", ja: "いっぽん", romaji: "ippon", en: "one long object" },
    { group: "Drinks in Cups & Glasses", ja: "いっぱい", romaji: "ippai", en: "one cup" },
    { group: "Small Animals & Fish", ja: "いっぴき", romaji: "ippiki", en: "one animal" }
];

// --- NUMBERS (UNCHANGED) ---
const rawNumbers = [
    { group: "Counting", ja: "いち", romaji: "ichi", en: "one" },
    { group: "Counting", ja: "に", romaji: "ni", en: "two" },
    { group: "Month", ja: "いちがつ", romaji: "ichigatsu", en: "January" },
    { group: "Month", ja: "にがつ", romaji: "nigatsu", en: "February" },
    { group: "Time", ja: "いちじ", romaji: "ichiji", en: "1 o'clock" },
    { group: "Minute", ja: "いっぷん", romaji: "ippun", en: "1 minute" },
    { group: "Day", ja: "にちようび", romaji: "nichiyoubi", en: "Sunday" },
    { group: "Date", ja: "ついたち", romaji: "tsuitachi", en: "1st day" }
];

// --- SYNONYMS & ANTONYMS (UNCHANGED) ---
const rawSynonyms = [
    { word: "大きい (Ookii)", synonym: "巨大 (Kyodai)", meaning: "Big / Huge", bn: "বড় / বিশাল" },
    { word: "綺麗 (Kirei)", synonym: "美しい (Utsukushii)", meaning: "Pretty / Beautiful", bn: "সুন্দর" }
];
const rawAntonyms = [
    { word: "高い (Takai)", antonym: "安い (Yasui)", meaning: "Expensive ↔ Cheap", bn: "দামি ↔ সস্তা" },
    { word: "暑い (Atsui)", antonym: "寒い (Samui)", meaning: "Hot ↔ Cold", bn: "গরম ↔ ঠান্ডা" }
];

// --- LISTENING & FORMAL/INFORMAL (UNCHANGED) ---
const rawListening = [
    { ja: "こんにちは", romaji: "Konnichiwa", en: "Hello" },
    { ja: "ありがとうございます", romaji: "Arigatou gozaimasu", en: "Thank you" },
    { ja: "すみません", romaji: "Sumimasen", en: "Excuse me / I'm sorry" },
    { ja: "わかります", romaji: "Wakarimasu", en: "I understand" },
    { ja: "しりません", romaji: "Shirimasen", en: "I don't know" },
    { ja: "これはなんですか", romaji: "Kore wa nan desu ka", en: "What is this?" },
    { ja: "おなまえは？", romaji: "Onamae wa?", en: "What is your name?" },
    { ja: "ごちそうさまでした", romaji: "Gochisousama deshita", en: "Thanks for the meal (after)" },
    { ja: "いってきます", romaji: "Ittekimasu", en: "I'm leaving (home)" },
    { ja: "ただいま", romaji: "Tadaima", en: "I'm home" }
];

const rawFormalInformal = [
    { polite: "食べます (Tabemasu)", casual: "食べる (Taberu)", meaning: "To eat" },
    { polite: "飲みます (Nomimasu)", casual: "飲む (Nomu)", meaning: "To drink" },
    { polite: "行きます (Ikimasu)", casual: "行く (Iku)", meaning: "To go" },
    { polite: "来ます (Kimasu)", casual: "来る (Kuru)", meaning: "To come" },
    { polite: "します (Shimasu)", casual: "する (Suru)", meaning: "To do" },
    { polite: "見ます (Mimasu)", casual: "見る (Miru)", meaning: "To see" },
    { polite: "話します (Hanashimasu)", casual: "話す (Hanasu)", meaning: "To speak" },
    { polite: "聞きます (Kikimasu)", casual: "聞く (Kiku)", meaning: "To listen/ask" },
    { polite: "買います (Kaimasu)", casual: "買う (Kau)", meaning: "To buy" },
    { polite: "待ちます (Machimasu)", casual: "待つ (Matsu)", meaning: "To wait" },
    { polite: "寒いです (Samui desu)", casual: "寒い (Samui)", meaning: "Cold (weather)" },
    { polite: "暑いです (Atsui desu)", casual: "暑い (Atsui)", meaning: "Hot (weather)" },
    { polite: "静かです (Shizuka desu)", casual: "静かだ (Shizuka da)", meaning: "Quiet" },
    { polite: "きれいです (Kirei desu)", casual: "きれいだ (Kirei da)", meaning: "Pretty/Clean" },
    { polite: "学生です (Gakusei desu)", casual: "学生だ (Gakusei da)", meaning: "Is a student" },
    { polite: "そうです (Sou desu)", casual: "そうだ (Sou da)", meaning: "That's right" }
];

// --- KANA GENERATION (UNCHANGED) ---
const generateKana = (): LearningItem[] => {
    const h_basic = [
        { ja: 'あ', romaji: 'a' }, { ja: 'い', romaji: 'i' }, { ja: 'う', romaji: 'u' }, { ja: 'え', romaji: 'e' }, { ja: 'お', romaji: 'o' },
        { ja: 'か', romaji: 'ka' }, { ja: 'き', romaji: 'ki' }, { ja: 'く', romaji: 'ku' }, { ja: 'け', romaji: 'ke' }, { ja: 'こ', romaji: 'ko' },
        { ja: 'さ', romaji: 'sa' }, { ja: 'し', romaji: 'shi' }, { ja: 'す', romaji: 'su' }, { ja: 'せ', romaji: 'se' }, { ja: 'そ', romaji: 'so' },
        { ja: 'た', romaji: 'ta' }, { ja: 'ち', romaji: 'chi' }, { ja: 'つ', romaji: 'tsu' }, { ja: 'て', romaji: 'te' }, { ja: 'と', romaji: 'to' },
        { ja: 'な', romaji: 'na' }, { ja: 'に', romaji: 'ni' }, { ja: 'ぬ', romaji: 'nu' }, { ja: 'ね', romaji: 'ne' }, { ja: 'の', romaji: 'no' },
        { ja: 'は', romaji: 'ha' }, { ja: 'ひ', romaji: 'hi' }, { ja: 'ふ', romaji: 'fu' }, { ja: 'へ', romaji: 'he' }, { ja: 'ほ', romaji: 'ho' },
        { ja: 'ま', romaji: 'ma' }, { ja: 'み', romaji: 'mi' }, { ja: 'む', romaji: 'mu' }, { ja: 'め', romaji: 'me' }, { ja: 'も', romaji: 'mo' },
        { ja: 'や', romaji: 'ya' }, { ja: 'ゆ', romaji: 'yu' }, { ja: 'よ', romaji: 'yo' },
        { ja: 'ら', romaji: 'ra' }, { ja: 'り', romaji: 'ri' }, { ja: 'る', romaji: 'ru' }, { ja: 'れ', romaji: 're' }, { ja: 'ろ', romaji: 'ro' },
        { ja: 'わ', romaji: 'wa' }, { ja: 'を', romaji: 'wo' }, { ja: 'ん', romaji: 'n' }
    ];
    
    const h_dakuten = [
        { ja: 'が', romaji: 'ga' }, { ja: 'ぎ', romaji: 'gi' }, { ja: 'ぐ', romaji: 'gu' }, { ja: 'げ', romaji: 'ge' }, { ja: 'ご', romaji: 'go' },
        { ja: 'ざ', romaji: 'za' }, { ja: 'じ', romaji: 'ji' }, { ja: 'ず', romaji: 'zu' }, { ja: 'ぜ', romaji: 'ze' }, { ja: 'ぞ', romaji: 'zo' },
        { ja: 'だ', romaji: 'da' }, { ja: 'ぢ', romaji: 'ji' }, { ja: 'づ', romaji: 'zu' }, { ja: 'で', romaji: 'de' }, { ja: 'ど', romaji: 'do' },
        { ja: 'ば', romaji: 'ba' }, { ja: 'び', romaji: 'bi' }, { ja: 'ぶ', romaji: 'bu' }, { ja: 'べ', romaji: 'be' }, { ja: 'ぼ', romaji: 'bo' },
        { ja: 'ぱ', romaji: 'pa' }, { ja: 'ぴ', romaji: 'pi' }, { ja: 'ぷ', romaji: 'pu' }, { ja: 'ぺ', romaji: 'pe' }, { ja: 'ぽ', romaji: 'po' }
    ];

    const h_youon = [
        { ja: 'きゃ', romaji: 'kya' }, { ja: 'きゅ', romaji: 'kyu' }, { ja: 'きょ', romaji: 'kyo' },
        { ja: 'しゃ', romaji: 'sha' }, { ja: 'しゅ', romaji: 'shu' }, { ja: 'しょ', romaji: 'sho' },
        { ja: 'ちゃ', romaji: 'cha' }, { ja: 'ちゅ', romaji: 'chu' }, { ja: 'ちょ', romaji: 'cho' },
        { ja: 'にゃ', romaji: 'nya' }, { ja: 'にゅ', romaji: 'nyu' }, { ja: 'にょ', romaji: 'nyo' },
        { ja: 'ひゃ', romaji: 'hya' }, { ja: 'ひゅ', romaji: 'hyu' }, { ja: 'ひょ', romaji: 'hyo' },
        { ja: 'みゃ', romaji: 'mya' }, { ja: 'みゅ', romaji: 'myu' }, { ja: 'みょ', romaji: 'myo' },
        { ja: 'りゃ', romaji: 'rya' }, { ja: 'りゅ', romaji: 'ryu' }, { ja: 'りょ', romaji: 'ryo' },
        { ja: 'ぎゃ', romaji: 'gya' }, { ja: 'ぎゅ', romaji: 'gyu' }, { ja: 'ぎょ', romaji: 'gyo' },
        { ja: 'じゃ', romaji: 'ja' }, { ja: 'じゅ', romaji: 'ju' }, { ja: 'じょ', romaji: 'jo' },
        { ja: 'びゃ', romaji: 'bya' }, { ja: 'びゅ', romaji: 'byu' }, { ja: 'びょ', romaji: 'byo' },
        { ja: 'ぴゃ', romaji: 'pya' }, { ja: 'ぴゅ', romaji: 'pyu' }, { ja: 'ぴょ', romaji: 'pyo' }
    ];

    const k_basic = [
        { ja: 'ア', romaji: 'a' }, { ja: 'イ', romaji: 'i' }, { ja: 'ウ', romaji: 'u' }, { ja: 'エ', romaji: 'e' }, { ja: 'オ', romaji: 'o' },
        { ja: 'カ', romaji: 'ka' }, { ja: 'キ', romaji: 'ki' }, { ja: 'ク', romaji: 'ku' }, { ja: 'ケ', romaji: 'ke' }, { ja: 'コ', romaji: 'ko' },
        { ja: 'サ', romaji: 'sa' }, { ja: 'シ', romaji: 'shi' }, { ja: 'ス', romaji: 'su' }, { ja: 'セ', romaji: 'se' }, { ja: 'ソ', romaji: 'so' },
        { ja: 'タ', romaji: 'ta' }, { ja: 'チ', romaji: 'chi' }, { ja: 'ツ', romaji: 'tsu' }, { ja: 'テ', romaji: 'te' }, { ja: 'ト', romaji: 'to' },
        { ja: 'ナ', romaji: 'na' }, { ja: 'ニ', romaji: 'ni' }, { ja: 'ヌ', romaji: 'nu' }, { ja: 'ネ', romaji: 'ne' }, { ja: 'ノ', romaji: 'no' },
        { ja: 'ハ', romaji: 'ha' }, { ja: 'ヒ', romaji: 'hi' }, { ja: 'フ', romaji: 'fu' }, { ja: 'ヘ', romaji: 'he' }, { ja: 'ホ', romaji: 'ho' },
        { ja: 'マ', romaji: 'ma' }, { ja: 'ミ', romaji: 'mi' }, { ja: 'ム', romaji: 'mu' }, { ja: 'メ', romaji: 'me' }, { ja: 'モ', romaji: 'mo' },
        { ja: 'ヤ', romaji: 'ya' }, { ja: 'ユ', romaji: 'yu' }, { ja: 'ヨ', romaji: 'yo' },
        { ja: 'ラ', romaji: 'ra' }, { ja: 'リ', romaji: 'ri' }, { ja: 'ル', romaji: 'ru' }, { ja: 'レ', romaji: 're' }, { ja: 'ロ', romaji: 'ro' },
        { ja: 'ワ', romaji: 'wa' }, { ja: 'ヲ', romaji: 'wo' }, { ja: 'ン', romaji: 'n' }
    ];

    const k_dakuten = [
        { ja: 'ガ', romaji: 'ga' }, { ja: 'ギ', romaji: 'gi' }, { ja: 'グ', romaji: 'gu' }, { ja: 'ゲ', romaji: 'ge' }, { ja: 'ゴ', romaji: 'go' },
        { ja: 'ザ', romaji: 'za' }, { ja: 'ジ', romaji: 'ji' }, { ja: 'ズ', romaji: 'zu' }, { ja: 'ゼ', romaji: 'ze' }, { ja: 'ゾ', romaji: 'zo' },
        { ja: 'ダ', romaji: 'da' }, { ja: 'ヂ', romaji: 'ji' }, { ja: 'ヅ', romaji: 'zu' }, { ja: 'デ', romaji: 'de' }, { ja: 'ド', romaji: 'do' },
        { ja: 'バ', romaji: 'ba' }, { ja: 'ビ', romaji: 'bi' }, { ja: 'ブ', romaji: 'bu' }, { ja: 'ベ', romaji: 'be' }, { ja: 'ボ', romaji: 'bo' },
        { ja: 'パ', romaji: 'pa' }, { ja: 'ピ', romaji: 'pi' }, { ja: 'プ', romaji: 'pu' }, { ja: 'ペ', romaji: 'pe' }, { ja: 'ポ', romaji: 'po' }
    ];

    const k_youon = [
        { ja: 'キャ', romaji: 'kya' }, { ja: 'キュ', romaji: 'kyu' }, { ja: 'キョ', romaji: 'kyo' },
        { ja: 'シャ', romaji: 'sha' }, { ja: 'シュ', romaji: 'shu' }, { ja: 'ショ', romaji: 'sho' },
        { ja: 'チャ', romaji: 'cha' }, { ja: 'チュ', romaji: 'chu' }, { ja: 'チョ', romaji: 'cho' },
        { ja: 'ニャ', romaji: 'nya' }, { ja: 'ニュ', romaji: 'nyu' }, { ja: 'ニョ', romaji: 'nyo' },
        { ja: 'ヒャ', romaji: 'hya' }, { ja: 'ヒュ', romaji: 'hyu' }, { ja: 'ヒョ', romaji: 'hyo' },
        { ja: 'ミャ', romaji: 'mya' }, { ja: 'ミュ', romaji: 'myu' }, { ja: 'ミョ', romaji: 'myo' },
        { ja: 'リャ', romaji: 'rya' }, { ja: 'リュ', romaji: 'ryu' }, { ja: 'リョ', romaji: 'ryo' },
        { ja: 'ギャ', romaji: 'gya' }, { ja: 'ギュ', romaji: 'gyu' }, { ja: 'ギョ', romaji: 'gyo' },
        { ja: 'ジャ', romaji: 'ja' }, { ja: 'ジュ', romaji: 'ju' }, { ja: 'ジョ', romaji: 'jo' },
        { ja: 'ビャ', romaji: 'bya' }, { ja: 'ビュ', romaji: 'byu' }, { ja: 'ビョ', romaji: 'byo' },
        { ja: 'ピャ', romaji: 'pya' }, { ja: 'ピュ', romaji: 'pyu' }, { ja: 'ピョ', romaji: 'pyo' }
    ];

    const hBasicItems = h_basic.map((k, i) => ({ id: `h-b-${i}`, ja: k.ja, romaji: k.romaji, en: k.romaji, type: 'kana' as const, category: 'Hiragana', variation: 'basic' as const }));
    const hDakItems = h_dakuten.map((k, i) => ({ id: `h-d-${i}`, ja: k.ja, romaji: k.romaji, en: k.romaji, type: 'kana' as const, category: 'Hiragana', variation: 'dakuten' as const }));
    const hYouItems = h_youon.map((k, i) => ({ id: `h-y-${i}`, ja: k.ja, romaji: k.romaji, en: k.romaji, type: 'kana' as const, category: 'Hiragana', variation: 'youon' as const }));

    const kBasicItems = k_basic.map((k, i) => ({ id: `k-b-${i}`, ja: k.ja, romaji: k.romaji, en: k.romaji, type: 'kana' as const, category: 'Katakana', variation: 'basic' as const }));
    const kDakItems = k_dakuten.map((k, i) => ({ id: `k-d-${i}`, ja: k.ja, romaji: k.romaji, en: k.romaji, type: 'kana' as const, category: 'Katakana', variation: 'dakuten' as const }));
    const kYouItems = k_youon.map((k, i) => ({ id: `k-y-${i}`, ja: k.ja, romaji: k.romaji, en: k.romaji, type: 'kana' as const, category: 'Katakana', variation: 'youon' as const }));

    return [...hBasicItems, ...hDakItems, ...hYouItems, ...kBasicItems, ...kDakItems, ...kYouItems];
};

export const CONFUSING_PAIRS = [
    { label: "Shi vs Tsu (Katakana)", correct: "シ", wrong: "ツ", hint: "Shi looks up (smiling), Tsu looks down." },
    { label: "So vs N (Katakana)", correct: "ソ", wrong: "ン", hint: "So looks down, N looks up." },
    { label: "Wa vs Re (Hiragana)", correct: "わ", wrong: "れ", hint: "Wa is rounded, Re kicks out." },
    { label: "Nu vs Me (Hiragana)", correct: "ぬ", wrong: "め", hint: "Nu has a loop (noodle), Me does not." },
    { label: "Ru vs Ro (Hiragana)", correct: "る", wrong: "ろ", hint: "Ru has a loop at the end, Ro does not." }
];

// --- TRANSFORMERS ---

const transformVocab = (): LearningItem[] => {
    return rawMinnaVocab.map((w, idx) => ({
        id: `v-${idx}`,
        ja: w.ja,
        romaji: w.romaji,
        en: w.en,
        bn: w.bn,
        type: 'vocab',
        category: w.cat,
        lesson: w.lesson
    }));
};

const transformKanji = (): LearningItem[] => {
    return rawKanji.map((k, idx) => ({
        id: `k-${idx}`,
        ja: k.kanji,
        romaji: k.romaji,
        en: k.jp, 
        bn: k.bn,
        type: 'kanji',
        category: k.cat,
        lesson: k.lesson
    }));
};

const transformGrammar = (): LearningItem[] => {
    return rawGrammar.map((r, idx) => ({
        id: `g-${idx}`,
        ja: r.rule,
        romaji: `Lesson ${r.lesson} Grammar`,
        en: r.explanation,
        usage: r.examples,
        type: 'grammar',
        category: 'Grammar',
        lesson: r.lesson
    }));
};

const transformCounters = (): LearningItem[] => {
    return rawCounters.map((c, idx) => ({
        id: `cnt-${idx}`,
        ja: c.ja,
        romaji: c.romaji,
        en: c.en,
        type: 'counter',
        category: 'Counter',
        group: c.group
    }));
};

const transformNumbers = (): LearningItem[] => {
    return rawNumbers.map((n, idx) => ({
        id: `num-${idx}`,
        ja: n.ja,
        romaji: n.romaji,
        en: n.en,
        type: 'number',
        category: 'Number',
        group: n.group
    }));
};

const transformSynonyms = (): LearningItem[] => {
    return rawSynonyms.map((s, idx) => ({
        id: `syn-${idx}`,
        ja: s.word,
        romaji: s.synonym, 
        en: s.meaning,
        bn: s.bn,
        type: 'vocab',
        category: 'Synonyms'
    }));
};

const transformAntonyms = (): LearningItem[] => {
    return rawAntonyms.map((a, idx) => ({
        id: `ant-${idx}`,
        ja: a.word,
        romaji: a.antonym,
        en: a.meaning,
        bn: a.bn,
        type: 'vocab',
        category: 'Antonyms'
    }));
};

const transformListening = (): LearningItem[] => {
    return rawListening.map((l, idx) => ({
        id: `lst-${idx}`,
        ja: l.ja,
        romaji: l.romaji,
        en: l.en,
        type: 'listening',
        category: 'Listening'
    }));
};

const transformFormalInformal = (): LearningItem[] => {
    return rawFormalInformal.map((f, idx) => ({
        id: `fi-${idx}`,
        ja: f.polite, 
        romaji: f.casual, 
        en: f.meaning,
        type: 'formal_informal',
        category: 'Polite vs Casual'
    }));
};

export const PHRASE_DATA: LearningItem[] = [
    { id: 'ph-1', ja: 'おはよう', romaji: 'ohayou', en: 'Good Morning', type: 'phrase' }
];

export const VOCAB_DATA = transformVocab();
export const KANJI_DATA = transformKanji();
export const GRAMMAR_DATA = transformGrammar();
export const COUNTER_DATA = transformCounters();
export const NUMBER_DATA = transformNumbers();
export const SYNONYM_DATA = transformSynonyms();
export const ANTONYM_DATA = transformAntonyms();
export const KANA_DATA = generateKana();
export const LISTENING_DATA = transformListening();
export const FORMAL_INFORMAL_DATA = transformFormalInformal();

export const ALL_CONTENT = [
    ...VOCAB_DATA,
    ...KANJI_DATA,
    ...GRAMMAR_DATA,
    ...COUNTER_DATA,
    ...NUMBER_DATA,
    ...SYNONYM_DATA,
    ...ANTONYM_DATA,
    ...KANA_DATA,
    ...PHRASE_DATA,
    ...LISTENING_DATA,
    ...FORMAL_INFORMAL_DATA
];

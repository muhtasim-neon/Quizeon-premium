// ... (Keep existing imports and previous data constants: COUNTER_CATEGORIES, NUMBER_CATEGORIES, CONVERSATION_DATA, rawMinnaVocab, rawKanji, rawGrammar, rawCounters, rawNumbers, rawSynonyms, rawAntonyms, rawListening, rawFormalInformal, PHRASE_DATA)

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
    // ... (Keep existing CONVERSATION_DATA content)
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
];

// --- COMPREHENSIVE VOCABULARY DATA (LESSONS 1-25) ---
// ... (Keep existing rawMinnaVocab, rawKanji, rawGrammar, rawCounters, rawNumbers, rawSynonyms, rawAntonyms, rawListening, rawFormalInformal, PHRASE_DATA, generateKana, CONFUSING_PAIRS, and transform functions)

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
  // ... (Rest of vocab data up to Lesson 25)
  // ...
  { lesson: 25, ja: "いなか", romaji: "inaka", en: "countryside", bn: "গ্রাম", cat: "Place" }
];

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

const rawSynonyms = [
    { word: "大きい (Ookii)", synonym: "巨大 (Kyodai)", meaning: "Big / Huge", bn: "বড় / বিশাল" },
    { word: "綺麗 (Kirei)", synonym: "美しい (Utsukushii)", meaning: "Pretty / Beautiful", bn: "সুন্দর" }
];
const rawAntonyms = [
    { word: "高い (Takai)", antonym: "安い (Yasui)", meaning: "Expensive ↔ Cheap", bn: "দামি ↔ সস্তা" },
    { word: "暑い (Atsui)", antonym: "寒い (Samui)", meaning: "Hot ↔ Cold", bn: "গরম ↔ ঠান্ডা" }
];

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

const generateKana = (): LearningItem[] => {
    // ... (Keep existing kana generation)
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
        { ja: 'にゃ', romaji: 'nya' }, { ja: 'にゅ', romaji: 'nyu' }, { ja: 'ニョ', romaji: 'nyo' },
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

export const CONNECTOR_DATA: LearningItem[] = [
    { id: 'c-1', ja: 'は', romaji: 'wa', en: 'Topic Marker', usage: 'Watashi wa... (As for me...)', type: 'grammar', category: 'Particle' },
    { id: 'c-2', ja: 'が', romaji: 'ga', en: 'Subject Marker', usage: 'Neko ga imasu (There is a cat)', type: 'grammar', category: 'Particle' },
    { id: 'c-3', ja: 'を', romaji: 'o', en: 'Object Marker', usage: 'Mizu o nomimasu (Drink water)', type: 'grammar', category: 'Particle' },
    { id: 'c-4', ja: 'に', romaji: 'ni', en: 'Time/Target/Location', usage: '6-ji ni okimasu (Wake at 6)', type: 'grammar', category: 'Particle' },
    { id: 'c-5', ja: 'で', romaji: 'de', en: 'Place of Action/Means', usage: 'Basu de ikimasu (Go by bus)', type: 'grammar', category: 'Particle' },
    { id: 'c-6', ja: 'へ', romaji: 'e', en: 'Direction', usage: 'Nihon e ikimasu (Go to Japan)', type: 'grammar', category: 'Particle' },
    { id: 'c-7', ja: 'と', romaji: 'to', en: 'And / With', usage: 'Tomodachi to asobimasu (Play with friend)', type: 'grammar', category: 'Particle' },
    { id: 'c-8', ja: 'の', romaji: 'no', en: 'Possession', usage: 'Watashi no hon (My book)', type: 'grammar', category: 'Particle' },
    { id: 'c-9', ja: 'も', romaji: 'mo', en: 'Also', usage: 'Watashi mo (Me too)', type: 'grammar', category: 'Particle' },
    { id: 'c-10', ja: 'から', romaji: 'kara', en: 'From', usage: '9-ji kara... (From 9...)', type: 'grammar', category: 'Particle' },
    { id: 'c-11', ja: 'まで', romaji: 'made', en: 'Until', usage: '...5-ji made (Until 5)', type: 'grammar', category: 'Particle' },
    { id: 'c-12', ja: 'や', romaji: 'ya', en: 'And (incomplete list)', usage: 'Hon ya pen (Books and pens etc.)', type: 'grammar', category: 'Particle' }
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
    ...FORMAL_INFORMAL_DATA,
    ...CONNECTOR_DATA
];
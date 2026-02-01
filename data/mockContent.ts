import { LearningItem } from '../types';

// --- DATA LISTS FOR UI DROPDOWNS ---

export const COUNTER_CATEGORIES = [
  'Things', 'Persons', 'Order', 'Thin & Flat Things', 'Machines & Vehicles', 'Age', 
  'Books & Notebooks', 'Clothes', 'Frequency', 'Small Things', 'Shoes & Socks', 
  'House', 'Floors of Building', 'Thin & Long Things', 'Drinks in Cups & Glasses', 'Small Animals & Fish'
];

export const NUMBER_CATEGORIES = [
  'Counting', 'Month', 'Time', 'Minute', 'Day', 'Date'
];

// --- RAW DATA SOURCES ---

// 1. Minna Vocab (Added lesson and category)
const rawMinnaVocab = [
  // Lesson 1
  { lesson: 1, ja: "わたし", romaji: "watashi", en: "I", bn: "আমি", cat: "People" },
  { lesson: 1, ja: "がくせい", romaji: "gakusei", en: "student", bn: "ছাত্র/ছাত্রী", cat: "Occupation" },
  { lesson: 1, ja: "せんせい", romaji: "sensei", en: "teacher", bn: "শিক্ষক", cat: "Occupation" },
  { lesson: 1, ja: "かいしゃいん", romaji: "kaishain", en: "company employee", bn: "কোম্পানির কর্মচারী", cat: "Occupation" },
  // Lesson 2
  { lesson: 2, ja: "ほん", romaji: "hon", en: "book", bn: "বই", cat: "Objects" },
  { lesson: 2, ja: "じしょ", romaji: "jisho", en: "dictionary", bn: "অভিধান", cat: "Objects" },
  { lesson: 2, ja: "とけい", romaji: "tokei", en: "watch/clock", bn: "ঘড়ি", cat: "Objects" },
  // Lesson 3
  { lesson: 3, ja: "ここ", romaji: "koko", en: "here", bn: "এখানে", cat: "Place" },
  { lesson: 3, ja: "そこ", romaji: "soko", en: "there", bn: "ওখানে", cat: "Place" },
  { lesson: 3, ja: "あそこ", romaji: "asoko", en: "over there", bn: "সেখানে", cat: "Place" },
  // Lesson 4
  { lesson: 4, ja: "おきます", romaji: "okimasu", en: "wake up", bn: "ঘুম থেকে ওঠা", cat: "Daily Life" },
  { lesson: 4, ja: "ねます", romaji: "nemasu", en: "sleep", bn: "ঘুমানো", cat: "Daily Life" },
  { lesson: 4, ja: "はたらきます", romaji: "hatarakimasu", en: "work", bn: "কাজ করা", cat: "Daily Life" },
  // Lesson 5
  { lesson: 5, ja: "いきます", romaji: "ikimasu", en: "go", bn: "যাওয়া", cat: "Travel" },
  { lesson: 5, ja: "きます", romaji: "kimasu", en: "come", bn: "আসা", cat: "Travel" },
  { lesson: 5, ja: "かえります", romaji: "kaerimasu", en: "return", bn: "ফিরে আসা", cat: "Travel" }
];

// 2. Kanji Data (Added lesson and category)
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

// 3. Grammar Data (Lesson wise)
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

// 4. Counters (Specific Grouping)
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

// 5. Numbers (Specific Grouping)
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

// 6. Synonyms & Antonyms
const rawSynonyms = [
    { word: "大きい (Ookii)", synonym: "巨大 (Kyodai)", meaning: "Big / Huge", bn: "বড় / বিশাল" },
    { word: "綺麗 (Kirei)", synonym: "美しい (Utsukushii)", meaning: "Pretty / Beautiful", bn: "সুন্দর" }
];
const rawAntonyms = [
    { word: "高い (Takai)", antonym: "安い (Yasui)", meaning: "Expensive ↔ Cheap", bn: "দামি ↔ সস্তা" },
    { word: "暑い (Atsui)", antonym: "寒い (Samui)", meaning: "Hot ↔ Cold", bn: "গরম ↔ ঠান্ডা" }
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
        romaji: s.synonym, // Using romaji field for synonym display
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
        romaji: a.antonym, // Using romaji field for antonym display
        en: a.meaning,
        bn: a.bn,
        type: 'vocab',
        category: 'Antonyms'
    }));
};

// Kana Data Generator with Variations
const generateKana = (): LearningItem[] => {
    // Hiragana Data
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

    // Katakana Data
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

// --- EXPORTS ---

export const VOCAB_DATA = transformVocab();
export const KANJI_DATA = transformKanji();
export const GRAMMAR_DATA = transformGrammar();
export const COUNTER_DATA = transformCounters();
export const NUMBER_DATA = transformNumbers();
export const SYNONYM_DATA = transformSynonyms();
export const ANTONYM_DATA = transformAntonyms();
export const KANA_DATA = generateKana();

// Helper to get Phrases (Mock)
export const PHRASE_DATA: LearningItem[] = [
    { id: 'ph-1', ja: 'おはよう', romaji: 'ohayou', en: 'Good Morning', type: 'phrase' }
];

export const ALL_CONTENT = [
    ...VOCAB_DATA,
    ...KANJI_DATA,
    ...GRAMMAR_DATA,
    ...COUNTER_DATA,
    ...NUMBER_DATA,
    ...SYNONYM_DATA,
    ...ANTONYM_DATA,
    ...KANA_DATA,
    ...PHRASE_DATA
];

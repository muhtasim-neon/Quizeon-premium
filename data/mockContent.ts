
import { LearningItem, ConversationTopic } from '../types';

// --- DATA LISTS FOR UI DROPDOWNS ---

export const COUNTER_CATEGORIES = [
  'Things', 'Persons', 'Order', 'Thin & Flat Things', 'Machines & Vehicles', 'Age', 
  'Books & Notebooks', 'Clothes', 'Frequency', 'Small Things', 'Shoes & Socks', 
  'House', 'Floors of Building', 'Thin & Long Things', 'Drinks in Cups & Glasses', 'Small Animals & Fish'
];

export const NUMBER_CATEGORIES = [
  'Counting', 'Month', 'Time', 'Minute', 'Day', 'Date'
];

// --- CONFUSING PAIRS DATA ---
export const CONFUSING_PAIRS = [
    { id: 'shi-tsu', group: 'Katakana', label: 'Shi (シ) vs Tsu (ツ)', correct: 'シ', wrong: 'ツ', hint: 'Shi looks up (she looks up), Tsu looks down.' },
    { id: 'so-n', group: 'Katakana', label: 'So (ソ) vs N (ン)', correct: 'ソ', wrong: 'ン', hint: 'So aligns top-to-bottom, N aligns bottom-up.' },
    { id: 'sa-ki', group: 'Hiragana', label: 'Sa (さ) vs Ki (き)', correct: 'さ', wrong: 'き', hint: 'Ki has two keys (two lines), Sa has one.' },
    { id: 're-wa', group: 'Hiragana', label: 'Re (れ) vs Wa (わ)', correct: 'れ', wrong: 'わ', hint: 'Re kicks out at the end, Wa curves in.' },
    { id: 'nu-me', group: 'Hiragana', label: 'Nu (ぬ) vs Me (め)', correct: 'ぬ', wrong: 'め', hint: 'Nu has a noodle (loop) at the tail.' },
    { id: 'ru-ro', group: 'Hiragana', label: 'Ru (る) vs Ro (ろ)', correct: 'る', wrong: 'ろ', hint: 'Ru has a loop at the end.' }
];

// --- MOCK LEARNING DATA ---

export const VOCAB_DATA: LearningItem[] = [
  { id: 'v1', ja: '私', romaji: 'watashi', en: 'I', bn: 'আমি', type: 'vocab', category: 'People', lesson: 1 },
  { id: 'v2', ja: '学生', romaji: 'gakusei', en: 'Student', bn: 'ছাত্র', type: 'vocab', category: 'People', lesson: 1 },
  { id: 'v3', ja: '先生', romaji: 'sensei', en: 'Teacher', bn: 'শিক্ষক', type: 'vocab', category: 'People', lesson: 1 },
  { id: 'v4', ja: '学校', romaji: 'gakkou', en: 'School', bn: 'স্কুল', type: 'vocab', category: 'Place', lesson: 2 },
  { id: 'v5', ja: '食べる', romaji: 'taberu', en: 'To eat', bn: 'খাওয়া', type: 'vocab', category: 'Verb', lesson: 3 },
  { id: 'v6', ja: '見る', romaji: 'miru', en: 'To see', bn: 'দেখা', type: 'vocab', category: 'Verb', lesson: 3 },
  { id: 'v7', ja: '水', romaji: 'mizu', en: 'Water', bn: 'পানি', type: 'vocab', category: 'Food', lesson: 2 },
  { id: 'v8', ja: '本', romaji: 'hon', en: 'Book', bn: 'বই', type: 'vocab', category: 'Object', lesson: 2 },
];

export const KANA_DATA: LearningItem[] = [
  { id: 'k1', ja: 'あ', romaji: 'a', en: 'a', type: 'kana', category: 'Hiragana', variation: 'basic' },
  { id: 'k2', ja: 'い', romaji: 'i', en: 'i', type: 'kana', category: 'Hiragana', variation: 'basic' },
  { id: 'k3', ja: 'う', romaji: 'u', en: 'u', type: 'kana', category: 'Hiragana', variation: 'basic' },
  { id: 'k4', ja: 'え', romaji: 'e', en: 'e', type: 'kana', category: 'Hiragana', variation: 'basic' },
  { id: 'k5', ja: 'お', romaji: 'o', en: 'o', type: 'kana', category: 'Hiragana', variation: 'basic' },
  { id: 'k6', ja: 'か', romaji: 'ka', en: 'ka', type: 'kana', category: 'Hiragana', variation: 'basic' },
  { id: 'k7', ja: 'が', romaji: 'ga', en: 'ga', type: 'kana', category: 'Hiragana', variation: 'dakuten' },
  { id: 'k8', ja: 'きゃ', romaji: 'kya', en: 'kya', type: 'kana', category: 'Hiragana', variation: 'youon' },
  { id: 'k9', ja: 'ア', romaji: 'a', en: 'a', type: 'kana', category: 'Katakana', variation: 'basic' },
  { id: 'k10', ja: 'イ', romaji: 'i', en: 'i', type: 'kana', category: 'Katakana', variation: 'basic' },
  { id: 'k11', ja: 'ガ', romaji: 'ga', en: 'ga', type: 'kana', category: 'Katakana', variation: 'dakuten' },
  { id: 'k12', ja: 'キャ', romaji: 'kya', en: 'kya', type: 'kana', category: 'Katakana', variation: 'youon' },
];

export const KANJI_DATA: LearningItem[] = [
  { id: 'kj1', ja: '日', romaji: 'nichi', en: 'Day / Sun', bn: 'দিন / সূর্য', type: 'kanji', category: 'Time', lesson: 1 },
  { id: 'kj2', ja: '月', romaji: 'tsuki', en: 'Moon / Month', bn: 'চাঁদ / মাস', type: 'kanji', category: 'Time', lesson: 1 },
  { id: 'kj3', ja: '人', romaji: 'hito', en: 'Person', bn: 'ব্যক্তি', type: 'kanji', category: 'People', lesson: 2 },
  { id: 'kj4', ja: '山', romaji: 'yama', en: 'Mountain', bn: 'পাহাড়', type: 'kanji', category: 'Nature', lesson: 2 },
  { id: 'kj5', ja: '川', romaji: 'kawa', en: 'River', bn: 'নদী', type: 'kanji', category: 'Nature', lesson: 2 },
];

export const GRAMMAR_DATA: LearningItem[] = [
  { id: 'g1', ja: 'は (wa)', romaji: 'Topic Marker', en: 'Indicates the topic of the sentence', bn: 'বাক্যের বিষয় নির্দেশ করে', type: 'grammar', lesson: 1, usage: '私は学生です (Watashi wa gakusei desu)' },
  { id: 'g2', ja: 'か (ka)', romaji: 'Question Marker', en: 'Turns a sentence into a question', bn: 'প্রশ্নবোধক', type: 'grammar', lesson: 1, usage: '学生ですか (Gakusei desu ka)' },
  { id: 'g3', ja: 'の (no)', romaji: 'Possessive Particle', en: 'Indicates possession (like \'s)', bn: 'মালিকানা বোঝায়', type: 'grammar', lesson: 2, usage: '私の本 (Watashi no hon)' },
  { id: 'g4', ja: 'を (o)', romaji: 'Object Marker', en: 'Indicates the direct object of an action', bn: 'কর্ম নির্দেশ করে', type: 'grammar', lesson: 3, usage: '水を飲みます (Mizu o nomimasu)' },
];

export const COUNTER_DATA: LearningItem[] = [
  { id: 'c1', ja: '一つ', romaji: 'hitotsu', en: 'One thing', bn: 'একটি জিনিস', type: 'counter', group: 'Things' },
  { id: 'c2', ja: '二つ', romaji: 'futatsu', en: 'Two things', bn: 'দুটি জিনিস', type: 'counter', group: 'Things' },
  { id: 'c3', ja: '一人', romaji: 'hitori', en: 'One person', bn: 'একজন ব্যক্তি', type: 'counter', group: 'Persons' },
  { id: 'c4', ja: '二人', romaji: 'futari', en: 'Two people', bn: 'দুইজন ব্যক্তি', type: 'counter', group: 'Persons' },
  { id: 'c5', ja: '一匹', romaji: 'ippiki', en: 'One small animal', bn: 'একটি ছোট প্রাণী', type: 'counter', group: 'Small Animals & Fish' },
];

export const NUMBER_DATA: LearningItem[] = [
  { id: 'n1', ja: '一', romaji: 'ichi', en: 'One', bn: 'এক', type: 'number', group: 'Counting' },
  { id: 'n2', ja: '二', romaji: 'ni', en: 'Two', bn: 'দুই', type: 'number', group: 'Counting' },
  { id: 'n3', ja: '三', romaji: 'san', en: 'Three', bn: 'তিন', type: 'number', group: 'Counting' },
  { id: 'n4', ja: '一時', romaji: 'ichiji', en: '1 O\'clock', bn: '১টা', type: 'number', group: 'Time' },
  { id: 'n5', ja: '一月', romaji: 'ichigatsu', en: 'January', bn: 'জানুয়ারি', type: 'number', group: 'Month' },
];

export const SYNONYM_DATA: LearningItem[] = [
  { id: 's1', ja: '学生', romaji: 'gakusei', en: 'Student', synonym: '生徒 (seito)', type: 'vocab' },
  { id: 's2', ja: '医者', romaji: 'isha', en: 'Doctor', synonym: '医師 (ishi)', type: 'vocab' },
];

export const ANTONYM_DATA: LearningItem[] = [
  { id: 'a1', ja: '高い', romaji: 'takai', en: 'Expensive/High', antonym: '安い (yasui)', type: 'vocab' },
  { id: 'a2', ja: '大きい', romaji: 'ookii', en: 'Big', antonym: '小さい (chiisai)', type: 'vocab' },
  { id: 'a3', ja: '新しい', romaji: 'atarashii', en: 'New', antonym: '古い (furui)', type: 'vocab' },
];

export const LISTENING_DATA: LearningItem[] = [
  { id: 'l1', ja: 'おはようございます', romaji: 'ohayou gozaimasu', en: 'Good Morning', bn: 'শুভ সকাল', type: 'listening' },
  { id: 'l2', ja: 'ありがとうございます', romaji: 'arigatou gozaimasu', en: 'Thank you very much', bn: 'আপনাকে অনেক ধন্যবাদ', type: 'listening' },
  { id: 'l3', ja: 'すみません', romaji: 'sumimasen', en: 'Excuse me / Sorry', bn: 'মাফ করবেন', type: 'listening' },
];

export const FORMAL_INFORMAL_DATA: LearningItem[] = [
  { id: 'fi1', ja: '食べます', romaji: 'taberu', en: 'To eat', type: 'formal_informal' },
  { id: 'fi2', ja: '行きます', romaji: 'iku', en: 'To go', type: 'formal_informal' },
  { id: 'fi3', ja: '飲みます', romaji: 'nomu', en: 'To drink', type: 'formal_informal' },
  { id: 'fi4', ja: '見ます', romaji: 'miru', en: 'To see', type: 'formal_informal' },
];

// --- CONVERSATION DATA (NEW) ---

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
    createDialogue('meeting', 'Meeting', '初対面', [
        { s: 'A', j: 'はじめまして。田中です。', r: 'Hajimemashite. Tanaka desu.', e: 'Nice to meet you. I am Tanaka.', b: 'আপনার সাথে পরিচিত হয়ে ভালো লাগল। আমি তানাকা।' },
        { s: 'B', j: 'はじめまして。スミスです。', r: 'Hajimemashite. Sumisu desu.', e: 'Nice to meet you. I am Smith.', b: 'আপনার সাথে পরিচিত হয়ে ভালো লাগল। আমি স্মিথ।' },
        { s: 'A', j: 'お国はどちらですか？', r: 'Okuni wa dochira desu ka?', e: 'Where are you from?', b: 'আপনার দেশ কোথায়?' },
        { s: 'B', j: 'アメリカです。田中さんは？', r: 'Amerika desu. Tanaka-san wa?', e: 'USA. How about you, Tanaka-san?', b: 'আমেরিকা। আর আপনি?' },
        { s: 'A', j: '私は日本です。', r: 'Watashi wa Nihon desu.', e: 'I am from Japan.', b: 'আমি জাপান থেকে।' },
        { s: 'B', j: 'お仕事は何ですか？', r: 'Oshigoto wa nan desu ka?', e: 'What is your job?', b: 'আপনি কী করেন?' },
        { s: 'A', j: 'エンジニアです。スミスさんは？', r: 'Enjinia desu. Sumisu-san wa?', e: 'I am an engineer. And you?', b: 'আমি ইঞ্জিনিয়ার। আর আপনি?' },
        { s: 'B', j: '私は学生です。', r: 'Watashi wa gakusei desu.', e: 'I am a student.', b: 'আমি ছাত্র।' },
        { s: 'A', j: 'そうですか。日本は初めてですか？', r: 'Sou desu ka. Nihon wa hajimete desu ka?', e: 'Is that so? Is this your first time in Japan?', b: 'তাই নাকি? জাপানে কি প্রথমবার?' },
        { s: 'B', j: 'はい、初めてです。', r: 'Hai, hajimete desu.', e: 'Yes, it is my first time.', b: 'হ্যাঁ, এই প্রথম।' },
        { s: 'A', j: 'どうぞよろしく。', r: 'Douzo yoroshiku.', e: 'Pleased to meet you.', b: 'আপনার সাথে পরিচয়ে খুশি হলাম।' },
        { s: 'B', j: 'こちらこそ。', r: 'Kochira koso.', e: 'Likewise.', b: 'আমিও।' }
    ]),
    createDialogue('directions', 'Directions', '道案内', [
        { s: 'A', j: 'すみません、駅はどこですか？', r: 'Sumimasen, eki wa doko desu ka?', e: 'Excuse me, where is the station?', b: 'শুনুন, স্টেশনটা কোন দিকে?' },
        { s: 'B', j: 'この道をまっすぐ行ってください。', r: 'Kono michi o massugu itte kudasai.', e: 'Go straight along this road.', b: 'এই রাস্তা দিয়ে সোজা যান।' },
        { s: 'B', j: 'そして、信号を右に曲がってください。', r: 'Soshite, shingou o migi ni magatte kudasai.', e: 'Then, turn right at the traffic light.', b: 'তারপর, সিগন্যাল থেকে ডানে ঘুরবেন।' },
        { s: 'A', j: '遠いですか？', r: 'Tooi desu ka?', e: 'Is it far?', b: 'এটা কি দূরে?' },
        { s: 'B', j: 'いいえ、歩いて5分くらいです。', r: 'Iie, aruite go-fun kurai desu.', e: 'No, it takes about 5 minutes on foot.', b: 'না, হেঁটে ৫ মিনিটের মতো লাগবে।' }
    ]),
    createDialogue('clinic', 'Clinic', '病院で', [
        { s: 'A', j: 'どうしましたか？', r: 'Dou shimashita ka?', e: 'What is wrong?', b: 'কী সমস্যা হয়েছে?' },
        { s: 'B', j: '頭が痛いです。', r: 'Atama ga itai desu.', e: 'I have a headache.', b: 'আমার মাথা ব্যথা করছে।' },
        { s: 'B', j: '熱もあります。', r: 'Netsu mo arimasu.', e: 'I also have a fever.', b: 'জ্বরও আছে।' },
        { s: 'A', j: 'いつからですか？', r: 'Itsu kara desu ka?', e: 'Since when?', b: 'কবে থেকে?' },
        { s: 'B', j: '昨日からです。', r: 'Kinou kara desu.', e: 'Since yesterday.', b: 'গতকাল থেকে।' },
        { s: 'A', j: '口を開けてください。', r: 'Kuchi o akete kudasai.', e: 'Please open your mouth.', b: 'দয়া করে মুখ খুলুন।' },
        { s: 'A', j: '風邪ですね。薬を出します。', r: 'Kaze desu ne. Kusuri o dashimasu.', e: 'It is a cold. I will prescribe medicine.', b: 'ঠান্ডা লেগেছে। ওষুধ দিচ্ছি।' },
        { s: 'B', j: 'お風呂に入ってもいいですか？', r: 'Ofuro ni haitte mo ii desu ka?', e: 'Can I take a bath?', b: 'গোসল করতে পারব?' },
        { s: 'A', j: 'いいえ、今日は入らないでください。', r: 'Iie, kyou wa hairanaide kudasai.', e: 'No, please do not take a bath today.', b: 'না, আজ গোসল করবেন না।' },
        { s: 'B', j: 'わかりました。ありがとうございます。', r: 'Wakarimashita. Arigatou gozaimasu.', e: 'Understood. Thank you.', b: 'বুঝতে পেরেছি। ধন্যবাদ।' },
        { s: 'A', j: 'お大事に。', r: 'Odaiji ni.', e: 'Get well soon.', b: 'দ্রুত সুস্থ হয়ে উঠুন।' }
    ]),
    createDialogue('station', 'Station', '駅で', [
        { s: 'A', j: '東京までいくらですか？', r: 'Toukyou made ikura desu ka?', e: 'How much is it to Tokyo?', b: 'টোকিও যেতে কত লাগবে?' },
        { s: 'B', j: '200円です。', r: 'Nihyakuen desu.', e: 'It is 200 yen.', b: '২০০ ইয়েন।' },
        { s: 'A', j: '何番線ですか？', r: 'Nanbansen desu ka?', e: 'Which platform is it?', b: 'কত নম্বর প্ল্যাটফর্ম?' },
        { s: 'B', j: '3番線です。', r: 'Sanbansen desu.', e: 'It is platform 3.', b: '৩ নম্বর প্ল্যাটফর্ম।' },
        { s: 'A', j: '次の電車は何時ですか？', r: 'Tsugi no densha wa nanji desu ka?', e: 'What time is the next train?', b: 'পরের ট্রেন কয়টায়?' },
        { s: 'B', j: '10時半です。', r: 'Juujihan desu.', e: 'It is at 10:30.', b: 'সাড়ে দশটায়।' }
    ]),
    createDialogue('hotel', 'Hotel', 'ホテル', [
        { s: 'A', j: 'チェックインをお願いします。', r: 'Chekkuin o onegaishimasu.', e: 'Check-in, please.', b: 'চেক-ইন করতে চাই।' },
        { s: 'B', j: 'お名前をお願いします。', r: 'Onamae o onegaishimasu.', e: 'Your name, please.', b: 'আপনার নামটা বলুন।' },
        { s: 'A', j: '田中です。予約しています。', r: 'Tanaka desu. Yoyaku shiteimasu.', e: 'I am Tanaka. I have a reservation.', b: 'আমি তানাকা। রিজার্ভেশন করা আছে।' },
        { s: 'B', j: 'はい、田中様ですね。', r: 'Hai, Tanaka-sama desu ne.', e: 'Yes, Mr./Ms. Tanaka.', b: 'হ্যাঁ, মিস্টার তানাকা।' },
        { s: 'B', j: '朝食は7時からです。', r: 'Choushoku wa shichiji kara desu.', e: 'Breakfast starts at 7:00.', b: 'সকালের নাস্তা ৭টা থেকে।' },
        { s: 'A', j: '部屋は禁煙ですか？', r: 'Heya wa kin\'en desu ka?', e: 'Is the room non-smoking?', b: 'রুমটা কি ধুমপানমুক্ত?' },
        { s: 'B', j: 'はい、そうです。', r: 'Hai, sou desu.', e: 'Yes, it is.', b: 'হ্যাঁ, তাই।' }
    ]),
    createDialogue('hobbies', 'Hobbies', '趣味の話', [
        { s: 'A', j: '趣味は何ですか？', r: 'Shumi wa nan desu ka?', e: 'What is your hobby?', b: 'আপনার শখ কী?' },
        { s: 'B', j: '映画を見ることです。', r: 'Eiga o miru koto desu.', e: 'It is watching movies.', b: 'মুভি দেখা।' },
        { s: 'A', j: 'どんな映画が好きですか？', r: 'Donna eiga ga suki desu ka?', e: 'What kind of movies do you like?', b: 'কী ধরনের মুভি পছন্দ করেন?' },
        { s: 'B', j: 'アクション映画が好きです。', r: 'Akushon eiga ga suki desu.', e: 'I like action movies.', b: 'অ্যাকশন মুভি পছন্দ করি।' },
        { s: 'A', j: 'そうですか。私も好きです。', r: 'Sou desu ka. Watashi mo suki desu.', e: 'Is that so? I like them too.', b: 'তাই নাকি? আমিও পছন্দ করি।' },
        { s: 'B', j: '週末は何をしますか？', r: 'Shuumatsu wa nani o shimasu ka?', e: 'What do you do on weekends?', b: 'সাপ্তাহিক ছুটির দিনে কী করেন?' },
        { s: 'A', j: 'テニスをします。', r: 'Tenisu o shimasu.', e: 'I play tennis.', b: 'টেনিস খেলি।' }
    ]),
    createDialogue('weather', 'Weather', '天気の挨拶', [
        { s: 'A', j: 'いい天気ですね。', r: 'Ii tenki desu ne.', e: 'It is nice weather, isn\'t it?', b: 'চমৎকার আবহাওয়া, তাই না?' },
        { s: 'B', j: 'そうですね。でも、ちょっと暑いです。', r: 'Sou desu ne. Demo, chotto atsui desu.', e: 'Yes, it is. But it is a bit hot.', b: 'হ্যাঁ। কিন্তু একটু গরম লাগছে।' },
        { s: 'A', j: '明日は雨が降るそうですよ。', r: 'Ashita wa ame ga furu sou desu yo.', e: 'I heard it will rain tomorrow.', b: 'শুনেছি আগামীকাল বৃষ্টি হবে।' },
        { s: 'B', j: 'えっ、本当ですか？困りましたね。', r: 'Eh, hontou desu ka? Komarimashita ne.', e: 'Eh, really? That is a problem.', b: 'অ্যাঁ, সত্যিই? তাহলে তো সমস্যা।' }
    ]),
    createDialogue('conveni', 'Conveni', 'コンビニ', [
        { s: 'A', j: 'お弁当を温めますか？', r: 'Obentou o atatamemasu ka?', e: 'Shall I warm up the bento?', b: 'বেন্তোটা কি গরম করে দেব?' },
        { s: 'B', j: 'はい、お願いします。', r: 'Hai, onegaishimasu.', e: 'Yes, please.', b: 'হ্যাঁ, প্লিজ।' },
        { s: 'A', j: 'お箸はご利用ですか？', r: 'Ohashi wa goriyou desu ka?', e: 'Would you like chopsticks?', b: 'চপস্টিক লাগবে কি?' },
        { s: 'B', j: 'はい、一膳ください。', r: 'Hai, ichizen kudasai.', e: 'Yes, one pair please.', b: 'হ্যাঁ, এক জোড়া দিন।' },
        { s: 'A', j: '袋は分けますか？', r: 'Fukuro wa wakemasu ka?', e: 'Shall I separate the bags?', b: 'ব্যাগ কি আলাদা করে দেব?' },
        { s: 'B', j: 'いいえ、一緒でいいです。', r: 'Iie, issho de ii desu.', e: 'No, together is fine.', b: 'না, একসাথে দিলেই হবে।' }
    ]),
    createDialogue('postoffice', 'Post Office', '郵便局', [
        { s: 'A', j: 'これをアメリカへ送りたいんですが。', r: 'Kore o Amerika e okuritai ndesu ga.', e: 'I want to send this to America.', b: 'আমি এটা আমেরিকায় পাঠাতে চাই।' },
        { s: 'B', j: '船便ですか？航空便ですか？', r: 'Funabin desu ka? Koukuubin desu ka?', e: 'Surface mail or Airmail?', b: 'জাহাজে নাকি বিমানে?' },
        { s: 'A', j: '航空便でお願いします。いくらですか？', r: 'Koukuubin de onegaishimasu. Ikura desu ka?', e: 'Airmail please. How much is it?', b: 'বিমানে প্লিজ। কত লাগবে?' },
        { s: 'B', j: '500円です。1週間くらいかかります。', r: 'Gohyaku-en desu. Isshuukan kurai kakarimasu.', e: 'It is 500 yen. It takes about one week.', b: '৫০০ ইয়েন। প্রায় এক সপ্তাহ লাগবে।' }
    ]),
    createDialogue('library', 'Library', '図書館', [
        { s: 'A', j: 'この本を借りたいです。', r: 'Kono hon o karitai desu.', e: 'I want to borrow this book.', b: 'আমি এই বইটা ধার নিতে চাই।' },
        { s: 'B', j: 'カードを持っていますか？', r: 'Kaado o motteimasu ka?', e: 'Do you have a card?', b: 'আপনার কি কার্ড আছে?' },
        { s: 'A', j: 'はい、これです。', r: 'Hai, kore desu.', e: 'Yes, here it is.', b: 'হ্যাঁ, এই যে।' },
        { s: 'B', j: '2週間借りられます。', r: 'Nishuukan kariraremasu.', e: 'You can borrow it for 2 weeks.', b: 'দুই সপ্তাহের জন্য নিতে পারবেন।' },
        { s: 'A', j: '何時まで開いていますか？', r: 'Nanji made aiteimasu ka?', e: 'Until what time are you open?', b: 'কয়টা পর্যন্ত খোলা থাকে?' },
        { s: 'B', j: '午後8時までです。', r: 'Gogo hachiji made desu.', e: 'Until 8:00 PM.', b: 'রাত ৮টা পর্যন্ত।' }
    ]),
    createDialogue('plans', 'Plans', '誘う', [
        { s: 'A', j: '今度の土曜日、暇ですか？', r: 'Kondo no doyoubi, hima desu ka?', e: 'Are you free this coming Saturday?', b: 'এই শনিবারে কি ফ্রি আছেন?' },
        { s: 'B', j: 'はい、暇ですよ。どうしてですか？', r: 'Hai, hima desu yo. Doushite desu ka?', e: 'Yes, I am free. Why?', b: 'হ্যাঁ, ফ্রি আছি। কেন?' },
        { s: 'A', j: '一緒に映画を見に行きませんか？', r: 'Issho ni eiga o mi ni ikimasen ka?', e: 'Would you like to go see a movie together?', b: 'একসাথে মুভি দেখতে যাবেন?' },
        { s: 'B', j: 'いいですね。行きましょう。', r: 'Ii desu ne. Ikimashou.', e: 'That sounds good. Let\'s go.', b: 'ভালো তো। চলুন যাই।' },
        { s: 'A', j: '何を見ますか？', r: 'Nani o mimasu ka?', e: 'What shall we watch?', b: 'কী দেখব?' },
        { s: 'B', j: '新しいアニメを見たいです。', r: 'Atarashii anime o mitai desu.', e: 'I want to see the new anime.', b: 'নতুন অ্যানিমেটা দেখতে চাই।' }
    ]),
    createDialogue('bank', 'Bank', '銀行', [
        { s: 'A', j: '口座を作りたいんですが。', r: 'Kouza o tsukuritai ndesu ga.', e: 'I would like to open an account.', b: 'আমি একটা অ্যাকাউন্ট খুলতে চাই।' },
        { s: 'B', j: '身分証明書はお持ちですか？', r: 'Mibunshoumeisho wa omochi desu ka?', e: 'Do you have identification?', b: 'আপনার কাছে কি আইডি কার্ড আছে?' },
        { s: 'A', j: 'はい、在留カードがあります。', r: 'Hai, zairyuukaado ga arimasu.', e: 'Yes, I have a residence card.', b: 'হ্যাঁ, রেসিডেন্স কার্ড আছে।' },
        { s: 'B', j: 'ここに名前と住所を書いてください。', r: 'Koko ni namae to juusho o kaite kudasai.', e: 'Please write your name and address here.', b: 'এখানে নাম আর ঠিকানা লিখুন।' },
        { s: 'A', j: 'ハンコは必要ですか？', r: 'Hanko wa hitsuyou desu ka?', e: 'Is a seal necessary?', b: 'সিল কি লাগবে?' },
        { s: 'B', j: 'はい、お願いします。', r: 'Hai, onegaishimasu.', e: 'Yes, please.', b: 'হ্যাঁ, লাগবে।' }
    ]),
    createDialogue('party', 'Party', '誕生日', [
        { s: 'A', j: '乾杯！', r: 'Kanpai!', e: 'Cheers!', b: 'চিয়ার্স!' },
        { s: 'B', j: 'お誕生日おめでとうございます！', r: 'Otanjoubi omedetou gozaimasu!', e: 'Happy Birthday!', b: 'শুভ জন্মদিন!' },
        { s: 'A', j: 'ありがとうございます。', r: 'Arigatou gozaimasu.', e: 'Thank you.', b: 'ধন্যবাদ।' },
        { s: 'B', j: 'これはプレゼントです。', r: 'Kore wa purezento desu.', e: 'This is a present.', b: 'এটা আপনার উপহার।' },
        { s: 'A', j: 'わあ、ありがとうございます。開けてもいいですか？', r: 'Waa, arigatou gozaimasu. Akete mo ii desu ka?', e: 'Wow, thank you. May I open it?', b: 'ওয়াও, ধন্যবাদ। খুলে দেখতে পারি?' },
        { s: 'B', j: 'はい、どうぞ。', r: 'Hai, douzo.', e: 'Yes, go ahead.', b: 'হ্যাঁ, দেখুন।' },
        { s: 'A', j: '素敵な時計ですね！', r: 'Suteki na tokei desu ne!', e: 'It is a lovely watch!', b: 'খুব সুন্দর ঘড়ি!' }
    ]),
    createDialogue('visit', 'Visit', '家を訪問', [
        { s: 'A', j: 'ごめんください。', r: 'Gomen kudasai.', e: 'Hello? (May I come in?)', b: 'হ্যালো? কেউ আছেন?' },
        { s: 'B', j: 'いらっしゃい。どうぞ上がってください。', r: 'Irasshai. Douzo agatte kudasai.', e: 'Welcome. Please come in.', b: 'আসুন। প্লিজ ভিতরে আসুন।' },
        { s: 'A', j: 'お邪魔します。', r: 'Ojama shimasu.', e: 'Excuse me for disturbing you.', b: 'আপনাকে বিরক্ত করলাম (ভিতরে আসার সময়)।' },
        { s: 'B', j: 'コーヒーはいかがですか？', r: 'Koohii wa ikaga desu ka?', e: 'Would you like some coffee?', b: 'কফি খাবেন?' },
        { s: 'A', j: 'いただきます。', r: 'Itadakimasu.', e: 'Yes, please.', b: 'হ্যাঁ, খাব।' },
        { s: 'B', j: 'どうぞ、召し上がってください。', r: 'Douzo, meshiagatte kudasai.', e: 'Please, have some.', b: 'নিন, খান।' },
        { s: 'A', j: 'そろそろ失礼します。', r: 'Sorosoro shitsurei shimasu.', e: 'I should be going soon.', b: 'এবার আমাকে উঠতে হবে।' },
        { s: 'B', j: 'また来てくださいね。', r: 'Mata kite kudasai ne.', e: 'Please come again.', b: 'আবার আসবেন কিন্তু।' }
    ])
];
    
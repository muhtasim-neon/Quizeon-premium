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
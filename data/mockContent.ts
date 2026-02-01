import { LearningItem } from '../types';

export const KANA_DATA: LearningItem[] = [
  { id: 'k-a', ja: 'あ', romaji: 'a', en: 'a', type: 'kana', category: 'basic' },
  { id: 'k-i', ja: 'い', romaji: 'i', en: 'i', type: 'kana', category: 'basic' },
  { id: 'k-u', ja: 'う', romaji: 'u', en: 'u', type: 'kana', category: 'basic' },
  { id: 'k-e', ja: 'え', romaji: 'e', en: 'e', type: 'kana', category: 'basic' },
  { id: 'k-o', ja: 'お', romaji: 'o', en: 'o', type: 'kana', category: 'basic' },
  { id: 'k-ka', ja: 'か', romaji: 'ka', en: 'ka', type: 'kana', category: 'basic' },
  { id: 'k-ga', ja: 'が', romaji: 'ga', en: 'ga', type: 'kana', category: 'dakuten' },
];

export const VOCAB_DATA: LearningItem[] = [
  { id: 'v-1', ja: 'わたし', romaji: 'watashi', en: 'I', bn: 'আমি', type: 'vocab', category: 'people' },
  { id: 'v-2', ja: 'がくせい', romaji: 'gakusei', en: 'student', bn: 'ছাত্র', type: 'vocab', category: 'people' },
  { id: 'v-3', ja: 'せんせい', romaji: 'sensei', en: 'teacher', bn: 'শিক্ষক', type: 'vocab', category: 'people' },
  { id: 'v-4', ja: 'ねこ', romaji: 'neko', en: 'cat', bn: 'বিড়াল', type: 'vocab', category: 'animals' },
  { id: 'v-5', ja: 'いぬ', romaji: 'inu', en: 'dog', bn: 'কুকুর', type: 'vocab', category: 'animals' },
  { id: 'v-6', ja: 'ほん', romaji: 'hon', en: 'book', bn: 'বই', type: 'vocab', category: 'objects' },
  { id: 'v-7', ja: 'たべる', romaji: 'taberu', en: 'to eat', bn: 'খাওয়া', type: 'vocab', category: 'verbs' },
  { id: 'v-8', ja: 'のむ', romaji: 'nomu', en: 'to drink', bn: 'পান করা', type: 'vocab', category: 'verbs' },
];

export const KANJI_DATA: LearningItem[] = [
  { id: 'kj-1', ja: '一', romaji: 'ichi', en: 'One', type: 'kanji', category: 'numbers' },
  { id: 'kj-2', ja: '二', romaji: 'ni', en: 'Two', type: 'kanji', category: 'numbers' },
  { id: 'kj-3', ja: '三', romaji: 'san', en: 'Three', type: 'kanji', category: 'numbers' },
  { id: 'kj-4', ja: '人', romaji: 'hito/jin', en: 'Person', type: 'kanji', category: 'people' },
  { id: 'kj-5', ja: '日', romaji: 'hi/nichi', en: 'Day/Sun', type: 'kanji', category: 'time' },
  { id: 'kj-6', ja: '月', romaji: 'tsuki/getsu', en: 'Moon/Month', type: 'kanji', category: 'time' },
];

export const GRAMMAR_DATA: LearningItem[] = [
  { id: 'g-1', ja: 'は (wa)', romaji: 'Topic Marker', en: 'Indicates the topic of the sentence', type: 'grammar', category: 'particles' },
  { id: 'g-2', ja: 'か (ka)', romaji: 'Question Marker', en: 'Turns a sentence into a question', type: 'grammar', category: 'particles' },
  { id: 'g-3', ja: 'です (desu)', romaji: 'Copula', en: 'To be (is/am/are)', type: 'grammar', category: 'basic' },
];

export const ALL_CONTENT = [...KANA_DATA, ...VOCAB_DATA, ...KANJI_DATA, ...GRAMMAR_DATA];

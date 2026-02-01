import React from 'react';

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'student';
  avatar?: string;
  streak?: number;
  xp?: number;
}

export interface LearningItem {
  id: string;
  ja: string; // Japanese text (Kanji/Kana)
  romaji: string;
  en: string; // English meaning
  bn?: string; // Bengali meaning
  type: 'vocab' | 'kanji' | 'grammar' | 'kana';
  category?: string; // e.g., 'greetings', 'numbers', 'verbs'
  audio?: string; // URL to audio
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  type: 'text' | 'audio';
}

export interface MistakeRecord {
  itemId: string;
  item: LearningItem;
  timestamp: number;
  count: number;
}

export interface StudyDocument {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'doc';
  url: string; // data url or mock url
  uploadDate: string;
  size: string;
}

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  color?: string;
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  time: string;
  status: 'success' | 'warning' | 'error';
}

// --- New Types for AI & Advanced Features ---

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface StoryContent {
  title: string;
  japanese: string;
  english: string;
  vocab: { word: string; meaning: string }[];
  quiz: { question: string; options: string[]; answer: string }[];
}

export interface SkillStats {
  subject: string;
  A: number; // Current Level
  fullMark: number;
}

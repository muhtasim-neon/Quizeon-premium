
import React from 'react';

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'student';
  avatar?: string;
  streak?: number;
  xp?: number;
  email?: string;
  // New fields for Admin Analytics
  subscription: 'free' | 'premium';
  joinedDate?: string;
  lastActive?: string;
  mostUsedSection?: string; // e.g., 'Arcade', 'Kanji', 'Reading'
  provider?: string; // e.g., 'email', 'google'
  metadata?: any; // Store raw Supabase/Auth data for Admin inspection
}

export interface ContentAnalytics {
  category: string;
  views: number;
  likes: number;
  avgTimeSpent: string;
  userRetention: number; // percentage
}

export interface LearningItem {
  id: string;
  ja: string; // Japanese text (Kanji/Kana) or Grammar Rule or Formal Form
  romaji: string; // Romaji or Informal Form
  en: string; // English meaning or Explanation
  bn?: string; // Bengali meaning
  type: 'vocab' | 'kanji' | 'grammar' | 'kana' | 'phrase' | 'conjugation' | 'counter' | 'number' | 'listening' | 'formal_informal';
  category?: string; // General category tag
  
  // Advanced Filtering Fields
  lesson?: number; // Minna no Nihongo Lesson Number
  variation?: 'basic' | 'dakuten' | 'youon'; // For Kana
  group?: string; // For Counters/Numbers specific grouping (e.g. 'Machines', 'Time')

  audio?: string; // URL to audio
  
  // New optional fields for advanced data
  usage?: string; // For counters/grammar
  examples?: string; // For counters/grammar
  synonym?: string;
  antonym?: string;
}

export interface SRSItemState {
  id: string;
  nextReview: number; // Timestamp
  interval: number;   // Days
  easeFactor: number; // Multiplier
  streak: number;
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

export interface ActivityHeatmapData {
  date: string;
  count: number;
}

export interface SkillTreeNode {
  id: string;
  title: string;
  jpTitle: string;
  status: 'locked' | 'unlocked' | 'completed';
  icon: string;
  children?: string[]; // IDs of child nodes
  requiredXP?: number;
}

export interface MasteryBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  category: 'vocab' | 'kanji' | 'grammar' | 'culture';
}

export interface SRSHealthData {
  category: string;
  health: number; // 0-100
  dueCount: number;
  nextReviewDate: string;
}

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
  bangla?: string; // Added field
  vocab: { word: string; meaning: string }[];
  quiz: { question: string; options: string[]; answer: string }[];
}

export interface SongLine {
  kana: string; // Only Hiragana/Katakana
  romaji: string;
  en: string;
  bn: string;
}

export interface SongContent {
  title: string;
  genre: string; // e.g. "Pop", "Rap", "Ballad"
  lyrics: SongLine[];
}

export interface SkillStats {
  subject: string;
  A: number; // Current Level
  fullMark: number;
}

// --- Conversation Types ---

export interface ConversationLine {
  speaker: 'A' | 'B';
  ja: string;
  romaji: string;
  en: string;
  bn: string;
}

export interface ConversationTopic {
  id: string;
  title: string; // English Title
  jpTitle: string; // Japanese Title
  lines: ConversationLine[];
}

// --- RPG & Gamification Types ---

export interface JourneyState {
  currentCity: string;
  progress: number; // 0-100 within the city
  unlockedCities: string[];
}

export interface PetState {
  type: 'tanuki' | 'neko';
  hunger: number; // 0-100
  happiness: number; // 0-100
  lastFed: number; // Timestamp
}

export interface GamanState {
  points: number;
  level: number;
}

export interface SakuraState {
  stage: 'seedling' | 'sprout' | 'young' | 'adult' | 'blooming';
  blooms: number; // 0-100
}

export type SamuraiRank = 'Ronin' | 'Ashigaru' | 'Samurai' | 'Shogun';

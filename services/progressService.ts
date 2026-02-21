import { LearningItem, MistakeRecord, SRSItemState } from '../types';
import { supabase } from './supabaseClient';

const MISTAKES_KEY = 'quizeon_mistakes';
const SCORES_KEY = 'quizeon_quiz_scores';
const SRS_KEY = 'quizeon_srs_data';

export const progressService = {
  // --- XP & Stats ---
  addXP: async (amount: number) => {
    let currentXp = 0;

    // 1. Local update
    const userStr = localStorage.getItem('quizeon_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      user.xp = (user.xp || 0) + amount;
      currentXp = user.xp;
      localStorage.setItem('quizeon_user', JSON.stringify(user));
    }

    // 2. Supabase update (Sync to Cloud)
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
        // Fetch current meta XP if local wasn't available (e.g. fresh session)
        const metaXp = session.user.user_metadata.xp || 0;
        const newXp = (userStr ? currentXp : metaXp + amount);

        // Update User Metadata (easiest way to persist without complex tables)
        await supabase.auth.updateUser({
            data: { xp: newXp }
        });
        
        // Optional: Update 'profiles' table if it exists
        try {
            await supabase.from('profiles').update({ xp: newXp }).eq('id', session.user.id);
        } catch (e) {
            // Ignore table errors if schema doesn't exist
        }
    }

    // Dispatch event to update UI immediately
    window.dispatchEvent(new Event('user-update'));
    return currentXp;
  },

  // --- Mistakes System ---
  addMistake: (item: LearningItem) => {
    const existing = localStorage.getItem(MISTAKES_KEY);
    let mistakes: MistakeRecord[] = existing ? JSON.parse(existing) : [];
    
    const index = mistakes.findIndex(m => m.itemId === item.id);
    if (index >= 0) {
      mistakes[index].count += 1;
      mistakes[index].timestamp = Date.now();
    } else {
      mistakes.push({
        itemId: item.id,
        item: item,
        timestamp: Date.now(),
        count: 1
      });
    }
    localStorage.setItem(MISTAKES_KEY, JSON.stringify(mistakes));
  },

  getMistakes: (): MistakeRecord[] => {
    const existing = localStorage.getItem(MISTAKES_KEY);
    return existing ? JSON.parse(existing) : [];
  },

  clearMistakes: () => {
    localStorage.removeItem(MISTAKES_KEY);
  },

  removeMistake: (itemId: string) => {
    const existing = localStorage.getItem(MISTAKES_KEY);
    if (existing) {
      let mistakes: MistakeRecord[] = JSON.parse(existing);
      mistakes = mistakes.filter(m => m.itemId !== itemId);
      localStorage.setItem(MISTAKES_KEY, JSON.stringify(mistakes));
    }
  },

  // --- Score Tracking for Checklist ---
  saveQuizScore: (id: string, percentage: number) => {
    const existing = localStorage.getItem(SCORES_KEY);
    const scores: Record<string, number> = existing ? JSON.parse(existing) : {};
    
    // Only update if the new score is higher or key doesn't exist
    if (!scores[id] || percentage > scores[id]) {
        scores[id] = percentage;
        localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
    }
  },

  getQuizScore: (id: string): number | null => {
    const existing = localStorage.getItem(SCORES_KEY);
    if (!existing) return null;
    const scores = JSON.parse(existing);
    return scores[id] !== undefined ? scores[id] : null;
  },

  getAllScores: (): Record<string, number> => {
      const existing = localStorage.getItem(SCORES_KEY);
      return existing ? JSON.parse(existing) : {};
  },

  getCompletedLessons: (): string[] => {
    // Derived from scores > 80
    const scores = progressService.getAllScores();
    return Object.keys(scores).filter(key => scores[key] >= 80);
  },
  
  // Legacy method support (forwarding to saveQuizScore with 100%)
  markLessonComplete: (id: string) => {
      progressService.saveQuizScore(id, 100);
  },

  // --- SRS (Spaced Repetition) System ---
  
  getSRSStats: (): Record<string, SRSItemState> => {
    const existing = localStorage.getItem(SRS_KEY);
    return existing ? JSON.parse(existing) : {};
  },

  getSRSDueCount: (): number => {
    const stats = progressService.getSRSStats();
    const now = Date.now();
    return Object.values(stats).filter((item: SRSItemState) => item.nextReview <= now).length;
  },

  updateSRSItem: (itemId: string, isCorrect: boolean) => {
    const stats = progressService.getSRSStats();
    
    let itemStat = stats[itemId] || {
      id: itemId,
      nextReview: 0,
      interval: 0, // 0 days (review immediately/tomorrow)
      easeFactor: 2.5,
      streak: 0
    };

    if (isCorrect) {
      // Logic: SuperMemo-2 simplified
      if (itemStat.streak === 0) {
        itemStat.interval = 1;
      } else if (itemStat.streak === 1) {
        itemStat.interval = 3;
      } else {
        itemStat.interval = Math.round(itemStat.interval * itemStat.easeFactor);
      }
      itemStat.streak += 1;
      // Ease factor stays same or slightly increases for ease
      itemStat.easeFactor = Math.min(itemStat.easeFactor + 0.1, 2.5); // Max cap
    } else {
      // Reset if wrong
      itemStat.streak = 0;
      itemStat.interval = 1; // Review tomorrow
      itemStat.easeFactor = Math.max(itemStat.easeFactor - 0.2, 1.3); // Min cap
    }

    // Calculate next review date (Interval * 24 hours)
    itemStat.nextReview = Date.now() + (itemStat.interval * 24 * 60 * 60 * 1000);

    stats[itemId] = itemStat;
    localStorage.setItem(SRS_KEY, JSON.stringify(stats));
    
    // Notify app of SRS changes
    window.dispatchEvent(new Event('srs-update'));
  },

  // --- New Dashboard Features Mock Data ---
  
  getHeatmapData: () => {
    const data: any[] = [];
    const now = new Date();
    for (let i = 0; i < 90; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 5)
      });
    }
    return data.reverse();
  },

  getSkillTree: () => {
    return [
      { id: 'hiragana', title: 'Hiragana', jpTitle: 'ひらがな', status: 'completed', icon: 'あ', children: ['katakana'] },
      { id: 'katakana', title: 'Katakana', jpTitle: 'カタカナ', status: 'unlocked', icon: 'ア', children: ['vocab-basic'] },
      { id: 'vocab-basic', title: 'Basic Vocab', jpTitle: '基本単語', status: 'locked', icon: '本', children: ['n5-grammar'], requiredXP: 2000 },
      { id: 'n5-grammar', title: 'N5 Grammar', jpTitle: 'N5文法', status: 'locked', icon: 'は', requiredXP: 5000 },
    ];
  },

  getMasteryBadges: () => {
    return [
      { id: 'food-ninja', name: 'Food Ninja', description: 'Mastered 50 food-related words', icon: '🍱', unlocked: true, category: 'vocab' },
      { id: 'animal-master', name: 'Animal Master', description: 'Mastered 30 animal names', icon: '🦁', unlocked: false, category: 'vocab' },
      { id: 'kanji-king', name: 'Kanji King', description: 'Learned 100 Kanji', icon: '👑', unlocked: false, category: 'kanji' },
    ];
  },

  getSRSHealth: () => {
    return [
      { category: 'Hiragana', health: 95, dueCount: 0, nextReviewDate: 'Tomorrow' },
      { category: 'Katakana', health: 80, dueCount: 5, nextReviewDate: 'Today' },
      { category: 'N5 Kanji', health: 45, dueCount: 12, nextReviewDate: 'Now' },
      { category: 'Vocab', health: 60, dueCount: 8, nextReviewDate: 'Today' },
    ];
  },

  // --- RPG & Gamification Methods ---

  getJourneyState: () => {
    const existing = localStorage.getItem('quizeon_journey');
    return existing ? JSON.parse(existing) : {
      currentCity: 'Tokyo',
      progress: 0,
      unlockedCities: ['Tokyo']
    };
  },

  updateJourneyProgress: (amount: number) => {
    const state = progressService.getJourneyState();
    state.progress += amount;
    if (state.progress >= 100) {
      state.progress = 0;
      const cities = ['Tokyo', 'Osaka', 'Kyoto', 'Hiroshima', 'Sapporo'];
      const currentIndex = cities.indexOf(state.currentCity);
      if (currentIndex < cities.length - 1) {
        state.currentCity = cities[currentIndex + 1];
        if (!state.unlockedCities.includes(state.currentCity)) {
          state.unlockedCities.push(state.currentCity);
        }
      }
    }
    localStorage.setItem('quizeon_journey', JSON.stringify(state));
    window.dispatchEvent(new Event('journey-update'));
  },

  getPetState: () => {
    const existing = localStorage.getItem('quizeon_pet');
    if (!existing) {
      return { type: 'tanuki', hunger: 50, happiness: 50, lastFed: Date.now() };
    }
    const state = JSON.parse(existing);
    const hoursSinceFed = (Date.now() - state.lastFed) / (1000 * 60 * 60);
    state.hunger = Math.max(0, state.hunger - hoursSinceFed * 5);
    state.happiness = Math.max(0, state.happiness - hoursSinceFed * 2);
    return state;
  },

  feedPet: () => {
    const state = progressService.getPetState();
    state.hunger = Math.min(100, state.hunger + 20);
    state.happiness = Math.min(100, state.happiness + 10);
    state.lastFed = Date.now();
    localStorage.setItem('quizeon_pet', JSON.stringify(state));
    window.dispatchEvent(new Event('pet-update'));
  },

  getGamanState: () => {
    const existing = localStorage.getItem('quizeon_gaman');
    return existing ? JSON.parse(existing) : { points: 0, level: 1 };
  },

  addGamanPoints: (points: number) => {
    const state = progressService.getGamanState();
    state.points += points;
    if (state.points >= state.level * 100) {
      state.points = 0;
      state.level += 1;
    }
    localStorage.setItem('quizeon_gaman', JSON.stringify(state));
    window.dispatchEvent(new Event('gaman-update'));
  },

  getSeasonalEvent: () => {
    const month = new Date().getMonth();
    const events = [
      { month: 0, name: 'Oshogatsu', vocab: '初詣 (Hatsumode)', description: 'New Year shrine visit.' },
      { month: 1, name: 'Setsubun', vocab: '豆まき (Mamemaki)', description: 'Bean-throwing festival.' },
      { month: 2, name: 'Hinamatsuri', vocab: '雛祭り (Hinamatsuri)', description: 'Doll Festival.' },
      { month: 3, name: 'Hanami', vocab: '桜 (Sakura)', description: 'Cherry blossom viewing.' },
      { month: 4, name: 'Kodomo no Hi', vocab: '鯉のぼり (Koinobori)', description: 'Children\'s Day.' },
      { month: 5, name: 'Tsuyu', vocab: '紫陽花 (Ajisai)', description: 'Rainy season.' },
      { month: 6, name: 'Tanabata', vocab: '七夕 (Tanabata)', description: 'Star Festival.' },
      { month: 7, name: 'Obon', vocab: '盆踊り (Bon Odori)', description: 'Festival of Souls.' },
      { month: 8, name: 'Tsukimi', vocab: '月見 (Tsukimi)', description: 'Moon viewing.' },
      { month: 9, name: 'Halloween', vocab: '仮装 (Kasou)', description: 'Costume parties.' },
      { month: 10, name: 'Shichi-Go-San', vocab: '七五三 (Shichi-Go-San)', description: 'Children\'s festival.' },
      { month: 11, name: 'Omisoka', vocab: '年越しそば (Toshikoshi Soba)', description: 'New Year\'s Eve.' },
    ];
    return events.find(e => e.month === month);
  },

  // --- New Theme & Analytics Methods ---

  getSakuraState: () => {
    const existing = localStorage.getItem('quizeon_sakura');
    if (existing) return JSON.parse(existing);
    
    // Default state based on XP
    const userStr = localStorage.getItem('quizeon_user');
    const xp = userStr ? JSON.parse(userStr).xp || 0 : 0;
    
    let stage: 'seedling' | 'sprout' | 'young' | 'adult' | 'blooming' = 'seedling';
    if (xp > 5000) stage = 'blooming';
    else if (xp > 3000) stage = 'adult';
    else if (xp > 1500) stage = 'young';
    else if (xp > 500) stage = 'sprout';

    return { stage, blooms: Math.min(100, (xp % 500) / 5) };
  },

  getSamuraiRank: (xp: number) => {
    if (xp > 10000) return 'Shogun';
    if (xp > 5000) return 'Samurai';
    if (xp > 1000) return 'Ashigaru';
    return 'Ronin';
  },

  getPerformanceAnalytics: () => {
    return {
      accuracy: 85,
      avgResponseTime: '2.4s',
      weakCategory: 'Kanji (日 vs 目)',
      studyTimeData: [
        { day: 'Mon', hours: 1.5 },
        { day: 'Tue', hours: 2.1 },
        { day: 'Wed', hours: 0.8 },
        { day: 'Thu', hours: 1.2 },
        { day: 'Fri', hours: 2.5 },
        { day: 'Sat', hours: 3.0 },
        { day: 'Sun', hours: 1.8 },
      ]
    };
  },

  getDailyQuote: () => {
    const quotes = [
      { ja: '継続は力なり', ro: 'Keizoku wa chikara nari', en: 'Consistency is power.' },
      { ja: '七転び八起き', ro: 'Nana korobi ya oki', en: 'Fall seven times, stand up eight.' },
      { ja: '千里の道も一歩から', ro: 'Senri no michi mo ippo kara', en: 'A journey of a thousand miles begins with a single step.' },
      { ja: '初心忘るべからず', ro: 'Shoshin wasuru bekarazu', en: 'Never forget your original intention.' },
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  }
};

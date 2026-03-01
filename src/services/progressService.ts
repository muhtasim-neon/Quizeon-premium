import { LearningItem, MistakeRecord, SRSItemState, User } from '@/types';
import { db, auth } from '@/services/firebase';
import { doc, updateDoc, getDoc, setDoc, increment } from 'firebase/firestore';

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

    // 2. Firebase update (Sync to Cloud)
    const currentUser = auth.currentUser;
    if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        try {
            await updateDoc(userRef, {
                xp: increment(amount),
                lastActive: new Date().toISOString()
            });
        } catch (e) {
            console.error("Error updating XP in Firestore:", e);
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
  }
};
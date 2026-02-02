
import { LearningItem, MistakeRecord } from '../types';
import { supabase } from './supabaseClient';

const MISTAKES_KEY = 'quizeon_mistakes';
const COMPLETED_LESSONS_KEY = 'quizeon_completed_lessons';

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
    
    // Future: Sync mistakes to Supabase JSON column
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

  // --- Lesson Completion ---
  markLessonComplete: (id: string) => {
    const existing = localStorage.getItem(COMPLETED_LESSONS_KEY);
    const completed: string[] = existing ? JSON.parse(existing) : [];
    if (!completed.includes(id)) {
      completed.push(id);
      localStorage.setItem(COMPLETED_LESSONS_KEY, JSON.stringify(completed));
    }
  },

  getCompletedLessons: (): string[] => {
    const existing = localStorage.getItem(COMPLETED_LESSONS_KEY);
    return existing ? JSON.parse(existing) : [];
  }
};

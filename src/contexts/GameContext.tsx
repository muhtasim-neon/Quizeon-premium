
import React, { createContext, useContext, useState, useEffect } from 'react';

interface GameStats {
  xp: number;
  level: number;
  streak: number;
  accuracy: number;
  totalGames: number;
  weakKana: Record<string, number>; // kana -> mistake count
}

interface GameContextType {
  stats: GameStats;
  addXP: (amount: number) => void;
  recordMistake: (kana: string) => void;
  recordSuccess: (kana: string) => void;
  resetStreak: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<GameStats>(() => {
    const saved = localStorage.getItem('kana_game_stats');
    return saved ? JSON.parse(saved) : {
      xp: 0,
      level: 1,
      streak: 0,
      accuracy: 100,
      totalGames: 0,
      weakKana: {}
    };
  });

  useEffect(() => {
    localStorage.setItem('kana_game_stats', JSON.stringify(stats));
  }, [stats]);

  const addXP = (amount: number) => {
    setStats(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1;
      return { ...prev, xp: newXP, level: newLevel, streak: prev.streak + 1 };
    });
  };

  const recordMistake = (kana: string) => {
    setStats(prev => ({
      ...prev,
      streak: 0,
      weakKana: {
        ...prev.weakKana,
        [kana]: (prev.weakKana[kana] || 0) + 1
      }
    }));
  };

  const recordSuccess = (kana: string) => {
    // Optional: reduce weak kana count if they get it right multiple times
  };

  const resetStreak = () => {
    setStats(prev => ({ ...prev, streak: 0 }));
  };

  return (
    <GameContext.Provider value={{ stats, addXP, recordMistake, recordSuccess, resetStreak }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
};

import React, { createContext, useContext, useEffect, useState } from 'react';

type TimeTheme = 'dawn' | 'day' | 'sunset' | 'night';

interface TimeThemeContextType {
  theme: TimeTheme;
  currentTime: Date;
}

const TimeThemeContext = createContext<TimeThemeContextType | undefined>(undefined);

export const TimeThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<TimeTheme>('day');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const updateTheme = () => {
      const now = new Date();
      setCurrentTime(now);
      const hour = now.getHours();

      if (hour >= 5 && hour < 8) {
        setTheme('dawn');
      } else if (hour >= 8 && hour < 17) {
        setTheme('day');
      } else if (hour >= 17 && hour < 20) {
        setTheme('sunset');
      } else {
        setTheme('night');
      }
    };

    updateTheme();
    const interval = setInterval(updateTheme, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <TimeThemeContext.Provider value={{ theme, currentTime }}>
      {children}
    </TimeThemeContext.Provider>
  );
};

export const useTimeTheme = () => {
  const context = useContext(TimeThemeContext);
  if (context === undefined) {
    throw new Error('useTimeTheme must be used within a TimeThemeProvider');
  }
  return context;
};

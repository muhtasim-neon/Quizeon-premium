import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface AudioSettings {
  volume: number; // 0.0 to 1.0
  speed: number;  // 0.5 to 2.0
  muted: boolean;
}

export type SoundType = 'correct' | 'wrong' | 'flip' | 'laser' | 'hit' | 'gameover' | 'click' | 'success';

interface SettingsContextType {
  theme: Theme;
  toggleTheme: () => void;
  audioSettings: AudioSettings;
  updateAudioSettings: (settings: Partial<AudioSettings>) => void;
  speak: (text: string, lang?: string) => void;
  playSound: (type: SoundType) => void;
  stopAudio: () => void;
  pauseAudio: () => void;
  resumeAudio: () => void;
  isSpeaking: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme State - Default to 'light'
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('quizeon_theme');
    return (saved as Theme) || 'light';
  });

  // Audio State
  const [audioSettings, setAudioSettings] = useState<AudioSettings>(() => {
    const saved = localStorage.getItem('quizeon_audio');
    return saved ? JSON.parse(saved) : { volume: 1, speed: 1, muted: false };
  });

  const [isSpeaking, setIsSpeaking] = useState(false);

  // Apply Theme
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark', 'light'); 
    root.classList.add(theme);
    
    localStorage.setItem('quizeon_theme', theme);
  }, [theme]);

  // Persist Audio
  useEffect(() => {
    localStorage.setItem('quizeon_audio', JSON.stringify(audioSettings));
  }, [audioSettings]);

  // Monitor Speech Status
  useEffect(() => {
    const interval = setInterval(() => {
      setIsSpeaking(window.speechSynthesis.speaking);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const updateAudioSettings = (newSettings: Partial<AudioSettings>) => {
    setAudioSettings(prev => ({ ...prev, ...newSettings }));
  };

  const speak = (text: string, lang = 'ja-JP') => {
    if (audioSettings.muted) return;
    
    window.speechSynthesis.cancel(); // Stop current
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.volume = audioSettings.volume;
    utterance.rate = audioSettings.speed;
    
    // Add event listeners if needed
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const playSound = (type: SoundType) => {
    if (audioSettings.muted) return;

    const sounds: Record<SoundType, string> = {
        correct: 'https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/bonus.wav',
        wrong: 'https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/explosion_02.wav',
        flip: 'https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/pause.wav', // subtle click
        laser: 'https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/pause.wav', 
        hit: 'https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/explosion_02.wav',
        gameover: 'https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/bonus.wav',
        click: 'https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/pause.wav',
        success: 'https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/bonus.wav'
    };

    const url = sounds[type];
    if (url) {
        const audio = new Audio(url);
        audio.volume = Math.min(audioSettings.volume, 1.0); // Ensure valid range, scale if needed
        audio.play().catch(e => console.log('Audio play failed', e));
    }
  };

  const stopAudio = () => window.speechSynthesis.cancel();
  const pauseAudio = () => window.speechSynthesis.pause();
  const resumeAudio = () => window.speechSynthesis.resume();

  return (
    <SettingsContext.Provider value={{
      theme,
      toggleTheme,
      audioSettings,
      updateAudioSettings,
      speak,
      playSound,
      stopAudio,
      pauseAudio,
      resumeAudio,
      isSpeaking
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

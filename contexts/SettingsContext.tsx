
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AudioSettings {
  volume: number; // 0.0 to 1.0
  speed: number;  // 0.5 to 2.0
  muted: boolean;
}

export type SoundType = 'correct' | 'wrong' | 'flip' | 'laser' | 'hit' | 'gameover' | 'click' | 'success';

interface SettingsContextType {
  audioSettings: AudioSettings;
  updateAudioSettings: (settings: Partial<AudioSettings>) => void;
  speak: (text: string, lang?: string) => Promise<void>;
  playSound: (type: SoundType) => void;
  stopAudio: () => void;
  pauseAudio: () => void;
  resumeAudio: () => void;
  isSpeaking: boolean;
  isPaused: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Audio State
  const [audioSettings, setAudioSettings] = useState<AudioSettings>(() => {
    const saved = localStorage.getItem('quizeon_audio');
    return saved ? JSON.parse(saved) : { volume: 1, speed: 1, muted: false };
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Persist Audio
  useEffect(() => {
    localStorage.setItem('quizeon_audio', JSON.stringify(audioSettings));
  }, [audioSettings]);

  // Monitor Speech Status periodically to ensure state sync
  useEffect(() => {
    const interval = setInterval(() => {
      setIsSpeaking(window.speechSynthesis.speaking);
      setIsPaused(window.speechSynthesis.paused);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const updateAudioSettings = (newSettings: Partial<AudioSettings>) => {
    setAudioSettings(prev => ({ ...prev, ...newSettings }));
  };

  const speak = (text: string, lang = 'ja-JP'): Promise<void> => {
    if (audioSettings.muted) return Promise.resolve();
    
    // Cancel existing speech
    window.speechSynthesis.cancel();
    setIsPaused(false);
    setIsSpeaking(true);
    
    return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.volume = audioSettings.volume;
        utterance.rate = audioSettings.speed;
        
        utterance.onstart = () => {
            setIsSpeaking(true);
            setIsPaused(false);
        };
        
        utterance.onend = () => {
            setIsSpeaking(false);
            setIsPaused(false);
            resolve();
        };

        utterance.onerror = () => {
            setIsSpeaking(false);
            setIsPaused(false);
            resolve();
        };
        
        window.speechSynthesis.speak(utterance);
    });
  };

  const playSound = (type: SoundType) => {
    if (audioSettings.muted) return;

    const sounds: Record<SoundType, string> = {
        correct: 'https://commondatastorage.googleapis.com/codeskulptor-assets/week7-brrring.m4a',
        wrong: 'https://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/explosion.mp3',
        flip: 'https://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/thrust.mp3',
        laser: 'https://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/missile.mp3',
        hit: 'https://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/explosion.mp3',
        gameover: 'https://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/soundtrack.mp3', 
        click: 'https://commondatastorage.googleapis.com/codeskulptor-assets/week7-button.m4a',
        success: 'https://commondatastorage.googleapis.com/codeskulptor-assets/week7-brrring.m4a'
    };

    const url = sounds[type];
    if (url) {
        const audio = new Audio(url);
        audio.volume = Math.min(audioSettings.volume, 1.0);
        audio.play().catch(e => console.log('Audio play failed', e));
    }
  };

  const stopAudio = () => {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
  };

  const pauseAudio = () => {
      window.speechSynthesis.pause();
      setIsPaused(true);
  };

  const resumeAudio = () => {
      window.speechSynthesis.resume();
      setIsPaused(false);
  };

  return (
    <SettingsContext.Provider value={{
      audioSettings,
      updateAudioSettings,
      speak,
      playSound,
      stopAudio,
      pauseAudio,
      resumeAudio,
      isSpeaking,
      isPaused
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

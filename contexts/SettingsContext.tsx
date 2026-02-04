
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

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
  const [audioSettings, setAudioSettings] = useState<AudioSettings>(() => {
    const saved = localStorage.getItem('quizeon_audio');
    return saved ? JSON.parse(saved) : { volume: 1, speed: 1, muted: false };
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // Ref to prevent garbage collection of the utterance object during long sequences
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    localStorage.setItem('quizeon_audio', JSON.stringify(audioSettings));
  }, [audioSettings]);

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
    return new Promise((resolve) => {
      if (audioSettings.muted) {
        resolve();
        return;
      }
      
      // Cancel any pending speech before starting new one
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance; // Keep reference to prevent GC
      
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
        utteranceRef.current = null;
        resolve();
      };

      utterance.onerror = (event) => {
        // Interrupted is normal when switching words quickly
        if (event.error !== 'interrupted') {
          console.error('SpeechSynthesis error:', event);
        }
        setIsSpeaking(false);
        setIsPaused(false);
        utteranceRef.current = null;
        resolve();
      };
      
      window.speechSynthesis.speak(utterance);
    });
  };

  const playSound = (type: SoundType) => {
    // BACKGROUND SOUNDS REMOVED AS REQUESTED
    return;
  };

  const stopAudio = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    utteranceRef.current = null;
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

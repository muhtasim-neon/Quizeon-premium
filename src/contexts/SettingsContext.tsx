import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

interface AudioSettings {
  volume: number; // 0.0 to 1.0
  speed: number; // 0.5 to 2.0
  pitch: number; // 0.5 to 2.0
  muted: boolean;
  voiceURI: string | null;
}

export type SoundType =
  | "correct"
  | "wrong"
  | "flip"
  | "laser"
  | "hit"
  | "gameover"
  | "click"
  | "success";

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
  voices: SpeechSynthesisVoice[];
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [audioSettings, setAudioSettings] = useState<AudioSettings>(() => {
    const saved = localStorage.getItem("quizeon_audio");
    // Default pitch 1, voiceURI null
    return saved
      ? { pitch: 1, voiceURI: null, ...JSON.parse(saved) }
      : { volume: 1, speed: 1, pitch: 1, muted: false, voiceURI: null };
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Ref to prevent garbage collection of the utterance object during long sequences
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // AudioContext ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
    };

    loadVoices();

    // Chrome needs this event to load voices
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("quizeon_audio", JSON.stringify(audioSettings));
  }, [audioSettings]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsSpeaking(window.speechSynthesis.speaking);
      setIsPaused(window.speechSynthesis.paused);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const updateAudioSettings = (newSettings: Partial<AudioSettings>) => {
    setAudioSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const speak = (text: string, lang = "ja-JP"): Promise<void> => {
    return new Promise((resolve) => {
      if (audioSettings.muted) {
        resolve();
        return;
      }

      // Cancel any pending speech before starting new one
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance; // Keep reference to prevent GC

      // If voiceURI is set, try to find that voice.
      // Otherwise fallback to lang.
      if (audioSettings.voiceURI) {
        const specificVoice = voices.find(
          (v) => v.voiceURI === audioSettings.voiceURI,
        );
        if (specificVoice) {
          utterance.voice = specificVoice;
          // If a specific voice is chosen, we trust it matches the text or we don't override lang if implied by voice
          // However, setting lang is still good practice for some engines if voice doesn't dictate it fully.
          utterance.lang = specificVoice.lang;
        } else {
          utterance.lang = lang;
        }
      } else {
        utterance.lang = lang;
      }

      utterance.volume = audioSettings.volume;
      utterance.rate = audioSettings.speed;
      utterance.pitch = audioSettings.pitch;

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
        if (event.error !== "interrupted") {
          console.error("SpeechSynthesis error:", event);
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
    if (audioSettings.muted) return;

    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (
          window.AudioContext || (window as any).webkitAudioContext
        )();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === "correct" || type === "success") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === "wrong") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.3);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === "flip") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(200, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === "hit") {
        osc.type = "square";
        osc.frequency.setValueAtTime(400, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      }
    } catch (e) {
      console.warn("Audio playback failed", e);
    }
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
    <SettingsContext.Provider
      value={{
        audioSettings,
        updateAudioSettings,
        speak,
        playSound,
        stopAudio,
        pauseAudio,
        resumeAudio,
        isSpeaking,
        isPaused,
        voices,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

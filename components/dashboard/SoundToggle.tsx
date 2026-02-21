import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import { motion } from 'framer-motion';

export const SoundToggle: React.FC = () => {
  const { audioSettings, updateAudioSettings, playSound } = useSettings();

  const toggleMute = () => {
    const newMuted = !audioSettings.muted;
    updateAudioSettings({ muted: newMuted });
    if (!newMuted) {
      playSound('click');
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleMute}
      className={`p-3 rounded-full border-2 transition-all shadow-lg ${
        audioSettings.muted 
          ? 'bg-gray-100 text-gray-400 border-gray-200' 
          : 'bg-white text-hanko border-hanko/20'
      }`}
      title={audioSettings.muted ? "Unmute Sound" : "Mute Sound"}
    >
      {audioSettings.muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
    </motion.button>
  );
};

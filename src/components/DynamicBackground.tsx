import React from 'react';
import { motion } from 'framer-motion';
import { useTimeTheme } from '../contexts/TimeThemeContext';

export const DynamicBackground = () => {
  const { theme } = useTimeTheme();

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      {/* Sky Gradient */}
      <motion.div 
        animate={{ 
          background: `linear-gradient(to bottom, var(--theme-sky-top), var(--theme-sky-bottom))` 
        }}
        transition={{ duration: 2 }}
        className="absolute inset-0"
      />

      {/* Stars (Night only) */}
      {theme === 'night' && (
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: Math.random() * 3 + 2, repeat: Infinity }}
              className="absolute bg-white rounded-full"
              style={{
                width: Math.random() * 2 + 1 + 'px',
                height: Math.random() * 2 + 1 + 'px',
                top: Math.random() * 60 + '%',
                left: Math.random() * 100 + '%',
              }}
            />
          ))}
        </div>
      )}

      {/* Sun / Moon */}
      <motion.div
        animate={{
          top: theme === 'night' ? '15%' : theme === 'day' ? '10%' : '45%',
          left: theme === 'night' ? '70%' : theme === 'day' ? '20%' : '50%',
          backgroundColor: varColor(theme),
          boxShadow: theme === 'night' ? '0 0 40px rgba(249, 215, 28, 0.3)' : '0 0 60px rgba(255, 215, 0, 0.4)',
          scale: theme === 'sunset' || theme === 'dawn' ? 1.5 : 1
        }}
        transition={{ duration: 3, type: 'spring' }}
        className="absolute w-24 h-24 rounded-full"
      />

      {/* Mt. Fuji */}
      <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-full max-w-4xl opacity-80">
        <svg viewBox="0 0 1000 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <motion.path
            animate={{ fill: 'var(--theme-mountain)' }}
            d="M0 400L400 100L500 150L600 100L1000 400H0Z"
          />
          {/* Snow Cap */}
          <motion.path
            animate={{ opacity: theme === 'night' ? 0.3 : 0.8 }}
            d="M400 100L450 125L500 110L550 125L600 100L500 50L400 100Z"
            fill="white"
          />
        </svg>
      </div>

      {/* Lake Reflection Area */}
      <div className="absolute bottom-0 left-0 w-full h-[30%] backdrop-blur-[2px]">
        <div className="absolute inset-0 bg-white/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Torii Gate */}
      <div className="absolute bottom-[15%] left-[15%] w-32 md:w-48 opacity-90">
        <ToriiGateGraphic />
      </div>

      {/* Floating Clouds */}
      <Cloud delay={0} top="20%" left="10%" />
      <Cloud delay={5} top="35%" left="60%" />
      <Cloud delay={2} top="15%" left="80%" />

      {/* Birds */}
      {(theme === 'day' || theme === 'dawn' || theme === 'sunset') && (
        <>
          <Bird delay={0} top="25%" left="30%" />
          <Bird delay={1} top="22%" left="35%" />
          <Bird delay={0.5} top="28%" left="33%" />
        </>
      )}

      {/* Washi Texture Overlay */}
      <div className="absolute inset-0 washi-texture opacity-30 mix-blend-multiply" />
    </div>
  );
};

const varColor = (theme: string) => {
  switch (theme) {
    case 'night': return '#F9D71C';
    case 'day': return '#FFD700';
    case 'sunset': return '#FF4500';
    case 'dawn': return '#FFB7B2';
    default: return '#FFD700';
  }
};

const ToriiGateGraphic = () => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full drop-shadow-2xl">
    <motion.g animate={{ stroke: 'var(--theme-mountain)' }} strokeWidth="8" strokeLinecap="round">
      <path d="M20 60C20 60 50 40 100 40C150 40 180 60 180 60" />
      <path d="M40 90H160" />
      <path d="M65 60V180" />
      <path d="M135 60V180" />
      <path d="M100 40V90" />
    </motion.g>
  </svg>
);

const Cloud = ({ delay, top, left }: { delay: number, top: string, left: string }) => (
  <motion.div
    initial={{ x: -100, opacity: 0 }}
    animate={{ x: 100, opacity: [0, 0.4, 0] }}
    transition={{ duration: 20, delay, repeat: Infinity, ease: "linear" }}
    className="absolute w-32 h-8 bg-white/30 blur-xl rounded-full"
    style={{ top, left }}
  />
);

const Bird = ({ delay, top, left }: { delay: number, top: string, left: string }) => (
  <motion.div
    initial={{ x: -50, y: 0 }}
    animate={{ x: 50, y: [0, -10, 0] }}
    transition={{ duration: 10, delay, repeat: Infinity, ease: "linear" }}
    className="absolute text-black/20"
    style={{ top, left }}
  >
    <svg width="20" height="10" viewBox="0 0 20 10">
      <path d="M0 5C5 0 10 5 10 5C10 5 15 0 20 5" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  </motion.div>
);

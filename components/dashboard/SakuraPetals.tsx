import React from 'react';
import { motion } from 'framer-motion';

export const SakuraPetals: React.FC = () => {
  const petals = Array.from({ length: 20 });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            top: -20, 
            left: `${Math.random() * 100}%`, 
            rotate: Math.random() * 360,
            opacity: 0.4 + Math.random() * 0.4
          }}
          animate={{
            top: '110%',
            left: `${(Math.random() * 100) + (Math.random() * 20 - 10)}%`,
            rotate: Math.random() * 720,
          }}
          transition={{
            duration: 10 + Math.random() * 20,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 20
          }}
          className="absolute w-4 h-4"
        >
          <svg viewBox="0 0 100 100" fill="#F48FB1">
            <path d="M50 0 C60 30 100 40 100 70 C100 90 80 100 50 100 C20 100 0 90 0 70 C0 40 40 30 50 0" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

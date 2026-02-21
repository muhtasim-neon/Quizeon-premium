import React from 'react';
import { motion } from 'framer-motion';
import { SakuraState } from '../../types';

interface GrowingSakuraProps {
  state: SakuraState;
}

export const GrowingSakura: React.FC<GrowingSakuraProps> = ({ state }) => {
  const getTreeScale = () => {
    switch (state.stage) {
      case 'seedling': return 0.2;
      case 'sprout': return 0.4;
      case 'young': return 0.6;
      case 'adult': return 0.8;
      case 'blooming': return 1;
      default: return 0.2;
    }
  };

  return (
    <div className="relative w-full h-64 flex items-end justify-center overflow-hidden bg-gradient-to-b from-blue-50 to-white rounded-[32px] border border-bamboo/10">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 w-full h-1/4 bg-emerald-100 blur-xl"></div>
      </div>

      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: getTreeScale() }}
        transition={{ type: 'spring', stiffness: 50, damping: 15 }}
        className="relative z-10 origin-bottom"
      >
        {/* Simple SVG Tree Representation */}
        <svg width="200" height="300" viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 300V150M100 200L60 160M100 180L140 140" stroke="#5D4037" strokeWidth="12" strokeLinecap="round"/>
          
          {/* Leaves/Flowers based on stage */}
          <circle cx="100" cy="120" r="40" fill="#81C784" fillOpacity="0.6" />
          <circle cx="70" cy="150" r="30" fill="#81C784" fillOpacity="0.6" />
          <circle cx="130" cy="140" r="35" fill="#81C784" fillOpacity="0.6" />

          {/* Blooms */}
          {state.stage === 'blooming' && Array.from({ length: Math.floor(state.blooms / 5) }).map((_, i) => (
            <motion.circle 
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
              cx={60 + Math.random() * 80} 
              cy={100 + Math.random() * 80} 
              r="4" 
              fill="#F48FB1" 
            />
          ))}
        </svg>
      </motion.div>

      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-[10px] font-black text-bamboo uppercase tracking-widest">Sakura Stage: {state.stage}</p>
        <div className="flex justify-center gap-1 mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div 
              key={i} 
              className={`w-2 h-2 rounded-full ${i <= ['seedling', 'sprout', 'young', 'adult', 'blooming'].indexOf(state.stage) ? 'bg-hanko' : 'bg-gray-200'}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

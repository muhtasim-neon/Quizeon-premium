import React from 'react';
import { motion } from 'framer-motion';

interface WashiQuoteProps {
  quote: { ja: string; ro: string; en: string };
}

export const WashiQuote: React.FC<WashiQuoteProps> = ({ quote }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-6 bg-[#F5F2ED] rounded-xl border border-[#D4C4A8] shadow-inner overflow-hidden"
      style={{
        backgroundImage: 'radial-gradient(#D4C4A8 0.5px, transparent 0.5px)',
        backgroundSize: '20px 20px'
      }}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4C4A8] to-transparent opacity-30"></div>
      
      <div className="relative z-10 text-center">
        <h3 className="text-2xl font-jp font-black text-[#5D4037] mb-2 leading-relaxed">
          {quote.ja}
        </h3>
        <p className="text-xs font-bold text-[#8D6E63] italic mb-1">{quote.ro}</p>
        <div className="w-12 h-0.5 bg-[#D4C4A8] mx-auto my-3"></div>
        <p className="text-sm font-medium text-[#5D4037]">{quote.en}</p>
      </div>

      <div className="absolute bottom-0 right-0 w-16 h-16 opacity-5 pointer-events-none">
        <svg viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 0 L100 50 L50 100 L0 50 Z" />
        </svg>
      </div>
    </motion.div>
  );
};

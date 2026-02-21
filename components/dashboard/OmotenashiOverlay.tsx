import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OmotenashiOverlayProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

export const OmotenashiOverlay: React.FC<OmotenashiOverlayProps> = ({ show, message, onClose }) => {
  const [petals, setPetals] = useState<{ id: number, x: number, delay: number }[]>([]);

  useEffect(() => {
    if (show) {
      const newPetals = Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 5
      }));
      setPetals(newPetals);
      
      // Auto close after 8 seconds
      const timer = setTimeout(onClose, 8000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none"
        >
          {/* Sakura Petals */}
          <div className="absolute inset-0 overflow-hidden">
            {petals.map(p => (
              <motion.div
                key={p.id}
                initial={{ y: -20, x: `${p.x}%`, rotate: 0 }}
                animate={{ 
                  y: '110vh', 
                  x: [`${p.x}%`, `${p.x + (Math.random() * 10 - 5)}%`],
                  rotate: 360 
                }}
                transition={{ duration: 5, delay: p.delay, repeat: Infinity, ease: 'linear' }}
                className="absolute w-4 h-4 bg-pink-200 rounded-full"
                style={{ 
                  borderRadius: '100% 0% 100% 0% / 100% 0% 100% 0%',
                  boxShadow: '0 0 5px rgba(255, 192, 203, 0.5)'
                }}
              />
            ))}
          </div>

          <motion.div 
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white/90 p-10 rounded-[40px] border-4 border-hanko shadow-2xl text-center max-w-lg mx-4 pointer-events-auto"
          >
            <h2 className="text-4xl font-black text-hanko mb-4 font-jp">おめでとうございます!</h2>
            <p className="text-xl font-bold text-ink mb-6">{message}</p>
            <div className="w-20 h-1 bg-hanko mx-auto mb-6"></div>
            <p className="text-sm text-bamboo italic">
              জাপানের ভাষার সাথে আপনার এই যাত্রা সত্যিই অসাধারণ।
            </p>
            <button 
              onClick={onClose}
              className="mt-8 px-6 py-2 bg-hanko text-white rounded-full font-bold hover:bg-hanko/90 transition-colors"
            >
              Arigato!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

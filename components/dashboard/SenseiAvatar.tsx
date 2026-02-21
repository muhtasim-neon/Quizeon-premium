import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SenseiAvatarProps {
  isStudyingLong: boolean;
  hasMissedDays: boolean;
  justMastered: boolean;
}

export const SenseiAvatar: React.FC<SenseiAvatarProps> = ({ isStudyingLong, hasMissedDays, justMastered }) => {
  const [message, setMessage] = useState("");
  const [animation, setAnimation] = useState("idle");
  const [style, setStyle] = useState<"sensei" | "miko" | "samurai">("sensei");

  useEffect(() => {
    if (justMastered) {
      setMessage("おめでとうございます! (Congratulations!) You've mastered it!");
      setAnimation("dance");
      const timer = setTimeout(() => setAnimation("idle"), 5000);
      return () => clearTimeout(timer);
    } else if (isStudyingLong) {
      setMessage("お疲れ様です! (Good job!) You're working so hard!");
      setAnimation("happy");
    } else if (hasMissedDays) {
      setMessage("寂しいです... (I'm lonely...) Come back and study!");
      setAnimation("sad");
    } else {
      const greetings = [
        "こんにちは! (Hello!) Ready to learn?",
        "がんばって! (Do your best!)",
        "継続は力なり! (Consistency is power!)",
        "今日も一日、がんばりましょう!"
      ];
      setMessage(greetings[Math.floor(Math.random() * greetings.length)]);
      setAnimation("idle");
    }
  }, [isStudyingLong, hasMissedDays, justMastered]);

  const variants = {
    idle: { y: [0, -8, 0], transition: { repeat: Infinity, duration: 3, ease: "easeInOut" } },
    dance: { 
      rotate: [0, 15, -15, 15, 0], 
      y: [0, -20, 0, -20, 0], 
      scale: [1, 1.1, 1, 1.1, 1],
      transition: { repeat: Infinity, duration: 0.6 } 
    },
    happy: { 
      scale: [1, 1.15, 1], 
      rotate: [0, 5, -5, 0],
      transition: { repeat: Infinity, duration: 1.5 } 
    },
    sad: { 
      opacity: [1, 0.6, 1], 
      y: [0, 5, 0], 
      transition: { repeat: Infinity, duration: 4 } 
    }
  };

  const getAvatarUrl = () => {
    const seeds: Record<string, string> = {
      sensei: "sensei-san",
      miko: "miko-chan",
      samurai: "samurai-kun"
    };
    // Using Lorelei for anime style
    return `https://api.dicebear.com/9.x/lorelei/svg?seed=${seeds[style]}&mood=${animation === 'sad' ? 'sad' : 'happy'}`;
  };

  const toggleStyle = () => {
    const styles: ("sensei" | "miko" | "samurai")[] = ["sensei", "miko", "samurai"];
    const nextIndex = (styles.indexOf(style) + 1) % styles.length;
    setStyle(styles[nextIndex]);
    setMessage(`I've changed my appearance! I'm now your ${styles[nextIndex]}!`);
  };

  return (
    <div className="flex items-center gap-5 group relative">
      <div className="relative shrink-0" onClick={toggleStyle} title="Click to change Sensei style">
        <motion.div 
          animate={animation}
          variants={variants}
          className="w-20 h-20 bg-gradient-to-br from-white to-rice rounded-full border-4 border-hanko overflow-hidden shadow-2xl ring-4 ring-hanko/10 cursor-pointer hover:ring-hanko/30 transition-all"
        >
          <img src={getAvatarUrl()} alt="Sensei" className="w-full h-full object-cover" />
        </motion.div>
        
        {/* Status Indicator */}
        <div className="absolute -bottom-1 -right-1 bg-hanko text-white text-[9px] font-black px-3 py-1 rounded-full border-2 border-white shadow-lg uppercase tracking-widest">
          {style}
        </div>

        {/* Click Prompt */}
        <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-[8px] font-bold p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity animate-pulse">
          TAP
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div 
          key={message}
          initial={{ opacity: 0, scale: 0.8, x: -20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: 20 }}
          className="bg-white p-4 rounded-3xl rounded-tl-none border-2 border-hanko/10 shadow-xl relative max-w-[220px] backdrop-blur-sm bg-white/90"
        >
          <p className="text-xs font-black text-ink leading-relaxed">{message}</p>
          {/* Speech Bubble Tail */}
          <div className="absolute top-5 -left-[10px] w-4 h-4 bg-white border-l-2 border-b-2 border-hanko/10 transform rotate-45"></div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

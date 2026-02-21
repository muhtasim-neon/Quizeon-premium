import React, { useState, useEffect } from 'react';
import { GlassCard, Button } from '../UI';
import { Heart, Utensils, Sparkles } from 'lucide-react';
import { progressService } from '../../services/progressService';
import { motion } from 'framer-motion';

export const StudyPet: React.FC = () => {
  const [pet, setPet] = useState(progressService.getPetState());

  useEffect(() => {
    const timer = setInterval(() => {
      setPet(progressService.getPetState());
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const handleFeed = () => {
    progressService.feedPet();
    setPet(progressService.getPetState());
  };

  const getPetEmoji = () => {
    if (pet.hunger < 20) return '😫';
    if (pet.happiness > 80) return '🥳';
    return pet.type === 'tanuki' ? '🍃' : '🐱';
  };

  return (
    <GlassCard className="h-full flex flex-col justify-between relative overflow-hidden">
      <div className="absolute -right-4 -top-4 opacity-5">
        <Sparkles size={80} />
      </div>

      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-xs text-ink flex items-center gap-1">
          <Heart size={14} className="text-red-500 fill-red-500" /> Study Pet
        </h3>
        <span className="text-[10px] font-black text-bamboo uppercase tracking-widest">{pet.type}</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-2">
        <motion.div 
          animate={{ y: [0, -5, 0], scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-4xl mb-2"
        >
          {getPetEmoji()}
        </motion.div>
        
        <div className="w-full space-y-2">
          <div>
            <div className="flex justify-between text-[8px] font-bold text-bamboo uppercase mb-0.5">
              <span>Hunger</span>
              <span>{Math.round(pet.hunger)}%</span>
            </div>
            <div className="w-full h-1.5 bg-rice rounded-full overflow-hidden">
              <div className="h-full bg-orange-400" style={{ width: `${pet.hunger}%` }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[8px] font-bold text-bamboo uppercase mb-0.5">
              <span>Happiness</span>
              <span>{Math.round(pet.happiness)}%</span>
            </div>
            <div className="w-full h-1.5 bg-rice rounded-full overflow-hidden">
              <div className="h-full bg-pink-400" style={{ width: `${pet.happiness}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <Button 
        size="xs" 
        variant="secondary" 
        className="w-full mt-2 flex items-center justify-center gap-1"
        onClick={handleFeed}
        disabled={pet.hunger > 90}
      >
        <Utensils size={10} /> Feed Pet
      </Button>
      
      <p className="text-[8px] text-bamboo mt-1 text-center">
        প্রতিদিন পড়াশোনা করে আপনার পেটকে "খাওয়াতে" হবে।
      </p>
    </GlassCard>
  );
};

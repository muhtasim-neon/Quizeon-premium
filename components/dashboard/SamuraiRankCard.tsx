import React from 'react';
import { motion } from 'framer-motion';
import { SamuraiRank } from '../../types';
import { Shield, Sword, Crown, User } from 'lucide-react';

interface SamuraiRankCardProps {
  rank: SamuraiRank;
}

export const SamuraiRankCard: React.FC<SamuraiRankCardProps> = ({ rank }) => {
  const getRankIcon = () => {
    switch (rank) {
      case 'Ronin': return <User size={24} />;
      case 'Ashigaru': return <Shield size={24} />;
      case 'Samurai': return <Sword size={24} />;
      case 'Shogun': return <Crown size={24} />;
      default: return <User size={24} />;
    }
  };

  const getRankColor = () => {
    switch (rank) {
      case 'Ronin': return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'Ashigaru': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Samurai': return 'bg-red-50 text-red-600 border-red-100';
      case 'Shogun': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-[24px] border-2 flex items-center gap-4 transition-all ${getRankColor()}`}
    >
      <div className="p-3 bg-white rounded-2xl shadow-sm">
        {getRankIcon()}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Current Rank</p>
        <h3 className="text-xl font-black">{rank}</h3>
      </div>
    </motion.div>
  );
};

import React from 'react';
import { GlassCard, Button, Badge } from '../components/UI';
import { Gamepad2, Rocket, Sword, ChefHat, Car, Mic2, Puzzle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Arcade: React.FC = () => {
  const navigate = useNavigate();

  const games = [
    { id: 'memory', title: 'Hiragana Memory', desc: 'Match Kana pairs', icon: Puzzle, color: 'text-pink-400', bg: 'bg-pink-500/20', status: 'Playable', path: '/practice' }, // redirecting to practice for now
    { id: 'invaders', title: 'Kana Invaders', desc: 'Shoot the correct Romaji', icon: Rocket, color: 'text-blue-400', bg: 'bg-blue-500/20', status: 'Coming Soon' },
    { id: 'quest', title: 'Hiragana Quest', desc: 'RPG Battle Game', icon: Sword, color: 'text-orange-400', bg: 'bg-orange-500/20', status: 'Coming Soon' },
    { id: 'chef', title: 'Sushi Chef', desc: 'Order words correctly', icon: ChefHat, color: 'text-green-400', bg: 'bg-green-500/20', status: 'Coming Soon' },
    { id: 'road', title: 'Tokyo Drift', desc: 'Speed reading race', icon: Car, color: 'text-red-400', bg: 'bg-red-500/20', status: 'Coming Soon' },
    { id: 'karaoke', title: 'Karaoke Pop', desc: 'Sing along challenge', icon: Mic2, color: 'text-purple-400', bg: 'bg-purple-500/20', status: 'Coming Soon' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Gamepad2 className="text-primary" size={32} /> Game Arcade
        </h1>
        <p className="text-slate-400">Learn while you play! Earn XP and unlock new levels.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
            <GlassCard key={game.id} hoverEffect className="relative overflow-hidden group">
                <div className={`absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity scale-150`}>
                    <game.icon size={100} />
                </div>
                
                <div className={`w-14 h-14 rounded-2xl ${game.bg} ${game.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <game.icon size={32} />
                </div>

                <h3 className="text-xl font-bold text-white mb-1">{game.title}</h3>
                <p className="text-slate-400 text-sm mb-4">{game.desc}</p>

                <div className="flex justify-between items-center mt-4">
                    {game.status === 'Playable' ? (
                        <Button size="sm" onClick={() => navigate(game.path || '#')}>Play Now</Button>
                    ) : (
                        <span className="text-xs text-slate-500 border border-slate-700 px-3 py-1.5 rounded-full uppercase tracking-wider font-bold">In Development</span>
                    )}
                </div>
            </GlassCard>
        ))}
      </div>
    </div>
  );
};

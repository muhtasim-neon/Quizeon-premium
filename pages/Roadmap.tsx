import React from 'react';
import { GlassCard, Badge } from '../components/UI';
import { CheckCircle2, Circle, Lock } from 'lucide-react';

export const Roadmap: React.FC = () => {
  const steps = [
    { id: 1, title: 'Introduction & Hiragana', status: 'completed', desc: 'Basic writing system and pronunciation.' },
    { id: 2, title: 'Katakana Mastery', status: 'completed', desc: 'Foreign words and loan words.' },
    { id: 3, title: 'Greetings & Self Intro', status: 'active', desc: 'Watashi wa... Desu/Masu forms.' },
    { id: 4, title: 'Numbers & Time', status: 'locked', desc: 'Counting, days, months, and telling time.' },
    { id: 5, title: 'Basic Particles (Wa, Ga, O)', status: 'locked', desc: 'Sentence structure foundations.' },
    { id: 6, title: 'Verbs (Dictionary Form)', status: 'locked', desc: 'Action words and basic conjugation.' },
    { id: 7, title: 'Adjectives (I & Na)', status: 'locked', desc: 'Describing things and people.' },
    { id: 8, title: 'JLPT N5 Mock Exam', status: 'locked', desc: 'Final assessment.' },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Road to N5 Mastery</h1>
        <p className="text-slate-400">Your step-by-step guide to passing the JLPT N5</p>
      </div>

      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
        {steps.map((step, idx) => (
          <div key={step.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            
            {/* Icon Marker */}
            <div className={`
                flex items-center justify-center w-10 h-10 rounded-full border-4 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow z-10
                ${step.status === 'completed' ? 'bg-green-500 border-dark-bg text-white' : 
                  step.status === 'active' ? 'bg-primary border-dark-bg text-white shadow-[0_0_15px_rgba(58,134,255,0.5)]' : 
                  'bg-dark-bg border-slate-700 text-slate-600'}
            `}>
              {step.status === 'completed' ? <CheckCircle2 size={18} /> : 
               step.status === 'active' ? <Circle size={18} className="animate-pulse fill-current" /> : 
               <Lock size={16} />}
            </div>
            
            {/* Content Card */}
            <GlassCard className={`
                w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 border transition-all duration-300
                ${step.status === 'active' ? 'border-primary/50 bg-primary/5' : 'border-white/5 opacity-80'}
            `}>
              <div className="flex justify-between items-start mb-1">
                <h3 className={`font-bold ${step.status === 'locked' ? 'text-slate-500' : 'text-white'}`}>
                    Lesson {step.id}: {step.title}
                </h3>
                {step.status === 'active' && <Badge>Current</Badge>}
              </div>
              <p className="text-sm text-slate-400">{step.desc}</p>
            </GlassCard>
            
          </div>
        ))}
      </div>
    </div>
  );
};

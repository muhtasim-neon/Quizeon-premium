
import React from 'react';
import { GlassCard } from './UI';
import { Lightbulb, Info } from 'lucide-react';

interface ExplainerProps {
  title?: string;
  content: string;
  variant?: 'tip' | 'grammar' | 'correction';
}

export const Explainer: React.FC<ExplainerProps> = ({ title = "Sensei's Note", content, variant = 'tip' }) => {
  const styles = {
    tip: "bg-yellow-50/80 border-l-4 border-yellow-400 text-yellow-900",
    grammar: "bg-blue-50/80 border-l-4 border-blue-400 text-blue-900",
    correction: "bg-red-50/80 border-l-4 border-red-400 text-red-900"
  };

  const icon = variant === 'correction' ? <Info size={20} className="text-red-500" /> : <Lightbulb size={20} className="text-yellow-600" />;

  return (
    <div className={`p-4 rounded-r-xl rounded-bl-xl shadow-sm my-4 animate-fade-in ${styles[variant]}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">{icon}</div>
        <div>
          <h4 className="font-bold text-sm mb-1 opacity-90">{title}</h4>
          <p className="text-sm font-medium leading-relaxed opacity-80">{content}</p>
        </div>
      </div>
    </div>
  );
};

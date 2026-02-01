import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ className, children, hoverEffect = false, ...props }) => {
  return (
    <div 
      className={cn(
        "shoji-card rounded-2xl p-6 transition-all duration-300 ease-out text-ink border border-white/60 relative", 
        // Add a subtle paper grain texture via pseudo-element if desired, or keep it clean
        hoverEffect && "hover:-translate-y-1 hover:shadow-[0_20px_40px_-12px_rgba(62,39,35,0.15)] cursor-pointer hover:border-bamboo/30 active:scale-[0.99]",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ className, variant = 'primary', size = 'md', children, ...props }) => {
  const variants = {
    // Primary: Hanko Red (Stamp Color) - Looks like a physical seal
    primary: "bg-hanko text-white shadow-md shadow-hanko/30 hover:bg-red-700 hover:shadow-lg hover:shadow-hanko/40 active:translate-y-0.5 active:shadow-sm border border-transparent",
    
    // Secondary: Bamboo/Paper - Clean and architectural
    secondary: "bg-white border border-bamboo/20 text-ink hover:bg-rice hover:border-bamboo/40 shadow-sm hover:shadow-md active:translate-y-0.5 text-bamboo hover:text-ink",
    
    // Ghost: Minimalist ink
    ghost: "bg-transparent text-bamboo hover:text-ink hover:bg-bamboo/10 active:bg-bamboo/20",
    
    // Danger: Muted Red on Paper
    danger: "bg-white text-hanko border border-hanko/20 hover:bg-red-50 hover:border-hanko/50 shadow-sm",
    
    // Outline: Bamboo Border
    outline: "bg-transparent border-2 border-bamboo/30 text-bamboo hover:border-bamboo hover:text-ink hover:bg-white/50"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs font-bold tracking-wide rounded-lg",
    md: "px-6 py-3 text-sm font-bold tracking-wide rounded-xl",
    lg: "px-8 py-4 text-base font-bold tracking-wide rounded-xl"
  };

  return (
    <button 
      className={cn(
        "transition-all duration-200 flex items-center justify-center gap-2 font-jp select-none transform",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ className, label, id, ...props }) => {
  return (
    <div className="w-full group">
      {label && (
        <label htmlFor={id} className="block text-xs font-bold uppercase tracking-widest text-bamboo mb-2 ml-1 group-focus-within:text-hanko transition-colors">
          {label}
        </label>
      )}
      <div className="relative">
        <input 
          id={id}
          className={cn(
            "w-full bg-white/60 backdrop-blur-sm border border-bamboo/20 rounded-xl px-4 py-3.5",
            "text-ink placeholder-bamboo/30 font-medium shadow-inner",
            "focus:border-hanko/50 focus:ring-4 focus:ring-hanko/5 focus:bg-white outline-none transition-all duration-300",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className
          )}
          {...props}
        />
      </div>
    </div>
  );
};

export const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = "bg-bamboo/10 text-bamboo border-bamboo/20" }) => (
  <span className={cn("px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border shadow-sm", color)}>
    {children}
  </span>
);
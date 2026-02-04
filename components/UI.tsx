
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
        "glass-effect rounded-2xl p-6 transition-all duration-500 ease-out text-ink relative overflow-hidden border border-white/40", 
        // 3D Hover Effect - Enhanced Shadow and Lift
        hoverEffect && "hover:-translate-y-2 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] hover:shadow-hanko/5 cursor-pointer hover:border-white/80 active:scale-[0.98] active:shadow-sm",
        className
      )} 
      {...props}
    >
      {/* Glossy sheen effect on hover */}
      {hoverEffect && (
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ backgroundSize: '200% 200%' }} />
      )}
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
    // Primary: Hanko Red - 3D Pressed Look
    primary: "bg-hanko text-white shadow-lg shadow-hanko/30 hover:bg-red-700 hover:shadow-xl hover:shadow-hanko/40 active:translate-y-0.5 active:shadow-sm border border-white/10",
    
    // Secondary: Clean Glass
    secondary: "bg-white/80 border border-bamboo/20 text-ink hover:bg-white hover:border-bamboo/40 shadow-sm hover:shadow-md active:translate-y-0.5 backdrop-blur-sm",
    
    // Ghost: Text Only
    ghost: "bg-transparent text-bamboo hover:text-ink hover:bg-black/5 active:bg-black/10",
    
    // Danger: Soft Red
    danger: "bg-red-50 text-hanko border border-red-200 hover:bg-red-100 hover:border-red-300 shadow-sm",
    
    // Outline: Stroked
    outline: "bg-transparent border-2 border-bamboo/30 text-bamboo hover:border-bamboo hover:text-ink"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs font-bold tracking-wide rounded-lg",
    md: "px-6 py-3 text-sm font-bold tracking-wide rounded-xl",
    lg: "px-8 py-4 text-base font-bold tracking-wide rounded-2xl"
  };

  return (
    <button 
      className={cn(
        "transition-all duration-200 flex items-center justify-center gap-2 font-jp select-none transform relative overflow-hidden",
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
            "w-full bg-white/50 backdrop-blur-sm border border-bamboo/20 rounded-xl px-4 py-3.5",
            "text-ink placeholder-bamboo/40 font-medium shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]",
            "focus:border-hanko focus:ring-4 focus:ring-hanko/10 focus:bg-white outline-none transition-all duration-300",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className
          )}
          {...props}
        />
      </div>
    </div>
  );
};

export const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = "bg-white/50 text-bamboo border-bamboo/20" }) => (
  <span className={cn("px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border shadow-sm backdrop-blur-sm", color)}>
    {children}
  </span>
);

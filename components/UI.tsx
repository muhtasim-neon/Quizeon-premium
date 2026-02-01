import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ className, children, hoverEffect = false, ...props }) => {
  return (
    <div 
      className={cn(
        "glass rounded-2xl p-6 transition-all duration-300", 
        hoverEffect && "hover:bg-white/10 hover:-translate-y-1 hover:border-primary/50 cursor-pointer",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({ className, variant = 'primary', children, ...props }) => {
  const variants = {
    primary: "bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/30",
    secondary: "bg-white/10 hover:bg-white/20 text-white",
    ghost: "hover:bg-white/5 text-slate-300 hover:text-white",
    danger: "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50"
  };

  return (
    <button 
      className={cn(
        "px-6 py-3 rounded-xl font-bold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2",
        variants[variant],
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
    <div className="w-full">
      {label && <label htmlFor={id} className="block text-sm font-medium text-slate-400 mb-2">{label}</label>}
      <input 
        id={id}
        className={cn(
          "w-full glass bg-transparent border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all",
          className
        )}
        {...props}
      />
    </div>
  );
};

export const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = "bg-primary/20 text-primary" }) => (
  <span className={cn("px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider", color)}>
    {children}
  </span>
);

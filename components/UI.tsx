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
        "glass-card rounded-2xl p-6 transition-all duration-300", 
        hoverEffect && "hover-effect cursor-pointer",
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
    primary: "bg-primary hover:bg-blue-700 dark:hover:bg-blue-500 text-white shadow-md shadow-primary/20 border border-transparent",
    secondary: "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm",
    ghost: "bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white",
    danger: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/20",
    outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary/5"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base"
  };

  return (
    <button 
      className={cn(
        "rounded-xl font-semibold transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2",
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
        <label htmlFor={id} className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 ml-1 group-focus-within:text-primary transition-colors">
          {label}
        </label>
      )}
      <div className="relative">
        <input 
          id={id}
          className={cn(
            "w-full bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5",
            "text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500",
            "focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className
          )}
          {...props}
        />
      </div>
    </div>
  );
};

export const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = "bg-primary/10 text-primary border-primary/20" }) => (
  <span className={cn("px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border", color)}>
    {children}
  </span>
);
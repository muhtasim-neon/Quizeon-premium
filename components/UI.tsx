
import React, { useRef, useState } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

// Standard Card
export const GlassCard: React.FC<GlassCardProps> = ({ className, children, hoverEffect = false, ...props }) => {
  return (
    <div 
      className={cn(
        "bg-white rounded-[32px] p-6 transition-all duration-300 ease-out text-ink relative overflow-hidden border-2 border-transparent",
        "shadow-[0_10px_40px_-10px_rgba(62,39,35,0.05)]", 
        hoverEffect && "hover:-translate-y-2 hover:shadow-[0_20px_40px_-12px_rgba(141,110,99,0.2)] hover:border-wood/30 cursor-pointer active:scale-[0.98]",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

interface WonderCardProps extends React.HTMLAttributes<HTMLDivElement> {
  colorClass?: string;
}

// Wonder Card - Updated to use Washi texture
export const WonderCard: React.FC<WonderCardProps> = ({ children, colorClass = "bg-white border-bamboo/10", className = '', onClick, ...props }) => (
  <div 
    onClick={onClick} 
    className={cn(
      `p-6 rounded-[32px] border-b-4 transition-all duration-300 relative overflow-hidden ${colorClass}`,
      onClick && "cursor-pointer hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]",
      className
    )}
    {...props}
  >
    <div className="absolute inset-0 washi-texture opacity-30"></div>
    <div className="relative z-10 h-full">{children}</div>
  </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  magnetic?: boolean; 
}

export const Button: React.FC<ButtonProps> = ({ className, variant = 'primary', size = 'md', magnetic, children, ...props }) => {
  
  // Strict Palette:
  // Primary -> Wood (#8d6e63)
  // Secondary -> White/Paper with Bamboo Border
  // Danger -> Hanko (#bc2f32)
  
  const variants = {
    primary: "bg-[#8d6e63] text-white border-b-4 border-[#5D4037] active:border-b-0 active:translate-y-1 hover:bg-[#a1887f]",
    secondary: "bg-white text-[#3e2723] border-2 border-b-4 border-[#795548]/30 active:border-b-2 active:translate-y-[2px] hover:border-[#8d6e63]/50",
    ghost: "bg-transparent text-[#795548] hover:bg-[#fdfaf1] hover:text-[#8d6e63] transition-colors border-0",
    danger: "bg-[#bc2f32] text-white border-b-4 border-[#8B0000] active:border-b-0 active:translate-y-1 hover:bg-[#d32f2f]",
    outline: "bg-transparent border-2 border-[#795548]/30 text-[#795548] hover:border-[#8d6e63] hover:text-[#8d6e63]"
  };

  const sizes = {
    sm: "px-4 py-2 text-xs font-bold rounded-xl",
    md: "px-6 py-3 text-sm font-bold rounded-2xl",
    lg: "px-8 py-4 text-base font-bold rounded-2xl"
  };

  return (
    <button 
      className={cn(
        "flex items-center justify-center gap-2 font-sans select-none transition-all duration-100",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:active:border-b-4",
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
        <label htmlFor={id} className="block text-xs font-bold uppercase tracking-wider text-bamboo mb-2 ml-1">
          {label}
        </label>
      )}
      <input 
        id={id}
        className={cn(
          "w-full bg-[#fdfaf1] border-2 border-[#d4a373]/20 rounded-2xl px-5 py-4",
          "text-ink font-bold placeholder-bamboo/40",
          "focus:border-[#8d6e63] focus:bg-white outline-none transition-all duration-300",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      />
    </div>
  );
};

export const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = "bg-[#fdfaf1] text-[#8d6e63] border border-[#8d6e63]/20" }) => (
  <span className={cn("px-3 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-wide", color)}>
    {children}
  </span>
);

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="flex items-center text-sm text-bamboo mb-6 pl-1 font-bold">
      <Link to="/" className="hover:text-wood transition-colors flex items-center bg-white p-2 rounded-lg shadow-sm border border-transparent hover:border-wood/20">
        <Home size={16} />
      </Link>
      {pathnames.length > 0 && <ChevronRight size={14} className="mx-2 text-bamboo/30" />}
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        return (
          <div key={to} className="flex items-center">
            {isLast ? (
              <span className="text-ink bg-white px-3 py-1 rounded-lg shadow-sm">{value.replace(/-/g, ' ')}</span>
            ) : (
              <Link to={to} className="hover:text-wood transition-colors capitalize">
                {value.replace(/-/g, ' ')}
              </Link>
            )}
            {!isLast && <ChevronRight size={14} className="mx-2 text-bamboo/30" />}
          </div>
        );
      })}
    </nav>
  );
};

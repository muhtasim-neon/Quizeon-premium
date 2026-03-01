
import React, { useRef, useState, useEffect } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home, Loader2 } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

// Standard Card - Updated with 3D Tilt and Glow
export const GlassCard: React.FC<GlassCardProps> = ({ className, children, hoverEffect = false, ...props }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);
  
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hoverEffect) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: hoverEffect ? rotateX : 0,
        rotateY: hoverEffect ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "bg-white/80 backdrop-blur-xl rounded-[32px] p-6 transition-all duration-300 ease-out text-ink relative overflow-hidden",
        "border-2 border-b-4 border-white/50 shadow-sm",
        hoverEffect && "hover:shadow-2xl hover:border-white cursor-pointer active:scale-[0.98] active:border-b-2",
        className
      )} 
      {...props}
    >
      <div className="absolute inset-0 washi-texture opacity-30 pointer-events-none"></div>
      {/* Glare Effect */}
      {hoverEffect && (
        <motion.div 
          className="absolute inset-0 pointer-events-none z-0 opacity-0 group-hover:opacity-20"
          style={{
            background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.8) 0%, transparent 60%)`
          }}
        />
      )}
      <div className="relative z-10" style={{ transform: "translateZ(30px)" }}>{children}</div>
    </motion.div>
  );
};

// Glow Card - For high-priority items
export const GlowCard: React.FC<GlassCardProps> = ({ className, children, ...props }) => (
  <GlassCard 
    className={cn("border-glow ring-4 ring-hanko/5", className)} 
    hoverEffect 
    {...props}
  >
    {children}
  </GlassCard>
);

interface WonderCardProps extends React.HTMLAttributes<HTMLDivElement> {
  colorClass?: string;
}

// Wonder Card - Enhanced with full border definition for consistency
export const WonderCard: React.FC<WonderCardProps> = ({ children, colorClass = "bg-white border-bamboo/10", className = '', onClick, ...props }) => (
  <div 
    onClick={onClick} 
    className={cn(
      `p-6 rounded-[32px] border-2 border-b-4 transition-all duration-300 relative overflow-hidden ${colorClass}`,
      onClick && "cursor-pointer hover:-translate-y-1 hover:shadow-xl active:scale-[0.98] active:border-b-2 active:translate-y-1",
      className
    )}
    {...props}
  >
    <div className="absolute inset-0 washi-texture opacity-30 pointer-events-none"></div>
    <div className="relative z-10 h-full">{children}</div>
  </div>
);

// Feature Card for Dark/Hero content - Updated with depth
export const FeatureCard: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-[32px] bg-ink text-rice shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300",
        "border-2 border-b-4 border-bamboo/20",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 washi-texture opacity-30 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-hanko/20 rounded-full blur-[80px] -mr-16 -mt-16 transition-all group-hover:bg-hanko/30 pointer-events-none"></div>
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  magnetic?: boolean; 
}

export const Button: React.FC<ButtonProps> = ({ className, variant = 'primary', size = 'md', magnetic, children, ...props }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!magnetic || !ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const variants = {
    primary: "bg-wood text-white border-b-4 border-[#5D4037] active:border-b-0 active:translate-y-1 hover:bg-[#a1887f] hover:shadow-lg hover:shadow-wood/20",
    secondary: "bg-rice text-ink border-2 border-b-4 border-bamboo/20 active:border-b-2 active:translate-y-[2px] hover:border-wood/50 hover:shadow-md",
    ghost: "bg-transparent text-bamboo hover:bg-rice hover:text-ink transition-colors border-0",
    danger: "bg-hanko text-white border-b-4 border-[#8B0000] active:border-b-0 active:translate-y-1 hover:bg-[#d32f2f] hover:shadow-lg hover:shadow-hanko/20",
    outline: "bg-transparent border-2 border-bamboo/30 text-bamboo hover:border-wood hover:text-wood"
  };

  const sizes = {
    sm: "px-4 py-2 text-xs font-bold rounded-xl",
    md: "px-6 py-3 text-sm font-bold rounded-2xl",
    lg: "px-8 py-4 text-base font-bold rounded-2xl"
  };

  return (
    <motion.button 
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={cn(
        "flex items-center justify-center gap-2 font-sans select-none transition-all duration-100 relative overflow-hidden",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:active:border-b-4",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 washi-texture opacity-10 pointer-events-none"></div>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <motion.div 
        className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity"
        initial={false}
        whileTap={{ scale: 4, opacity: 0, transition: { duration: 0.5 } }}
      />
    </motion.button>
  );
};

export const ProgressRing: React.FC<{ progress: number; size?: number; strokeWidth?: number; color?: string }> = ({ 
  progress, 
  size = 60, 
  strokeWidth = 6, 
  color = "text-hanko" 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-bamboo/10"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          className={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <span className="absolute text-[10px] font-black text-ink">{Math.round(progress)}%</span>
    </div>
  );
};

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("animate-pulse bg-bamboo/10 rounded-xl", className)} />
);

export const Toggle: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; label?: string; description?: string }> = ({ checked, onChange, label, description }) => (
  <div className="flex items-center justify-between gap-4 cursor-pointer select-none group" onClick={() => onChange(!checked)}>
    <div className="flex-1">
      {label && <h4 className="text-sm font-bold text-ink group-hover:text-hanko transition-colors">{label}</h4>}
      {description && <p className="text-[10px] text-bamboo font-medium leading-tight">{description}</p>}
    </div>
    <div className={cn(
      "w-12 h-6 rounded-full transition-colors duration-300 relative shrink-0",
      checked ? "bg-hanko" : "bg-bamboo/20"
    )}>
      <motion.div 
        className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
        animate={{ x: checked ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </div>
  </div>
);

export const Confetti: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(30)].map((_, i) => (
        <motion.div 
          key={i}
          initial={{ 
            opacity: 1, 
            scale: 0, 
            x: 0, 
            y: 0,
            rotate: 0 
          }}
          animate={{ 
            opacity: 0, 
            scale: 1, 
            x: (Math.random() - 0.5) * 400, 
            y: (Math.random() - 0.5) * 400,
            rotate: Math.random() * 360 
          }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute left-1/2 top-1/2 w-3 h-3 rounded-sm"
          style={{
            backgroundColor: ['#bc2f32', '#d4a373', '#8d6e63', '#795548', '#3e2723'][Math.floor(Math.random() * 5)],
          }}
        />
      ))}
    </div>
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
          "w-full bg-rice border-2 border-gold/20 rounded-2xl px-5 py-4 relative",
          "text-ink font-bold placeholder-bamboo/40 font-jp",
          "focus:border-wood focus:bg-white outline-none transition-all duration-300 shadow-inner",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      />
    </div>
  );
};

export const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = "bg-rice text-wood border border-wood/20" }) => (
  <span className={cn("px-3 py-1 rounded-lg text-[11px] font-black uppercase tracking-widest font-jp", color)}>
    {children}
  </span>
);

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md"
      >
        <GlassCard className="washi-theme shadow-2xl p-8">
          <h2 className="text-2xl font-black text-ink mb-4 font-jp uppercase tracking-tighter">{title}</h2>
          <div className="mb-8">{children}</div>
          <Button onClick={onClose} className="w-full py-4">
            OK
          </Button>
        </GlassCard>
      </motion.div>
    </div>
  );
};

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

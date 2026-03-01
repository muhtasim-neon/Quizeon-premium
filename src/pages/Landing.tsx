
import React from 'react';
import { motion } from 'framer-motion';
import { Button, GlassCard, WonderCard } from '@/components/UI';
import { ChevronRight, Zap, Shield, Sparkles, Globe, BookOpen, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="snap-y snap-mandatory h-screen overflow-y-auto overflow-x-hidden">
      {/* Section 1: Hero */}
      <section className="snap-section h-screen flex flex-col lg:flex-row items-center justify-center relative overflow-hidden">
        <div className="flex-1 p-12 flex flex-col justify-center items-start z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge color="bg-hanko/10 text-hanko border-hanko/20 mb-6">Next-Gen Language Learning</Badge>
            <h1 className="text-6xl lg:text-8xl font-black text-ink leading-tight mb-6">
              Master <span className="text-hanko">Japanese</span> <br /> with AI.
            </h1>
            <p className="text-xl text-bamboo mb-8 max-w-lg leading-relaxed">
              Experience the future of language acquisition. Quizeon combines traditional wisdom with cutting-edge AI to make learning Japanese faster, smarter, and more fun.
            </p>
            <div className="flex gap-4">
              <Button size="lg" magnetic onClick={() => navigate('/dashboard')}>
                Get Started <ChevronRight className="ml-2" />
              </Button>
              <Button size="lg" variant="secondary">
                View Roadmap
              </Button>
            </div>
          </motion.div>
        </div>
        
        <div className="flex-1 h-full w-full relative overflow-hidden hidden lg:block">
          <motion.div 
            initial={{ scale: 1.2, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 bg-gradient-to-br from-hanko/20 to-orange-500/20"
          />
          <div className="absolute inset-0 flex items-center justify-center">
             <motion.div
               animate={{ 
                 y: [0, -20, 0],
                 rotate: [0, 5, 0]
               }}
               transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
               className="w-[500px] h-[700px] bg-white rounded-[48px] shadow-2xl border-4 border-white overflow-hidden relative"
             >
                <img 
                  src="https://picsum.photos/seed/japan/800/1200" 
                  alt="Japan" 
                  className="w-full h-full object-cover opacity-80"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                <div className="absolute bottom-12 left-12 right-12 text-white">
                   <h3 className="text-4xl font-black mb-2">未来学習</h3>
                   <p className="text-white/70 font-bold uppercase tracking-widest">Future Learning</p>
                </div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2: Features */}
      <section className="snap-section h-screen flex items-center justify-center bg-white/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-6xl font-black text-ink mb-4">Why Quizeon?</h2>
            <p className="text-bamboo font-bold uppercase tracking-widest">The Core Pillars of Our Methodology</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { icon: Zap, title: "AI Sensei", desc: "Real-time conversation practice with our advanced AI tutor." },
              { icon: Shield, title: "SRS Mastery", desc: "Scientifically proven spaced repetition for long-term retention." },
              { icon: Sparkles, title: "Gamified Hub", desc: "Learn through play with our collection of arcade-style games." }
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
              >
                <GlassCard hoverEffect className="h-full text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-hanko/10 rounded-2xl flex items-center justify-center text-hanko mb-6">
                    <f.icon size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-ink mb-4">{f.title}</h3>
                  <p className="text-bamboo leading-relaxed">{f.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="flex items-center gap-2 font-black text-xl"><Globe /> GLOBAL EDU</div>
             <div className="flex items-center gap-2 font-black text-xl"><Zap /> TECH STARS</div>
             <div className="flex items-center gap-2 font-black text-xl"><Shield /> SECURE LEARN</div>
          </div>
        </div>
      </section>

      {/* Section 2.5: Interactive Demo Preview */}
      <section className="snap-section h-screen flex items-center justify-center bg-rice relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
               <Badge color="bg-blue-100 text-blue-600 border-blue-200 mb-6">Interactive Demo</Badge>
               <h2 className="text-5xl lg:text-7xl font-black text-ink mb-6">See it in <br /> <span className="text-blue-500">Action.</span></h2>
               <p className="text-lg text-bamboo mb-8 leading-relaxed">
                  Our dashboard isn't just a list of links. It's a living ecosystem that adapts to your learning pace, showing you exactly what you need to focus on next.
               </p>
               <div className="space-y-4">
                  {['Real-time Progress Tracking', 'Dynamic AI Content Generation', 'Personalized Learning Roadmap'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 font-bold text-ink">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <Check size={14} />
                      </div>
                      {item}
                    </div>
                  ))}
               </div>
            </div>
            <div className="relative">
               <motion.div 
                 initial={{ rotateY: 20, rotateX: 10, scale: 0.9 }}
                 whileInView={{ rotateY: 0, rotateX: 0, scale: 1 }}
                 transition={{ duration: 1 }}
                 className="bg-white rounded-[32px] shadow-2xl border-2 border-bamboo/10 p-4 overflow-hidden"
               >
                  <div className="flex items-center gap-2 mb-4 border-b border-bamboo/5 pb-4">
                     <div className="w-3 h-3 rounded-full bg-red-400" />
                     <div className="w-3 h-3 rounded-full bg-yellow-400" />
                     <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <img 
                    src="https://picsum.photos/seed/dashboard/800/600" 
                    alt="Dashboard Preview" 
                    className="w-full h-auto rounded-2xl"
                    referrerPolicy="no-referrer"
                  />
               </motion.div>
               <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-hanko rounded-full blur-3xl opacity-20" />
            </div>
         </div>
      </section>

      {/* Section 3: CTA */}
      <section className="snap-section h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-ink z-0">
          <div className="absolute inset-0 bg-pattern opacity-10" />
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-hanko rounded-full blur-[120px]"
          />
        </div>
        
        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
          >
            <h2 className="text-6xl lg:text-9xl font-black text-white mb-8 leading-none">
              READY TO <br /> <span className="text-hanko">BEGIN?</span>
            </h2>
            <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto">
              Join thousands of students mastering Japanese with the most advanced learning platform ever built.
            </p>
            <Button size="lg" className="px-12 py-6 text-xl" magnetic onClick={() => navigate('/dashboard')}>
              Enter the Dojo
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

const Badge: React.FC<{ children: React.ReactNode; className?: string; color?: string }> = ({ children, className, color = "bg-[#fdfaf1] text-[#8d6e63] border border-[#8d6e63]/20" }) => (
  <span className={`px-3 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-wide inline-block ${color} ${className}`}>
    {children}
  </span>
);

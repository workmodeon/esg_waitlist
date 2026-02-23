import React, { useState, useMemo, useEffect } from 'react';
import { Building2, User, Mail, Calendar, CheckCircle2, X, Loader2, ArrowRight, Clock } from 'lucide-react';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [introFade, setIntroFade] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 4 seconds of "Cinema", then 0.5s fade out
    const timer = setTimeout(() => setIntroFade(true), 4000);
    const removeTimer = setTimeout(() => setShowIntro(false), 4500);
    return () => { clearTimeout(timer); clearTimeout(removeTimer); };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {showIntro && (
        <div className={`fixed inset-0 z-[100] bg-black flex items-center justify-center transition-opacity duration-1000 ${introFade ? 'opacity-0' : 'opacity-100'}`}>
          
          {/* Layer 1: The Forest (Sustainability) */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600')] bg-cover bg-center animate-cinematicReveal" />

          {/* Layer 2: The Tech Grid (Automation/Remote Sensing) */}
          <div className="absolute inset-0 animate-techGrid"
            style={{
              backgroundImage: 'linear-gradient(rgba(16,185,129,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.2) 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }}
          />

          {/* Layer 3: The Rising Tree */}
          <div className="absolute bottom-0 w-full flex justify-center">
            <div className="w-32 h-80 bg-gradient-to-t from-emerald-900 via-emerald-600 to-transparent rounded-t-full origin-bottom animate-treeRise" />
          </div>

          {/* Layer 4: Data Particles */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="data-leaf left-[45%] top-[60%] animate-particle1" />
            <div className="data-leaf left-[50%] top-[65%] animate-particle2" />
            <div className="data-leaf left-[55%] top-[58%] animate-particle3" />
          </div>

          {/* Layer 5: The Brand Reveal */}
          <div className="relative z-10 text-center animate-logoEnter">
            <img src="/logo.png" alt="Zissions" className="h-28 w-auto mx-auto mb-6 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
            <h2 className="text-emerald-400 text-3xl font-light tracking-[0.6em] uppercase">Zissions</h2>
            <div className="mt-2 h-[1px] w-0 bg-emerald-500 mx-auto animate-[width_2s_ease_forwards_delay-2s]" style={{ width: '100%' }} />
          </div>
        </div>
      )}

      {/* MAIN CONTENT (Waitlist Page) */}
      <main className={`relative h-full w-full flex items-center justify-center bg-emerald-50 transition-all duration-1000 ${showIntro ? 'scale-110 blur-xl' : 'scale-100 blur-0'}`}>
        <div className="text-center p-8 max-w-2xl">
           <img src="/logo.png" alt="Logo" className="h-12 mx-auto mb-6" />
           <h1 className="text-5xl font-black text-emerald-950 mb-4">ESG Automation</h1>
           <p className="text-emerald-800/70 mb-8 text-lg">Your journey to automated sustainability begins here.</p>
           <button 
             onClick={() => setIsOpen(true)}
             className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-emerald-200"
           >
             Join the Waitlist
           </button>
        </div>
      </main>
    </div>
  );
}

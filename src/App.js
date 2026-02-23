import React, { useState, useMemo, useEffect } from 'react';
import { 
  Building2, User, Mail, Calendar, CheckCircle2, 
  X, Loader2, ArrowRight, Clock
} from 'lucide-react';

const GOOGLE_SHEET_WEBHOOK_URL = "YOUR_URL_HERE"; 

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [showIntro, setShowIntro] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false); // New state for smooth exit

  const [formData, setFormData] = useState({
    companyName: '',
    personName: '',
    email: '',
    demoDate: ''
  });

  const daysLeft = useMemo(() => {
    const targetDate = new Date("2026-04-14T00:00:00"); 
    const now = new Date();
    const diff = targetDate - now;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, []);

  useEffect(() => {
    // Start fading out slightly before unmounting
    const fadeTimer = setTimeout(() => setIsFadingOut(true), 2800);
    const unmountTimer = setTimeout(() => setShowIntro(false), 3200);
    
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setTimeout(() => {
          setIsSuccess(false);
          setFormData({ companyName: '', personName: '', email: '', demoDate: '' });
        }, 500);
      }, 4000);
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      {showIntro && (
        <div className={`fixed inset-0 bg-black overflow-hidden flex items-center justify-center z-[100] transition-opacity duration-500 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
          
          {/* BLURRED FOREST BACKGROUND */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600')] bg-cover bg-center animate-forestReveal"></div>

          {/* EARTH GRID OVERLAY */}
          <div className="absolute inset-0 opacity-20 animate-gridMove"
            style={{
              backgroundImage: `
                linear-gradient(rgba(16,185,129,0.4) 1px, transparent 1px),
                linear-gradient(90deg, rgba(16,185,129,0.4) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px'
            }}
          ></div>

          {/* TREE SILHOUETTE */}
          <div className="absolute bottom-0 w-full flex justify-center">
            <div className="w-40 h-64 bg-gradient-to-t from-emerald-900 to-emerald-600 rounded-t-full origin-bottom animate-treeGrow"></div>
          </div>

          {/* LEAF PARTICLES */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="leaf left-[42%] top-[55%] animate-leaf1"></div>
            <div className="leaf left-[50%] top-[62%] animate-leaf2"></div>
            <div className="leaf left-[58%] top-[50%] animate-leaf3"></div>
            <div className="leaf left-[47%] top-[45%] animate-leaf4"></div>
          </div>

          {/* BIG LOGO */}
          <div className="relative z-10 animate-logoReveal text-center">
             <img src="/logo.png" alt="Logo" className="h-32 w-auto mx-auto mb-4" />
             <h2 className="text-emerald-400 text-2xl font-mono tracking-[0.5em] uppercase">Zissions</h2>
          </div>
        </div>
      )}
        
      {/* MAIN PAGE */}
      <div className={`min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4 transition-opacity duration-1000 ${showIntro ? "opacity-0" : "opacity-100"}`}>
        <div className="text-center z-10 max-w-2xl px-4">
          <div className="mb-8">
            <img src="/logo.png" alt="Logo" className="h-16 w-auto mx-auto" />
          </div>

          <h1 className="text-5xl font-extrabold mb-4 text-emerald-950">
            ESG Automation Waitlist
          </h1>

          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full font-bold mb-8 animate-bounce">
            <Clock size={18} />
            <span>Only {daysLeft} days left!</span>
          </div>

          <p className="text-xl text-emerald-800/80 mb-8">
            Join the exclusive list of companies automating their sustainability future.
          </p>

          <button onClick={() => setIsOpen(true)} className="group px-10 py-5 font-bold text-white bg-emerald-600 rounded-2xl hover:bg-emerald-700 shadow-lg flex items-center gap-2 mx-auto transition-all hover:scale-105">
            Join the Waitlist
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* MODAL (Kept original logic) */}
        {isOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-md">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 relative shadow-2xl">
               {/* ... (Your Modal Form Code) ... */}
               <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6"><X /></button>
               {isSuccess ? <div className="text-center">Success!</div> : <form onSubmit={handleSubmit}>...</form>}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

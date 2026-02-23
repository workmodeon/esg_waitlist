import React, { useState, useMemo } from 'react';
import { 
  Building2, User, Mail, Calendar, CheckCircle2, 
  X, Loader2, ArrowRight, Clock, Leaf, TreePine 
} from 'lucide-react';

const GOOGLE_SHEET_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbyo0XDNh7R2oWGsWvM7Gi-L9VUuMVjCFcyvZJxnf7XvR1Bk-1QvLbzDdwMRR4o50uqiBQ/exec"; 

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    companyName: '',
    personName: '',
    email: '',
    demoDate: ''
  });

  // Countdown Logic
  const daysLeft = useMemo(() => {
    const targetDate = new Date("2026-04-14T00:00:00"); 
    const now = new Date();
    const diff = targetDate - now;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
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
      }, 3000);
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
    <div className="relative min-h-screen w-full overflow-hidden font-sans antialiased flex items-center justify-center bg-emerald-950">
      
      {/* --- CLASSY ANIMATED BACKDROP --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 animate-slow-zoom opacity-60 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=2000')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/80 via-emerald-950/20 to-emerald-950" />
        
        {/* Floating Particles */}
        <div className="absolute inset-0 opacity-30">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="absolute bg-white rounded-full blur-2xl animate-blob"
                    style={{
                        width: Math.random() * 200 + 100 + 'px',
                        height: Math.random() * 200 + 100 + 'px',
                        left: Math.random() * 100 + '%',
                        top: Math.random() * 100 + '%',
                        animationDelay: i * 2 + 's',
                    }}
                />
            ))}
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <main className="relative z-10 w-full max-w-4xl px-6 text-center">
        {/* LOGO */}
        <div className="mb-10 animate-in fade-in duration-1000">
          <img 
            src="/logo.png" 
            alt="Zissions Logo" 
            className="h-16 w-auto mx-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" 
          />
        </div>

        <header className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 backdrop-blur-md text-emerald-300 text-sm font-medium">
             <Leaf size={14} className="animate-bounce" />
             <span>The Future of Sustainability Automation</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Nurturing a <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                Greener Future
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-emerald-100/70 max-w-2xl mx-auto leading-relaxed mb-10">
            Join the exclusive list of companies automating their sustainability future with <span className="text-white font-semibold">Zissions</span>.
          </p>

          <div className="flex flex-col items-center gap-8">
            <button 
              onClick={() => setIsOpen(true)}
              className="group relative px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-lg rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(16,185,129,0.3)]"
            >
              <span className="flex items-center gap-2">
                Join the Waitlist <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

            <div className="flex items-center gap-6 text-emerald-400/60 font-medium text-sm">
               <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>Only {daysLeft} days left for early access!</span>
               </div>
            </div>
          </div>
        </header>
      </main>

      {/* --- MODAL --- */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setIsOpen(false)} />
          
          <div className="relative bg-white/95 backdrop-blur-md w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 overflow-hidden animate-in zoom-in-95 duration-300">
            <button onClick={() => setIsOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-emerald-600 transition-colors">
              <X size={24} />
            </button>
            
            {isSuccess ? (
              <div className="py-12 text-center animate-in zoom-in duration-500">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} className="text-emerald-600" />
                </div>
                <h2 className="text-3xl font-bold text-emerald-950 mb-3">Success!</h2>
                <p className="text-emerald-700">You're on the list. Check your inbox soon!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Secure Your Spot</h2>
                  <p className="text-emerald-600 text-sm font-semibold mt-2 flex items-center gap-1">
                    <Clock size={14} /> Early access closes in {daysLeft} days.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input required name="companyName" placeholder="Company Name" onChange={handleInputChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-emerald-500 outline-none transition-all" />
                  </div>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input required name="personName" placeholder="Your Name" onChange={handleInputChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-emerald-500 outline-none transition-all" />
                  </div>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input required type="email" name="email" placeholder="Official Email" onChange={handleInputChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-emerald-500 outline-none transition-all" />
                  </div>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input required type="date" name="demoDate" min={new Date().toISOString().split('T')[0]} onChange={handleInputChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-emerald-500 outline-none transition-all cursor-pointer" />
                  </div>
                </div>

                {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}

                <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-70">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "Reserve Early Access"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

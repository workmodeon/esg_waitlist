import React, { useState, useMemo } from 'react';
import { 
  Building2, User, Mail, Calendar, CheckCircle2, 
  X, Loader2, ArrowRight, Clock, Leaf 
} from 'lucide-react';

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
    // 1️⃣ Send Email via Resend API
    const emailResponse = await fetch('/api/sendEmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (!emailResponse.ok) {
      let message = 'Failed to send confirmation email';
      try {
        const body = await emailResponse.json();
        if (body?.error) message = body.error;
      } catch (_) {
        // Keep fallback message when response is not JSON
      }
      throw new Error(message);
    }

    setIsSuccess(true);

    setTimeout(() => {
      setIsOpen(false);
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          companyName: '',
          personName: '',
          email: '',
          demoDate: ''
        });
      }, 500);
    }, 3000);

  } catch (err) {
    setError(err?.message || "Something went wrong. Please try again.");
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
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/90 via-emerald-950/40 to-emerald-950" />
        
        <div className="absolute inset-0 opacity-20">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="absolute bg-emerald-100 rounded-full blur-3xl animate-blob"
                    style={{
                        width: Math.random() * 300 + 150 + 'px',
                        height: Math.random() * 300 + 150 + 'px',
                        left: Math.random() * 100 + '%',
                        top: Math.random() * 100 + '%',
                        animationDelay: i * 2 + 's',
                    }}
                />
            ))}
        </div>
      </div>

      <main className="relative z-10 w-full max-w-4xl px-6 text-center">
        <div className="mb-12 animate-in fade-in duration-1000">
          <img 
            src="/logo.png" 
            alt="Zissions Logo" 
            className="h-16 w-auto mx-auto object-contain drop-shadow-[0_0_20px_rgba(16,185,129,0.4)]" 
          />
        </div>

        <header className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 backdrop-blur-md text-emerald-300 text-sm font-medium">
             <Leaf size={14} className="animate-pulse" />
             <span>Join the Sustainability Revolution</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight leading-tight">
            Automate Your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-100">
                Sustainability Future
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-emerald-100/70 max-w-2xl mx-auto leading-relaxed mb-12">
            Join the exclusive list of companies scaling their green impact with <span className="text-emerald-400 font-semibold tracking-wide">ZISSIONS</span>.
          </p>

          <div className="flex flex-col items-center gap-6">
            <button 
              onClick={() => setIsOpen(true)}
              className="group relative px-12 py-5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-lg rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(16,185,129,0.2)]"
            >
              <span className="flex items-center gap-2">
                Join the Waitlist <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

            <div className="flex items-center gap-2 text-emerald-400/60 font-medium text-sm">
                <Clock size={16} />
                <span className="uppercase tracking-widest text-[10px]">Early access closes in {daysLeft} days</span>
            </div>
          </div>
        </header>
      </main>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-md animate-in fade-in duration-500" onClick={() => setIsOpen(false)} />
          
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 overflow-hidden animate-in zoom-in-95 duration-300">
            <button onClick={() => setIsOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-emerald-600 transition-colors">
              <X size={24} />
            </button>
            
            {isSuccess ? (
              <div className="py-12 text-center animate-in zoom-in duration-500">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} className="text-emerald-600" />
                </div>
                <h2 className="text-3xl font-bold text-emerald-950 mb-3">Success!</h2>
                <p className="text-emerald-700">You're on the list. Check your inbox soon!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Reserve Spot</h2>
                  <p className="text-emerald-600 text-sm font-semibold mt-1">
                    Limited early access availability.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input required name="companyName" placeholder="Company Name" onChange={handleInputChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-emerald-500 outline-none transition-all" />
                  </div>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input required name="personName" placeholder="Your Name" onChange={handleInputChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-emerald-500 outline-none transition-all" />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input required type="email" name="email" placeholder="Official Email" onChange={handleInputChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-emerald-500 outline-none transition-all" />
                  </div>

                  {/* MODIFIED SECTION: YOUR AVAILABILITY */}
                  <div className="pt-2">
                    <label className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-bold mb-2 block ml-1">
                      Your Availability
                    </label>
                    <div className="relative group">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                      <input 
                        required 
                        type="date" 
                        name="demoDate" 
                        min={new Date().toISOString().split('T')[0]} 
                        onChange={handleInputChange} 
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-emerald-500 outline-none transition-all cursor-pointer" 
                      />
                    </div>
                  </div>
                </div>

                {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}

                <button type="submit" disabled={isSubmitting} className="w-full mt-4 py-5 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70">
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



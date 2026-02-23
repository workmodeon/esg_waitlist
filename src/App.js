import React, { useState, useMemo } from 'react';
import { 
  Building2, User, Mail, Calendar, CheckCircle2, 
  X, Loader2, ArrowRight, Clock
} from 'lucide-react';

// YOUR LIVE GOOGLE SHEET URL
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

  // Countdown Logic: 51 days from Feb 22, 2026 is April 14, 2026
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4 font-sans antialiased">
      <div className="text-center z-10 max-w-2xl px-4">
        <div className="mb-8">
          <img
            src="/logo.png"
            alt="Company Logo"
            className="h-16 w-auto mx-auto object-contain"
          />
        </div>
<h1 className="text-5xl font-extrabold mb-4 text-emerald-950 leading-tight">
  ESG Automation <span className="underline">Waitlist</span>
</h1>        
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full font-bold mb-8 animate-bounce">
          <Clock size={18} />
          <span>Only {daysLeft} days left for early access!</span>
        </div>

        <p className="text-xl text-emerald-800/80 mb-8">
         Join the exclusive list of companies automating their sustainability future with <span className="font-bold">Zissions</span>.
        </p>
        
        <button onClick={() => setIsOpen(true)} className="group px-10 py-5 font-bold text-white bg-emerald-600 rounded-2xl hover:bg-emerald-700 shadow-lg flex items-center gap-2 mx-auto transition-all hover:scale-105 active:scale-95">
          Join the Waitlist <ArrowRight className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-md transition-all">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 relative overflow-hidden animate-in zoom-in duration-300">
            <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors">
              <X size={24} />
            </button>
            
            {isSuccess ? (
              <div className="py-12 text-center">
                <CheckCircle2 size={64} className="text-emerald-600 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-emerald-950 mb-2">Success!</h2>
                <p className="text-emerald-700 text-lg">You're on the list. Check your inbox soon!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">Secure Your Spot</h2>
                  <p className="text-emerald-600 text-sm font-semibold mt-1 flex items-center gap-1">
                    <Clock size={14} /> Early access closes in {daysLeft} days.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="relative">
                    <Building2 className="absolute left-4 top-4 text-slate-400" size={20} />
                    <input required name="companyName" placeholder="Company Name" onChange={handleInputChange} className="w-full pl-12 pr-4 py-4 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 outline-none transition-all text-slate-800" />
                  </div>
                  <div className="relative">
                    <User className="absolute left-4 top-4 text-slate-400" size={20} />
                    <input required name="personName" placeholder="Your Name" onChange={handleInputChange} className="w-full pl-12 pr-4 py-4 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 outline-none transition-all text-slate-800" />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 text-slate-400" size={20} />
                    <input required type="email" name="email" placeholder="Official Email" onChange={handleInputChange} className="w-full pl-12 pr-4 py-4 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 outline-none transition-all text-slate-800" />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-4 text-slate-400" size={20} />
                    <input required type="date" name="demoDate" min={new Date().toISOString().split('T')[0]} onChange={handleInputChange} className="w-full pl-12 pr-4 py-4 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 outline-none transition-all text-slate-800 cursor-pointer" />
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-lg flex items-center justify-center gap-2 active:scale-[0.98]">
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





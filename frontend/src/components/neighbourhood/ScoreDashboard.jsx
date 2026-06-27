import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { api } from "../../lib/api";

export function ScoreDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const res = await api.get("/households/me");
        setScore(res.data.wasteScore || 0);
      } catch (err) {
        console.error("Failed to fetch score", err);
      } finally {
        setLoading(false);
      }
    };
    fetchScore();
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getScoreProfile = (s) => {
    if (s <= 15) return { color: "text-emerald-600", ring: "ring-emerald-400/50", bg: "bg-emerald-100", label: "Eco-Warriors 🌍", desc: "Almost zero waste!" };
    if (s <= 40) return { color: "text-amber-600", ring: "ring-amber-400/50", bg: "bg-amber-100", label: "Doing Okay 👍", desc: "Room for improvement." };
    return { color: "text-rose-600", ring: "ring-rose-400/50", bg: "bg-rose-100", label: "High Waste 🚨", desc: "Time to clean the fridge." };
  };

  if (loading) return <div className="h-8 w-24 animate-pulse rounded-full bg-white/20"></div>;

  const profile = getScoreProfile(score);

  return (
    <div className="relative" ref={dropdownRef}>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center flex-col sm:flex-row gap-1 sm:gap-2 rounded-xl sm:rounded-full border border-amber-50/20 bg-amber-900/30 px-2 py-1.5 sm:px-3 sm:py-1.5 shadow-sm backdrop-blur-md transition-all hover:bg-amber-900/50 active:scale-95 ${isOpen ? "ring-2 " + profile.ring : ""}`}
      >
        
        <div className="flex flex-col items-center justify-center sm:hidden">
          <span className="text-base leading-none drop-shadow-sm mb-0.5">🗑️</span>
          <span className={`flex items-center rounded-md px-1 py-0.5 text-[9px] font-black shadow-inner leading-none ${profile.bg} ${profile.color}`}>
            {score}%
          </span>
        </div>

        <span className="hidden text-xs font-bold uppercase tracking-wider text-amber-50/90 drop-shadow-sm sm:block">
          Waste Score
        </span>
        <span className={`hidden h-6 items-center rounded-full px-2 text-sm font-black shadow-inner sm:flex ${profile.bg} ${profile.color}`}>
          {score}%
        </span>

      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{willChange : "transform, opacity"}}
            className="fixed left-[15%] top-20 z-50 mt w-[85vw] max-w-[280px] -translate-x-1/2 overflow-hidden rounded-2xl border border-white/50 bg-white p-5 shadow-2xl backdrop-blur-xl lg:bg-white/50 lg:left-1/2 lg:mt-6 sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-3 sm:w-72 sm:translate-x-0"
          >
            <div className="flex flex-col items-center text-center">
              
              <div className={`relative mb-3 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full border-4 shadow-inner bg-white/50 ${profile.color.replace('text', 'border')}`}>
                <span className={`text-2xl sm:text-3xl font-black ${profile.color}`}>{score}%</span>
              </div>

              <h3 className="text-base font-bold text-amber-950 sm:text-lg">{profile.label}</h3>
              <p className="mt-1 text-xs font-medium text-amber-950/70 sm:text-sm">{profile.desc}</p>
              
              <hr className="my-3 sm:my-4 w-full border-amber-900/10" />

              <p className="text-[10px] leading-relaxed text-amber-950/50 sm:text-xs">
                This score represents the percentage of food thrown away vs. eaten by your household. Keep it as low as possible!
              </p>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
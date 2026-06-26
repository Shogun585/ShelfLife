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
        className={`flex items-center gap-2 rounded-full border border-white/40 bg-white/30 px-3 py-1.5 shadow-sm backdrop-blur-md transition-all hover:bg-white/50 active:scale-95 ${isOpen ? "ring-2 " + profile.ring : ""}`}
      >
        <span className="text-xs font-bold uppercase tracking-wider text-amber-950/70">Waste Score</span>
        <span className={`flex h-6 items-center rounded-full px-2 text-sm font-black shadow-inner ${profile.bg} ${profile.color}`}>
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
            className="absolute right-0 mt-3 w-72 overflow-hidden rounded-2xl border border-white/50 bg-white/80 p-5 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex flex-col items-center text-center">
              
              <div className={`relative mb-3 flex h-24 w-24 items-center justify-center rounded-full border-4 shadow-inner bg-white/50 ${profile.color.replace('text', 'border')}`}>
                <span className={`text-3xl font-black ${profile.color}`}>{score}%</span>
              </div>

              <h3 className="text-lg font-bold text-amber-950">{profile.label}</h3>
              <p className="mt-1 text-sm font-medium text-amber-950/70">{profile.desc}</p>
              
              <hr className="my-4 w-full border-amber-900/10" />

              <p className="text-xs text-amber-950/50">
                This score represents the percentage of food thrown away vs. eaten by your household. Keep it as low as possible!
              </p>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
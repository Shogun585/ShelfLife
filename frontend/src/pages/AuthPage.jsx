import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HangingSign } from "../components/auth/HangingSign";
import { AuthForm } from "../components/auth/AuthForm";

export default function AuthPage() {
  const [showSign, setShowSign] = useState(false);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-sky-300 via-sky-400 to-blue-400 p-6">
      
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-amber-100/30 blur-[100px] pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-blue-100/20 blur-[100px] pointer-events-none"></div>

      <div 
        className={`relative z-10 flex w-full max-w-2xl flex-col items-center text-center transition-all duration-700 ${
          showSign ? "scale-95 opacity-40 blur-sm" : "scale-100 opacity-100 blur-0"
        }`}
      >
        <h1 className="mb-6 font-serif text-5xl font-black tracking-wide md:text-6xl lg:text-7xl">
          <span className="bg-gradient-to-br from-amber-900 to-amber-950 bg-clip-text text-transparent drop-shadow-sm">
            Stop wasting food.
          </span>
          <br />
          <span className="bg-gradient-to-br from-amber-800 to-amber-900 bg-clip-text text-transparent drop-shadow-sm">
            Start sharing.
          </span>
        </h1>
        
        <p className="mb-10 text-lg font-medium text-amber-950/80 drop-shadow-sm md:text-xl">
          A collaborative neighborhood where you and your roommates can track your shared fridge, prevent groceries from expiring, and reduce waste together.
        </p>

        <div className="mb-12 flex flex-col gap-4 text-left font-semibold text-amber-950 sm:flex-row sm:justify-center">
          <div className="flex items-center gap-2 rounded-xl border border-white/40 bg-amber-50/30 p-3 shadow-xl backdrop-blur-md transition-transform hover:-translate-y-1">
            <span className="text-2xl drop-shadow-md">🏡</span> Join your house
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-white/40 bg-amber-50/30 p-3 shadow-xl backdrop-blur-md transition-transform hover:-translate-y-1">
            <span className="text-2xl drop-shadow-md">🍎</span> Track shared food
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-white/40 bg-amber-50/30 p-3 shadow-xl backdrop-blur-md transition-transform hover:-translate-y-1">
            <span className="text-2xl drop-shadow-md">📉</span> Stop wasting
          </div>
        </div>

        <button
          onClick={() => setShowSign(true)}
          className="group relative overflow-hidden rounded-full bg-gradient-to-r from-amber-800 to-amber-950 px-10 py-4 text-lg font-black tracking-widest text-amber-50 shadow-[0_0_40px_-10px_rgba(120,53,15,0.6)] ring-2 ring-amber-900/30 ring-offset-2 ring-offset-sky-400 transition-all hover:scale-105 hover:from-amber-700 hover:to-amber-900 hover:shadow-[0_0_60px_-15px_rgba(120,53,15,0.8)] active:scale-95"
        >
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>
          <span className="relative z-10 drop-shadow-md">ENTER THE NEIGHBORHOOD</span>
        </button>
      </div>

      <AnimatePresence>
        {showSign && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-sky-950/30 backdrop-blur-md"
          >
            <div 
              className="absolute inset-0 cursor-pointer" 
              onClick={() => setShowSign(false)} 
            />

            <HangingSign>
              <AuthForm />
              
              <button 
                onClick={() => setShowSign(false)}
                className="mt-12 w-full text-center text-sm font-bold tracking-wider text-amber-950/60 transition-colors hover:text-amber-950"
              >
                ← BACK TO INTRO
              </button>
            </HangingSign>
            
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
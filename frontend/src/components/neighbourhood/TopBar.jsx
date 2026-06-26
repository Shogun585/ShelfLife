import { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { api } from "../../lib/api";
import { ScoreDashboard } from "./ScoreDashboard";

const importSwitchModal = () => import('./SwitchHouseModal');
const SwitchHouseModal = lazy(importSwitchModal);

export function TopBar() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Loading...");
  const [showModal, setShowModal] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    api.get("/households/me")
      .then((res) => setUserName(res.data.user_name))
      .catch(() => setUserName("Neighbor"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleSwitchHouse = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await api.post("/households/switch", { inviteCode });
      setShowModal(false);
      setInviteCode("");
      window.location.reload(); 
    } catch (err) {
      setError(err.response?.data?.message || "Failed to switch households.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* 1. THE MAIN NAVIGATION BAR (Responsive padding) */}
      <div className="fixed top-0 left-0 z-40 w-full border-b border-amber-50/20 bg-amber-950/40 px-4 py-3 sm:px-6 md:z-20 text-amber-50 shadow-lg backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          
          {/* LEFT: Greeting */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xl">👋</span>
            {/* Desktop: Full Greeting */}
            <span className="hidden font-medium tracking-wide sm:block">
              Welcome, {userName}
            </span>
            {/* Mobile: Compact Greeting */}
            <span className="font-medium tracking-wide sm:hidden">
              {userName}
            </span>
          </div>

          {/* RIGHT: Controls */}
          {/* Mobile gap-2, Desktop gap-4 */}
          <div className="flex items-center gap-2 sm:gap-4">
            <ScoreDashboard />
            
            <button
              onMouseEnter={importSwitchModal}
              onFocus={importSwitchModal}
              onClick={()=>setShowModal(true)}
              title="Switch House"
              className="text-sm font-semibold text-amber-200 transition-colors hover:text-white"
            >

              <span className="hidden md:block">Switch House</span>
              <span className="text-lg md:hidden">🏠</span>

            </button>
            
            <div className="hidden h-4 w-px bg-amber-50/30 sm:block"></div>
            
            <button
              onClick={handleLogout}
              className="rounded-md bg-rose-600/80 px-3 py-1.5 sm:px-4 text-sm font-bold shadow transition hover:bg-rose-500"
            >
              Logout
            </button>
          </div>

        </div>
      </div>
      <div className="pointer-events-none fixed left-1/2 top-20 z-30 -translate-x-1/2 transition-all lg:top-4">
        <div className="whitespace-nowrap rounded-full bg-amber-950/90 border border-amber-900/50 px-4 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-md sm:px-5 sm:py-2 sm:text-sm">
          Drag the street <span className="opacity-50">·</span> tap your home to enter
        </div>
      </div>
      <Suspense fallback={null}>
        <SwitchHouseModal isOpen={showModal} onClose={()=>setShowModal(false)} />
      </Suspense>
    </>
  );
}
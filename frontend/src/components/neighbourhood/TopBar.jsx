import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { api } from "../../lib/api";
import { ScoreDashboard } from "./ScoreDashboard";

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
              onClick={() => setShowModal(true)}
              title="Switch House"
              className="text-sm font-semibold text-amber-200 transition-colors hover:text-white"
            >
              {/* Desktop: Full Text */}
              <span className="hidden md:block">Switch House</span>
              {/* Mobile: Compact Icon */}
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

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md overflow-hidden rounded-2xl bg-amber-50 p-6 shadow-2xl ring-4 ring-amber-900/20"
            >
              <h2 className="mb-2 text-xl font-black text-amber-950">Move to a new house?</h2>
              <p className="mb-4 text-sm text-amber-900/80">
                Warning: Joining a new household with an invite code will forfeit your access to your current shared fridge.
              </p>

              {error && (
                <div className="mb-4 rounded border border-rose-200 bg-rose-50 p-2 text-sm text-rose-600">
                  {error}
                </div>
              )}

              <form onSubmit={handleSwitchHouse} className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Paste 6-character Invite Code"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  maxLength={6}
                  required
                  className="rounded-lg border-2 border-amber-200 bg-white p-3 text-center font-mono text-xl tracking-widest text-amber-950 outline-none focus:border-amber-500"
                />
                
                <div className="mt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 rounded-lg bg-amber-200/50 py-3 font-bold text-amber-900 hover:bg-amber-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 rounded-lg bg-amber-900 py-3 font-bold text-amber-50 hover:bg-amber-950 disabled:opacity-50"
                  >
                    {isSubmitting ? "Packing boxes..." : "Join House"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
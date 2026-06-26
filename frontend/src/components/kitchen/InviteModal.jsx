import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function InviteModal({ open, onClose, inviteCode, householdName }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!inviteCode) return;
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex w-full max-w-sm flex-col overflow-hidden rounded-2xl bg-amber-50 p-6 shadow-2xl ring-4 ring-amber-900/20 text-center"
          >
            <h2 className="text-xl font-black text-amber-950 mb-1">
              Invite Roommates
            </h2>
            <p className="text-sm text-amber-900/70 mb-6">
              Share this code so others can join <strong>{householdName}</strong>.
            </p>

            <div className="rounded-xl border-2 border-dashed border-amber-300 bg-amber-100/50 p-4 mb-4">
              <span className="text-4xl font-mono font-black tracking-widest text-amber-900">
                {inviteCode || "------"}
              </span>
            </div>

            <button
              onClick={handleCopy}
              className="w-full rounded-lg bg-amber-900 py-3 font-bold text-amber-50 shadow-md transition hover:bg-amber-950 active:translate-y-px"
            >
              {copied ? "✓ Copied to clipboard" : "Copy Invite Code"}
            </button>
            
            <button
              onClick={onClose}
              className="mt-3 text-sm font-medium text-amber-900/60 hover:text-amber-900"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
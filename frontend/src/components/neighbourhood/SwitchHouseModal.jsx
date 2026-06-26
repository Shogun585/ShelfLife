import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { api } from "../../lib/api";

export default function SwitchHouseModal({isOpen, onClose}){

    const [inviteCode, setInviteCode] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSwitchHouse = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);
        try {
        await api.post("/households/switch", { inviteCode });
        onClose();
        window.location.reload(); 
        } catch (err) {
        setError(err.response?.data?.message || "Failed to switch households.");
        } finally {
        setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
                    onClick={onClose}
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
                            onClick={onClose}
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
    )
}
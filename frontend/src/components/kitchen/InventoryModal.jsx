import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useInventory } from "../../data/useInventory";
import { ItemFilters } from "./ItemFilters";
import { ItemRow } from "./ItemRow";
import { AddItemForm } from "./AddItemForm";
import { InviteModal } from "./InviteModal";
import { api } from "../../lib/api";

export function InventoryModal({ open, onClose }) {
  const { visible, counts, filters, setFilters, add, remove } = useInventory();

  const [household, setHousehold] = useState({ name: "Loading...", code: "" });
  const [showInvite, setShowInvite] = useState(false);

  useEffect(() => {
    if (open) {
      api.get("/households/me")
        .then((res) => {
          setHousehold({
            name: res.data.household_name,
            code: res.data.invite_code
          });
        })
        .catch(console.error);
    }
  }, [open]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-amber-50 shadow-2xl ring-1 ring-amber-900/20"
            >

              <div className="flex items-start justify-between gap-4 border-b border-amber-200 bg-amber-100/60 p-5">
                <div>

                  <h2 className="text-lg font-bold text-amber-950">{household.name} Inventory</h2>
                  <div className="mt-2 flex gap-2 text-xs">
                    <Badge color="emerald" label={`${counts.fresh} fresh`} />
                    <Badge color="amber" label={`${counts.expiring} expiring`} />
                    <Badge color="rose" label={`${counts.expired} expired`} />
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 items-end">
                  <button
                    onClick={onClose}
                    className="rounded-md px-3 py-1 text-sm font-medium text-amber-900 hover:bg-amber-200/60"
                  >
                    Close ✕
                  </button>
                  <button
                    onClick={() => setShowInvite(true)}
                    className="text-xs font-bold uppercase tracking-wide text-amber-700 hover:text-amber-900 underline underline-offset-2"
                  >
                    + Invite Roommates
                  </button>
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto p-5">
                <AddItemForm onAdd={add} />
                <ItemFilters filters={filters} onChange={setFilters} />

                <div className="space-y-2">
                  {visible.length === 0 ? (
                    <p className="rounded-md bg-amber-100/60 p-6 text-center text-sm text-amber-900/70">
                      No items match these filters.
                    </p>
                  ) : (
                    visible.map((item) => (
                      <ItemRow key={item._id} item={item} onDelete={remove} />
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <InviteModal 
        open={showInvite} 
        onClose={() => setShowInvite(false)} 
        inviteCode={household.code}
        householdName={household.name}
      />
    </>
  );
}

function Badge({ color, label }) {
  const map = {
    emerald: "bg-emerald-100 text-emerald-800 ring-emerald-300",
    amber: "bg-amber-100 text-amber-800 ring-amber-300",
    rose: "bg-rose-100 text-rose-800 ring-rose-300",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 font-semibold ring-1 ${map[color]}`}>
      {label}
    </span>
  );
}
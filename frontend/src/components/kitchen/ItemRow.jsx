import { api } from "../../lib/api";
import { daysUntil, getStatus, STATUS_DOT, STATUS_LABEL, STATUS_RING } from "../../lib/status";

export function ItemRow({ item, onDelete, onStatusChange }) {
  
  const handleUpdateStatus = async (newStatus) => {
    try {
      await api.patch(`/items/${item._id}/${newStatus}`);

      if (onStatusChange) {
        onStatusChange(item._id); 
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleHardDelete = async () => {
    try {
      
      await api.delete(`/items/${item._id}`);
      
      if (onDelete) {
        onDelete(item._id); 
      }
    } catch (err) {
      console.error("Failed to delete item", err);
    }
  };

  const status = getStatus(item.expiryDate);
  const days = daysUntil(item.expiryDate);
  const expiryText =
    days < 0 ? `Expired ${Math.abs(days)}d ago`
    : days === 0 ? "Expires today"
    : `Expires in ${days}d`;

  return (
    <div className={`flex items-center gap-3 rounded-lg border border-amber-200 border-l-4 bg-white p-3 shadow-sm ${STATUS_RING[status]}`}>
      
      <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${STATUS_DOT[status]}`} />
      
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <p className="truncate text-sm font-semibold text-amber-950">{item.name}</p>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-800">
            {item.category}
          </span>
        </div>
        <p className="text-xs text-amber-900/70">
          Qty {item.quantity} · {expiryText} · added by {item.addedBy?.name || "Unknown"}
        </p>
      </div>

      <span className="hidden text-xs font-medium text-amber-900/70 sm:inline">
        {STATUS_LABEL[status]}
      </span>
      
      {/* action buttons*/}
      <div className="flex items-center gap-1.5 pl-2 sm:pl-3 border-l border-amber-900/10">
        
        {/* consumed button */}
        <button 
          onClick={() => handleUpdateStatus('used')}
          title="Mark as Consumed"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-200 active:scale-95"
        >
          ✓
        </button>

        {/* wasted button */}
        <button 
          onClick={() => handleUpdateStatus('wasted')}
          title="Mark as Wasted"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700 transition-colors hover:bg-orange-200 active:scale-95"
        >
          ✗
        </button>

        {/* hard delete button */}
        <button
          onClick={handleHardDelete}
          title="Delete Permanently"
          className="ml-1 rounded-md px-2 py-1 text-xs font-semibold text-rose-500 transition-colors hover:bg-rose-50 hover:text-rose-700"
        >
          Remove
        </button>
        
      </div>
    </div>
  );
}
import { daysUntil, getStatus, STATUS_DOT, STATUS_LABEL, STATUS_RING } from "../../lib/status";

export function ItemRow({ item, onDelete }) {
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
          Qty {item.quantity} · {expiryText} · added by {item.addedBy}
        </p>
      </div>
      <span className="hidden text-xs font-medium text-amber-900/70 sm:inline">{STATUS_LABEL[status]}</span>
      <button
        onClick={() => onDelete(item._id)}
        className="rounded-md px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50"
      >
        Remove
      </button>
    </div>
  );
}
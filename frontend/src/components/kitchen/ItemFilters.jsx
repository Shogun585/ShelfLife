import { CATEGORIES } from "../../data/mockItems";

const STATUS_OPTS = ["All", "fresh", "expiring", "expired"];

export function ItemFilters({ filters, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 text-sm">
      <select
        value={filters.category}
        onChange={(e) => onChange({ ...filters, category: e.target.value })}
        className="rounded-md border border-amber-200 bg-white px-3 py-1.5"
      >
        <option value="All">All categories</option>
        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <select
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
        className="rounded-md border border-amber-200 bg-white px-3 py-1.5"
      >
        {STATUS_OPTS.map((s) => (
          <option key={s} value={s}>
            {s === "All" ? "All statuses" : s === "fresh" ? "Fresh" : s === "expiring" ? "Expiring soon" : "Expired"}
          </option>
        ))}
      </select>
      <select
        value={filters.sort}
        onChange={(e) => onChange({ ...filters, sort: e.target.value })}
        className="rounded-md border border-amber-200 bg-white px-3 py-1.5"
      >
        <option value="expiry-asc">Expiring first</option>
        <option value="expiry-desc">Latest expiry</option>
        <option value="name">Name (A–Z)</option>
      </select>
    </div>
  );
}
export function daysUntil(dateString) {
  const diff = new Date(dateString) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getStatus(dateString) {
  const days = daysUntil(dateString);
  if (days < 0) return "expired";
  if (days <= 3) return "expiring";
  return "fresh";
}

export const STATUS_DOT = {
  fresh: "bg-emerald-500",
  expiring: "bg-amber-500",
  expired: "bg-rose-500",
};

export const STATUS_RING = {
  fresh: "border-emerald-500",
  expiring: "border-amber-500",
  expired: "border-rose-500",
};

export const STATUS_LABEL = {
  fresh: "Fresh",
  expiring: "Expiring Soon",
  expired: "Expired",
};
const Badge = ({color, label}) => {
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

export default Badge;
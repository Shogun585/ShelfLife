import { useState } from "react";
import { CATEGORIES } from "../../data/mockItems";

export function AddItemForm({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Produce");
  const [quantity, setQuantity] = useState(1);
  const [expiry, setExpiry] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!name || !expiry) return;
    onAdd({
      name,
      category,
      quantity,
      expiryDate: new Date(expiry).toISOString(),
    });
    setName("");
    setQuantity(1);
    setExpiry("");
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-lg border-2 border-dashed border-amber-700/40 px-4 py-3 text-sm font-semibold text-amber-900 transition hover:bg-amber-50"
      >
        + Add item to the fridge
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 gap-2 rounded-lg border border-amber-200 bg-amber-50/60 p-3 sm:grid-cols-5">
      <input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Item name"
        className="rounded-md border border-amber-200 bg-white px-3 py-2 text-sm sm:col-span-2"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="rounded-md border border-amber-200 bg-white px-3 py-2 text-sm"
      >
        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <input
        required
        type="number"
        min={1}
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="rounded-md border border-amber-200 bg-white px-3 py-2 text-sm"
      />
      <input
        required
        type="date"
        value={expiry}
        onChange={(e) => setExpiry(e.target.value)}
        className="rounded-md border border-amber-200 bg-white px-3 py-2 text-sm"
      />
      <div className="flex gap-2 sm:col-span-5">
        <button type="submit" className="flex-1 rounded-md bg-amber-900 px-3 py-2 text-sm font-semibold text-amber-50 hover:bg-amber-800">
          Add item
        </button>
        <button type="button" onClick={() => setOpen(false)} className="rounded-md border border-amber-300 px-3 py-2 text-sm text-amber-900 hover:bg-amber-100">
          Cancel
        </button>
      </div>
    </form>
  );
}
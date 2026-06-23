import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InventoryModal } from "../components/kitchen/InventoryModal";
import kitchen_background from "../assets/kitchen_background.webp";

export default function KitchenPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  return (
    <div
      className="relative min-h-screen w-full cursor-pointer bg-cover bg-center"
      style={{ backgroundImage: `url(${kitchen_background})` }} 
      onClick={() => setOpen(true)}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate("/neighborhood");
        }}
        className="absolute top-[4vh] left-[4vh] z-50 rounded-full bg-[#5c3a21] px-[2.5vh] py-[1.2vh] text-[1.8vh] font-bold text-white shadow-lg transition-transform hover:scale-105"
      >
        ← Leave house
      </button>

      {!open && (
        <div className="pointer-events-none absolute bottom-[8vh] left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#5c3a21] px-[3vh] py-[1.2vh] text-[1.8vh] font-bold text-white shadow-lg">
          Tap anywhere to open the fridge
        </div>
      )}

      <InventoryModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
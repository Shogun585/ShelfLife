import { forwardRef } from "react";
import { motion } from "framer-motion";
import house_teal from "../../assets/house_teal.webp";
import house_yellow from "../../assets/house_yellow.webp";
import house_blue from "../../assets/house_blue.webp";
import house_red from "../../assets/house_red.webp";

const HOUSE_SRC = {
  teal: house_teal,
  yellow: house_yellow,
  blue: house_blue,
  red: house_red,
};

export const House = forwardRef(({ variant, isUser = false, onClick }, ref) => {
  const shiftClass = isUser ? "translate-y-[2vh]" : "";

  return (
    <div 
      ref={ref}
      className={`relative shrink-0 ${shiftClass} group`} 
      style={{ width: isUser ? "36vh" : "28vh" }}
    >
      <motion.button
        type="button"
        data-testid="user-house"
        onClick={onClick}
        whileHover={isUser ? { scale: 1.08 } : {}}
        className={`block w-full ${isUser ? "cursor-pointer" : "cursor-default"}`}
        disabled={!isUser}
      >
        {isUser && (
          <div className="absolute -top-[6vh] left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-amber-700 px-[1.5vh] py-[0.5vh] text-[1.5vh] font-bold uppercase tracking-wide text-amber-50 shadow-lg ring-2 ring-amber-900/40">
            Your Home
            <div className="absolute -bottom-[0.5vh] left-1/2 h-[1.5vh] w-[1.5vh] -translate-x-1/2 rotate-45 bg-amber-700" />
          </div>
        )}

        {!isUser && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/60 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
          <span className="translate-y-4 rounded-full bg-white px-4 py-2 text-sm font-bold tracking-wide text-gray-700 shadow-lg transition-transform duration-300 group-hover:translate-y-0">
            Coming soon...
          </span>
        </div>
      )}
        <img
          src={HOUSE_SRC[variant]}
          alt={`${variant} house`}
          draggable={false}
          className="pointer-events-none block w-full select-none object-contain drop-shadow-xl"
        />
      </motion.button>
    </div>
  );
});

House.displayName = "House";
import { forwardRef } from "react";
import { motion } from "framer-motion";

const HOUSE_SRC = {
  teal: "/house_teal.png",
  yellow: "/house_yellow.png",
  blue: "/house_blue.png",
  red: "/house_red.png",
};

export const House = forwardRef(({ variant, isUser = false, onClick }, ref) => {
  const shiftClass = isUser ? "translate-y-[2vh]" : "";

  return (
    <div 
      ref={ref}
      className={`relative shrink-0 ${shiftClass}`} 
      style={{ width: isUser ? "36vh" : "28vh" }}
    >
      <motion.button
        type="button"
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
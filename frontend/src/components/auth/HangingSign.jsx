import { motion } from "framer-motion";
import rope_segment from "../../assets/rope_segment.webp";
import wooden_sign from "../../assets/wooden_sign.webp";

export function HangingSign({ children }) {
  return (
    <div className="pointer-events-none absolute left-1/2 top-0 flex w-full -translate-x-1/2 flex-col items-center">
      <motion.div
        initial={{ y: "-110vh" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 70, damping: 18, mass: 2, delay: 0.15 }}
        className="relative mt-20 flex flex-col items-center "
        style={{ transformOrigin: "top center" }}
      >
        <motion.div
          animate={{ rotate: [-1.2, 1.2, -1.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
          style={{ transformOrigin: "top center" }}
          className="relative flex flex-col items-center"
        >
          
          <div className="pointer-events-auto relative flex min-h-[460px] w-[550px] items-center justify-center px-16 pt-10 pb-16">

            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20">
              <img 
                src={rope_segment} 
                alt="rope" 
                className="absolute left-[15%] w-9 h-auto drop-shadow-md ml-7" 
                style={{ bottom: "calc(100% - 45px)" }}
                draggable={false}
              />
              <img 
                src={rope_segment} 
                alt="rope" 
                className="absolute right-[15%] w-9 h-auto drop-shadow-md mr-7" 
                style={{ bottom: "calc(100% - 45px)" }}
                draggable={false}
              />
            </div>

            <img
              src={wooden_sign}
              alt="ShelfLife sign"
              className="absolute inset-0 h-full w-full select-none object-fill drop-shadow-2xl z-10 rounded-xl"
              draggable={false}
            />
            
            <div className="relative z-30 w-full max-w-[320px]">
              {children}
            </div>
          </div>
          
        </motion.div>
      </motion.div>
    </div>
  );
}
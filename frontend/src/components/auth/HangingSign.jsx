import { motion } from "framer-motion";
import rope_segment from "../../assets/rope_segment.webp";
import wooden_sign from "../../assets/wooden_sign.webp";

export function HangingSign({ children }) {
  return (
    <div className="pointer-events-auto relative flex min-h-[400px] sm:min-h-[460px] w-full max-w-[550px] items-center justify-center px-8 pt-8 pb-12 sm:px-16 sm:pt-10 sm:pb-16">
      <motion.div
        initial={{ y: "-110vh" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 70, damping: 18, mass: 2, delay: 0.15 }}
        className="relative mt-18 flex flex-col items-center "
        style={{ transformOrigin: "top center" }}
      >
        <motion.div
          animate={{ rotate: [-1.2, 1.2, -1.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
          style={{ transformOrigin: "top center", willChange : "transform, opacity" }}
          className="relative flex flex-col items-center"
        >
          
          <div className="pointer-events-auto relative flex min-h-[460px] w-full items-center justify-center px-16 pt-10 pb-16">

            <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-full">
              
              <div 
                className="absolute left-[15%] ml-7 w-9 drop-shadow-md" 
                style={{ 
                  bottom: "calc(100% - 45px)",
                  height: "100vh", 
                  backgroundImage: `url(${rope_segment})`,
                  backgroundRepeat: "repeat-y",
                  backgroundSize: "100% auto"
                }}
              ></div>

              <div 
                className="absolute right-[15%] mr-7 w-9 drop-shadow-md" 
                style={{ 
                  bottom: "calc(100% - 45px)",
                  height: "100vh", 
                  backgroundImage: `url(${rope_segment})`,
                  backgroundRepeat: "repeat-y",
                  backgroundSize: "100% auto"
                }}
              ></div>
            </div>

            <img
              src={wooden_sign}
              alt="ShelfLife sign"
              className="absolute inset-0 z-10 h-full w-full select-none rounded-xl object-fill drop-shadow-[0_20px_50px_rgba(120,53,15,0.5)]"
              draggable={false}
            />

            <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-xl">
              <motion.div
                initial={{ x: "-150%" }}
                animate={{ x: "150%" }}
                transition={{ delay: 0.7, duration: 1.2, ease: "easeInOut" }}
                style={{willChange : "transform, opacity"}}
                className="absolute inset-0 h-full w-[150%] skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
            </div>
            
            <div className="relative z-30 w-full max-w-[320px]">
              {children}
            </div>
          </div>
          
        </motion.div>
      </motion.div>
    </div>
  );
}
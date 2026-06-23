import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { House } from "./House";
import garden_bg from "../../assets/garden_bg.webp";
import { TopBar } from "./TopBar";

const HOUSES = [
  "yellow", "blue", "red", "yellow", "blue",
  "teal", // user
  "red", "yellow", "blue", "red", "yellow",
];
const USER_INDEX = HOUSES.indexOf("teal");

export default function Neighborhood() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  
  const userHouseRef = useRef(null); 
  
  const x = useMotionValue(0);
  const [zooming, setZooming] = useState(false);
  const dragStartX = useRef(0);

  useEffect(() => {
    if (userHouseRef.current) {
      const houseLeft = userHouseRef.current.offsetLeft;
      const houseWidth = userHouseRef.current.offsetWidth;
      
      const houseCenter = houseLeft + (houseWidth / 2);
      
      const screenCenter = window.innerWidth / 2;
      
      x.set(screenCenter - houseCenter);
    }
  }, [x]);

  const handleEnter = () => {
    if (zooming) return;
    setZooming(true);
    setTimeout(() => navigate("/kitchen"), 900);
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-sky-300 via-sky-200 to-emerald-200"
    >
      <div className="relative h-[100vh] w-full overflow-hidden bg-[#87CEEB]">
        <TopBar/> 

        <div className="pointer-events-none absolute left-1/2 top-[12vh] md:top-[2vh]  z-30 -translate-x-1/2 rounded-full bg-amber-950/80 px-[2vh] py-[1vh] text-[1.5vh] font-medium text-amber-50 shadow-lg backdrop-blur whitespace-nowrap">
          Drag the street &nbsp;·&nbsp; tap your home to enter
        </div>

        <motion.div
          drag={zooming ? false : "x"}
          dragConstraints={containerRef}
          dragElastic={0.18}
          dragTransition={{ bounceStiffness: 260, bounceDamping: 28 }}
          onPointerDown={() => { dragStartX.current = x.get(); }}
          animate={zooming ? {
            scale: 3.4,
            x: typeof window !== "undefined"
              ? -(USER_INDEX * 300 - window.innerWidth / 2 + 180) * 3.4 + window.innerWidth / 2
              : 0,
          } : undefined}
          transition={zooming ? { duration: 0.9, ease: [0.7, 0, 0.3, 1] } : undefined}
          className="relative flex h-screen w-max cursor-grab active:cursor-grabbing"
          style={{ x }}
        >
          <div className="relative z-10 flex h-full items-end gap-[3vh] px-[15vh] pb-[22vh]">
            {HOUSES.map((variant, i) => (
              <House
                key={i}
                variant={variant}
                isUser={i === USER_INDEX}
                ref={i === USER_INDEX ? userHouseRef : null}
                onClick={() => {
                  if (Math.abs(x.get() - dragStartX.current) > 6) return;
                  if (i === USER_INDEX) handleEnter();
                }}
              />
            ))}
          </div>

          <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
            <div className="absolute bottom-0 left-0 flex h-[60vh] w-max items-end">
              {[...Array(8)].map((_, i) => (
                <img 
                  key={i}
                  src={garden_bg}
                  alt="garden landscape"
                  className={`h-full w-auto shrink-0 object-cover ${i !== 0 ? '-ml-[2px]' : ''} ${i % 2 !== 0 ? 'scale-x-[-1]' : ''}`}
                  draggable={false}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {zooming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.35 }}
            className="pointer-events-none absolute inset-0 z-40 bg-black"
          />
        )}
        
      </div>      
   </div>
  );
}
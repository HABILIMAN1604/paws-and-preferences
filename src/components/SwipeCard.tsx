import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";

interface Props {
  image: string;
  onSwipe: (direction: "left" | "right") => void;
  zIndex: number;
}

export const SwipeCard = ({ image, onSwipe, zIndex }: Props) => {
  const x = useMotionValue(0);
  const [exitX, setExitX] = useState<number>(0);

  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const opacityNope = useTransform(x, [-150, -40], [1, 0]);
  const opacityLike = useTransform(x, [40, 150], [0, 1]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) {
      setExitX(1000);
      onSwipe("right");
    } else if (info.offset.x < -100) {
      setExitX(-1000);
      onSwipe("left");
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      exit={{ x: exitX, opacity: 0, transition: { duration: 0.35 } }}
      className="absolute w-full h-full rounded-3xl overflow-hidden touch-none cursor-grab active:cursor-grabbing"
      style={{
        x,
        rotate,
        zIndex,
        boxShadow: "0 8px 32px rgba(0,0,0,0.18), 0 1.5px 6px rgba(0,0,0,0.08)",
      }}
    >
      <img
        src={image}
        alt="Cat"
        className="w-full h-full object-cover pointer-events-none select-none"
      />

      <div
        className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 100%)",
        }}
      />

      <motion.div
        style={{ opacity: opacityLike, transform: "rotate(-14deg)" }}
        className="absolute top-8 left-5 pointer-events-none border-[3px] border-emerald-400 text-emerald-400 font-black text-3xl px-3 py-1 rounded-xl tracking-widest"
      >
        LIKE
      </motion.div>


      <motion.div
        style={{ opacity: opacityNope, transform: "rotate(14deg)" }}
        className="absolute top-8 right-5 pointer-events-none border-[3px] border-rose-500 text-rose-500 font-black text-3xl px-3 py-1 rounded-xl tracking-widest"
      >
        NOPE
      </motion.div>
    </motion.div>
  );
};

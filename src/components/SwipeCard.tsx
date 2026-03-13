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
  const opacityNope = useTransform(x, [-80, -20], [1, 0]);
  const opacityLike = useTransform(x, [20, 80], [0, 1]);

  // Overlay tint: green on right, red on left
  const likeOverlay = useTransform(x, [0, 150], [0, 0.35]);
  const nopeOverlay = useTransform(x, [-150, 0], [0.35, 0]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) {
      setExitX(1000);
      if (window.navigator.vibrate) window.navigator.vibrate([20, 10, 20]);
      onSwipe("right");
    } else if (info.offset.x < -100) {
      setExitX(-1000);
      if (window.navigator.vibrate) window.navigator.vibrate(30);
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
      style={{ x, rotate, zIndex, willChange: "transform", boxShadow: "0 8px 40px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)" }}
    >
      <img
        src={image}
        alt="Cat"
        decoding="async"
        className="w-full h-full object-cover pointer-events-none select-none"
        onError={(e) => { (e.target as HTMLImageElement).src = "https://cataas.com/cat?width=450"; }}
      />

      {/* Green tint overlay for like */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: "rgb(16,185,129)", opacity: likeOverlay }}
      />

      {/* Red tint overlay for nope */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: "rgb(244,63,94)", opacity: nopeOverlay }}
      />

      {/* Bottom gradient */}
      <div
        className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)" }}
      />

      {/* LIKE stamp */}
      <motion.div
        style={{ opacity: opacityLike }}
        className="absolute top-10 left-6 pointer-events-none rotate-[-14deg] border-[4px] border-emerald-400 text-emerald-400 font-black text-4xl px-4 py-1.5 rounded-2xl tracking-widest drop-shadow-lg"
      >
        LIKE 💚
      </motion.div>

      {/* NOPE stamp */}
      <motion.div
        style={{ opacity: opacityNope }}
        className="absolute top-10 right-6 pointer-events-none rotate-[14deg] border-[4px] border-rose-500 text-rose-500 font-black text-4xl px-4 py-1.5 rounded-2xl tracking-widest drop-shadow-lg"
      >
        NOPE 🚫
      </motion.div>
    </motion.div>
  );
};
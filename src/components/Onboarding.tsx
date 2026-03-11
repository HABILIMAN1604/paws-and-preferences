import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Heart, X, RotateCcw } from "lucide-react";

interface Props {
  onDone: () => void;
}

const steps = [
  {
    icon: (
      <div className="relative w-36 h-36">
        {/* Fake card stack */}
        <div className="absolute inset-0 bg-zinc-700 rounded-3xl rotate-6 scale-95" />
        <div className="absolute inset-0 bg-zinc-600 rounded-3xl rotate-2 scale-97" />
        <div className="absolute inset-0 bg-zinc-500 rounded-3xl flex items-center justify-center text-6xl">🐱</div>
      </div>
    ),
    title: "Meet your cats",
    body: "We've found 12 cats in your area. Swipe through them one by one.",
  },
  {
    icon: (
      <div className="flex items-center gap-6">
        <motion.div
          animate={{ x: [-10, 10, -10] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <div className="w-14 h-14 rounded-full bg-zinc-800 border-2 border-rose-500 flex items-center justify-center">
            <X size={26} className="text-rose-500" />
          </div>
          <span className="text-xs text-zinc-500 font-bold tracking-wider">SWIPE LEFT</span>
        </motion.div>
        <div className="w-24 h-32 bg-zinc-700 rounded-2xl flex items-center justify-center text-4xl shadow-xl">🐾</div>
        <motion.div
          animate={{ x: [10, -10, 10] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <div className="w-14 h-14 rounded-full bg-zinc-800 border-2 border-emerald-400 flex items-center justify-center">
            <Heart size={26} className="text-emerald-400" />
          </div>
          <span className="text-xs text-zinc-500 font-bold tracking-wider">SWIPE RIGHT</span>
        </motion.div>
      </div>
    ),
    title: "Swipe to decide",
    body: "Swipe right to like a cat, left to pass. Or drag the card yourself!",
  },
  {
    icon: (
      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-2">
          {["🐱","😺","😸"].map((e, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="w-16 h-16 bg-zinc-700 rounded-2xl flex items-center justify-center text-3xl"
            >
              {e}
            </motion.div>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-rose-500 text-white text-sm font-bold px-5 py-2.5 rounded-full mt-2">
          <Heart size={16} fill="white" /> See your matches
        </div>
      </div>
    ),
    title: "See your favourites",
    body: "When you're done, we'll show you every cat you liked in a gallery.",
  },
];

export const Onboarding = ({ onDone }: Props) => {
  const [step, setStep] = useState(0);
  const isLast = step === steps.length - 1;
  const current = steps[step];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
    >
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl"
      >
        {/* Step indicator */}
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? "bg-rose-500 w-6" : i < step ? "bg-rose-800 w-3" : "bg-zinc-700 w-3"
              }`}
            />
          ))}
        </div>

        {/* Illustration */}
        <div className="mb-8 flex items-center justify-center min-h-[140px]">
          {current.icon}
        </div>

        {/* Text */}
        <h2 className="text-2xl font-black text-white tracking-tight mb-2">{current.title}</h2>
        <p className="text-zinc-400 text-sm leading-relaxed mb-10">{current.body}</p>

        {/* CTA */}
        <button
          onClick={() => isLast ? onDone() : setStep(s => s + 1)}
          className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-2xl text-base transition-all active:scale-95 shadow-lg shadow-rose-900/40"
        >
          {isLast ? "Let's go! 🐾" : "Next"}
        </button>

        {!isLast && (
          <button
            onClick={onDone}
            className="mt-3 text-zinc-600 hover:text-zinc-400 text-sm font-medium transition-colors"
          >
            Skip tutorial
          </button>
        )}
      </motion.div>
    </motion.div>
  );
};

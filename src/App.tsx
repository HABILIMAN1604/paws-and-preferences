import { useEffect, useState } from "react";
import { fetchCats } from "./api";
import { SwipeCard } from "./components/SwipeCard";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import { EmptyState } from "./components/EmptyState";
import { Summary } from "./components/Summary";
import { Onboarding } from "./components/Onboarding";
import { RotateCcw, X, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactGA from "react-ga4";

const MEASUREMENT_ID = "G-M3RFDFRDRS";
ReactGA.initialize(MEASUREMENT_ID);


export default function App() {
  const [cats, setCats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedCats, setLikedCats] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [isBusy, setIsBusy] = useState(false); // Added to prevent double-swiping
  const [showOnboarding, setShowOnboarding] = useState(
    () => !localStorage.getItem("paws-seen-tutorial")
  );

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "Home Page" });
    loadCats();
  }, []);

  const loadCats = async () => {
    const urls = await fetchCats(12);
    const promises = urls.slice(-4).map((url) =>
      new Promise((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = resolve;
        img.onerror = resolve;
      })
    );
    await Promise.all(promises);
    setCats(urls);
    setLoading(false);
    urls.slice(0, -4).forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  };

  const handleSwipe = (direction: "left" | "right", url: string) => {
    if (isBusy) return;
    setIsBusy(true);
    setHistory((prev) => [...prev, url]);
    if (direction === "right") {
      setLikedCats((prev) => [...prev, url]);
      if (window.navigator.vibrate) window.navigator.vibrate(20);
    }
    setCats((prev) => prev.filter((c) => c !== url));
    setTimeout(() => setIsBusy(false), 400);
  };

  const triggerSwipe = (direction: "left" | "right") => {
    if (cats.length === 0 || isBusy) return;
    const topCat = cats[cats.length - 1]; 
    handleSwipe(direction, topCat);
  };

  const handleUndo = () => {
    if (history.length === 0 || isBusy) return;
    const lastUrl = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setLikedCats((prev) => prev.filter((url) => url !== lastUrl));
    setCats((prev) => [...prev, lastUrl]);
  };

  const handleRestart = () => {
    setCats([]);
    setLikedCats([]);
    setHistory([]);
    setLoading(true);
    loadCats();
  };

  const handleOnboardingDone = () => {
    localStorage.setItem("paws-seen-tutorial", "1");
    setShowOnboarding(false);
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#0d0d0d]">
      <LoadingSkeleton />
    </div>
  );

  return ( 
    <main className="flex flex-col items-center h-screen w-full bg-[#0d0d0d] overflow-hidden relative p-4 pt-safe">

      <AnimatePresence>
        {showOnboarding && <Onboarding onDone={handleOnboardingDone} />}
      </AnimatePresence>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-rose-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-1/4 w-[300px] h-[300px] bg-orange-500/8 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full flex items-center justify-between px-2 pt-4 pb-3 shrink-0">
        <div>
          <h1 className="text-base font-black text-white tracking-[0.15em] uppercase">Paws & Prefs</h1>
          <p className="text-[10px] text-zinc-500 mt-0.5">{likedCats.length} liked · {history.length} seen</p>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all duration-300 ${
              i < history.length ? "bg-rose-500 w-3" : "bg-zinc-700 w-1.5"
            }`} />
          ))}
        </div>
      </div>

      <div className={`relative w-full flex items-center justify-center flex-1 ${
        cats.length > 0 ? "max-w-[340px]" : "max-w-2xl"
      }`}>
        <AnimatePresence mode="popLayout">
          {cats.length > 0 ? (
            cats.map((url, index) => (
              <SwipeCard key={url} image={url} zIndex={index} onSwipe={(dir) => handleSwipe(dir, url)} />
            ))
          ) : likedCats.length > 0 ? (
            <Summary likedCats={likedCats} onRestart={handleRestart} />
          ) : (
            <EmptyState key="empty" />
          )}
        </AnimatePresence>
      </div>

      {/* REPLACED BOTTOM CONTROLS WITH LEGEND BUTTONS */}
      <div className="relative z-10 flex items-center gap-8 py-6 shrink-0">
        
        {/* NOPE Button */}
        <div className="flex flex-col items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => triggerSwipe("left")}
            disabled={cats.length === 0}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-rose-500 shadow-xl active:bg-zinc-800 transition-colors disabled:opacity-20"
          >
            <X size={26} strokeWidth={3} />
          </motion.button>
          <span className="text-[9px] font-black text-zinc-600 tracking-[0.2em] uppercase">Nope</span>
        </div>

        {/* UNDO Button */}
        <div className="flex flex-col items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleUndo}
            disabled={history.length === 0}
            className={`p-3 rounded-full border transition-all ${
              history.length > 0 
                ? "bg-zinc-800 border-zinc-700 text-orange-400 opacity-100" 
                : "bg-zinc-900/50 border-zinc-800 text-zinc-700 opacity-30"
            }`}
          >
            <RotateCcw size={18} />
          </motion.button>
          <span className="text-[8px] font-bold text-zinc-700 uppercase">Undo</span>
        </div>

        {/* LIKE Button */}
        <div className="flex flex-col items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => triggerSwipe("right")}
            disabled={cats.length === 0}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-emerald-500 shadow-xl active:bg-zinc-800 transition-colors disabled:opacity-20"
          >
            <Heart size={26} fill="currentColor" />
          </motion.button>
          <span className="text-[9px] font-black text-zinc-600 tracking-[0.2em] uppercase">Like</span>
        </div>
      </div>

      {cats.length === 12 && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          className="relative z-10 pb-4 text-[10px] text-zinc-700 font-bold tracking-[0.3em] shrink-0">
          GIVE IT A SWIPE
        </motion.p>
      )}
    </main>
  );
}
import { useEffect, useState } from "react";
import { fetchCats } from "./api";
import { SwipeCard } from "./components/SwipeCard";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import { EmptyState } from "./components/EmptyState";
import { Summary } from "./components/Summary";
import { RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const [cats, setCats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedCats, setLikedCats] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const init = async () => {
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
    init();
  }, []);

  const handleSwipe = (direction: "left" | "right", url: string) => {
    setHistory((prev) => [...prev, url]);
    if (direction === "right") {
      setLikedCats((prev) => [...prev, url]);
      if (window.navigator.vibrate) window.navigator.vibrate(20);
    }
    setCats((prev) => prev.filter((c) => c !== url));
  };

  const handleUndo = () => {
    if (history.length === 0) return;
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
    const init = async () => {
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
    init();
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#0d0d0d]">
      <LoadingSkeleton />
    </div>
  );

 return (
    <main className="flex flex-col items-center h-screen w-full bg-[#0d0d0d] overflow-hidden relative p-4 pt-safe">
      
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-rose-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-1/4 w-[300px] h-[300px] bg-orange-500/8 rounded-full blur-[100px]" />
      </div>

      {/* Header — in flow, not absolute */}
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

      {/* Card area */}
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

      {/* Bottom controls */}
      <div className="relative z-10 flex items-center gap-6 py-3 shrink-0">
        <span className="text-[11px] font-bold text-zinc-600 tracking-widest uppercase w-16 text-right">Skip</span>
        <AnimatePresence>
          {cats.length > 0 && history.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={handleUndo}
              className="p-3 bg-zinc-800 border border-zinc-700 rounded-full text-zinc-400 hover:text-white hover:border-zinc-500 transition-all shadow-lg"
            >
              <RotateCcw size={18} />
            </motion.button>
          )}
        </AnimatePresence>
        <span className="text-[11px] font-bold text-zinc-600 tracking-widest uppercase w-16 text-left">Like</span>
      </div>

      {cats.length === 12 && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          className="relative z-10 pb-2 text-[11px] text-zinc-600 tracking-widest shrink-0">
          ← SWIPE TO DECIDE →
        </motion.p>
      )}
    </main>
  );
}
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
      
      const promises = urls.slice(-4).map((url) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = url;
          img.onload = resolve;
          img.onerror = resolve;
        });
      });

      await Promise.all(promises);
      setCats(urls);
      setLoading(false);

      // Background preload remaining cards
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
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <LoadingSkeleton />
    </div>
  );

  return (
    <main className="flex flex-col items-center justify-center h-screen w-full bg-slate-50 overflow-hidden relative p-4">
      <h1 className="absolute top-8 text-xl font-black text-slate-300 tracking-[0.2em] uppercase">Paws & Prefs</h1>
      <p className="absolute top-16 text-xs text-slate-300">{likedCats.length} liked · {history.length} seen</p>

      <div className={`relative w-full flex items-center justify-center ${
  cats.length > 0 ? "max-w-[340px] h-[520px]" : "max-w-2xl"
}`}>
        <AnimatePresence mode="popLayout">
          {cats.length > 0 ? (
            cats.map((url, index) => (
              <SwipeCard
                key={url}
                image={url}
                zIndex={index}
                onSwipe={(dir) => handleSwipe(dir, url)}
              />
            ))
          ) : (
            likedCats.length > 0 ? (
              <Summary likedCats={likedCats} onRestart={handleRestart} />
            ) : (
              <EmptyState key="empty" />
            )
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {cats.length > 0 && history.length > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={handleUndo}
            className="mt-6 p-4 bg-white rounded-full shadow-md text-orange-500 hover:shadow-lg active:scale-95 transition-all"
          >
            <RotateCcw size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {cats.length > 0 && (
        <div className="mt-8 flex gap-12 text-slate-300 font-bold text-sm tracking-widest">
          <span>SWIPE LEFT TO SKIP</span>
          <span>RIGHT TO LIKE</span>
        </div>
      )}
    </main>
  );
}
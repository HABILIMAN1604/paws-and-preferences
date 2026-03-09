import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { fetchCats } from "./api";
import { SwipeCard } from "./components/SwipeCard";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import { EmptyState } from "./components/EmptyState";

export default function App() {
  const [cats, setCats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedCats, setLikedCats] = useState<string[]>([]);

  useEffect(() => {
    const init = async () => {
      const urls = await fetchCats(12);
      
      // PRE-LOADER: Create image objects to force browser caching
      const promises = urls.slice(-4).map((url) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = url;
          img.onload = resolve;
          img.onerror = resolve; // Continue even if one fails
        });
      });

      await Promise.all(promises);
      setCats(urls);
      setLoading(false);
    };
    init();
  }, []);

  const handleSwipe = (direction: "left" | "right", url: string) => {
    if (direction === "right") {
      setLikedCats((prev) => [...prev, url]);
      if (window.navigator.vibrate) window.navigator.vibrate(20);
    }
    setCats((prev) => prev.filter((c) => c !== url));
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-50"><LoadingSkeleton /></div>;

  return (
    <main className="flex flex-col items-center justify-center h-screen w-full bg-slate-50 overflow-hidden relative p-4">
      <h1 className="absolute top-8 text-xl font-black text-slate-300 tracking-[0.2em] uppercase">Paws & Prefs</h1>

      <div className="relative w-full max-w-[340px] h-[520px]">
        <AnimatePresence>
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
            <EmptyState key="empty" />
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 flex gap-12 text-slate-300 font-bold text-sm tracking-widest">
        <span>SWIPE LEFT TO SKIP</span>
        <span>RIGHT TO LIKE</span>
      </div>
    </main>
  );
}
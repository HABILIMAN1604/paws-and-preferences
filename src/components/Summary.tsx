import { motion } from "framer-motion";
import { Share2, RotateCcw } from "lucide-react";

interface Props {
  likedCats: string[];
  onRestart: () => void;
}

export const Summary = ({ likedCats, onRestart }: Props) => {
  const handleShare = () => {
    const text = `I just found ${likedCats.length} favorite cats on Paws & Prefs! 🐾`;
    navigator.clipboard.writeText(text);
    alert("Share text copied to clipboard!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl px-4 pt-2 pb-8 overflow-y-auto max-h-[85vh] no-scrollbar"
    >
      <div className="text-center mb-4">
        <h2 className="text-3xl font-black text-white tracking-tight">Your Purr-fect Matches</h2>
        <p className="text-zinc-500">You liked {likedCats.length} kitties today.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 auto-rows-[150px]">
        {likedCats.map((url, index) => (
          <motion.div
            key={url}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`relative rounded-2xl overflow-hidden ${
              index % 3 === 0 ? "row-span-2" : "row-span-1"
            }`}
          >
            <img
              src={url}
              className="w-full h-full object-cover"
              alt="Liked cat"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://cataas.com/cat?width=450";
              }}
            />
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col gap-3 mt-10">
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 bg-rose-500 text-white font-bold py-4 rounded-2xl hover:bg-rose-600 transition-all shadow-lg shadow-rose-900"
        >
          <Share2 size={20} /> Share My Collection
        </button>
        <button
          onClick={onRestart}
          className="flex items-center justify-center gap-2 text-zinc-600 font-semibold py-2 hover:text-zinc-300 transition-all"
        >
          <RotateCcw size={18} /> Start Over
        </button>
      </div>
    </motion.div>
  );
};
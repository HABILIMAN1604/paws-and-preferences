import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";

export const EmptyState = () => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center p-8"
  >
    <div className="text-6xl mb-4">😿</div>
    <h2 className="text-2xl font-bold text-slate-800">No more kitties!</h2>
    <p className="text-slate-500 mb-6">You've seen all the cats in your area.</p>
    <button className="flex items-center gap-2 mx-auto bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors">
      <RefreshCw size={20} />
      Find More
    </button>
  </motion.div>
);
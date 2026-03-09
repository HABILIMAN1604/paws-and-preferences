import { motion } from "framer-motion";

export const LoadingSkeleton = () => (
  <div className="flex flex-col items-center justify-center h-[60vh] w-full max-w-sm bg-white rounded-3xl shadow-xl p-4 mx-auto">
    <div className="w-full h-4/5 bg-slate-200 rounded-2xl animate-pulse" />
    <div className="w-3/4 h-6 bg-slate-200 mt-6 rounded-md animate-pulse" />
  </div>
);
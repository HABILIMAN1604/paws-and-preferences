export const LoadingSkeleton = () => (
  <div className="flex flex-col items-center gap-4">
    <div className="w-[340px] h-[520px] bg-zinc-900 rounded-3xl animate-pulse" />
    <div className="w-32 h-3 bg-zinc-800 rounded-full animate-pulse" />
    <p className="text-zinc-600 text-xs tracking-widest uppercase">Finding cats...</p>
  </div>
);
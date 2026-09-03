import { Loader2 } from'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-slate-800 space-y-4">
      <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
      <p className="text-sm font-medium text-slate-500">Loading Our Bestsellers reels...</p>
    </div>
  );
}
